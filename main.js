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

// Globale Variablen
const layers = []; // Speichert Informationen über alle KML-Layer
const kmlItems = document.getElementById('kml-items'); // Container für KML-Listeneinträge
let currentProject = null; // Aktuell ausgewähltes Projekt

// Importiere Event-Handler
import { MapEvents, FileEvents, UIEvents } from './eventHandler.js';
import { processKMLFile, processKMLFiles } from './kmlProcessor.js';

// Karte initialisieren mit Fokus auf Deutschland
const map = L.map('map').setView([51.1657, 10.4515], 6);

// OpenStreetMap Kartenlayer hinzufügen
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialisiere Map Events
MapEvents.init(map);

// Initialisiere File Events
const dropArea = document.getElementById('map');
FileEvents.init(dropArea, (files) => processKMLFiles(files, map, kmlItems, layers, currentProject), {
  map,
  kmlItems,
  layers
});

const projectSelector = document.getElementById('project-selector');
const selectedProjectDisplay = document.getElementById('selected-project-display');
const newProjectForm = document.getElementById('new-project-form'); // Formular für neue Projekte

// Initiale Anzeige beim Laden der Seite
document.getElementById('username-display').textContent = 'Benutzer: allgemein';
document.getElementById('projectname-display').textContent = 'Befahrungsprojekt: leer';

// Initialisiere UI Events
UIEvents.init({
  userSelector: document.getElementById('user-selector'),
  projectSelector: projectSelector,
  createProjectBtn: document.getElementById('create-project-btn')
}, {
  currentProject,
  loadProjectKMLs,
  applyUserSettings,
  showTempMessage,
  isValidProjectName
});

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
      const layerInfo = processKMLFile(file, map, kmlItems, layers, currentProject);
      
      // Event-Listener für ShadowLayer hinzufügen
      if (layerInfo && layerInfo.shadowLayer) {
        map.on('layeradd', function(e) {
          if (e.layer === layerInfo.shadowLayer) {
            e.layer.eachLayer(layer => {
              if (layer.feature && layer.feature.id) {
                console.log('KML ShadowLayer - Feature ID:', layer.feature.id);
              }
            });
          }
        });
      }
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
    }
  } catch (error) {
    console.error('Fehler beim Laden der Benutzer:', error);
    showTempMessage(NACHRICHTEN.FEHLER.NETZWERK_FEHLER, '#ff4444');
  }
}

// Benutzerverzeichnisse laden
loadUserDirectories();


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
