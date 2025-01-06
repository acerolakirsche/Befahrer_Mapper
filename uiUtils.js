// uiUtils.js
function createKMLListItem(file, layerInfo, kmlItems, layers, map) {
  const kmlItem = document.createElement('div');
  kmlItem.className = 'kml-item';

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
  };
  kmlItem.appendChild(deleteIcon);

  kmlItem.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    createContextMenu(e, layerInfo, map, layers);
  });

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
      const visibleLayers = layers.filter(layerInfo => !layerInfo.eyeIcon.classList.contains('fa-eye-slash'));

      // Ändere die Farbe der sichtbaren Layer
      visibleLayers.forEach(layerInfo => {
        layerInfo.mainLayer.setStyle({ color: selectedColor });
        layerInfo.color = selectedColor; // Aktualisiere die gespeicherte Farbe
      });
    });
  });
});
