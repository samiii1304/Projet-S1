// ===== ENVIRONNEMENT DE TRAVAIL =====

// Configuration
const RASPBERRY_IP = '192.168.1.XXX'; 
const API_URL = `http://${RASPBERRY_IP}:5000/api/environment`;
let isDemoMode = true; // Mode simulation par défaut

// 1. Récupère les données de l'API Raspberry Pi
async function getEnvData() {
    try {
        const response = await fetch(API_URL, { timeout: 3000 });
        const data = await response.json();
        
        // Mode réel activé
        isDemoMode = false;
        
        // Mettre à jour l'affichage avec les VRAIES données
        updateEnv({
            luminosite: data.luminosite,        // Valeur brute (ex: 408)
            light_percent: data.light_percent,  // Pourcentage (ex: 40%)
            qualite_air: data.qualite_air,      // "Bon", "Moyen", etc.
            mouvement: data.mouvement,          // true/false
            // Pour le son : simulation car pas de capteur dans phase2_environment.py
            niveau_sonore: 25 + Math.random() * 10
        });
        
    } catch (error) {
        // Si l'API ne répond pas, on reste en mode simulation
        console.log('Raspberry Pi non connecté, mode simulation activé');
        isDemoMode = true;
        
        // DONNÉES SIMULÉES
        updateEnv({
            luminosite: 400 + Math.random() * 50,
            qualite_air: "Bonne",
            niveau_sonore: 30 + Math.random() * 10
        });
    }
}

// 2. Mettre à jour l'affichage (modifié pour gérer le pourcentage)
function updateEnv(data) {
    // Luminosité - Affiche la valeur brute ET le pourcentage
    if (document.getElementById('light-value')) {
        document.getElementById('light-value').textContent = data.luminosite;
        
        // La barre utilise le pourcentage (0-100%)
        const lightPercent = data.light_percent || (data.luminosite / 10);
        document.getElementById('light-bar').style.width = lightPercent + '%';
    }
    
    // Qualité air
    if (document.getElementById('air-quality')) {
        document.getElementById('air-quality').textContent = data.qualite_air;
        
        // Mapping qualité -> largeur barre
        const airWidths = {
            "Excellent": "90%",
            "Bon": "75%",
            "Moyen": "50%",
            "Mauvais": "25%",
            "Dangereux": "10%"
        };
        document.getElementById('air-bar').style.width = 
            airWidths[data.qualite_air] || "50%";
    }

    // Niveau sonore (simulé pour l'instant)
    if (document.getElementById('sound-value')) {
        document.getElementById('sound-value').textContent = 
            Math.round(data.niveau_sonore);
        document.getElementById('sound-bar').style.width = 
            Math.round(data.niveau_sonore) + '%';
    }
    
    // Optionnel : afficher un indicateur mode réel/simulation
    console.log(isDemoMode ? "Mode: Simulation" : "Mode: Raspberry Pi");
}

// Lance au bout de 2 secondes, puis toutes les 3 secondes
setTimeout(() => {
    getEnvData();
    setInterval(getEnvData, 3000);
}, 2000);
