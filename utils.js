/*
      utils.js
      ========
      Diese Datei enthält Hilfsfunktionen, die in der Hauptlogik verwendet werden, einschließlich:
      - Verarbeitung von KML-Dateien (Konvertierung zu GeoJSON und Erstellung von Layern).
      - Erstellung von Listeneinträgen für die KML-Dateien.
      - Verwaltung der Checkboxen und Löschfunktionen für die KML-Einträge.
      - Sortierung der KML-Liste alphabetisch nach Dateinamen.
      - Farbauswahl für KML-Linien.
      - Schattenlinien unter den eigentlichen Linien.
      - "Alle auswählen"-Funktion.
      - Anzeige einer großen Zahl basierend auf dem Dateinamen (13 Zeichen vom Ende entfernt).
      - Verdoppelungsschutz für KML-Dateien mit übersichtlichen, nicht überlappenden Meldungen.
      - Kontextmenü für Zoom-Funktionen
    */

    // Globale Variable für die Linienstärke der Hauptlinie
    const mainLineWeight = 3; // Linienstärke der Hauptlinie (auf 3 gesetzt)
    const shadowLineWeight = mainLineWeight * 2; // Linienstärke der Schattenlinie (doppelte Stärke)

    // Funktion zum Extrahieren der zweistelligen Zahl aus dem Dateinamen
    function extractNumberFromFilename(filename) {
      // Entferne die Dateiendung (.kml)
      const nameWithoutExtension = filename.replace('.kml', '');
      // Berechne die Startposition: 13 Zeichen vom Ende entfernt
      const startPos = nameWithoutExtension.length - 13;
      // Extrahiere die nächsten beiden Zeichen ab der Startposition
      const number = nameWithoutExtension.substring(startPos, startPos + 2);
      return number;
    }

    // Funktion zum Anzeigen einer temporären Meldung
    function showTempMessage(message, backgroundColor = '#ffa500', duration = 5000, offset = 0) {
      const messageElement = document.createElement('div');
      messageElement.style.position = 'fixed';
      messageElement.style.bottom = `${20 + offset}px`; // Verschiebe die Meldung nach oben basierend auf dem Offset
      messageElement.style.left = '50%';
      messageElement.style.transform = 'translateX(-50%)';
      messageElement.style.backgroundColor = backgroundColor; // Farbe anpassbar
      messageElement.style.color = 'white';
      messageElement.style.padding = '10px 20px';
      messageElement.style.borderRadius = '5px';
      messageElement.style.zIndex = '10000';
      messageElement.style.textAlign = 'left'; // Text linksbündig ausrichten
      messageElement.style.whiteSpace = 'pre-line'; // Zeilenumbrüche berücksichtigen
      messageElement.innerHTML = message; // Verwende innerHTML für Formatierung

      document.body.appendChild(messageElement);

      setTimeout(() => {
        document.body.removeChild(messageElement);
      }, duration);

      return messageElement; // Gib das Meldungselement zurück, um die Höhe zu ermitteln
    }

    // Funktion zum Verarbeiten mehrerer KML-Dateien
    function processKMLFiles(files, map, kmlItems, layers) {
      const ignoredFiles = [];
      const addedFiles = [];

      // Verarbeite alle Dateien
      for (const file of files) {
        if (file.name.endsWith('.kml')) {
          // Überprüfe, ob die Datei bereits importiert wurde
          const isDuplicate = layers.some(layerInfo => layerInfo.name === file.name);
          if (isDuplicate) {
            ignoredFiles.push(file.name);
          } else {
            processKMLFile(file, map, kmlItems, layers);
            addedFiles.push(file.name);
          }
        } else {
          alert('Bitte nur KML-Dateien hochladen.');
        }
      }

      // Zeige eine Meldung für alle ignorierten Dateien
      let ignoreMessageElement = null;
      if (ignoredFiles.length > 0) {
        const message = `<b>Ignoriert, weil doppelt:</b>\n${ignoredFiles.join('\n')}`;
        ignoreMessageElement = showTempMessage(message, '#ffa500'); // Orange für ignorierte Dateien
      }

      // Zeige eine Meldung für alle hinzugefügten Dateien
      if (addedFiles.length > 0) {
        const message = `<b>Erfolgreich hinzugefügt:</b>\n${addedFiles.join('\n')}`;
        // Warte 100ms, um sicherzustellen, dass die orange Meldung gerendert ist
        setTimeout(() => {
          const offset = ignoreMessageElement ? ignoreMessageElement.offsetHeight + 20 : 0; // Höhe der orangen Meldung + Abstand
          showTempMessage(message, '#4CAF50', 5000, offset); // Grün für hinzugefügte Dateien
        }, 100);
      }
    }

    function processKMLFile(file, map, kmlItems, layers) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const kml = e.target.result;
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kml, 'text/xml');

        // Konvertiere KML zu GeoJSON
        const geojson = toGeoJSON.kml(kmlDoc);

        // Erstelle eine Schattenlinie (schwarz, doppelte Linienstärke, 50% Opacity)
        const shadowLayer = L.geoJSON(geojson, {
          style: {
            color: '#000000', // Schwarz
            weight: shadowLineWeight, // Doppelte Linienstärke
            opacity: 0.5      // 50% Opacity
          },
          pointToLayer: (feature, latlng) => {
            return null; // Überspringe die Erstellung von Markern für Point-Features
          }
        }).addTo(map);

        // Erstelle die eigentliche Linie (mit ausgewählter Farbe und normaler Linienstärke)
        const mainLayer = L.geoJSON(geojson, {
          style: {
            color: '#ff0000', // Standardfarbe (knallrot)
            weight: mainLineWeight // Linienstärke der Hauptlinie
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.name) {
              layer.bindPopup(feature.properties.name);
            }
          },
          pointToLayer: (feature, latlng) => {
            return null; // Überspringe die Erstellung von Markern für Point-Features
          }
        }).addTo(map);

        // Speichere die Layer-Referenzen für spätere Verwendung
        const layerInfo = {
          name: file.name,
          mainLayer,
          shadowLayer,
          checkbox: null,
          color: '#ff0000'
        };
        layers.push(layerInfo);

        // Erstelle ein neues Listenelement für die KML-Datei
        const kmlItem = document.createElement('div');
        kmlItem.className = 'kml-item';

        // Checkbox für die Auswahl
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginRight = '10px';
        layerInfo.checkbox = checkbox;

        // Verhindere, dass ein Klick auf die Checkbox den Fokus auslöst
        checkbox.addEventListener('click', (e) => {
          e.stopPropagation(); // Verhindere das Auslösen des Klick-Events auf dem übergeordneten Element
        });

        kmlItem.appendChild(checkbox);

        // Extrahiere die zweistellige Zahl aus dem Dateinamen
        const number = extractNumberFromFilename(file.name);

        // Erstelle ein Element für die große Zahl
        const numberElement = document.createElement('span');
        numberElement.className = 'kml-number';
        numberElement.textContent = number;
        kmlItem.appendChild(numberElement);

        // Dateiname
        const fileName = document.createElement('span');
        fileName.textContent = file.name;
        kmlItem.appendChild(fileName);

        // Mülleimer-Symbol zum Löschen
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash delete-icon';
        deleteIcon.onclick = (e) => {
          e.stopPropagation(); // Verhindere das Auslösen des Klick-Events auf dem übergeordneten Element
          map.removeLayer(layerInfo.mainLayer); // Entferne die Hauptlinie von der Karte
          map.removeLayer(layerInfo.shadowLayer); // Entferne die Schattenlinie von der Karte
          kmlItems.removeChild(kmlItem); // Entferne den Eintrag aus der Liste
          layers.splice(layers.indexOf(layerInfo), 1); // Entferne die Layer-Referenz aus dem Array
        };
        kmlItem.appendChild(deleteIcon);

        // Event-Listener für das Klicken auf den Listeneintrag
        kmlItem.addEventListener('click', (e) => {
          // Nur umschalten, wenn nicht auf die Checkbox oder das Mülleimer-Symbol geklickt wurde
          if (!e.target.matches('input[type="checkbox"]') && !e.target.matches('.delete-icon')) {
            checkbox.checked = !checkbox.checked;
          }
        });

        // Kontextmenü für Rechtsklick
        kmlItem.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          
          // Entferne vorhandenes Kontextmenü
          const existingMenu = document.getElementById('kml-context-menu');
          if (existingMenu) {
            existingMenu.remove();
          }

          // Erstelle neues Kontextmenü
          const contextMenu = document.createElement('div');
          contextMenu.id = 'kml-context-menu';
          contextMenu.style.position = 'absolute';
          contextMenu.style.right = `${window.innerWidth - e.pageX}px`; // Positioniere links vom Mauszeiger
          contextMenu.style.top = `${e.pageY}px`;
          contextMenu.style.backgroundColor = 'white';
          contextMenu.style.border = '1px solid #ccc';
          contextMenu.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.2)';
          contextMenu.style.zIndex = '1000';

          // Zoom auf diese KML
          const zoomItem = document.createElement('div');
          zoomItem.textContent = 'Zoom auf diese KML';
          zoomItem.style.padding = '5px 10px';
          zoomItem.style.cursor = 'pointer';
          zoomItem.addEventListener('click', () => {
            map.flyToBounds(layerInfo.mainLayer.getBounds(), {
              duration: 1, // Dauer der Animation in Sekunden
              easeLinearity: 0.25 // Geschwindigkeit der Animation
            });
            contextMenu.remove();
          });
          contextMenu.appendChild(zoomItem);

          // Zoom auf alle selektierten KMLs
          const zoomAllItem = document.createElement('div');
          zoomAllItem.textContent = 'Zoom auf alle selektierten';
          zoomAllItem.style.padding = '5px 10px';
          zoomAllItem.style.cursor = 'pointer';
          zoomAllItem.addEventListener('click', () => {
            const selectedLayers = layers.filter(l => l.checkbox.checked);
            if (selectedLayers.length > 0) {
              const bounds = selectedLayers.map(l => l.mainLayer.getBounds());
              const combinedBounds = bounds.reduce((acc, curr) => acc.extend(curr), L.latLngBounds(bounds[0]));
              map.flyToBounds(combinedBounds, {
                duration: 1.5, // Längere Dauer für größere Zoom-Änderungen
                easeLinearity: 0.25
              });
            }
            contextMenu.remove();
          });
          contextMenu.appendChild(zoomAllItem);

          // Alle selektieren/deselektieren (Toggle)
          const toggleAllItem = document.createElement('div');
          toggleAllItem.textContent = 'Alle selektieren/deselektieren';
          toggleAllItem.style.padding = '5px 10px';
          toggleAllItem.style.cursor = 'pointer';
          toggleAllItem.addEventListener('click', () => {
            const allChecked = layers.every(layer => layer.checkbox.checked);
            layers.forEach(layer => {
              layer.checkbox.checked = !allChecked;
            });
            contextMenu.remove();
          });
          contextMenu.appendChild(toggleAllItem);

          // Zoom-out auf Deutschland
          const zoomOutItem = document.createElement('div');
          zoomOutItem.textContent = 'Zoom-out auf Deutschland';
          zoomOutItem.style.padding = '5px 10px';
          zoomOutItem.style.cursor = 'pointer';
          zoomOutItem.addEventListener('click', () => {
            map.flyTo([51.1657, 10.4515], 6, {
              duration: 1,
              easeLinearity: 0.25
            });
            contextMenu.remove();
          });
          contextMenu.appendChild(zoomOutItem);

          document.body.appendChild(contextMenu);

          // Schließe das Menü bei Klick außerhalb
          const closeMenu = (e) => {
            if (!contextMenu.contains(e.target)) {
              contextMenu.remove();
              document.removeEventListener('click', closeMenu);
            }
          };
          document.addEventListener('click', closeMenu);
        });

        // Füge den Listeneintrag zur Liste hinzu
        kmlItems.appendChild(kmlItem);

        // Sortiere die Liste der KML-Dateien alphabetisch nach Dateinamen
        sortKMLList(kmlItems);
      };
      reader.readAsText(file);
    }

    // Funktion zum Sortieren der KML-Liste alphabetisch nach Dateinamen
    function sortKMLList(kmlItems) {
      const items = Array.from(kmlItems.children);
      items.sort((a, b) => {
        const nameA = a.querySelector('span').textContent.toLowerCase();
        const nameB = b.querySelector('span').textContent.toLowerCase();
        return nameA.localeCompare(nameB);
      });

      // Leere die Liste und füge die sortierten Elemente wieder hinzu
      kmlItems.innerHTML = '';
      items.forEach(item => kmlItems.appendChild(item));
    }

    // Event-Listener für die Farbkästchen
    document.addEventListener('DOMContentLoaded', () => {
      const colorBoxes = document.querySelectorAll('.color-box');
      colorBoxes.forEach(colorBox => {
        colorBox.addEventListener('click', () => {
          const selectedColor = colorBox.getAttribute('data-color');
          const selectedLayers = layers.filter(layerInfo => layerInfo.checkbox.checked);

          // Ändere die Farbe der ausgewählten Layer
          selectedLayers.forEach(layerInfo => {
            layerInfo.mainLayer.setStyle({ color: selectedColor });
            layerInfo.color = selectedColor; // Aktualisiere die gespeicherte Farbe
          });
        });
      });
    });
