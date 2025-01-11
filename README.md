# Befahrer Mapper

## Übersicht
Der Befahrer Mapper ist eine spezialisierte Webanwendung für die Planung und Koordination von Messfahrten im Stil von Google Street View. Die App wurde entwickelt, um Befahrungsteams eine einfache, intuitive Alternative zu komplexen GIS-Systemen wie QGis zu bieten.

### Hauptmerkmale
- **Browserbasiert & Überall verfügbar**: Läuft auf STRATO Webspace und ist von überall ohne Installation zugänglich
- **Einfache Bedienung**: Optimiert für nicht-technische Nutzer
- **Projektverwaltung**: Erstellen und Verwalten von separaten Befahrungsprojekten
- **Drag & Drop KML-Import**: Schnelles Hinzufügen von Befahrungsabschnitten
  - **Visuelle Hervorhebung**: 
    - Doppelte Linienführung für bessere Sichtbarkeit
    - Farbkodierung für verschiedene Teams/Abschnitte
    - Intelligente Selektierung mit visueller Hervorhebung
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

## Technische Dokumentation

### Dateistruktur und Komponenten

#### `index.html`
- **Hauptfunktion**: Zentrale Benutzeroberfläche und Struktur der Anwendung
- **Wichtige Elemente**:
  - Kartendarstellung (`#map`)
  - Projekt-Auswahl (`#project-selector`) mit optimierter CSS-Klassenstruktur
  - KML-Listenansicht (`#kml-items`)
  - Verschiedene UI-Kontrollelemente

#### `main.js`
- **Hauptfunktion**: Zentrale Anwendungslogik und Kartensteuerung
- **Kernfunktionalitäten**:
  - Karteninitialisierung und Grundeinstellungen
  - Projekt-Management (`loadProjectKMLs`)
  - Drag & Drop-Verarbeitung
  - Layer-Management und Visualisierung
  - Automatische Kartenfokussierung auf Projektbereiche

#### `kmlProcessor.js`
- **Hauptfunktion**: Verarbeitung und Verwaltung von KML-Dateien
- **Kernfunktionalitäten**:
  - KML-Datei-Parsing und Konvertierung
  - Duplikatserkennung
  - Layer-Erstellung und Styling
  - Extraktion von Abschnittsnummern

#### `contextMenu.js`
- **Hauptfunktion**: Kontextmenü-Funktionalität für Karteninteraktionen
- **Kernfunktionalitäten**:
  - Rechtsklick-Menü
  - Kontextabhängige Aktionen
  - Layer-spezifische Operationen

#### `styles.css`
- **Hauptfunktion**: Visuelle Gestaltung und Benutzeroberfläche
- **Neue Features**:
  - Optimierte CSS-Klassen für Dropdown-Menüs
  - Verbesserte Browser-Kompatibilität
  - Konsistente Farbgebung und Formatierung
  - ::before Pseudo-Elemente für Icons

### Wichtige Funktionen im Detail

#### Projekt-Management (`main.js`, `getProjects.php`)
```javascript
async function loadProjectKMLs(projektName)
```
- Lädt alle KML-Dateien eines Projekts
- Bereinigt bestehende Layer
- Verarbeitet neue KML-Dateien
- Fokussiert die Karte automatisch auf den relevanten Bereich
- Parameter:
  - `projektName`: Name des zu ladenden Projekts

```javascript
// Projekterstellung via POST-Request
fetch('getProjects.php', {
  method: 'POST',
  body: 'action=create&projectName=projektName'
})
```
- Erstellt ein neues Befahrungsprojekt
- Erzeugt automatisch die erforderliche Ordnerstruktur
- Erstellt einen KML-Files Unterordner für Befahrungsdaten
- Validiert Projektnamen auf erlaubte Zeichen
- Verhindert Duplikate von Projektnamen

#### KML-Verarbeitung (`kmlProcessor.js`)
```javascript
function processKMLFile(file, map, kmlItems, layers)
```
- Verarbeitet einzelne KML-Dateien
- Erstellt Layer und Visualisierungen
- Fügt Einträge zur KML-Liste hinzu
- Parameter:
  - `file`: Die zu verarbeitende KML-Datei
  - `map`: Leaflet-Kartenobjekt
  - `kmlItems`: Container für KML-Listeneinträge
  - `layers`: Array für Layer-Verwaltung

### Technischer Stack
- **Frontend**: 
  - HTML5, CSS3, JavaScript
  - Leaflet.js für Kartendarstellung
  - toGeoJSON für KML-Verarbeitung
- **Backend**: 
  - PHP für Dateisystem-Operationen
- **Hosting**: 
  - STRATO Webspace