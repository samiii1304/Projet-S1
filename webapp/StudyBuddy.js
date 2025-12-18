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
        ...document.querySelectorAll('.kpi-card, .main-chart, .mini-stat'),
        ...document.querySelectorAll('.agenda-card, .calendar-main')
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
                            progressFill.style.width = '78%';
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
    
    // Initialiser le calendrier
    initializeCalendar();
    
    // Initialiser le timer Pomodoro
    initializePomodoroTimer();
    
    // Initialiser l'environnement de travail
    initializeEnvironment();
    
    // Initialiser le player LOFI
    initializeLofiPlayer();
});

// INITIALISATION DES VALEURS DES KPI
function initializeKPIValues() {
    // Simuler des valeurs pour démonstration
    setTimeout(() => {
        // Sessions aujourd'hui
        const sessionsToday = document.getElementById('sessions-today');
        if (sessionsToday) {
            sessionsToday.textContent = '3';
        }
        
        // Temps d'étude
        const studyTime = document.getElementById('study-time');
        if (studyTime) {
            studyTime.textContent = '2h 45min';
        }
        
        // Jours consécutifs
        const consecutiveDays = document.getElementById('consecutive-days');
        if (consecutiveDays) {
            consecutiveDays.textContent = '14';
        }
        
        // Focus moyen
        const avgFocus = document.getElementById('avg-focus');
        if (avgFocus) {
            avgFocus.textContent = '78%';
        }
    }, 1000);
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
            
            // Animation des barres du graphique
            animateChartBars();
        });
    });
    
    function animateChartBars() {
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach(bar => {
            // Réinitialiser l'animation
            bar.style.height = '0%';
            
            // Obtenir la hauteur d'origine depuis l'attribut style
            const originalHeight = bar.getAttribute('style')?.match(/height:\s*(\d+)%/);
            if (originalHeight) {
                setTimeout(() => {
                    bar.style.height = originalHeight[1] + '%';
                }, 100);
            }
        });
    }
});

// INITIALISATION DU CALENDRIER
function initializeCalendar() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const currentMonthElement = document.querySelector('.current-month');
    
    if (navButtons.length > 0 && currentMonthElement) {
        // Ajouter des événements aux boutons de navigation
        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Logique de navigation du calendrier
                console.log('Navigation du calendrier cliquée');
                // Ici, vous implémenteriez la logique pour changer de mois
            });
        });
        
        // Marquer les jours avec des événements
        const daysWithEvents = [5, 10, 15, 20, 25];
        const dayElements = document.querySelectorAll('.day:not(.other-month)');
        
        dayElements.forEach((day, index) => {
            const dayNumber = parseInt(day.textContent);
            if (daysWithEvents.includes(dayNumber)) {
                day.classList.add('has-event');
            }
        });
    }
}

// GESTIONNAIRE DU TIMER POMODORO
function initializePomodoroTimer() {
    const toggleBtn = document.getElementById('toggleBtn');
    const resetBtn = document.getElementById('resetBtn');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const timerDisplay = document.getElementById('timer');
    const phaseDisplay = document.getElementById('phase');
    
    if (!toggleBtn || !resetBtn) return;
    
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
    }
    
    // Réinitialiser le timer
    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        isWorkPhase = true;
        currentCycle = 1;
        timeLeft = modes[currentMode].work;
        updateTimerDisplay();
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
}









// GESTIONNAIRE DES BOUTONS D'ACTION DE L'AGENDA
function initializeAgendaButtons() {
    const agendaActionButtons = document.querySelectorAll('.agenda-action-btn');
    
    agendaActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.agenda-card');
            const cardType = card.classList.contains('add-homework') ? 'devoir' : 
                           card.classList.contains('add-exam') ? 'examen' : 'tâche';
            
            // Simuler l'ajout d'un élément
            alert(`Ajout d'un ${cardType} - Cette fonctionnalité sera implémentée prochainement !`);
            
            // Animation de confirmation
            const originalHTML = this.innerHTML;
            const originalBgColor = this.style.backgroundColor;
            
            this.innerHTML = '<i class="fas fa-check"></i> Ajouté !';
            this.style.backgroundColor = '#6b705c';
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.backgroundColor = originalBgColor || '';
            }, 2000);
        });
    });
}






// ===== ENVIRONNEMENT DE TRAVAIL =====

function initializeEnvironment() {
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
            document.getElementById('light-value').textContent = Math.round(data.luminosite);
            
            // La barre utilise le pourcentage (0-100%)
            const lightPercent = data.light_percent || (data.luminosite / 10);
            document.getElementById('light-bar').style.width = lightPercent + '%';
        }
        
        // Qualité air
        if (document.getElementById('air-quality-value')) {
            document.getElementById('air-quality-value').textContent = Math.round(data.qualite_air || 85);
            
            // Mapping qualité -> largeur barre
            const airWidths = {
                "Excellent": "90%",
                "Bon": "75%",
                "Bonne": "75%",
                "Moyen": "50%",
                "Mauvais": "25%",
                "Dangereux": "10%"
            };
            document.getElementById('air-bar').style.width = 
                airWidths[data.qualite_air] || "75%";
                
            // Mettre à jour le statut
            if (document.getElementById('air-quality-status')) {
                document.getElementById('air-quality-status').textContent = data.qualite_air || "Bonne";
            }
        }

        // Niveau sonore (simulé pour l'instant)
        if (document.getElementById('sound-value')) {
            const soundValue = Math.round(data.niveau_sonore || 31);
            document.getElementById('sound-value').textContent = soundValue;
            document.getElementById('sound-bar').style.width = Math.min(soundValue, 100) + '%';
        }
        
        // Optionnel : afficher un indicateur mode réel/simulation
        console.log(isDemoMode ? "Mode: Simulation" : "Mode: Raspberry Pi");
    }

    // Initialiser avec des valeurs par défaut
    updateEnv({
        luminosite: 408,
        qualite_air: "Bonne",
        niveau_sonore: 31
    });
    
    // Lance au bout de 2 secondes, puis toutes les 3 secondes
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

