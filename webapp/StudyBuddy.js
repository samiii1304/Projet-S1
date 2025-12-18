// TRANSITION DU HEADER
// ===== CONFIG RASPBERRY =====
const RASPBERRY_IP = "192.168.1.2";
const API_URL = `http://${RASPBERRY_IP}:5000/api/environment`;


let ticking = false;

function updateHeader() {
    const header = document.querySelector('header');
    const banner = document.querySelector('.banner');
    const bannerBottom = banner.offsetTop + banner.offsetHeight;
    
    if (window.scrollY > bannerBottom - 80) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    ticking = false;
}

function onScroll() {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll, { passive: true });

// SLIDE HEADER AUTOMATIQUE

document.addEventListener('DOMContentLoaded', function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    
    if (totalSlides > 0) {
        function showNextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % totalSlides;
            slides[currentSlide].classList.add('active');
        }
        
        setInterval(showNextSlide, 4000);
    }
});


// ANIMATION SCROLL POUR LES BLOCS
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner tous les blocs à animer
    const allBlocksToReveal = [
        ...document.querySelectorAll('.session-status-block, .lofi-music-block, .work-environment-block'),
        ...document.querySelectorAll('.kpi-card, .main-chart-full'),
        ...document.querySelectorAll('.agenda-simple-block')
    ];
    
    // Fonction pour vérifier si un élément est dans le viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    // Fonction pour révéler les blocs visibles
    function revealVisibleBlocks() {
        allBlocksToReveal.forEach(block => {
            if (isElementInViewport(block)) {
                block.classList.add('visible');
                block.classList.remove('hidden');
                
                // Animation spécifique pour la barre de progression
                if (block.classList.contains('avg-focus')) {
                    setTimeout(() => {
                        const progressFill = document.getElementById('focus-progress');
                        if (progressFill) {
                            progressFill.style.width = '0%';
                        }
                    }, 300);
                }
            }
        });
    }
    
    // Révéler les blocs visibles au chargement
    revealVisibleBlocks();
    
    let scrollTicking = false;
    
    // Fonction de gestion du scroll
    function onScrollReveal() {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                revealVisibleBlocks();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }
    
    // Écouteurs d'événements
    window.addEventListener('scroll', onScrollReveal, { passive: true });
    window.addEventListener('resize', revealVisibleBlocks, { passive: true });
    
    // Initialiser les données des KPI
    initializeKPIValues();
    
    // Initialiser le timer Pomodoro
    initializePomodoroTimer();
    
    // Initialiser l'environnement de travail
    initializeEnvironment();
    
    // Initialiser le player LOFI
    initializeLofiPlayer();
});

// INITIALISATION DES VALEURS DES KPI
function initializeKPIValues() {
    // Déjà à 0 dans le HTML, donc pas besoin de mise à jour
    // Les valeurs sont déjà : 0 sessions, 00h 00min, 0 jours, 0%
    console.log('Statistiques initialisées à 0');
}

// INTERACTIVITÉ DES BOUTONS DE PÉRIODE
document.addEventListener('DOMContentLoaded', function() {
    const periodButtons = document.querySelectorAll('.period-btn');
    
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            periodButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Ici, vous pourriez charger de nouvelles données pour la période sélectionnée
            const period = this.textContent;
            console.log(`Changement de période: ${period}`);
            
            // Animation des barres du graphique (reste à 0%)
            animateChartBars();
        });
    });
    
    function animateChartBars() {
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach(bar => {
            // Les barres restent à 0%
            bar.style.height = '0%';
        });
    }
});

// GESTIONNAIRE DU TIMER POMODORO
function initializePomodoroTimer() {
    const toggleBtn = document.getElementById('toggleBtn');
    const resetBtn = document.getElementById('resetBtn');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const timerDisplay = document.getElementById('timer');
    const phaseDisplay = document.getElementById('phase');
    const statusDot = document.getElementById('pomodoroDot');
    const statusText = document.getElementById('pomodoroStatusText');
    
    if (!toggleBtn || !resetBtn || !statusDot) return;
    
    let timerInterval = null;
    let isRunning = false;
    let timeLeft = 25 * 60; // 25 minutes en secondes
    let currentMode = 'classic'; // classic, long
    
    // Configurations des modes
    const modes = {
        classic: {
            work: 25 * 60,
            break: 5 * 60,
            cycles: 4
        },
        long: {
            work: 50 * 60,
            break: 10 * 60,
            cycles: 2
        }
    };
    
    let currentCycle = 1;
    let isWorkPhase = true;
    
    // Mettre à jour l'affichage du timer
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Mettre à jour la phase
        phaseDisplay.textContent = isWorkPhase ? 'TRAVAIL' : 'PAUSE';
    }
    
    // Mettre à jour l'indicateur d'état
    function updateStatusIndicator() {
        if (isRunning) {
            // Session en cours - point VERT
            statusDot.classList.add('active');
            statusDot.style.backgroundColor = '#10b981';
            statusText.textContent = isWorkPhase ? 'En session' : 'En pause';
            statusText.style.color = '#10b981';
        } else {
            // Session arrêtée - point ROUGE
            statusDot.classList.remove('active');
            statusDot.style.backgroundColor = '#ef4444';
            statusText.textContent = 'Arrêté';
            statusText.style.color = '#ef4444';
        }
    }
    
    // Démarrer/arrêter le timer
    function toggleTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            toggleBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">Démarrer</span>';
        } else {
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    
                    // Jouer un son de notification
                    playNotificationSound();
                    
                    // Changer de phase
                    if (isWorkPhase) {
                        // Fin de la phase travail
                        if (currentCycle < modes[currentMode].cycles) {
                            // Passer à la pause
                            isWorkPhase = false;
                            timeLeft = modes[currentMode].break;
                            currentCycle++;
                        } else {
                            // Fin de tous les cycles
                            isWorkPhase = true;
                            currentCycle = 1;
                            timeLeft = modes[currentMode].work;
                            alert('Session Pomodoro terminée ! Bon travail !');
                        }
                    } else {
                        // Fin de la pause, retour au travail
                        isWorkPhase = true;
                        timeLeft = modes[currentMode].work;
                    }
                    
                    updateTimerDisplay();
                    updateStatusIndicator();
                    
                    // Redémarrer automatiquement
                    if (isRunning) {
                        timerInterval = setInterval(() => {
                            timeLeft--;
                            updateTimerDisplay();
                            
                            if (timeLeft <= 0) {
                                clearInterval(timerInterval);
                                toggleTimer();
                            }
                        }, 1000);
                    }
                }
            }, 1000);
            
            toggleBtn.innerHTML = '<span class="btn-icon">⏸</span><span class="btn-text">Pause</span>';
        }
        
        isRunning = !isRunning;
        updateStatusIndicator();
    }
    
    // Réinitialiser le timer
    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        isWorkPhase = true;
        currentCycle = 1;
        timeLeft = modes[currentMode].work;
        updateTimerDisplay();
        updateStatusIndicator();
        toggleBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">Démarrer</span>';
    }
    
    // Changer de mode
    function changeMode(mode) {
        currentMode = mode;
        resetTimer();
        
        // Mettre à jour les boutons de mode
        modeButtons.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Jouer un son de notification
    function playNotificationSound() {
        // Créer un contexte audio simple
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio non supporté ou bloqué par le navigateur');
        }
    }
    
    // Écouteurs d'événements
    toggleBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            changeMode(this.dataset.mode);
        });
    });
    
    // Initialiser l'affichage
    updateTimerDisplay();
    updateStatusIndicator();
}

// ===== ENVIRONNEMENT DE TRAVAIL =====
function initializeEnvironment() {
    const RASPBERRY_IP = '192.168.1.2'; // Remplace par l'IP exacte de ton Raspberry
    const API_URL = `http://${RASPBERRY_IP}:5000/api/environment`;

    // Convertir la valeur brute du capteur gaz en pourcentage
    function airPercentFromSensor(rawValue) {
        if (typeof rawValue === 'number' && !isNaN(rawValue)) {
            const min = 200;
            const max = 700;
            let percent = ((rawValue - min) / (max - min)) * 100;
            percent = Math.min(Math.max(percent, 0), 100);
            return Math.round(percent);
        }
        return 0;
    }

    // Mettre à jour l'affichage
    function updateEnv(data) {
        // Luminosité
        const lightValue = Math.round(data.luminosite || 0);
        document.getElementById('light-value').textContent = lightValue;
        const lightPercent = data.light_percent ?? Math.min(lightValue / 10, 100);
        document.getElementById('light-bar').style.width = lightPercent + '%';

        // Qualité de l'air
        let airPercent = 0;
        if (typeof data.qualite_air === 'number') {
            airPercent = airPercentFromSensor(data.qualite_air);
        } else if (!isNaN(parseInt(data.qualite_air))) {
            airPercent = parseInt(data.qualite_air);
        }
        document.getElementById('air-quality-value').textContent = airPercent;
        document.getElementById('air-bar').style.width = airPercent + '%';
        let airStatus = airPercent > 85 ? "Excellent" :
                        airPercent > 70 ? "Bonne" :
                        airPercent > 50 ? "Moyenne" :
                        airPercent > 25 ? "Mauvaise" : "Dangereux";
        document.getElementById('air-quality-status').textContent = airStatus;

        // Niveau sonore
        const soundValue = Math.round(data.niveau_sonore || 0);
        document.getElementById('sound-value').textContent = soundValue;
        document.getElementById('sound-bar').style.width = Math.min(soundValue, 100) + '%';

        // LOG pour chaque changement
        console.log("Nouvelle valeur environnement :", data);
    }

    // Récupérer les données depuis le Raspberry
    async function getEnvData() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (!data || Object.keys(data).length === 0) {
                updateEnv({ luminosite: 0, qualite_air: 0, niveau_sonore: 0 });
                return;
            }

            updateEnv({
                luminosite: data.luminosite || 0,
                light_percent: data.light_percent || 0,
                qualite_air: data.qualite_air || 0,
                niveau_sonore: data.niveau_sonore || 0
            });
        } catch (error) {
            console.log('Raspberry Pi non connecté, initialisation à 0');
            updateEnv({ luminosite: 0, qualite_air: 0, niveau_sonore: 0 });
        }
    }

    // Initialisation à 0 au départ
    updateEnv({ luminosite: 0, qualite_air: 0, niveau_sonore: 0 });

    // Lancer la récupération toutes les 3 secondes
    setTimeout(() => {
        getEnvData();
        setInterval(getEnvData, 3000);
    }, 2000);
}


// ===== LOFI MUSIC PLAYER =====

function initializeLofiPlayer() {
    const audio = document.getElementById('lofiAudio');
    const toggle = document.getElementById('lofiToggle');
    const volume = document.getElementById('lofiVolume');
    const status = document.getElementById('lofi-status');
    const card = document.querySelector('.lofi-card');
    
    if (!audio || !toggle) return;
    
    // Initialisation du volume
    audio.volume = 0.4;
    
    // Gestion du bouton play/pause
    toggle.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            toggle.innerHTML = '<i class="fas fa-pause"></i>';
            status.textContent = 'ON';
            if (card) {
                card.classList.add('lofi-playing');
            }
        } else {
            audio.pause();
            toggle.innerHTML = '<i class="fas fa-play"></i>';
            status.textContent = 'OFF';
            if (card) {
                card.classList.remove('lofi-playing');
            }
        }
    });
    
    // Gestion du volume
    volume.addEventListener('input', () => {
        audio.volume = volume.value / 100;
    });
    
    // Gestion des boutons avant/arrière (pour une future implémentation)
    const prevBtn = document.querySelector('.lofi-btn .fa-backward')?.closest('.lofi-btn');
    const nextBtn = document.querySelector('.lofi-btn .fa-forward')?.closest('.lofi-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            // Pour l'instant, juste réinitialiser la musique
            audio.currentTime = 0;
            console.log('Previous track - fonctionnalité à venir');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            // Pour l'instant, juste réinitialiser la musique
            audio.currentTime = 0;
            console.log('Next track - fonctionnalité à venir');
        });
    }
    
    // Gestion des erreurs audio
    audio.addEventListener('error', (e) => {
        console.error('Erreur de chargement audio:', e);
        status.textContent = 'ERROR';
        if (card) {
            card.classList.remove('lofi-playing');
        }
    });
    
    // Mise à jour de l'interface quand la musique se termine
    audio.addEventListener('ended', () => {
        // Comme la musique est en loop, cela ne devrait pas arriver
        toggle.innerHTML = '<i class="fas fa-play"></i>';
        status.textContent = 'OFF';
        if (card) {
            card.classList.remove('lofi-playing');
        }
    });
}
