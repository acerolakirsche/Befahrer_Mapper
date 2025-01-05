/*
      main.js
      =======
      Diese Datei enthält die Hauptlogik der Anwendung, einschließlich:
      - Initialisierung der Leaflet-Karte.
      - Drag & Drop-Funktionalität für KML-Dateien.
      - Verwaltung der KML-Layer und ihrer Einträge in der Liste.
    */
    // Initialisiere die Karte mit einem Fokus auf Deutschland
    const map = L.map('map').setView([51.1657, 10.4515], 6);

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

    // Globale Variablen für die KML-Layer und die Liste der KML-Einträge
    const layers = [];
    const kmlItems = document.getElementById('kml-items');
