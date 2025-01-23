# Befahrer Mapper

## Übersicht
Der Befahrer Mapper ist eine webbasierte Anwendung zur effizienten Planung und Koordination von Messfahrten nach dem Prinzip von Google Street View. Die Anwendung bietet Befahrungsteams eine intuitive Alternative zu komplexen geografischen Informationssystemen wie QGIS.

### Hauptmerkmale
- **Browserbasierte Verfügbarkeit**: Gehostet auf STRATO Webspace, ermöglicht direkten Zugriff ohne Installation
- **Intuitive Benutzeroberfläche**: Optimiert für effiziente Bedienung durch eine zentrale Kartenansicht und ein strukturiertes Bedienpanel
- **Projektverwaltung**: Erstellen und Verwalten von separaten Befahrungsprojekten
- **Drag & Drop KML-Import**: Schnelles Hinzufügen von Befahrungsabschnitten
- **Visuelle Hervorhebung**: 
  - Doppelte Linienführung für bessere Sichtbarkeit
  - Farbkodierung für verschiedene Teams/Abschnitte
  - Intelligente Selektierung mit visueller Hervorhebung im Bedienpanel
- **Automatischer Fokus**: Automatische Zentrierung auf relevante Kartenabschnitte
- **Verbesserte Benutzeroberfläche**: Optimierte Dropdown-Menüs mit klarer visueller Hierarchie

## Codebase Struktur

### Hauptdateien und ihre Verantwortlichkeiten

#### Frontend
- **main.js**: 
  - Zentrale Steuerung der Anwendung
  - Initialisierung der Karte
  - Koordination zwischen UI und Kartenlayer

- **eventHandler.js**:
  - Zentrale Verwaltung aller Maus-Events (Klick, Hover, Drag & Drop)
  - Event-Listener für Benutzerinteraktionen
  - Delegation an spezialisierte Handler

- **kmlProcessor.js**:
  - Verarbeitung von KML-Dateien
  - Konvertierung von KML zu GeoJSON
  - Erstellung von Kartenlayern
  - Keine direkte Event-Handling-Logik

- **uiUtils.js**:
  - Hilfsfunktionen für UI-Interaktionen
  - Erstellung und Aktualisierung von UI-Elementen
  - Synchronisation zwischen UI und Kartenlayer

- **messageUtils.js**:
  - Anzeige von Benachrichtigungen und Fehlermeldungen
  - Temporäre Statusmeldungen

- **styles.css**:
  - Zentrale Styling-Datei
  - Definition von Farben, Schriftarten und Layout

#### Backend
- **getKMLFiles.php**: 
  - Bereitstellung von KML-Dateien für ein bestimmtes Projekt
  - Verwaltung der Dateistruktur

- **getProjects.php**:
  - Verwaltung der Projektstruktur
  - Erstellung neuer Projekte

- **saveUserSettings.php**:
  - Persistente Speicherung von Benutzereinstellungen

## Architekturprinzipien

### Maus-Event-Handling
Alle Maus-Events werden zentral in **eventHandler.js** verwaltet, um eine konsistente Verarbeitung sicherzustellen:

1. **Klick-Events**:
   - Einzel- und Mehrfachselektion von KML-Layern
   - Synchronisation zwischen Karte und Bedienpanel

2. **Hover-Events**:
   - Visuelle Hervorhebung von Layern
   - Anzeige von Zusatzinformationen
   - Synchronisation mit Bedienpanel

3. **Drag & Drop**:
   - Verarbeitung von KML-Dateien
   - Validierung und Konvertierung
   - Erstellung neuer Layer

### Layer-Management
- **main.js**: Verwaltung der Layer-Instanzen
- **kmlProcessor.js**: Erstellung und Styling von Layern
- **uiUtils.js**: Synchronisation mit UI-Elementen

## Entwicklungsrichtlinien

1. **Maus-Events**:
   - Alle Maus-Interaktionen müssen in eventHandler.js implementiert werden
   - Keine direkte Event-Handling-Logik in kmlProcessor.js
   - Konsistente Verarbeitung über zentrale Event-Handler

2. **Code-Organisation**:
   - Klare Trennung von Verantwortlichkeiten
   - main.js als zentrale Steuerungseinheit
   - kmlProcessor.js für reine Datenverarbeitung

3. **Dokumentation**:
   - Alle neuen Funktionen müssen in der README.md dokumentiert werden
   - Architekturänderungen müssen sofort dokumentiert werden

## Wichtige Code-Patterns

### Event Handling in main.js
```javascript
// Beispiel für zentrales Event-Handling
map.on('layeradd', function(e) {
  if (e.layer && e.layer.feature) {
    e.layer.on('mouseover', function() {
      // Hover-Logik
    });
    
    e.layer.on('click', function() {
      // Klick-Logik  
    });
  }
});
```

### Layer Synchronisation
```javascript
// Beispiel für UI-Karten-Synchronisation
function syncLayerSelection(layer, uiElement) {
  layer.on('click', () => {
    uiElement.classList.toggle('selected');
    // Weitere Synchronisationslogik
  });
}
```

## API-Endpunkte

| Endpunkt           | Methode | Beschreibung                     |
|--------------------|---------|----------------------------------|
| getProjects.php    | GET     | Liste aller Projekte             |
| getProjects.php    | POST    | Neues Projekt erstellen          |
| getKMLFiles.php    | GET     | KML-Dateien eines Projekts       |
| saveUserSettings.php | POST  | Benutzereinstellungen speichern  |

## Fehlerbehandlung
- Zentrale Fehlerbehandlung in main.js
- Konsistente Fehlermeldungen über messageUtils.js
- Automatische Protokollierung von Fehlern

```javascript
try {
  // Code mit potentiellen Fehlern
} catch (error) {
  console.error('Fehler:', error);
  showErrorMessage('Ein Fehler ist aufgetreten');
}
