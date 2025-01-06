// uiUtils.js
function createKMLListItem(file, layerInfo, kmlItems, layers, map) {
  const kmlItem = document.createElement('div');
  kmlItem.className = 'kml-item';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.style.marginRight = '10px';
  layerInfo.checkbox = checkbox;

  checkbox.addEventListener('click', (e) => e.stopPropagation());
  kmlItem.appendChild(checkbox);

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

  kmlItem.addEventListener('click', (e) => {
    if (!e.target.matches('input[type="checkbox"]') && !e.target.matches('.delete-icon')) {
      checkbox.checked = !checkbox.checked;
    }
  });

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
      const selectedLayers = layers.filter(layerInfo => layerInfo.checkbox.checked);

      // Ändere die Farbe der ausgewählten Layer
      selectedLayers.forEach(layerInfo => {
        layerInfo.mainLayer.setStyle({ color: selectedColor });
        layerInfo.color = selectedColor; // Aktualisiere die gespeicherte Farbe
      });
    });
  });
});
