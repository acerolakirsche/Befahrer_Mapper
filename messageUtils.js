/**
 * messageUtils.js
 * ==============
 * Dieses Modul stellt Funktionen für die Anzeige von temporären Benachrichtigungen bereit.
 * 
 * Hauptfunktionen:
 * - Erstellen und Stylen von temporären Benachrichtigungselementen
 * - Intelligente Positionierung auf dem Bildschirm
 * - Automatisches Ausblenden nach definierter Zeit
 * 
 * Verwendungszweck:
 * Diese Datei wird hauptsächlich für Benutzer-Feedback verwendet, z.B.:
 * - Bestätigung erfolgreicher Aktionen
 * - Warnungen bei Duplikaten
 * - Fehlermeldungen bei ungültigen Dateien
 * 
 * Besonderheiten:
 * - Unterstützt HTML in Nachrichten
 * - Automatische horizontale Zentrierung
 * - Stapelbare Nachrichten durch Offset
 * - Anpassbare Farben und Anzeigedauer
 */

/**
 * Zeigt eine temporäre Nachricht auf dem Bildschirm an
 * 
 * @param {string} nachricht - Der Nachrichteninhalt (kann HTML enthalten)
 * @param {string} hintergrundFarbe - Hintergrundfarbe der Nachricht (Standard: Orange)
 * @param {number} anzeigedauer - Wie lange die Nachricht sichtbar sein soll in Millisekunden (Standard: 5000)
 * @param {number} versatz - Vertikaler Abstand von unten in Pixeln (Standard: 0)
 * @returns {HTMLElement} - Das erstellte Nachrichtenelement
 * 
 * Beispielaufrufe:
 * showTempMessage("KML erfolgreich hinzugefügt", "#4CAF50", 3000);
 * showTempMessage("Warnung: Duplikat gefunden", "#ffa500");
 * showTempMessage("Fehler beim Laden", "#ff0000", 7000);
 */
function showTempMessage(nachricht, hintergrundFarbe = '#ffa500', anzeigedauer = 5000, versatz = 0) {
    // Nachrichtencontainer erstellen
    const nachrichtElement = document.createElement('div');
    
    // Styling anwenden
    // Wir nutzen fixed positioning für konsistente Platzierung
    nachrichtElement.style.position = 'fixed';
    nachrichtElement.style.bottom = `${20 + versatz}px`; // Abstand von unten plus Versatz
    nachrichtElement.style.left = '50%';
    nachrichtElement.style.transform = 'translateX(-50%)'; // Horizontale Zentrierung
    
    // Visuelle Gestaltung
    nachrichtElement.style.backgroundColor = hintergrundFarbe;
    nachrichtElement.style.color = 'white'; // Weißer Text für guten Kontrast
    nachrichtElement.style.padding = '10px 20px';
    nachrichtElement.style.borderRadius = '5px'; // Abgerundete Ecken
    nachrichtElement.style.zIndex = '10000'; // Über allen anderen Elementen
    
    // Textformatierung
    nachrichtElement.style.textAlign = 'left'; // Linksbündiger Text
    nachrichtElement.style.whiteSpace = 'pre-line'; // Zeilenumbrüche erhalten
    nachrichtElement.style.fontFamily = 'Arial, sans-serif'; // Gut lesbare Schriftart
    nachrichtElement.style.fontSize = '14px';
    nachrichtElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'; // Subtiler Schatten
    
    // Nachrichteninhalt setzen (erlaubt HTML)
    nachrichtElement.innerHTML = nachricht;

    // Nachricht zum Dokument hinzufügen
    document.body.appendChild(nachrichtElement);

    // Timer für automatisches Entfernen setzen
    setTimeout(() => {
        // Ausblend-Animation hinzufügen
        nachrichtElement.style.transition = 'opacity 0.5s ease-out';
        nachrichtElement.style.opacity = '0';
        
        // Nach der Animation entfernen
        setTimeout(() => {
            document.body.removeChild(nachrichtElement);
        }, 500);
    }, anzeigedauer);

    // Element für weitere Verarbeitung zurückgeben
    return nachrichtElement;
}

// Vordefinierte Nachrichtentypen für konsistente Kommunikation
const NACHRICHTEN = {
    ERFOLG: {
        KML_HINZUGEFUEGT: (dateiname) => `KML "${dateiname}" wurde erfolgreich hinzugefügt`,
        PROJEKT_GELADEN: (projektname) => `Projekt "${projektname}" wurde erfolgreich geladen`,
        AENDERUNGEN_GESPEICHERT: 'Änderungen wurden erfolgreich gespeichert'
    },
    WARNUNG: {
        DUPLIKAT: (dateiname) => `Die Datei "${dateiname}" existiert bereits`,
        UNGUELTIGE_DATEI: 'Bitte nur KML-Dateien hochladen',
        KEINE_AUSWAHL: 'Bitte wählen Sie zuerst eine KML aus'
    },
    FEHLER: {
        LADEN_FEHLGESCHLAGEN: 'Fehler beim Laden der Datei',
        NETZWERK_FEHLER: 'Netzwerkfehler - Bitte überprüfen Sie Ihre Verbindung',
        UNBEKANNTER_FEHLER: 'Ein unerwarteter Fehler ist aufgetreten'
    }
};
