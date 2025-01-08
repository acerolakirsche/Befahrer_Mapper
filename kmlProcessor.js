/**
 * kmlProcessor.js
 * ==============
 * Dieses Modul ist verantwortlich für die Verarbeitung von KML-Dateien.
 * 
 * Hauptfunktionen:
 * - Einlesen und Parsen von KML-Dateien
 * - Konvertierung von KML zu GeoJSON
 * - Erstellung von Kartenebenen zur Visualisierung
 * - Erkennung von Duplikaten
 * - Extraktion von Nummern aus Dateinamen
 * 
 * Technische Details:
 * - Verwendet FileReader API für lokale Dateien
 * - Nutzt fetch API für Server-Dateien
 * - Konvertiert mit toGeoJSON Bibliothek
 * - Erstellt Leaflet GeoJSON Layer
 */

// Linienstärken für die Visualisierung
const mainLineWeight = 3;  // Stärke der Haupt-KML-Linie
const shadowLineWeight = mainLineWeight * 2;  // Stärke der Schatten-Linie

/**
 * Verarbeitet mehrere KML-Dateien
 * 
 * @param {FileList|Array} files - Liste der zu verarbeitenden KML-Dateien
 * @param {L.Map} map - Leaflet-Karteninstanz
 * @param {HTMLElement} kmlItems - Container für KML-Listeneinträge
 * @param {Array} layers - Array zur Speicherung der Layer-Informationen
 * @returns {Object} - Objekt mit Listen der ignorierten und hinzugefügten Dateien
 * 
 * Ablauf:
 * 1. Prüft jede Datei auf gültiges KML-Format
 * 2. Erkennt Duplikate
 * 3. Verarbeitet gültige, neue KML-Dateien
 */
function processKMLFiles(files, map, kmlItems, layers) {
  const ignoredFiles = []; // Ignorierte Dateien (Duplikate)
  const addedFiles = []; // Erfolgreich hinzugefügte Dateien

  // Jede Datei in der Liste verarbeiten
  for (const file of files) {
    if (file.name.endsWith('.kml')) {
      // Prüfen ob Datei ein Duplikat ist
      const isDuplicate = layers.some(layerInfo => layerInfo.name === file.name);
      if (isDuplicate) {
        ignoredFiles.push(file.name);
      } else {
        // Gültige, nicht-doppelte KML-Datei verarbeiten
        processKMLFile(file, map, kmlItems, layers);
        addedFiles.push(file.name);
      }
    } else {
      showTempMessage(NACHRICHTEN.WARNUNG.UNGUELTIGE_DATEI, '#ffa500');
    }
  }

  return { ignoredFiles, addedFiles };
}

/**
 * Verarbeitet eine einzelne KML-Datei
 * 
 * @param {File} file - Die zu verarbeitende KML-Datei
 * @param {L.Map} map - Leaflet-Karteninstanz
 * @param {HTMLElement} kmlItems - Container für KML-Listeneinträge
 * @param {Array} layers - Array zur Speicherung der Layer-Informationen
 * 
 * Ablauf:
 * 1. Liest die KML-Datei ein
 * 2. Konvertiert zu GeoJSON
 * 3. Erstellt Schatten- und Haupt-Layer
 * 4. Fügt Layer zur Karte hinzu
 * 5. Erstellt Listeneintrag
 */
function processKMLFile(file, map, kmlItems, layers) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    // Handler für abgeschlossenes Datei-Einlesen
    reader.onload = (e) => {
      const kml = e.target.result;
      
      // KML-Inhalt parsen
      const parser = new DOMParser();
      const kmlDoc = parser.parseFromString(kml, 'text/xml');
      
      // KML zu GeoJSON konvertieren
      const geojson = toGeoJSON.kml(kmlDoc);

      // Schatten-Layer erstellen (schwarze Hintergrundlinie)
      const shadowLayer = L.geoJSON(geojson, {
        style: {
          color: '#000000',
          weight: shadowLineWeight,
          opacity: 0.5
        },
        pointToLayer: () => null // Punktfeatures überspringen
      }).addTo(map);

      // Haupt-Visualisierungslayer erstellen
      const mainLayer = L.geoJSON(geojson, {
        style: {
          color: '#ff0000', // Standard: Rot
          weight: mainLineWeight
        },
        onEachFeature: (feature, layer) => {
          // Popup hinzufügen, wenn Feature einen Namen hat
          if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name);
          }
        },
        pointToLayer: () => null // Punktfeatures überspringen
      }).addTo(map);

      // Layer-Informationen speichern
      const layerInfo = {
        name: file.name,
        mainLayer,
        shadowLayer,
        checkbox: null,
        color: '#ff0000' // Standardfarbe
      };
      layers.push(layerInfo);

      // Listeneintrag für die KML-Datei erstellen
      createKMLListItem(file, layerInfo, kmlItems, layers, map);
      resolve();
    };
    
    // Datei einlesen starten
    if (file.size > 0) {
      reader.readAsText(file);
    } else {
      // Server-seitige Dateien verarbeiten
      const fetchPath = `Befahrungsprojekte/${currentProject}/KML-Files/${file.name}`;
      
      fetch(fetchPath)
        .then(response => response.text())
        .then(kml => {
          // KML-Inhalt parsen
          const parser = new DOMParser();
          const kmlDoc = parser.parseFromString(kml, 'text/xml');
          
          // KML zu GeoJSON konvertieren
          const geojson = toGeoJSON.kml(kmlDoc);

          // Schatten-Layer erstellen
          const shadowLayer = L.geoJSON(geojson, {
            style: {
              color: '#000000',
              weight: shadowLineWeight,
              opacity: 0.5
            },
            pointToLayer: () => null
          }).addTo(map);

          // Haupt-Layer erstellen
          const mainLayer = L.geoJSON(geojson, {
            style: {
              color: '#ff0000',
              weight: mainLineWeight,
              opacity: 0.8
            },
            pointToLayer: () => null
          }).addTo(map);

          // Layer-Informationen speichern
          const layerInfo = {
            name: file.name,
            mainLayer: mainLayer,
            shadowLayer: shadowLayer,
            color: '#ff0000'
          };
          layers.push(layerInfo);

          // Listeneintrag erstellen
          createKMLListItem(file, layerInfo, kmlItems, layers, map);
          resolve();
        })
        .catch(error => {
          console.error('Fehler beim Laden der KML-Datei:', error);
          showTempMessage(NACHRICHTEN.FEHLER.LADEN_FEHLGESCHLAGEN, '#ff4444');
          reject(error);
        });
    }
  });
}

/**
 * Extrahiert eine zweistellige Nummer aus dem Dateinamen
 * 
 * @param {string} filename - Der KML-Dateiname
 * @returns {string} - Extrahierte zweistellige Nummer
 * 
 * Format-Beispiel:
 * Aus "Befahrung_2023_01_KML.kml" wird "01" extrahiert
 */
function extractNumberFromFilename(filename) {
  // Dateiendung entfernen
  const nameWithoutExtension = filename.replace('.kml', '');
  
  // Startposition berechnen (13 Zeichen vom Ende)
  const startPos = nameWithoutExtension.length - 13;
  
  // Zweistellige Nummer extrahieren
  return nameWithoutExtension.substring(startPos, startPos + 2);
}
