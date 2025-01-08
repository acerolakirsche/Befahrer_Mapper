<?php
/**
 * getProjects.php
 * ==============
 * Dieses Skript liest die Projektverzeichnisse aus und stellt sie
 * als JSON-Array für die Benutzeroberfläche bereit.
 * 
 * Funktionsweise:
 * 1. Liest alle Unterverzeichnisse aus dem 'Befahrungsprojekte'-Ordner
 * 2. Filtert System-Verzeichnisse ('.' und '..') heraus
 * 3. Gibt die Liste als JSON-Array zurück
 * 
 * Technische Details:
 * - Verwendet PHP's Verzeichnisfunktionen (scandir, is_dir)
 * - Ausgangsformat ist JSON für einfache JavaScript-Integration
 * - Setzt den korrekten Content-Type-Header
 * 
 * Sicherheitsaspekte:
 * - Prüft auf gültige Verzeichnisse
 * - Filtert System-Verzeichnisse
 * - Keine Ausführung von Benutzer-Input
 */

// Pfad zum Hauptverzeichnis der Befahrungsprojekte
$projectDir = 'Befahrungsprojekte';
$projects = [];

// Prüfen ob das Verzeichnis existiert
if (is_dir($projectDir)) {
    // Verzeichnis nach Unterordnern durchsuchen
    $items = scandir($projectDir);
    foreach ($items as $item) {
        // System-Verzeichnisse überspringen und nur Ordner berücksichtigen
        if ($item != '.' && $item != '..' && is_dir($projectDir . '/' . $item)) {
            $projects[] = $item;
        }
    }
}

// Content-Type auf JSON setzen für korrekte Browser-Interpretation
header('Content-Type: application/json');

// Projektliste als JSON-Array zurückgeben
echo json_encode($projects);
?>
