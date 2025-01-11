<?php
/**
 * getProjects.php
 * ==============
 * Dieses Skript liest die Projektverzeichnisse aus und stellt sie
 * als JSON-Array für die Benutzeroberfläche bereit.
 * 
 * Neue Funktionen:
 * - Erstellen von neuen Projektordnern mit Unterordner "KML-Files"
 * 
 * Funktionsweise:
 * 1. Liest alle Unterverzeichnisse aus dem 'Befahrungsprojekte'-Ordner
 * 2. Filtert System-Verzeichnisse ('.' und '..') heraus
 * 3. Gibt die Liste als JSON-Array zurück
 * 4. Erstellt neue Projektordner mit Unterordner "KML-Files"
 * 
 * Technische Details:
 * - Verwendet PHP's Verzeichnisfunktionen (scandir, is_dir, mkdir)
 * - Ausgangsformat ist JSON für einfache JavaScript-Integration
 * - Setzt den korrekten Content-Type-Header
 * 
 * Sicherheitsaspekte:
 * - Prüft auf gültige Verzeichnisse
 * - Filtert System-Verzeichnisse
 * - Keine Ausführung von Benutzer-Input
 */

// Pfad zum Hauptverzeichnis der Befahrungsprojekte
$baseDir = dirname(__FILE__);
$projectDir = $baseDir . '/Befahrungsprojekte';
$projects = [];

// Funktion zum Überprüfen und Erstellen des Basisordners
function ensureBaseDirectoryExists() {
    global $projectDir;
    
    if (!is_dir($projectDir)) {
        if (!mkdir($projectDir, 0775, true)) {
            return ['status' => 'error', 'message' => 'Konnte Basisordner nicht erstellen: ' . $projectDir];
        }
    }
    return ['status' => 'success'];
}

// Funktion zum Erstellen eines neuen Projekts
function createProject($projectName) {
    global $projectDir;
    
    // Basisordner sicherstellen
    $baseDirCheck = ensureBaseDirectoryExists();
    if ($baseDirCheck['status'] === 'error') {
        return $baseDirCheck;
    }
    
    // Sicherstellen, dass der Projektname gültig ist
    if (empty($projectName)) {
        return ['status' => 'error', 'message' => 'Projektname darf nicht leer sein'];
    }
    
    // Pfad zum neuen Projektordner
    $newProjectPath = $projectDir . '/' . $projectName;
    
    // Prüfen, ob der Ordner bereits existiert
    if (is_dir($newProjectPath)) {
        return ['status' => 'error', 'message' => 'Projekt existiert bereits'];
    }
    
    // Projektordner erstellen
    if (!mkdir($newProjectPath, 0775, true)) {
        return ['status' => 'error', 'message' => 'Konnte Projektordner nicht erstellen: ' . $newProjectPath];
    }
    
    // KML-Files Unterordner erstellen
    $kmlFolderPath = $newProjectPath . '/KML-Files';
    if (!mkdir($kmlFolderPath, 0775)) {
        return ['status' => 'error', 'message' => 'Konnte KML-Ordner nicht erstellen: ' . $kmlFolderPath];
    }
    
    return ['status' => 'success', 'message' => 'Projekt erfolgreich erstellt'];
}

// Prüfen ob ein neues Projekt erstellt werden soll
if (isset($_POST['action']) && $_POST['action'] === 'create' && isset($_POST['projectName'])) {
    $projectName = $_POST['projectName'];
    $result = createProject($projectName);
    echo json_encode($result);
    exit;
}

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
