# Befahrer Mapper
# Leaflet Map with KML Import and Management

## Project Description
This project is a web-based application that allows users to import KML files (Keyhole Markup Language) via drag & drop onto an interactive map. The application provides a variety of features for managing and visualizing KML data, including color selection, zoom functions, and a clear display of imported files.

## Features
### KML File Import
- **Drag & Drop**: KML files can be dragged and dropped onto the map.
- **Duplicate Protection**: Duplicate KML files are ignored, and the user is informed.
- **Messages**: Successfully added and ignored files are displayed in clear messages.

### Visualization
- **Lines and Shadow Lines**: Each KML file is displayed as a line on the map, with a black shadow line underneath for better visibility.
- **Color Selection**: 8 predefined colors are available to color the lines of selected KML files.
- **Zoom Functions**:

### User Interface
- **Number from Filename**: A two-digit number is extracted from the filename and displayed prominently.
- **Styles**: The font of KML labels is sans-serif and small, while the number is large and easily visible.

### Error Handling and Optimizations
- **Error Messages**: Invalid file types are rejected, and the user is informed.
- **Performance**: The application is optimized for processing many KML files.

## Problems Solved
- **Duplicate Protection**: Duplicate KML files are ignored, and the user is informed.
- **Messages**: Messages for ignored and successfully added files no longer overlap and are clearly designed.

## Possible Extensions
- **Export Function**: Ability to export the current map view as an image or PDF.
- **Advanced Error Handling**: Better error messages for invalid or corrupted KML files.
- **Database Integration**: Storage of imported KML files in a database for persistent use.
- **User Accounts**: Introduction of user accounts to save individual maps and settings.
- **Layer Management**: Ability to group and manage layers to improve clarity.

## Technologies
- **Leaflet.js**: For the interactive map.
- **HTML/CSS/JavaScript**: For the user interface and logic.
- **toGeoJSON**: For converting KML to GeoJSON.
- **PHP**: For server-side functionality like loading projects and KML files.

## Installation and Usage
1. Clone the repository or download the files.
2. Open the `index.html` in a modern web browser.
3. Drag and drop KML files onto the map to import them.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more information.

## Contact
For questions or suggestions, please contact the project maintainer.

## Acknowledgments
Thanks to everyone who contributed to this project, especially the developers of Leaflet.js and toGeoJSON.
