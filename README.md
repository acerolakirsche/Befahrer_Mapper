# Befahrer Mapper

## Übersicht
Der Befahrer Mapper ist eine webbasierte Anwendung zur effizienten Planung und Koordination von Messfahrten nach dem Prinzip von Google Street View. Die Anwendung bietet Befahrungsteams eine intuitive Alternative zu komplexen geografischen Informationssystemen wie QGIS.

### Hauptmerkmale
- **Browserbasierte Verfügbarkeit**: Gehostet auf STRATO Webspace, ermöglicht direkten Zugriff ohne Installation
- **Intuitive Benutzeroberfläche**: Optimiert für effiziente Bedienung durch eine zentrale Kartenansicht und ein strukturiertes Bedienpanel
- **Projektverwaltung**: Erstellen und Verwalten von separaten Befahrungsprojekten
- **Drag & Drop KML-Import**: Schnelles Hinzufügen von Befahrungsabschnitten (so genannte KML Files, oder kurz: KMLs)
    - **Visuelle Hervorhebung**: 
      - Doppelte Linienführung für bessere Sichtbarkeit
      - Farbkodierung für verschiedene Teams/Abschnitte
      - Intelligente Selektierung mit visueller Hervorhebung im Bedienpanel:
        - Einzelauswahl: Klicken ohne Modifikatortaste
        - Mehrfachauswahl: Strg/Cmd + Klick
        - Bereichsauswahl: Shift + Klick
        - Visuelle Hervorhebung durch blaue Hinterlegung
        - Synchronisierte Hervorhebung auf der Karte
      - Bounding Box beim Hovern über KML-Einträge
        - Präzise positionierte Info-Labels mit Schatteneffekt für bessere Lesbarkeit
      - Automatische Entfernung der Bounding Box beim Löschen
- **Automatischer Fokus**: Automatische Zentrierung auf relevante Kartenabschnitte
- **Verbesserte Benutzeroberfläche**:
  - Optimierte Dropdown-Menüs mit klarer visueller Hierarchie
  - Konsistente Farbgebung und Formatierung
  - Browser-kompatible CSS-Implementierungen

## Funktionsweise
### Für Befahrungsteams
1. **Zugriff**: Öffnen Sie die Webseite in einem beliebigen Browser
2. **Befahrungsplanung**: 
   - KML-Dateien per Drag & Drop auf die Karte ziehen
   - Abschnitte farblich markieren
   - Mehrere Abschnitte gleichzeitig auswählen und vergleichen
3. **Koordination**: Einfacher Überblick über alle geplanten Befahrungen
4. **Projektauswahl und -erstellung**:
    - Schneller Wechsel zwischen verschiedenen Befahrungsprojekten
    - Automatische Fokussierung auf relevante Kartenabschnitte
    - Einfache Erstellung neuer Projekte:
      - Auswahl "neues Projekt" aus dem Dropdown-Menü
      - Eingabe des Projektnamens (erlaubt sind Buchstaben, Zahlen, Bindestrich und Unterstrich)
      - Automatische Erstellung der Projektstruktur mit KML-Ordner
      - Sofortige Verfügbarkeit des neuen Projekts in der Auswahlliste
      - Verbesserte visuelle Darstellung der "neues Projekt" Option mit grünem Plus-Zeichen

## Technische Dokumentation für LLMs

### Architekturübersicht

#### Kernkomponenten und Datenfluss

Die Anwendung basiert auf einer klassischen Client-Server-Architektur:

**Frontend (Browser)**
- Zentrale Komponente ist index.html als UI-Root
- Enthält zwei Hauptbereiche:
  1. Kartenansicht: Primäre Interaktionsfläche für KML-Visualisierung
  2. Bedienpanel: Steuerungszentrale für alle Benutzerinteraktionen
- Neue Dateien:
  - styles.css: Zentrale Styling-Datei für das gesamte visuelle Erscheinungsbild
  - uiUtils.js: Hilfsfunktionen für UI-Interaktionen und Updates
  - messageUtils.js: Funktionen für Benachrichtigungen und Fehlermeldungen

**Backend (PHP)**
- Verwaltet die Projektstruktur im Dateisystem
- Organisiert KML-Dateien in projektspezifischen Verzeichnissen
- Stellt REST-Schnittstellen bereit für:
  - Projektverwaltung
  - KML-Dateioperationen
  - Benutzerverwaltung

**Datenfluss**
1. Benutzerinteraktionen im Frontend lösen Events aus
2. Events führen zu REST-API-Aufrufen an Backend-Endpunkte
3. Backend verarbeitet Anfragen und manipuliert Dateisystem
4. Antworten werden ans Frontend zurückgeliefert
5. Frontend aktualisiert UI-Zustand entsprechend

#### Bedienpanel Struktur
Das Bedienpanel ist die zentrale Steuerungseinheit und enthält:
- Projekt-Dropdown (#project-selector)
- KML-Listendarstellung (#kml-items)
- Farbauswahl für KML-Layer
- Benutzerauswahl (#user-selector)
  - Anzeige des aktuellen Benutzers (#username-display)
  - Dropdown zur Benutzerauswahl
  - Persistente Speicherung der Benutzereinstellungen

### Komponenteninteraktionen

#### 1. Projekt-Management Flow
```javascript
// 1. Projekt laden
main.js:loadProjectKMLs(projektName)
  ↓
// 2. KML-Dateien abrufen
getKMLFiles.php (GET)
  ↓
// 3. KML verarbeiten
kmlProcessor.js:processKMLFile()
  ↓
// 4. UI aktualisieren
uiUtils.js:updateKMLList()
```

#### 2. KML-Verarbeitung Flow
```javascript
// 1. Drag & Drop Event
main.js:handleDrop()
  ↓
// 2. KML zu GeoJSON
kmlProcessor.js:convertKMLtoGeoJSON()
  ↓
// 3. Layer erstellen
kmlProcessor.js:createLayer()
  ↓
// 4. UI Element erstellen
uiUtils.js:createKMLListItem()
```

### Neue Dateistruktur

```
Befahrer_Mapper-1/
├── User/
│   ├── allgemein/
│   │   └── user_allgemein.json
│   ├── Andreas/
│   │   └── user_Andreas.json
│   ├── Lars/
│   │   └── user_Lars.json
│   ├── Leon/
│   │   └── user_Leon.json
│   ├── Michi/
│   │   └── user_Michi.json
│   ├── Nico/
│   │   └── user_Nico.json
│   ├── Thomas/
│   │   └── user_Thomas.json
│   ├── Tom/
│   │   └── user_Tom.json
│   └── Torsten/
│       └── user_Thorsten.json
├── contextMenu.js
├── getKMLFiles.php
├── getProjects.php
├── index.html
├── kmlProcessor.js
├── main.js
├── messageUtils.js
├── README.md
├── styles.css
└── uiUtils.js
```

### Wichtige Code-Patterns

#### 1. Event Handling
```javascript
// Beispiel aus main.js
document.addEventListener('drop', async (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    for (const file of files) {
        await processKMLFile(file, map, kmlItems, layers);
    }
});
```

#### 2. Layer Management
```javascript
// Beispiel aus kmlProcessor.js
function createLayer(geoJSON, style) {
    return L.geoJSON(geoJSON, {
        style: style,
        onEachFeature: (feature, layer) => {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: selectFeature
            });
        }
    });
}
```

#### 3. UI Updates
```javascript
// Beispiel aus uiUtils.js
function updateKMLList(kmlItem, layer) {
    const listItem = document.createElement('div');
    listItem.className = 'kml-item';
    listItem.dataset.layerId = layer._leaflet_id;
    
    // Synchronisiere UI-Status mit Layer
    layer.on('click', () => {
        listItem.classList.toggle('selected');
    });
    
    return listItem;
}
```

### API-Endpunkte

#### getProjects.php
```
GET  / - Liste aller Projekte
POST / - Neues Projekt erstellen
Body: action=create&projectName={name}
```

#### getKMLFiles.php
```
GET /?project={name} - KML-Dateien eines Projekts
POST / - KML-Datei speichern
Body: FormData mit file und project
```

### Fehlerbehandlung
```javascript
// Beispiel für konsistente Fehlerbehandlung
try {
    await loadProjectKMLs(projektName);
} catch (error) {
    messageUtils.show({
        type: 'error',
        message: `Fehler beim Laden des Projekts: ${error.message}`,
        duration: 5000
    });
}
```

## Implementierte Funktionen

### Benutzerverwaltungssystem

#### Funktionen
1. **Benutzerauswahl**
   - Dropdown-Menü zur Benutzerauswahl im Bedienpanel
   - Standardbenutzer "allgemein" bei nicht erfolgter Auswahl
   - Anzeige des aktiven Benutzers im Format "Aktueller Benutzer: [NAME]"
   - Graue Textfarbe (50% #808080) für bessere Lesbarkeit

2. **Persistente Benutzerkonfiguration**
   - Speicherung individueller KML-Konfigurationen:
     - Farbzuweisungen
     - Sichtbarkeitsstatus
     - Zuletzt gewähltes Projekt
   - JSON-basierte Konfigurationsdateien im jeweiligen Benutzerverzeichnis
   - Automatische Wiederherstellung der Benutzereinstellungen bei erneutem Login

#### Technische Umsetzung
- Verzeichnisstruktur: "User"-Ordner auf Projektebene
- Dynamische Erfassung vorhandener Benutzerverzeichnisse
- Integration der Benutzerauswahl im Bedienpanel via Dropdown
- Validierung der korrekten Funktionalität
