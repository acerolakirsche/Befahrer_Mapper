<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ordnerName = $_POST['folderName'];
    
    // Sicherheitsprüfung: Nur alphanumerische Zeichen und Bindestriche erlauben
    if (preg_match('/^[a-zA-Z0-9-_]+$/', $ordnerName)) {
        if (is_dir($ordnerName)) {
            echo "Der Ordner '$ordnerName' existiert bereits.";
        } else {
            if (mkdir($ordnerName, 0777)) {
                echo "Der Ordner '$ordnerName' wurde erfolgreich erstellt.";
            } else {
                echo "Fehler: Der Ordner '$ordnerName' konnte nicht erstellt werden.";
            }
        }
    } else {
        echo "Ungültiger Ordnername. Nur Buchstaben, Zahlen, Bindestriche und Unterstriche sind erlaubt.";
    }
}
?>
