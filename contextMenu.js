/**
 * contextMenu.js
 * ==============
 * This script handles the creation and management of context menus for KML layers.
 * It provides right-click functionality with options to:
 * - Zoom to specific KML
 * - Zoom to all selected KMLs
 * - Select/deselect all KMLs
 * - Zoom out to default view of Germany
 * 
 * The context menu appears when right-clicking on a KML item in the list.
 */

/**
 * Creates a context menu at the click position with relevant options
 * @param {Event} e - The click event
 * @param {Object} layerInfo - Information about the clicked KML layer
 * @param {L.Map} map - The Leaflet map instance
 * @param {Array} layers - Array of all KML layers
 */
function createContextMenu(e, layerInfo, map, layers) {
  // Remove any existing context menu to prevent duplicates
  const existingMenu = document.getElementById('kml-context-menu');
  if (existingMenu) existingMenu.remove();

  // Create new context menu container
  const contextMenu = document.createElement('div');
  contextMenu.id = 'kml-context-menu';
  contextMenu.style.position = 'absolute';
  contextMenu.style.right = `${window.innerWidth - e.pageX}px`; // Position from right edge
  contextMenu.style.top = `${e.pageY}px`;
  contextMenu.style.backgroundColor = 'white';
  contextMenu.style.border = '1px solid #ccc';
  contextMenu.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.2)';
  contextMenu.style.zIndex = '1000';

  // Add menu item: Zoom to this KML
  addMenuItem(contextMenu, 'Zoom to this KML', () => {
    map.flyToBounds(layerInfo.mainLayer.getBounds(), {
      duration: 1,
      easeLinearity: 0.25
    });
  });

  // Add menu item: Zoom to all selected KMLs
  addMenuItem(contextMenu, 'Zoom to all selected', () => {
    if (selectedKMLs.length > 0) {
      // Combine bounds of all selected KMLs
      const bounds = selectedKMLs.map(layerInfo => layerInfo.mainLayer.getBounds());
      const combinedBounds = bounds.reduce((acc, curr) => acc.extend(curr), L.latLngBounds(bounds[0]));
      map.flyToBounds(combinedBounds, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  });

  // Add menu item: Select/deselect all KMLs
  addMenuItem(contextMenu, 'Select/deselect all', () => {
    const allSelected = layers.every(layer => selectedKMLs.includes(layer));
    layers.forEach(layer => {
      const item = document.querySelector(`[data-name="${layer.name}"]`);
      if (item) {
        if (allSelected) {
          // Deselect all
          selectedKMLs = selectedKMLs.filter(selected => selected !== layer);
          item.classList.remove('selected');
        } else {
          // Select all
          if (!selectedKMLs.includes(layer)) {
            selectedKMLs.push(layer);
            item.classList.add('selected');
          }
        }
      }
    });
    updateSelectedKMLs();
  });

  // Add menu item: Zoom out to Germany view
  addMenuItem(contextMenu, 'Zoom-out to Germany', () => {
    map.flyTo([51.1657, 10.4515], 6, {
      duration: 1,
      easeLinearity: 0.25
    });
  });

  // Add the context menu to the document
  document.body.appendChild(contextMenu);

  // Setup click handler to close menu when clicking outside
  const closeMenu = (e) => {
    if (!contextMenu.contains(e.target)) {
      contextMenu.remove();
      document.removeEventListener('click', closeMenu);
    }
  };
  document.addEventListener('click', closeMenu);
}

/**
 * Adds a menu item to the context menu
 * @param {HTMLElement} menu - The context menu container
 * @param {string} text - The text to display in the menu item
 * @param {Function} onClick - The function to execute when the item is clicked
 */
function addMenuItem(menu, text, onClick) {
  // Create menu item container
  const menuItem = document.createElement('div');
  menuItem.textContent = text;
  menuItem.style.padding = '5px 10px';
  menuItem.style.cursor = 'pointer';
  
  // Add click handler that executes the action and removes the menu
  menuItem.addEventListener('click', () => {
    onClick();
    menu.remove();
  });
  
  // Add the item to the menu
  menu.appendChild(menuItem);
}
