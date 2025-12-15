<?php
// get_environment.php - 
header('Content-Type: application/json');

// Chemin où le Raspberry sauvegarde ses données
$sensor_file = '/chemin/partagé/sensors.json';

if (file_exists($sensor_file)) {
    // Lit les VRAIES données du Raspberry
    $json = file_get_contents($sensor_file);
    $data = json_decode($json, true);
} else {
    // Fallback si Raspberry pas connecté
    $data = [
        'luminosite' => 0,
        'qualite_air' => 'Capteur déconnecté',
        'niveau_sonore' => 0
    ];
}

echo json_encode($data);
?>
