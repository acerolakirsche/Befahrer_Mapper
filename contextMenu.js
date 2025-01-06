// contextMenu.js
    function createContextMenu(e, layerInfo, map, layers) {
      const existingMenu = document.getElementById('kml-context-menu');
      if (existingMenu) existingMenu.remove();

      const contextMenu = document.createElement('div');
      contextMenu.id = 'kml-context-menu';
      contextMenu.style.position = 'absolute';
      contextMenu.style.right = `${window.innerWidth - e.pageX}px`;
      contextMenu.style.top = `${e.pageY}px`;
      contextMenu.style.backgroundColor = 'white';
      contextMenu.style.border = '1px solid #ccc';
      contextMenu.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.2)';
      contextMenu.style.zIndex = '1000';

      addMenuItem(contextMenu, 'Zoom auf diese KML', () => {
        map.flyToBounds(layerInfo.mainLayer.getBounds(), {
          duration: 1,
          easeLinearity: 0.25
        });
      });

      addMenuItem(contextMenu, 'Zoom auf alle selektierten', () => {
        const selectedLayers = layers.filter(l => l.checkbox.checked);
        if (selectedLayers.length > 0) {
          const bounds = selectedLayers.map(l => l.mainLayer.getBounds());
          const combinedBounds = bounds.reduce((acc, curr) => acc.extend(curr), L.latLngBounds(bounds[0]));
          map.flyToBounds(combinedBounds, {
            duration: 1.5,
            easeLinearity: 0.25
          });
        }
      });

      addMenuItem(contextMenu, 'Alle selektieren/deselektieren', () => {
        const allChecked = layers.every(layer => layer.checkbox.checked);
        layers.forEach(layer => {
          layer.checkbox.checked = !allChecked;
        });
      });

      addMenuItem(contextMenu, 'Zoom-out auf Deutschland', () => {
        map.flyTo([51.1657, 10.4515], 6, {
          duration: 1,
          easeLinearity: 0.25
        });
      });

      document.body.appendChild(contextMenu);

      const closeMenu = (e) => {
        if (!contextMenu.contains(e.target)) {
          contextMenu.remove();
          document.removeEventListener('click', closeMenu);
        }
      };
      document.addEventListener('click', closeMenu);
    }

    function addMenuItem(menu, text, onClick) {
      const menuItem = document.createElement('div');
      menuItem.textContent = text;
      menuItem.style.padding = '5px 10px';
      menuItem.style.cursor = 'pointer';
      menuItem.addEventListener('click', () => {
        onClick();
        menu.remove();
      });
      menu.appendChild(menuItem);
    }
