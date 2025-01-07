/**
 * kmlProcessor.js
 * ===============
 * This script handles the processing of KML files, including:
 * - Reading and parsing KML files
 * - Converting KML to GeoJSON
 * - Creating map layers for visualization
 * - Managing duplicate file detection
 * - Extracting numbers from filenames
 */

// Define line weights for visualization
const mainLineWeight = 3; // Weight of the main KML line
const shadowLineWeight = mainLineWeight * 2; // Weight of the shadow line

/**
 * Processes multiple KML files
 * @param {FileList} files - List of KML files to process
 * @param {L.Map} map - Leaflet map instance
 * @param {HTMLElement} kmlItems - Container for KML list items
 * @param {Array} layers - Array to store layer information
 * @returns {Object} - Object containing lists of ignored and added files
 */
function processKMLFiles(files, map, kmlItems, layers) {
  const ignoredFiles = []; // Files that were ignored (duplicates)
  const addedFiles = []; // Files that were successfully added

  // Process each file in the list
  for (const file of files) {
    if (file.name.endsWith('.kml')) {
      // Check if file is a duplicate
      const isDuplicate = layers.some(layerInfo => layerInfo.name === file.name);
      if (isDuplicate) {
        ignoredFiles.push(file.name);
      } else {
        // Process valid, non-duplicate KML file
        processKMLFile(file, map, kmlItems, layers);
        addedFiles.push(file.name);
      }
    } else {
      alert('Please only upload KML files.');
    }
  }

  return { ignoredFiles, addedFiles };
}

/**
 * Processes a single KML file
 * @param {File} file - The KML file to process
 * @param {L.Map} map - Leaflet map instance
 * @param {HTMLElement} kmlItems - Container for KML list items
 * @param {Array} layers - Array to store layer information
 */
function processKMLFile(file, map, kmlItems, layers) {
  const reader = new FileReader();
  
  // Handle file reading completion
  reader.onload = (e) => {
    const kml = e.target.result;
    
    // Parse KML content
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kml, 'text/xml');
    
    // Convert KML to GeoJSON
    const geojson = toGeoJSON.kml(kmlDoc);

    // Create shadow layer (black background line)
    const shadowLayer = L.geoJSON(geojson, {
      style: {
        color: '#000000',
        weight: shadowLineWeight,
        opacity: 0.5
      },
      pointToLayer: () => null // Skip point features
    }).addTo(map);

    // Create main visualization layer
    const mainLayer = L.geoJSON(geojson, {
      style: {
        color: '#ff0000', // Default red color
        weight: mainLineWeight
      },
      onEachFeature: (feature, layer) => {
        // Add popup if feature has a name
        if (feature.properties && feature.properties.name) {
          layer.bindPopup(feature.properties.name);
        }
      },
      pointToLayer: () => null // Skip point features
    }).addTo(map);

    // Store layer information
    const layerInfo = {
      name: file.name,
      mainLayer,
      shadowLayer,
      checkbox: null,
      color: '#ff0000' // Default color
    };
    layers.push(layerInfo);

    // Create list item for the KML file
    createKMLListItem(file, layerInfo, kmlItems, layers, map);
  };
  
  // Start reading the file
  reader.readAsText(file);
}

/**
 * Extracts a two-digit number from the filename
 * @param {string} filename - The KML filename
 * @returns {string} - Extracted two-digit number
 */
function extractNumberFromFilename(filename) {
  // Remove file extension
  const nameWithoutExtension = filename.replace('.kml', '');
  
  // Calculate start position (13 characters from the end)
  const startPos = nameWithoutExtension.length - 13;
  
  // Extract two-digit number
  return nameWithoutExtension.substring(startPos, startPos + 2);
}
