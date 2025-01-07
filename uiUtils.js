/**
 * uiUtils.js
 * ==========
 * This script contains utility functions for managing the user interface, including:
 * - Creating and managing KML list items
 * - Handling layer selection and visibility
 * - Managing color selection for KML layers
 * - Sorting and updating the KML list
 * - Handling context menu interactions
 */

// Global variable to track selected KMLs
let selectedKMLs = [];

/**
 * Creates a list item for a KML file
 * @param {File} file - The KML file
 * @param {Object} layerInfo - Information about the KML layer
 * @param {HTMLElement} kmlItems - Container for KML list items
 * @param {Array} layers - Array of all KML layers
 * @param {L.Map} map - Leaflet map instance
 */
function createKMLListItem(file, layerInfo, kmlItems, layers, map) {
  // Create container for the list item
  const kmlItem = document.createElement('div');
  kmlItem.className = 'kml-item';

  // Create color stripe indicating layer color
  const colorStripe = document.createElement('div');
  colorStripe.className = 'color-stripe';
  colorStripe.style.backgroundColor = layerInfo.color;
  kmlItem.appendChild(colorStripe);

  // Create eye icon for visibility control
  const eyeIcon = document.createElement('i');
  eyeIcon.className = 'fas fa-eye';
  eyeIcon.style.marginRight = '10px';
  eyeIcon.style.cursor = 'pointer';
  layerInfo.eyeIcon = eyeIcon;

  // Add click handler for visibility toggle
  eyeIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = !eyeIcon.classList.contains('fa-eye-slash');
    if (isVisible) {
      // Hide the layer
      map.removeLayer(layerInfo.mainLayer);
      map.removeLayer(layerInfo.shadowLayer);
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    } else {
      // Show the layer
      map.addLayer(layerInfo.shadowLayer);
      map.addLayer(layerInfo.mainLayer);
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
  });

  kmlItem.appendChild(eyeIcon);

  // Extract and display number from filename
  const number = extractNumberFromFilename(file.name);
  const numberElement = document.createElement('span');
  numberElement.className = 'kml-number';
  numberElement.textContent = number;
  kmlItem.appendChild(numberElement);

  // Display filename
  const fileName = document.createElement('span');
  fileName.textContent = file.name;
  kmlItem.appendChild(fileName);

  // Add delete icon
  const deleteIcon = document.createElement('i');
  deleteIcon.className = 'fas fa-trash delete-icon';
  deleteIcon.onclick = (e) => {
    e.stopPropagation();
    map.removeLayer(layerInfo.mainLayer);
    map.removeLayer(layerInfo.shadowLayer);
    kmlItems.removeChild(kmlItem);
    layers.splice(layers.indexOf(layerInfo), 1);
    selectedKMLs = selectedKMLs.filter(selected => selected !== layerInfo);
  };
  kmlItem.appendChild(deleteIcon);

  // Add click handler for selection
  kmlItem.addEventListener('click', (e) => {
    e.stopPropagation();

    // Handle different selection modes
    if (e.metaKey || e.ctrlKey) {
      // Toggle single selection
      if (selectedKMLs.includes(layerInfo)) {
        selectedKMLs = selectedKMLs.filter(selected => selected !== layerInfo);
        kmlItem.classList.remove('selected');
      } else {
        selectedKMLs.push(layerInfo);
        kmlItem.classList.add('selected');
      }
    } else if (e.shiftKey) {
      // Range selection
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
      // Single selection
      selectedKMLs.forEach(selected => {
        const item = kmlItems.querySelector(`[data-name="${selected.name}"]`);
        if (item) item.classList.remove('selected');
      });
      selectedKMLs = [layerInfo];
      kmlItem.classList.add('selected');
    }

    updateSelectedKMLs();
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
 * Sorts the KML list alphabetically
 * @param {HTMLElement} kmlItems - Container for KML list items
 */
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

/**
 * Updates the visual state of selected KMLs
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
