# Befahrer Mapper

## Übersicht
Der Befahrer Mapper ist eine spezialisierte Webanwendung für die Planung und Koordination von Messfahrten im Stil von Google Street View. Die App wurde entwickelt, um Befahrungsteams eine einfache, intuitive Alternative zu komplexen GIS-Systemen wie QGis zu bieten.

### Hauptmerkmale
- **Browserbasiert & Überall verfügbar**: Läuft auf STRATO Webspace und ist von überall ohne Installation zugänglich
- **Einfache Bedienung**: Optimiert für nicht-technische Nutzer
- **Drag & Drop KML-Import**: Schnelles Hinzufügen von Befahrungsabschnitten
- **Visuelle Hervorhebung**: 
  - Doppelte Linienführung für bessere Sichtbarkeit
  - Farbkodierung für verschiedene Teams/Abschnitte
  - Intelligente Selektierung mit visueller Hervorhebung

## Funktionsweise

### Für Befahrungsteams
1. **Zugriff**: Öffnen Sie die Webseite in einem beliebigen Browser
2. **Befahrungsplanung**: 
   - KML-Dateien per Drag & Drop auf die Karte ziehen
   - Abschnitte farblich markieren
   - Mehrere Abschnitte gleichzeitig auswählen und vergleichen
3. **Koordination**: Einfacher Überblick über alle geplanten Befahrungen

### Technische Features
- **Intelligente KML-Verwaltung**:
  - Automatische Erkennung von Duplikaten
  - Extraktion und prominente Anzeige von Abschnittsnummern
  - Schwarze Schatten-Layer für bessere Sichtbarkeit
- **Interaktive Kartenansicht**:
  - Zoom-Funktionen
  - Multi-Select von Abschnitten
  - Hover-Effekte zur schnellen Identifizierung
- **Benutzerfreundliche Oberfläche**:
  - Klare, übersichtliche Darstellung
  - Sofortiges visuelles Feedback
  - Intuitive Bedienelemente

## Geplante Erweiterungen

### Kurzfristig
- **Benutzerkonten**: 
  - Persönliche Ansichten speichern
  - Teamspezifische Einstellungen
- **Erweiterte KML-Informationen**:
  - Anzeige der Streckenlänge in Kilometern
  - Zeitschätzungen für Befahrungen

### Mittelfristig
- **Erweiterte Kartenansichten**:
  - Satellitenbilder für Geländeeinschätzung
  - Wetterdaten-Integration
  - Wetter-Satellitenbilder-Overlay

### Langfristig
- **Team-Koordination**:
  - Echtzeit-Kollaboration
  - Automatische Routenoptimierung
  - Fortschrittsverfolgung

## Technischer Stack
- **Frontend**: HTML5, CSS3, JavaScript
- **Kartendarstellung**: Leaflet.js
- **Datenverarbeitung**: toGeoJSON
- **Backend**: PHP
- **Hosting**: STRATO Webspace

## Mitwirkung
Feedback und Verbesserungsvorschläge sind willkommen! Die Anwendung wird kontinuierlich weiterentwickelt, um den Bedürfnissen der Befahrungsteams gerecht zu werden.

## Lizenz
Dieses Projekt steht unter der MIT-Lizenz.
