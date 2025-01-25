/**
 * eventHandler.js
 * ================
 * Zentrale Verwaltung aller Event-Listener der Anwendung
 * 
 * Diese Datei enthält alle Event-Listener, die zuvor in main.js waren,
 * nun aber in einer separaten Datei organisiert sind.
 */

export class MapEvents {
  /**
   * Initialisiert Event-Listener für die Karteninteraktionen
   * @param {L.Map} map - Leaflet Karteninstanz
   */
  static init(map) {
    // Event-Listener für Karteninteraktionen
    map.on('click', (e) => {});
    map.on('zoomend', () => {});
    map.on('moveend', () => {});
  }

  /**
   * Registriert Event-Listener für Kartenlayer
   * @param {L.Layer} layer - Der Layer, für den Events registriert werden sollen
   */
  static registerLayerEvents(layer) {
    layer.on('click', function(e) {});
    layer.on('add', function(e) {});
  }
}

export class FileEvents {
  /**
   * Initialisiert Event-Listener für Dateioperationen
   * @param {HTMLElement} dropArea - HTML Element für Drag & Drop
   * @param {Function} processKMLFiles - Callback für KML-Verarbeitung
   * @param {Object} context - Kontextobjekt mit benötigten Referenzen
   */
  static init(dropArea, processKMLFiles, { map, kmlItems, layers }) {
    // Drag & Drop Event-Listener
    dropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropArea.classList.add('dragover');
    });

    dropArea.addEventListener('dragleave', () => {
      dropArea.classList.remove('dragover');
    });

    dropArea.addEventListener('drop', (e) => {
      e.preventDefault();
      dropArea.classList.remove('dragover');
      processKMLFiles(e.dataTransfer.files);
    });
  }
}

export class UIEvents {
  /**
   * Initialisiert Event-Listener für UI-Interaktionen
   * @param {Object} elements - HTML Elemente
   * @param {Object} callbacks - Callback Funktionen
   */
  static init({ userSelector, projectSelector, createProjectBtn }, {
    currentProject,
    loadProjectKMLs,
    applyUserSettings,
    showTempMessage,
    isValidProjectName
  }) {
    // Event-Listener für Benutzerauswahl
    userSelector.addEventListener('change', (e) => {
      const selectedUser = e.target.value;
      applyUserSettings({ defaultUser: selectedUser });
    });

    // Event-Listener für Projektauswahl
    projectSelector.addEventListener('change', (e) => {
      const selectedProject = e.target.value;
      if (selectedProject !== currentProject) {
        loadProjectKMLs(selectedProject);
      }
    });

    // Event-Listener für Projekt-Erstellung
    createProjectBtn.addEventListener('click', () => {
      const projectName = prompt('Neues Projektname:');
      if (projectName) {
        const { isValid, sanitizedName } = isValidProjectName(projectName);
        if (isValid) {
          // Neues Projekt erstellen
          showTempMessage(`Projekt "${sanitizedName}" wird erstellt...`, '#4CAF50');
        } else {
          showTempMessage('Ungültiger Projektname!', '#ff4444');
        }
      }
    });
  }
}
