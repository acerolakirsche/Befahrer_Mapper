/**
 * eventHandler.js
 * ================
 * Zentrale Verwaltung aller Event-Listener der Anwendung
 * 
 * Diese Datei enthält alle Event-Listener.
 * 
 * Hier eine Liste von eventListeners aus der Codebase, die ich hier hinein delegieren möchte:
 * 
 * Hier ist die erweiterte Übersicht mit Funktionsbeschreibungen:


contextMenu.js
colorBox.addEventListener('click', ...) → Verarbeitet Klicks auf Farbauswahlboxen
document.addEventListener('click', closeMenu) → Schließt das Kontextmenü bei Klicks außerhalb
menuItem.addEventListener('click', ...) → Führt Aktionen bei Klicks auf Menüpunkte aus

main.js
dropArea.addEventListener('dragover', ...) → Verarbeitet Drag-over Events für Datei-Uploads
dropArea.addEventListener('dragleave', ...) → Setzt die Drop-Area-Stile zurück bei Drag-leave
dropArea.addEventListener('drop', ...) → Verarbeitet das Ablegen von Dateien
userSelector.addEventListener('change', ...) → Reagiert auf Benutzerauswahländerungen
projectSelector.addEventListener('change', ...) → Lädt Projektdaten bei Projektauswahl
createProjectBtn.addEventListener('click', ...) → Erstellt neue Projekte

uiUtils.js
eyeIcon.addEventListener('click', ...) → Zeigt/Versteckt Layer (mit Event-Propagation-Stop)
deleteIcon.onclick = ... → Löscht Elemente (mit Event-Propagation-Stop)
kmlItem.addEventListener('mouseenter', ...) → Hervorhebung bei Mouse-over
kmlItem.addEventListener('mouseleave', ...) → Entfernt Hervorhebung bei Mouse-out
kmlItem.addEventListener('dblclick', ...) → Debugging-Funktion bei Doppelklick
kmlItem.addEventListener('click', ...) → Verarbeitet Klicks auf KML-Elemente
kmlItem.addEventListener('contextmenu', ...) → Öffnet Kontextmenü bei Rechtsklick
document.addEventListener('DOMContentLoaded', ...) → Initialisiert Farbauswahl nach DOM-Load
colorBox.addEventListener('click', ...) → Verarbeitet Klicks auf Farbboxen
colorPicker.addEventListener('change', ...) → Aktualisiert Farben bei Änderung
menuItem.addEventListener('click', ...) → Führt Menüpunkt-Aktionen aus
document.addEventListener('click', closeMenu) → Schließt Menüs bei Klicks außerhalb

kmlProcessor.js
reader.onload = ... → Verarbeitet geladene KML-Dateien
 * 
 */

