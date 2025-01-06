// kmlProcessor.js
    const mainLineWeight = 3;
    const shadowLineWeight = mainLineWeight * 2;

    function processKMLFiles(files, map, kmlItems, layers) {
      const ignoredFiles = [];
      const addedFiles = [];

      for (const file of files) {
        if (file.name.endsWith('.kml')) {
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

      return { ignoredFiles, addedFiles };
    }

    function processKMLFile(file, map, kmlItems, layers) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const kml = e.target.result;
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kml, 'text/xml');
        const geojson = toGeoJSON.kml(kmlDoc);

        const shadowLayer = L.geoJSON(geojson, {
          style: {
            color: '#000000',
            weight: shadowLineWeight,
            opacity: 0.5
          },
          pointToLayer: () => null
        }).addTo(map);

        const mainLayer = L.geoJSON(geojson, {
          style: {
            color: '#ff0000',
            weight: mainLineWeight
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.name) {
              layer.bindPopup(feature.properties.name);
            }
          },
          pointToLayer: () => null
        }).addTo(map);

        const layerInfo = {
          name: file.name,
          mainLayer,
          shadowLayer,
          checkbox: null,
          color: '#ff0000'
        };
        layers.push(layerInfo);

        createKMLListItem(file, layerInfo, kmlItems, layers, map);
      };
      reader.readAsText(file);
    }

    function extractNumberFromFilename(filename) {
      const nameWithoutExtension = filename.replace('.kml', '');
      const startPos = nameWithoutExtension.length - 13;
      return nameWithoutExtension.substring(startPos, startPos + 2);
    }
