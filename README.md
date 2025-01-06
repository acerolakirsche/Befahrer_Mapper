# Befahrer Mapper
# Leaflet Map with KML Import and Management

    ## Vorab-Prompt:
		Vorabinformationen für Dich:
		Bitte in Deinen Antworten immer vollständigen Code schicken, niemals nur Snippets.
		Das Projekt liegt auf dem Webspace von STRATO, und man kann dort mit php auch Serverfunktionalität nutzen.
		Niemals Vite nutzen.
		Niemals hier in der Entwicklungsumgebung einen WebContainer starten.
		Niemals ES-Module nutzen.
		Der Code darf keine CORS Probleme verursachen, also bitte auf Kompatibilität achten!
		
		Bitte jetzt noch nichts ändern. Es war nur eine Information für Dich.
		
		## Projektbeschreibung
    Dieses Projekt ist eine webbasierte Anwendung, die es Benutzern ermöglicht, KML-Dateien (Keyhole Markup Language) per Drag & Drop auf eine interaktive Karte zu importieren. Die Anwendung bietet eine Vielzahl von Funktionen zur Verwaltung und Visualisierung der KML-Daten, einschließlich Farbauswahl, Zoom-Funktionen und einer übersichtlichen Darstellung der importierten Dateien.

    ## Funktionen
    ### KML-Dateien importieren
    - **Drag & Drop**: KML-Dateien können per Drag & Drop auf die Karte gezogen werden.
    - **Verdoppelungsschutz**: Doppelte KML-Dateien werden ignoriert, und der Benutzer wird darüber informiert.
    - **Meldungen**: Erfolgreich hinzugefügte und ignorierte Dateien werden in übersichtlichen Meldungen angezeigt.

    ### Visualisierung
    - **Linien und Schattenlinien**: Jede KML-Datei wird als Linie auf der Karte dargestellt, mit einer schwarzen Schattenlinie darunter für bessere Sichtbarkeit.
    - **Farbauswahl**: 8 vordefinierte Farben stehen zur Verfügung, um die Linien der ausgewählten KML-Dateien einzufärben.
    - **Zoom-Funktionen**:
      - Klicken auf einen Listeneintrag zoomt auf die entsprechende KML-Datei.
      - Ein Button ermöglicht das Zoomen auf alle ausgewählten KML-Dateien.

    ### Benutzeroberfläche
    - **Checkboxen**: Jede KML-Datei hat eine Checkbox für die Auswahl.
    - **"Alle auswählen"**: Eine Checkbox ermöglicht das Auswählen/Abwählen aller KML-Dateien.
    - **Zahl aus dem Dateinamen**: Eine zweistellige Zahl wird aus dem Dateinamen extrahiert und groß angezeigt.
    - **Stile**: Die Schrift der KML-Bezeichnungen ist serifenlos und klein, während die Zahl groß und gut sichtbar ist.

    ### Fehlerbehandlung und Optimierungen
    - **Fehlermeldungen**: Ungültige Dateitypen werden abgelehnt, und der Benutzer wird informiert.
    - **Performance**: Die Anwendung ist für die Verarbeitung vieler KML-Dateien optimiert.

    ## Probleme, die beseitigt wurden
    - **Verdoppelungsschutz**: Doppelte KML-Dateien werden ignoriert, und der Benutzer wird darüber informiert.
    - **Meldungen**: Die Meldungen für ignorierte und erfolgreich hinzugefügte Dateien überlappen sich nicht mehr und sind übersichtlich gestaltet.
    - **Benutzerfreundlichkeit**: Die Anwendung wurde durch klare Meldungen und eine intuitive Benutzeroberfläche verbessert.

    ## Mögliche Erweiterungen
    - **Linienstärke anpassen**: Eine Funktion, um die Linienstärke der Hauptlinie über die Benutzeroberfläche zu ändern.
    - **Exportfunktion**: Möglichkeit, die aktuelle Kartenansicht als Bild oder PDF zu exportieren.
    - **Erweiterte Fehlerbehandlung**: Bessere Fehlermeldungen für ungültige oder beschädigte KML-Dateien.
    - **Datenbankintegration**: Speicherung der importierten KML-Dateien in einer Datenbank für persistente Nutzung.
    - **Benutzerkonten**: Einführung von Benutzerkonten, um individuelle Karten und Einstellungen zu speichern.
    - **Layer-Management**: Möglichkeit, Layer zu gruppieren und zu verwalten, um die Übersichtlichkeit zu verbessern.

    ## Technologien
    - **Leaflet.js**: Für die interaktive Karte.
    - **HTML/CSS/JavaScript**: Für die Benutzeroberfläche und Logik.
    - **toGeoJSON**: Für die Konvertierung von KML zu GeoJSON.

    ## Installation und Nutzung
    1. Klonen Sie das Repository oder laden Sie die Dateien herunter.
    2. Öffnen Sie die `index.html` in einem modernen Webbrowser.
    3. Ziehen Sie KML-Dateien per Drag & Drop auf die Karte, um sie zu importieren.

    ## Lizenz
    Dieses Projekt steht unter der MIT-Lizenz. Weitere Informationen finden Sie in der `LICENSE`-Datei.

    ## Kontakt
    Bei Fragen oder Anregungen können Sie sich gerne an den Projektbetreuer wenden.

    ## Danksagung
    Vielen Dank an alle, die zu diesem Projekt beigetragen haben, insbesondere an die Entwickler von Leaflet.js und toGeoJSON.
