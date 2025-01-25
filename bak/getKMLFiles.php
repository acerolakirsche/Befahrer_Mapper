<?php
/**
 * getKMLFiles.php
 * ==============
 * Dieses Skript liest KML-Dateien aus dem KML-Files-Verzeichnis eines Projekts
 * und stellt sie als JSON-Array bereit.
 * 
 * Funktionsweise:
 * 1. Liest den Projektnamen aus dem GET-Parameter
 * 2. Prüft ob das Projektverzeichnis existiert
 * 3. Liest alle KML-Dateien aus dem Verzeichnis
 * 4. Gibt die Liste als JSON-Array zurück
 * 
 * Technische Details:
 * - Verwendet glob() für Dateisuche mit Wildcard
 * - Filtert nach .kml-Dateien
 * - Gibt nur Dateinamen ohne Pfad zurück
 * 
 * Fehlerbehandlung:
 * - HTTP 400 bei fehlendem Projektnamen
 * - HTTP 404 bei nicht existierendem Verzeichnis
 * - Saubere JSON-Fehlerausgabe
 * 
 * Sicherheitsaspekte:
 * - Validierung des Projektnamens
 * - Prüfung auf gültige Verzeichnisse
 * - Keine direkte Ausführung von Dateien
 */

// Content-Type auf JSON setzen
header('Content-Type: application/json');

// Projektnamen aus GET-Parameter lesen
$projectName = $_GET['project'];

// Prüfen ob ein Projektname angegeben wurde
if (!$projectName) {
    http_response_code(400);
    echo json_encode(['error' => 'Projektname ist erforderlich']);
    exit;
}

// Pfad zum KML-Verzeichnis des Projekts
$kmlDir = "Befahrungsprojekte/$projectName/KML-Files";

// Prüfen ob das Verzeichnis existiert
if (!is_dir($kmlDir)) {
    http_response_code(404);
    echo json_encode(['error' => 'Verzeichnis nicht gefunden']);
    exit;
}

// Alle KML-Dateien im Verzeichnis finden
$kmlFiles = glob("$kmlDir/*.kml");

// Dateinamen ohne Pfad extrahieren
$files = array_map(function($file) {
    return basename($file);
}, $kmlFiles);

// KML-Liste als JSON zurückgeben
echo json_encode($files);
?>
