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
  const { ignoredFiles, addedFiles, invalidMessageElement } = processKMLFiles(files, map, kmlItems, layers);

  // Meldungen für ignorierte und hinzugefügte Dateien anzeigen
  let versatz = invalidMessageElement ? invalidMessageElement.offsetHeight + 20 : 0;
  
  if (ignoredFiles.length > 0) {
    const duplikatNachricht = ignoredFiles.map(datei =>
      NACHRICHTEN.WARNUNG.DUPLIKAT(datei)
    ).join('\n');
    const warnungElement = showTempMessage(duplikatNachricht, '#ffa500', 5000, versatz);
    versatz += warnungElement.offsetHeight + 20;
  }

  if (addedFiles.length > 0) {
    const erfolgNachricht = addedFiles.map(datei =>
      NACHRICHTEN.ERFOLG.KML_HINZUGEFUEGT(datei)
    ).join('\n');
    setTimeout(() => {
      showTempMessage(erfolgNachricht, '#4CAF50', 5000, versatz);
    }, 100);
  }
});

// Globale Variablen für KML-Layer und Listenelemente
const layers = []; // Speichert Informationen über alle KML-Layer
const kmlItems = document.getElementById('kml-items'); // Container für KML-Listeneinträge
const projectSelector = document.getElementById('project-selector');
const selectedProjectDisplay = document.getElementById('selected-project-display');
// Initiale Anzeige beim Laden der Seite
document.getElementById('username-display').textContent = 'Benutzer: allgemein';
document.getElementById('projectname-display').textContent = 'Befahrungsprojekt: leer';
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
    const currentUser = userSelector.value;
    document.getElementById('username-display').textContent = `Benutzer: ${currentUser}`;
    document.getElementById('projectname-display').textContent = `Projekt: ${projektName}`;

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

// Benutzerverzeichnisse scannen und Dropdown befüllen
const userSelector = document.getElementById('user-selector');

/**
 * Lädt verfügbare Benutzerverzeichnisse und füllt das Dropdown
 */
async function loadUserDirectories() {
  try {
    const response = await fetch('getProjects.php?type=users');
    const users = await response.json();
    
    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user;
      option.textContent = user;
      userSelector.appendChild(option);
    });
    
    // Standardmäßig "allgemein" Benutzer auswählen
    const generalUser = users.find(u => u === 'allgemein');
    if (generalUser) {
      userSelector.value = generalUser;
      // Event auslösen, um Benutzerdaten zu laden
      userSelector.dispatchEvent(new Event('change'));
    }
  } catch (error) {
    console.error('Fehler beim Laden der Benutzer:', error);
    showTempMessage(NACHRICHTEN.FEHLER.NETZWERK_FEHLER, '#ff4444');
  }
}

// Benutzerverzeichnisse laden
loadUserDirectories();

// Event-Listener für Benutzerauswahl
userSelector.addEventListener('change', function() {
  const selectedUser = this.value;
  if (selectedUser) {
    // Anzeige sofort aktualisieren
    document.getElementById('username-display').textContent = `Benutzer: ${selectedUser}`;
    document.getElementById('projectname-display').textContent = `Befahrungsprojekt: ${currentProject || 'leer'}`;
    
    // Benutzerdaten vom Server laden
    fetch(`User/${selectedUser}/user_${selectedUser}.json`)
      .then(response => response.json())
      .then(userData => {
        // Benutzerspezifische Einstellungen anwenden
        if (userData.settings) {
          applyUserSettings(userData.settings);
        }
      })
      .catch(error => {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
        showTempMessage(NACHRICHTEN.FEHLER.BENUTZERDATEN_LADEN, '#ff4444');
      });
  }
});

/**
 * Wendet benutzerspezifische Einstellungen an
 * @param {Object} settings - Benutzereinstellungen
 */
function applyUserSettings(settings) {
  // Kartenstil anpassen
  if (settings.mapStyle) {
    map.setStyle(settings.mapStyle);
  }
  
  // Standardprojekt laden
  if (settings.defaultProject) {
    projectSelector.value = settings.defaultProject;
    loadProjectKMLs(settings.defaultProject);
  }
  
  // UI-Einstellungen anwenden
  if (settings.ui) {
    document.body.classList.toggle('dark-mode', settings.ui.darkMode);
  }
}

// Projekte vom Server abrufen und Dropdown befüllen
fetch('getProjects.php')
  .then(response => response.json())
  .then(projects => {
    projects.forEach(project => {
      const option = document.createElement('option');
      option.value = project;
      if (project === 'neues Projekt') {
        option.textContent = '➕ neues Projekt';
        option.style.color = 'green';
        option.style.fontWeight = 'bold';
      } else {
        option.textContent = project;
      }
      projectSelector.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Fehler beim Abrufen der Projekte:', error);
    showTempMessage(NACHRICHTEN.FEHLER.NETZWERK_FEHLER, '#ff4444');
  });

// Event-Listener für die Projektauswahl
projectSelector.addEventListener('change', async function() {
  const selectedProject = this.value;
  const newProjectForm = document.getElementById('new-project-form');
  const currentUser = userSelector.value;
  
  if (selectedProject === 'neues Projekt') {
    newProjectForm.style.display = 'flex';
  } else if (selectedProject) {
    newProjectForm.style.display = 'none';
    
    // Projektstatus in Benutzer-JSON speichern
    try {
      const userFilePath = `User/${currentUser}/user_${currentUser}.json`;
      
      // Aktuelle Benutzerdaten laden
      const response = await fetch(userFilePath);
      const userData = await response.json();
      
      // Projektstatus aktualisieren
      userData.settings = userData.settings || {};
      userData.settings.lastProject = selectedProject;
      
      // Aktualisierte Daten speichern
      await fetch('saveUserSettings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `user=${encodeURIComponent(currentUser)}&data=${encodeURIComponent(JSON.stringify(userData))}`
      });
      
      // Debug-Ausgabe in Konsole
      console.log(`Projektstatus gespeichert: ${selectedProject} für Benutzer ${currentUser}`);
    } catch (error) {
      console.error('Fehler beim Speichern des Projektstatus:', error);
    }
    
    // Projekt laden
    loadProjectKMLs(selectedProject);
  } else {
    newProjectForm.style.display = 'none';
  }
});

// Funktion zur Validierung des Projektnamens
function sanitizeProjectName(projectName) {
  // Vorangehende Sonderzeichen entfernen
  projectName = projectName.replace(/^[^a-zA-Z0-9]+/, '');
  
  // "Befahrung" (case-insensitive) entfernen
  projectName = projectName.replace(/\bBefahrung\b/gi, '');
  
  // Umlaute ersetzen
  const umlautMap = {
    'ä': 'ae',
    'ö': 'oe',
    'ü': 'ue',
    'Ä': 'Ae',
    'Ö': 'Oe',
    'Ü': 'Ue',
    'ß': 'ss'
  };
  
  // Umlaute durch ihre Entsprechungen ersetzen
  projectName = projectName.replace(/[äöüÄÖÜß]/g, match => umlautMap[match]);
  
  // Leerzeichen durch Unterstriche ersetzen
  projectName = projectName.replace(/\s+/g, '_');
  
  // Pluszeichen durch "plus" ersetzen
  projectName = projectName.replace(/\+/g, 'plus');
  
  // Alle verbleibenden Sonderzeichen durch Unterstriche ersetzen
  projectName = projectName.replace(/[^a-zA-Z0-9-_]/g, '_');
  
  // Mehrfache Unterstriche durch einen einzelnen ersetzen
  projectName = projectName.replace(/_+/g, '_');
  
  // Führende und abschließende Unterstriche entfernen
  projectName = projectName.replace(/^_+|_+$/g, '');
  
  return projectName;
}

function isValidProjectName(projectName) {
  // Zuerst den Namen bereinigen
  const sanitizedName = sanitizeProjectName(projectName);
  
  // Erlaubt: Buchstaben (a-z, A-Z), Zahlen (0-9), Bindestrich (-), Unterstrich (_)
  const validChars = /^[a-zA-Z0-9-_]+$/;
  
  // Prüfen ob der bereinigte Name gültig ist
  return {
    isValid: validChars.test(sanitizedName),
    sanitizedName: sanitizedName
  };
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
  
  // Projektnamen bereinigen und validieren
  const { isValid, sanitizedName } = isValidProjectName(newProjectName);
  
  if (!isValid) {
    showTempMessage(
      `Der Projektname wurde automatisch angepasst zu: ${sanitizedName}`,
      '#4CAF50'
    );
  }
  
  // Neues Projekt über API erstellen
  fetch('getProjects.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `action=create&projectName=${encodeURIComponent(sanitizedName)}`
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      showTempMessage(`Projekt "${newProjectName}" erfolgreich erstellt`, '#4CAF50');
      
      // Dropdown aktualisieren mit bereinigtem Namen
      const option = document.createElement('option');
      option.value = sanitizedName;
      option.textContent = sanitizedName;
      projectSelector.appendChild(option);
      
      // Neues Projekt direkt auswählen
      projectSelector.value = sanitizedName;
      loadProjectKMLs(sanitizedName);
    } else {
      showTempMessage(`Fehler: ${data.message}`, '#ff4444');
    }
  })
  .catch(error => {
    console.error('Fehler beim Erstellen des Projekts:', error);
    showTempMessage('Fehler beim Erstellen des Projekts', '#ff4444');
  });
  
  newProjectForm.style.display = 'none';
  newProjectNameInput.value = ''; // Eingabefeld leeren
});
