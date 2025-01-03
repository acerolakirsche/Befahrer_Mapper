/*
      main.js
      =======
      Diese Datei enthält die Hauptlogik der Anwendung, einschließlich:
      - Initialisierung der Leaflet-Karte.
      - Drag & Drop-Funktionalität für KML-Dateien.
      - Event-Listener für den "Zu ausgewählten KMLs zoomen"-Button.
      - Verwaltung der KML-Layer und ihrer Einträge in der Liste.
    */
    // Initialisiere die Karte mit einem Standard-View
    const map = L.map('map').setView([51.505, -0.09], 13);
    const kmlItems = document.getElementById('kml-items');
    const layers = [];

    // Füge die OpenStreetMap-TileLayer hinzu
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Drag & Drop Handler für die Karte
    const dropArea = document.getElementById('map');
    dropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropArea.style.backgroundColor = '#f0f0f0';
    });

    dropArea.addEventListener('dragleave', () => {
      dropArea.style.backgroundColor = '';
    });

    dropArea.addEventListener('drop', (e) => {
      e.preventDefault();
      dropArea.style.backgroundColor = '';

      // Verarbeite alle Dateien, die per Drag & Drop hinzugefügt wurden
      const files = e.dataTransfer.files;
      processKMLFiles(files, map, kmlItems, layers);
    });

    // Event-Listener für den "Zu ausgewählten KMLs zoomen"-Button
    document.getElementById('zoom-to-selected').addEventListener('click', () => {
      const selectedLayers = layers.filter(layerInfo => layerInfo.checkbox.checked);
      if (selectedLayers.length > 0) {
        // Erstelle ein Array mit den Bounds aller ausgewählten Layer
        const bounds = selectedLayers.map(layerInfo => layerInfo.mainLayer.getBounds());
        // Kombiniere alle Bounds zu einem gemeinsamen Bound
        const combinedBounds = bounds.reduce((acc, curr) => acc.extend(curr), L.latLngBounds(bounds[0]));
        // Zoome zur kombinierten BoundingBox
        map.fitBounds(combinedBounds);
      } else {
        alert('Bitte wähle mindestens eine KML-Datei aus.');
      }
    });
