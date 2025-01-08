# Befahrer Mapper
# Leaflet Map with KML Import and Management

## Vorab-Prompt:
    Vorabinformationen für Dich:
		Implementiere stets Deine Änderungen in die vorhandenen Dateien, und achte darauf, dass Du die von den Änderungen nicht betroffenen Bereiche nicht löschst oder unbrauchbar machst.
		Füge keine Zeilennummern an den Beginn jeder Zeile.
		Beachte, dass, wenn Du 'create' machen willst, Du bitte einfach beispielsweise 'create dateiname.js' machst. Also ohne einen Pfad davor!
		Bitte den Code immer ausführlich mit englischen Kommentaren versehen, damit er gut lesbar für Anfänger ist.
		Bitte Kommentare im Code gegebenenfalls aktualisieren.
    Das Projekt liegt auf dem Webspace von STRATO, und man kann dort mit php auch Serverfunktionalität nutzen.
    Niemals Vite nutzen.
    Niemals hier in der Entwicklungsumgebung einen WebContainer starten.
    Niemals ES-Module nutzen.
    Der Code darf keine CORS Probleme verursachen, also bitte auf Kompatibilität achten!
    
    Bitte jetzt noch nichts ändern. Es war nur eine Information für Dich.

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
  - Clicking on a list entry zooms to the corresponding KML file.
  - A button allows zooming to all selected KML files.

### User Interface
- **Checkboxes**: Each KML file has a checkbox for selection.
- **"Select All"**: A checkbox allows selecting/deselecting all KML files.
- **Number from Filename**: A two-digit number is extracted from the filename and displayed prominently.
- **Styles**: The font of KML labels is sans-serif and small, while the number is large and easily visible.

### Error Handling and Optimizations
- **Error Messages**: Invalid file types are rejected, and the user is informed.
- **Performance**: The application is optimized for processing many KML files.

## Problems Solved
- **Duplicate Protection**: Duplicate KML files are ignored, and the user is informed.
- **Messages**: Messages for ignored and successfully added files no longer overlap and are clearly designed.
- **User Friendliness**: The application has been improved through clear messages and an intuitive user interface.

## Possible Extensions
- **Adjust Line Thickness**: A function to change the line thickness of the main line via the user interface.
- **Export Function**: Ability to export the current map view as an image or PDF.
- **Advanced Error Handling**: Better error messages for invalid or corrupted KML files.
- **Database Integration**: Storage of imported KML files in a database for persistent use.
- **User Accounts**: Introduction of user accounts to save individual maps and settings.
- **Layer Management**: Ability to group and manage layers to improve clarity.

## Technologies
- **Leaflet.js**: For the interactive map.
- **HTML/CSS/JavaScript**: For the user interface and logic.
- **toGeoJSON**: For converting KML to GeoJSON.
- **PHP**: For server-side functionality like folder creation.

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

## Recent Updates
- Added PHP-based folder creation functionality
- Improved error handling and user feedback
- Enhanced UI with better color selection and visibility controls
- Added context menu for quick access to zoom functions
- Improved performance for handling multiple KML files
