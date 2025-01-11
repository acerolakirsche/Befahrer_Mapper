/**
 * main.js
 * =======
 * Hauptskript der Befahrer Mapper Anwendung
 * 
 * Dieses Skript ist der zentrale Einstiegspunkt der Anwendung und
 * steuert die grundlegenden Funktionen:
 * 
 * Hauptfunktionen:
 * - Initialisierung der Karte mit Deutschland-Fokus
 * - Drag & Drop Funktionalität für KML-Dateien
 * - Verwaltung der Kartenlayer
 * - Projektverwaltung und -auswahl
 * 
 * Technische Details:
 * - Nutzt Leaflet.js für die Kartendarstellung
 * - Verwendet fetch API für Server-Kommunikation
 * - Verwaltet globale Zustände für Layer und Projekte
 */

// Karte initialisieren mit Fokus auf Deutschland
const map = L.map('map').setView([51.1657, 10.4515], 6);

// OpenStreetMap Kartenlayer hinzufügen
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Drag & Drop Bereich für die Karte einrichten
const dropArea = document.getElementById('map');

// Drag-Over Event behandeln
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.style.backgroundColor = '#f0f0f0'; // Visuelles Feedback
});

// Drag-Leave Event behandeln
dropArea.addEventListener('dragleave', () => {
  dropArea.style.backgroundColor = ''; // Hintergrund zurücksetzen
});

// Drop Event behandeln
dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.style.backgroundColor = ''; // Hintergrund zurücksetzen

  // Abgelegte Dateien verarbeiten
  const files = e.dataTransfer.files;

  // KML-Dateien verarbeiten und Ergebnisse sammeln
  const { ignoredFiles, addedFiles } = processKMLFiles(files, map, kmlItems, layers);

  // Meldungen für ignorierte und hinzugefügte Dateien anzeigen
  let warnungElement = null;
  if (ignoredFiles.length > 0) {
    const duplikatNachricht = ignoredFiles.map(datei => 
      NACHRICHTEN.WARNUNG.DUPLIKAT(datei)
    ).join('\n');
    warnungElement = showTempMessage(duplikatNachricht, '#ffa500');
  }

  if (addedFiles.length > 0) {
    const erfolgNachricht = addedFiles.map(datei =>
      NACHRICHTEN.ERFOLG.KML_HINZUGEFUEGT(datei)
    ).join('\n');
    setTimeout(() => {
      // Erfolgsmeldung unter Warnungen positionieren
      const versatz = warnungElement ? warnungElement.offsetHeight + 20 : 0;
      showTempMessage(erfolgNachricht, '#4CAF50', 5000, versatz);
    }, 100);
  }
});

// Globale Variablen für KML-Layer und Listenelemente
const layers = []; // Speichert Informationen über alle KML-Layer
const kmlItems = document.getElementById('kml-items'); // Container für KML-Listeneinträge
const projectSelector = document.getElementById('project-selector');
const selectedProjectDisplay = document.getElementById('selected-project-display');
const newProjectForm = document.getElementById('new-project-form'); // Formular für neue Projekte
let currentProject = null; // Aktuell ausgewähltes Projekt

/**
 * Lädt KML-Dateien aus dem ausgewählten Projektordner
 * 
 * @param {string} projektName - Name des Projektordners
 * 
 * Ablauf:
 * 1. Prüft, ob das Projekt bereits geladen ist
 * 2. Bereinigt bestehende Layer und Liste
 * 3. Lädt neue KML-Dateien vom Server
 * 4. Verarbeitet jede KML-Datei einzeln
 */
async function loadProjectKMLs(projektName) {
  if (projektName === currentProject) return; // Überspringen wenn gleiches Projekt
  
  // Bestehende Layer und Liste bereinigen
  layers.forEach(layerInfo => {
    map.removeLayer(layerInfo.mainLayer);
    map.removeLayer(layerInfo.shadowLayer);
  });
  layers.length = 0;
  kmlItems.innerHTML = '';
  
  try {
    // Projektnamen sofort setzen
    currentProject = projektName;
    selectedProjectDisplay.textContent = projektName;

    // KML-Dateien vom Server abrufen
    const fetchPath = `getKMLFiles.php?project=${encodeURIComponent(projektName)}`;
    const response = await fetch(fetchPath);
    const kmlFiles = await response.json();
    
    // Jede KML-Datei verarbeiten
    for (const fileName of kmlFiles) {
      const file = { name: fileName };
      processKMLFile(file, map, kmlItems, layers);
    }

    // Kurz warten, bis die Layer vollständig geladen sind
    setTimeout(() => {
      // Bounds für alle Layer berechnen
      if (layers.length > 0) {
        const bounds = L.latLngBounds([]);
        layers.forEach(layerInfo => {
          bounds.extend(layerInfo.mainLayer.getBounds());
        });
        
        // Karte auf den Bereich fokussieren mit Animation
        map.flyToBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 15,
          duration: 1.5  // Dauer der Animation in Sekunden
        });
      }
    }, 1000);  // 1 Sekunde warten

    // Erfolgsmeldung anzeigen
    showTempMessage(NACHRICHTEN.ERFOLG.PROJEKT_GELADEN(projektName), '#4CAF50');
  } catch (error) {
    console.error('Fehler beim Laden der Projekt-KMLs:', error);
    showTempMessage(NACHRICHTEN.FEHLER.LADEN_FEHLGESCHLAGEN, '#ff4444');
  }
}

// Projekte vom Server abrufen und Dropdown befüllen
fetch('getProjects.php')
  .then(response => response.json())
  .then(projects => {
    projects.forEach(project => {
      const option = document.createElement('option');
      option.value = project;
      option.textContent = project;
      projectSelector.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Fehler beim Abrufen der Projekte:', error);
    showTempMessage(NACHRICHTEN.FEHLER.NETZWERK_FEHLER, '#ff4444');
  });

// Event-Listener für die Projektauswahl
projectSelector.addEventListener('change', function() {
  const selectedProject = this.value;
  const newProjectForm = document.getElementById('new-project-form');
  
  if (selectedProject === 'neues Projekt') {
    newProjectForm.style.display = 'flex';
  } else if (selectedProject) {
    newProjectForm.style.display = 'none';
    loadProjectKMLs(selectedProject);
  } else {
    newProjectForm.style.display = 'none';
  }
});

// Funktion zur Validierung des Projektnamens
function isValidProjectName(projectName) {
  // Erlaubt: Buchstaben (a-z, A-Z), Zahlen (0-9), Bindestrich (-), Unterstrich (_)
  const validChars = /^[a-zA-Z0-9-_]+$/;
  return validChars.test(projectName);
}

// Event-Listener für den "Erstellen"-Button
const createProjectBtn = document.getElementById('create-project-btn');
createProjectBtn.addEventListener('click', function() {
  const newProjectNameInput = document.getElementById('new-project-name');
  const newProjectName = newProjectNameInput.value.trim();
  
  if (!newProjectName) {
    showTempMessage('Bitte geben Sie einen Projektnamen ein.', '#ff4444');
    return;
  }
  
  if (!isValidProjectName(newProjectName)) {
    showTempMessage(
      'Ungültige Zeichen im Projektnamen. Erlaubt sind nur: Buchstaben (a-z, A-Z), Zahlen (0-9), Bindestrich (-) und Unterstrich (_).',
      '#ff4444'
    );
    return;
  }
  
  // Hier wird die Logik zum Erstellen des neuen Projekts stehen
  showTempMessage(`Projekt "${newProjectName}" wird erstellt`, '#4CAF50');
  newProjectForm.style.display = 'none';
  newProjectNameInput.value = ''; // Eingabefeld leeren
  // Hier könnte man die Projektliste aktualisieren
  projectSelector.value = ''; // Dropdown zurücksetzen
});