/**
 * uiUtils.js
 * ==========
 * Diese Datei ist das Herzstück der Benutzeroberfläche des Befahrer Mappers.
 * Sie steuert die gesamte Interaktion mit der KML-Liste und deren Darstellung auf der Karte.
 * 
 * Hauptfunktionen:
 * - Verwaltung der KML-Listeneinträge (Erstellen, Löschen, Auswählen)
 * - Visuelle Effekte (Hover-Effekte, Hervorhebungen)
 * - Mehrfachauswahl von KMLs (mit Strg/Cmd oder Shift)
 * - Farbverwaltung für KML-Schichten
 * 
 * Technische Details:
 * - Verwendet Leaflet.js für Kartenoperationen
 * - Arbeitet eng mit kmlProcessor.js zusammen
 * - Nutzt DOM-Manipulation für UI-Updates
 */

// Globale Variable für ausgewählte KMLs
// Diese Liste speichert alle aktuell selektierten KML-Einträge, damit wir sie
// gemeinsam bearbeiten können (z.B. Farbe ändern, ausblenden)
let selectedKMLs = [];

/**
 * Erstellt einen neuen Listeneintrag für eine KML-Datei
 * 
 * @param {File} file - Die KML-Datei, die dargestellt werden soll
 * @param {Object} layerInfo - Informationen über die KML-Ebene (enthält mainLayer und shadowLayer)
 * @param {HTMLElement} kmlItems - Der Container, der alle KML-Listeneinträge enthält
 * @param {Array} layers - Array mit allen KML-Ebenen für Verwaltungszwecke
 * @param {L.Map} map - Die Leaflet-Karteninstanz
 * 
 * Ablauf der Funktion:
 * 1. Erstellt Container für den Listeneintrag
 * 2. Fügt Farbstreifen zur visuellen Identifikation hinzu
 * 3. Erstellt Sichtbarkeits-Toggle (Augen-Icon)
 * 4. Extrahiert und zeigt Nummer aus Dateinamen
 * 5. Fügt Lösch-Button hinzu
 * 6. Implementiert Auswahllogik (Einzel-, Mehrfach-, Bereichsauswahl)
 */
function createKMLListItem(file, layerInfo, kmlItems, layers, map) {
  // Container für den Listeneintrag erstellen
  // Wir nutzen ein div statt li für bessere Styling-Kontrolle
  const kmlItem = document.createElement('div');
  kmlItem.className = 'kml-item';

  // Farbstreifen erstellen
  // Dieser zeigt die aktuelle Farbe der KML an und macht die Zuordnung einfacher
  const colorStripe = document.createElement('div');
  colorStripe.className = 'color-stripe';
  colorStripe.style.backgroundColor = layerInfo.color;
  kmlItem.appendChild(colorStripe);

  // Sichtbarkeits-Icon (Auge) erstellen
  // Ermöglicht schnelles Ein-/Ausblenden der KML
  const eyeIcon = document.createElement('i');
  eyeIcon.className = 'fas fa-eye';
  eyeIcon.style.marginRight = '10px';
  eyeIcon.style.cursor = 'pointer';
  layerInfo.eyeIcon = eyeIcon;

  // Click-Handler für Sichtbarkeits-Toggle
  // Schaltet beide Layer (Haupt- und Schatten-Layer) gleichzeitig um
  eyeIcon.addEventListener('click', (e) => {
    e.stopPropagation(); // Verhindert Auslösen der Listenauswahl
    const isVisible = !eyeIcon.classList.contains('fa-eye-slash');
    if (isVisible) {
      // Layer ausblenden
      map.removeLayer(layerInfo.mainLayer);
      map.removeLayer(layerInfo.shadowLayer);
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    } else {
      // Layer einblenden
      map.addLayer(layerInfo.shadowLayer);
      map.addLayer(layerInfo.mainLayer);
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
  });
  kmlItem.appendChild(eyeIcon);

  // Nummer aus Dateinamen extrahieren und anzeigen
  // Wichtig für schnelle Identifikation der Befahrungsabschnitte
  const number = extractNumberFromFilename(file.name);
  const numberElement = document.createElement('span');
  numberElement.className = 'kml-number';
  numberElement.textContent = number;
  kmlItem.appendChild(numberElement);

  // Dateinamen anzeigen
  const fileName = document.createElement('span');
  fileName.textContent = file.name;
  kmlItem.appendChild(fileName);

  // Lösch-Icon erstellen
  // Ermöglicht das Entfernen einzelner KMLs
  const deleteIcon = document.createElement('i');
  deleteIcon.className = 'fas fa-trash delete-icon';
  deleteIcon.onclick = (e) => {
    e.stopPropagation(); // Verhindert Auslösen der Listenauswahl
    // Entfernt beide Layer und den Listeneintrag
    map.removeLayer(layerInfo.mainLayer);
    map.removeLayer(layerInfo.shadowLayer);
    // Entfernt die Bounding Box falls vorhanden
    if (boundingBoxLayer) {
      map.removeLayer(boundingBoxLayer);
      boundingBoxLayer = null;
    }
    kmlItems.removeChild(kmlItem);
    layers.splice(layers.indexOf(layerInfo), 1);
    selectedKMLs = selectedKMLs.filter(selected => selected !== layerInfo);
  };
  kmlItem.appendChild(deleteIcon);

  // Hover-Effekt für KML-Hervorhebung
  // Zeigt eine Bounding-Box um die KML auf der Karte
  let boundingBoxLayer = null;
  let infoLabel = null;

  function createBoundingBox(layer) {
    const bounds = layer.getBounds();
    const bbox = L.rectangle(bounds, {
      color: '#000000',
      weight: 10,
      opacity: 0.5,
      fill: false,
      interactive: false
    }).addTo(map);

    // Info-Label auf der BoundingBox klebend erstellen
    const centerTop = L.latLng(
      bounds.getNorth(),
      bounds.getCenter().lng
    );
    infoLabel = L.marker(centerTop, {
      icon: L.divIcon({
        className: 'bbox-info-label',
        html: `KML ${extractNumberFromFilename(layerInfo.name)}`,
        iconSize: [100, 18], // Breite 100px, Höhe 18px
        iconAnchor: [50, 18] // Ankerpunkt in der Mitte der unteren Kante
      }),
      interactive: false,
      offset: [0, -9] // Versatz nach oben um halbe Höhe des Labels
    }).addTo(map);

    return bbox;
  }

  kmlItem.addEventListener('mouseenter', () => {
    boundingBoxLayer = createBoundingBox(layerInfo.mainLayer);
  });

  kmlItem.addEventListener('mouseleave', () => {
    if (boundingBoxLayer) {
      map.removeLayer(boundingBoxLayer);
      boundingBoxLayer = null;
    }
    if (infoLabel) {
      map.removeLayer(infoLabel);
      infoLabel = null;
    }
  });

  // Click-Handler für Auswahl-Funktionalität
  // Implementiert drei Auswahlmodi mit visueller Hervorhebung:
  // 1. Einzelauswahl: Klicken ohne Modifikatortaste
  //   - Hebt alle vorherigen Auswahlen auf
  //   - Setzt die aktuelle Auswahl
  //   - Visuelle Hervorhebung durch CSS-Klasse .selected
  //   - Synchronisierte Hervorhebung auf der Karte durch erhöhte Opazität
  // 2. Mehrfachauswahl: Strg/Cmd + Klick
  //   - Toggle-Funktion: Fügt Element zur Auswahl hinzu oder entfernt es
  //   - Ermöglicht die Auswahl mehrerer nicht-benachbarter Elemente
  //   - Visuelle Hervorhebung bleibt für alle ausgewählten Elemente bestehen
  // 3. Bereichsauswahl: Shift + Klick
  //   - Wählt alle Elemente zwischen der letzten und aktuellen Auswahl
  //   - Nützlich für die Auswahl zusammenhängender Befahrungsabschnitte
  //   - Automatische Hervorhebung des gesamten Bereichs
  // Doppelklick-Listener für Debugging
  kmlItem.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    console.log('Doppelklick auf KML-Eintrag:', {
      name: file.name,
      number: number,
      color: layerInfo.color,
      visible: !eyeIcon.classList.contains('fa-eye-slash')
    });
  });

  kmlItem.addEventListener('click', (e) => {
    e.stopPropagation();

    if (e.metaKey || e.ctrlKey) {
      // Toggle-Auswahl für Mehrfachauswahl
      if (selectedKMLs.includes(layerInfo)) {
        // Abwählen
        selectedKMLs = selectedKMLs.filter(selected => selected !== layerInfo);
        kmlItem.classList.remove('selected');
        layerInfo.shadowLayer.setStyle({ 
          opacity: 0.5,
          weight: shadowLineWeight
        });
      } else {
        // Hinzufügen zur Auswahl
        selectedKMLs.push(layerInfo);
        kmlItem.classList.add('selected');
        layerInfo.shadowLayer.setStyle({ 
          opacity: 1.0,
          weight: shadowLineWeight * 2
        });
      }
    } else if (e.shiftKey) {
      // Bereichsauswahl
      const items = Array.from(kmlItems.children);
      const currentIndex = items.indexOf(kmlItem);
      const lastSelectedIndex = items.findIndex(item => 
        selectedKMLs.includes(layers[items.indexOf(item)])
      );

      if (lastSelectedIndex === -1) {
        // Wenn keine vorherige Auswahl, wie Einzelauswahl behandeln
        selectedKMLs = [layerInfo];
        kmlItem.classList.add('selected');
        layerInfo.shadowLayer.setStyle({ 
          opacity: 1.0,
          weight: shadowLineWeight * 2
        });
      } else {
        // Bereich auswählen
        const [start, end] = [lastSelectedIndex, currentIndex].sort((a, b) => a - b);
        selectedKMLs = [];
        items.forEach((item, index) => {
          if (index >= start && index <= end) {
            const itemLayer = layers[index];
            selectedKMLs.push(itemLayer);
            item.classList.add('selected');
            itemLayer.shadowLayer.setStyle({ 
              opacity: 1.0,
              weight: shadowLineWeight * 2
            });
          } else {
            item.classList.remove('selected');
            layers[index].shadowLayer.setStyle({ 
              opacity: 0.5,
              weight: shadowLineWeight
            });
          }
        });
      }
    } else {
      // Einzelauswahl
      // Alle bisherigen Auswahlen aufheben
      selectedKMLs.forEach(selected => {
        const selectedItem = Array.from(kmlItems.children).find(item => 
          item.textContent.includes(selected.name)
        );
        if (selectedItem) {
          selectedItem.classList.remove('selected');
          selected.shadowLayer.setStyle({ 
            opacity: 0.5,
            weight: shadowLineWeight
          });
        }
      });
      // Neue Auswahl setzen
      selectedKMLs = [layerInfo];
      kmlItem.classList.add('selected');
      layerInfo.shadowLayer.setStyle({ 
        opacity: 1.0,
        weight: shadowLineWeight * 2
      });
    }
  });

  // Add context menu handler
  kmlItem.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    createContextMenu(e, layerInfo, map, layers);
  });

  kmlItem.setAttribute('data-name', file.name);
  kmlItems.appendChild(kmlItem);
  sortKMLList(kmlItems);
}

/**
 * Sortiert die KML-Liste alphabetisch
 * 
 * @param {HTMLElement} kmlItems - Container mit allen KML-Listeneinträgen
 * 
 * Diese Funktion wird genutzt, um die Liste übersichtlich zu halten.
 * Die Sortierung basiert auf den extrahierten Nummern aus den Dateinamen,
 * wodurch eine logische Reihenfolge der Befahrungsabschnitte entsteht.
 */
function sortKMLList(kmlItems) {
  const items = Array.from(kmlItems.children);
  items.sort((a, b) => {
    const aText = a.querySelector('.kml-number').textContent;
    const bText = b.querySelector('.kml-number').textContent;
    return aText.localeCompare(bText);
  });
  
  kmlItems.innerHTML = '';
  items.forEach(item => kmlItems.appendChild(item));
}

/**
 * Aktualisiert den visuellen Zustand aller ausgewählten KMLs
 * 
 * Diese Funktion wird aufgerufen, wenn sich der Auswahlzustand ändert.
 * Sie stellt sicher, dass alle UI-Elemente und Layer-Styles
 * den aktuellen Auswahlzustand korrekt widerspiegeln.
 */
function updateSelectedKMLs() {
  const kmlItems = document.getElementById('kml-items');
  kmlItems.querySelectorAll('.kml-item').forEach(item => {
    const name = item.getAttribute('data-name');
    const isSelected = selectedKMLs.some(layerInfo => layerInfo.name === name);
    item.classList.toggle('selected', isSelected);
  });
}

// Initialize color picker functionality
document.addEventListener('DOMContentLoaded', () => {
  const colorBoxes = document.querySelectorAll('.color-box');
  colorBoxes.forEach(colorBox => {
    colorBox.addEventListener('click', () => {
      const selectedColor = colorBox.getAttribute('data-color');
      selectedKMLs.forEach(layerInfo => {
        layerInfo.mainLayer.setStyle({ color: selectedColor });
        layerInfo.color = selectedColor;
        const kmlItem = document.querySelector(`[data-name="${layerInfo.name}"]`);
        if (kmlItem) {
          kmlItem.querySelector('.color-stripe').style.backgroundColor = selectedColor;
        }
      });
    });
  });
});

/**
 * Erstellt ein Kontextmenü für KML-Einträge
 * 
 * @param {Event} e - Das auslösende Event (Rechtsklick)
 * @param {Object} layerInfo - Informationen über die KML-Ebene
 * @param {L.Map} map - Die Leaflet-Karteninstanz
 * @param {Array} layers - Array mit allen KML-Ebenen
 * 
 * Funktionen im Kontextmenü:
 * - Zoom auf KML-Bereich
 * - Farbe ändern
 * - Layer ein-/ausblenden
 * - Layer löschen
 */
function createContextMenu(e, layerInfo, map, layers) {
  // Altes Kontextmenü entfernen falls vorhanden
  const oldMenu = document.querySelector('.context-menu');
  if (oldMenu) {
    document.body.removeChild(oldMenu);
  }

  // Neues Kontextmenü erstellen
  const contextMenu = document.createElement('div');
  contextMenu.className = 'context-menu';
  contextMenu.style.top = `${e.pageY}px`;
  contextMenu.style.left = `${e.pageX}px`;

  // Menüeinträge erstellen
  const menuItems = [
    {
      text: 'Auf KML-Bereich zoomen',
      icon: 'fa-search',
      action: () => {
        map.fitBounds(layerInfo.mainLayer.getBounds());
      }
    },
    {
      text: 'Farbe ändern',
      icon: 'fa-palette',
      action: () => {
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = layerInfo.color;
        colorPicker.click();
        colorPicker.addEventListener('change', (e) => {
          const newColor = e.target.value;
          layerInfo.mainLayer.setStyle({ color: newColor });
          layerInfo.color = newColor;
          const kmlItem = document.querySelector(`[data-name="${layerInfo.name}"]`);
          if (kmlItem) {
            kmlItem.querySelector('.color-stripe').style.backgroundColor = newColor;
          }
        });
      }
    },
    {
      text: layerInfo.eyeIcon.classList.contains('fa-eye-slash') ? 'Layer einblenden' : 'Layer ausblenden',
      icon: layerInfo.eyeIcon.classList.contains('fa-eye-slash') ? 'fa-eye' : 'fa-eye-slash',
      action: () => {
        layerInfo.eyeIcon.click();
      }
    },
    {
      text: 'Layer löschen',
      icon: 'fa-trash',
      action: () => {
        map.removeLayer(layerInfo.mainLayer);
        map.removeLayer(layerInfo.shadowLayer);
        const kmlItem = document.querySelector(`[data-name="${layerInfo.name}"]`);
        if (kmlItem) {
          kmlItem.parentNode.removeChild(kmlItem);
        }
        layers.splice(layers.indexOf(layerInfo), 1);
        selectedKMLs = selectedKMLs.filter(selected => selected !== layerInfo);
      }
    }
  ];

  // Menüeinträge zum Kontextmenü hinzufügen
  menuItems.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.className = 'context-menu-item';
    
    const icon = document.createElement('i');
    icon.className = `fas ${item.icon}`;
    menuItem.appendChild(icon);
    
    const text = document.createElement('span');
    text.textContent = item.text;
    menuItem.appendChild(text);
    
    menuItem.addEventListener('click', () => {
      item.action();
      document.body.removeChild(contextMenu);
    });
    
    contextMenu.appendChild(menuItem);
  });

  // Kontextmenü zum Dokument hinzufügen
  document.body.appendChild(contextMenu);

  // Event-Listener zum Schließen des Menüs
  document.addEventListener('click', function closeMenu(e) {
    if (!contextMenu.contains(e.target)) {
      document.body.removeChild(contextMenu);
      document.removeEventListener('click', closeMenu);
    }
  });
}
