// uiUtils.js
let selectedKMLs = []; // Globale Variable für selektierte KMLs

function createKMLListItem(file, layerInfo, kmlItems, layers, map) {
  const kmlItem = document.createElement('div');
  kmlItem.className = 'kml-item';

  // Erstelle den Farbstrich
  const colorStripe = document.createElement('div');
  colorStripe.className = 'color-stripe';
  colorStripe.style.backgroundColor = layerInfo.color; // Initiale Farbe
  kmlItem.appendChild(colorStripe);

  // Erstelle das Augen-Symbol
  const eyeIcon = document.createElement('i');
  eyeIcon.className = 'fas fa-eye'; // Standard: Auge sichtbar
  eyeIcon.style.marginRight = '10px';
  eyeIcon.style.cursor = 'pointer';
  layerInfo.eyeIcon = eyeIcon;

  // Event-Listener für das Augen-Symbol
  eyeIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = !eyeIcon.classList.contains('fa-eye-slash');
    if (isVisible) {
      // Blende die KML aus
      map.removeLayer(layerInfo.mainLayer);
      map.removeLayer(layerInfo.shadowLayer);
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    } else {
      // Blende die KML ein
      map.addLayer(layerInfo.shadowLayer);
      map.addLayer(layerInfo.mainLayer);
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
  });

  kmlItem.appendChild(eyeIcon);

  const number = extractNumberFromFilename(file.name);
  const numberElement = document.createElement('span');
  numberElement.className = 'kml-number';
  numberElement.textContent = number;
  kmlItem.appendChild(numberElement);

  const fileName = document.createElement('span');
  fileName.textContent = file.name;
  kmlItem.appendChild(fileName);

  const deleteIcon = document.createElement('i');
  deleteIcon.className = 'fas fa-trash delete-icon';
  deleteIcon.onclick = (e) => {
    e.stopPropagation();
    map.removeLayer(layerInfo.mainLayer);
    map.removeLayer(layerInfo.shadowLayer);
    kmlItems.removeChild(kmlItem);
    layers.splice(layers.indexOf(layerInfo), 1);
    selectedKMLs = selectedKMLs.filter(selected => selected !== layerInfo); // Entferne aus Selektion
  };
  kmlItem.appendChild(deleteIcon);

  // Event-Listener für die Selektierung
  kmlItem.addEventListener('click', (e) => {
    e.stopPropagation();

    if (e.metaKey || e.ctrlKey) {
      // Command/Strg + Klick: Einzelne Auswahl hinzufügen/entfernen
      if (selectedKMLs.includes(layerInfo)) {
        selectedKMLs = selectedKMLs.filter(selected => selected !== layerInfo);
        kmlItem.classList.remove('selected');
      } else {
        selectedKMLs.push(layerInfo);
        kmlItem.classList.add('selected');
      }
    } else if (e.shiftKey) {
      // Shift + Klick: Bereichsauswahl basierend auf der sichtbaren Reihenfolge
      const visibleItems = Array.from(kmlItems.children);
      const startIndex = visibleItems.findIndex(item => selectedKMLs.includes(layers.find(layer => layer.name === item.getAttribute('data-name'))));
      const endIndex = visibleItems.indexOf(kmlItem);

      if (startIndex !== -1 && endIndex !== -1) {
        const range = visibleItems.slice(
          Math.min(startIndex, endIndex),
          Math.max(startIndex, endIndex) + 1
        );
        range.forEach(item => {
          const layer = layers.find(layer => layer.name === item.getAttribute('data-name'));
          if (layer && !selectedKMLs.includes(layer)) {
            selectedKMLs.push(layer);
            item.classList.add('selected');
          }
        });
      }
    } else {
      // Einfacher Klick: Einzelauswahl
      selectedKMLs.forEach(selected => {
        const item = kmlItems.querySelector(`[data-name="${selected.name}"]`);
        if (item) item.classList.remove('selected');
      });
      selectedKMLs = [layerInfo];
      kmlItem.classList.add('selected');
    }

    // Aktualisiere die Farbe der selektierten KMLs
    updateSelectedKMLs();
  });

  // Event-Listener für das Kontextmenü (Rechtsklick)
  kmlItem.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    createContextMenu(e, layerInfo, map, layers);
  });

  kmlItem.setAttribute('data-name', file.name);
  kmlItems.appendChild(kmlItem);
  sortKMLList(kmlItems);
}

function sortKMLList(kmlItems) {
  const items = Array.from(kmlItems.children);
  items.sort((a, b) => {
    const nameA = a.querySelector('span').textContent.toLowerCase();
    const nameB = b.querySelector('span').textContent.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  kmlItems.innerHTML = '';
  items.forEach(item => kmlItems.appendChild(item));
}

// Event-Listener für die Farbkästchen
document.addEventListener('DOMContentLoaded', () => {
  const colorBoxes = document.querySelectorAll('.color-box');
  colorBoxes.forEach(colorBox => {
    colorBox.addEventListener('click', () => {
      const selectedColor = colorBox.getAttribute('data-color');
      selectedKMLs.forEach(layerInfo => {
        layerInfo.mainLayer.setStyle({ color: selectedColor });
        layerInfo.color = selectedColor; // Aktualisiere die gespeicherte Farbe
        // Aktualisiere den Farbstrich
        const kmlItem = document.querySelector(`[data-name="${layerInfo.name}"]`);
        if (kmlItem) {
          kmlItem.querySelector('.color-stripe').style.backgroundColor = selectedColor;
        }
      });
    });
  });
});

function updateSelectedKMLs() {
  const kmlItems = document.getElementById('kml-items');
  kmlItems.querySelectorAll('.kml-item').forEach(item => {
    const name = item.getAttribute('data-name');
    const isSelected = selectedKMLs.some(layerInfo => layerInfo.name === name);
    item.classList.toggle('selected', isSelected);
  });
}
