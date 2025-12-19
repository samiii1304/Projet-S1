//Variables
const TEST_MODE = true;
const backendurl = "http://127.0.0.1:5000";
let currentSessionId = null;
let sessionStarted = false;
let ticking = false;

// vérification de la session
checkSession();
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

document.addEventListener('DOMContentLoaded', function () {
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
document.addEventListener('DOMContentLoaded', function () {
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
                        if (progressFill && document.getElementById("avg-focus").textContent) {
                            progressFill.style.width = document.getElementById("avg-focus").textContent;
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
    fetchUserStats();
}

// INTERACTIVITÉ DES BOUTONS DE PÉRIODE
document.addEventListener('DOMContentLoaded', function () {
    const periodButtons = document.querySelectorAll('.period-btn');

    periodButtons.forEach(button => {
        button.addEventListener('click', function () {
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
            bar.style.height = '100%';
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
    // 10s ou 25min
    let pomodoroClassic = TEST_MODE ? 10 : 25 * 60;
    // 5s ou 5min
    let breakClassic = TEST_MODE ? 5 : 5 * 60;
    let cycleClassic = TEST_MODE ? 2 : 4;

    let pomodoroLong = TEST_MODE ? 15 : 50 * 60;
    let breakLong = TEST_MODE ? 5 : 10 * 60;
    let cycleLong = 2;
    let currentMode = 'classic'; // classic, long

    // Configurations des modes
    const modes = {
        classic: {
            work: pomodoroClassic,
            break: breakClassic,
            cycles: cycleClassic
        },
        long: {
            work: pomodoroLong,
            break: breakLong,
            cycles: cycleLong
        }
    };
    let timeLeft = modes[currentMode].work;

    let completedCycles = 0;
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
        let cycleStr = null;
        if (sessionStarted && isWorkPhase) {
            cycleStr = ' cycle n°' + (completedCycles + 1) + '/' + modes[currentMode].cycles;
        }
        if (sessionStarted && !isWorkPhase) {
            cycleStr = ' cycle n°' + completedCycles + '/' + modes[currentMode].cycles;
        }
        if (isRunning) {
            // Session en cours - point VERT
            statusDot.classList.add('active');
            statusDot.style.backgroundColor = '#10b981';
            statusText.textContent = isWorkPhase ? 'En session' : 'En pause';
            let tempVal = ' cycle n°' + (completedCycles+1) + '/' + modes[currentMode].cycles;
            statusText.textContent = statusText.textContent + tempVal;
            statusText.style.color = '#10b981';
        } else {
            // Session arrêtée - point ROUGE
            statusDot.classList.remove('active');
            statusDot.style.backgroundColor = '#ef4444';
            statusText.textContent = 'Arrêté';
            statusText.style.color = '#ef4444';
        }
    }

    function toggleTimer() {
        if (!sessionStarted) startSession(); // démarre la session si ce n'est pas fait
        if (isRunning) {
            clearInterval(timerInterval);
            toggleBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">Démarrer</span>';
            isRunning = false;
            updateStatusIndicator();
            return;
        }
        isRunning = true;
        toggleBtn.innerHTML = '<span class="btn-icon">⏸</span><span class="btn-text">Pause</span>';
        updateStatusIndicator();
        tick();
        timerInterval = setInterval(tick, 1000);
    }

    function tick() {
        timeLeft--;
        if (timeLeft <= 0) {
            playNotificationSound();
            if (isWorkPhase) {
                completedCycles++;
                console.log(`Pomodoro terminé ! (${completedCycles})`);
                sendPomodoro();
                isWorkPhase = false;
                timeLeft = modes[currentMode].break;
            } else {
                isWorkPhase = true;
                timeLeft = modes[currentMode].work;
            }
            updateStatusIndicator();
            if (completedCycles >= modes[currentMode].cycles) {
                alert("Session terminée");
                endSession();
                resetTimer();
                return;
            }
        }
        updateTimerDisplay();
    }

    // Réinitialiser le timer
    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        isWorkPhase = true;
        completedCycles = 0;
        sessionStarted = false;
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
        button.addEventListener('click', function () {
            changeMode(this.dataset.mode);
        });
    });

    // Initialiser l'affichage
    updateTimerDisplay();
    updateStatusIndicator();
}

// ===== ENVIRONNEMENT DE TRAVAIL =====
function initializeEnvironment() {
    const RASPBERRY_IP = '192.168.1.2';
    const API_URL = `http://${RASPBERRY_IP}:5000/api/environment`;

    function airPercentFromSensor(rawValue) {
        if (typeof rawValue === 'number' && !isNaN(rawValue)) {
            const min = 200, max = 700;
            let percent = ((rawValue - min) / (max - min)) * 100;
            percent = Math.min(Math.max(percent, 0), 100);
            return Math.round(percent);
        }
        return 0;
    }

    function updateEnv(data) {
        const lightValue = Math.round(data.luminosite || 0);
        document.getElementById('light-value').textContent = lightValue;
        const lightPercent = data.light_percent ?? Math.min(lightValue / 10, 100);
        document.getElementById('light-bar').style.width = lightPercent + '%';

        let airPercent = data.qualite_air;
        if (typeof airPercent === "string") {
            switch (airPercent.toLowerCase()) {
                case "excellent": airPercent = 90; break;
                case "bonne": airPercent = 75; break;
                case "moyenne": airPercent = 55; break;
                case "mauvaise": airPercent = 30; break;
                case "dangereux": airPercent = 10; break;
                default: airPercent = 0;
            }
        }
        document.getElementById('air-quality-value').textContent = airPercent;
        document.getElementById('air-bar').style.width = airPercent + '%';
        let airStatus = airPercent > 85 ? "Excellent" : airPercent > 70 ? "Bonne" : airPercent > 50 ? "Moyenne" : airPercent > 25 ? "Mauvaise" : "Dangereux";
        document.getElementById('air-quality-status').textContent = airStatus;

        const soundValue = Math.round(data.niveau_sonore || 0);
        document.getElementById('sound-value').textContent = soundValue;
        document.getElementById('sound-bar').style.width = Math.min(soundValue, 100) + '%';

        console.log("Nouvelle valeur environnement :", data);
    }

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
                qualite_air: data.qualite_air,
                niveau_sonore: data.niveau_sonore || 0
            });
        } catch (error) {
            console.log('Raspberry Pi non connecté, initialisation à 0');
            updateEnv({ luminosite: 0, qualite_air: 0, niveau_sonore: 0 });
        }
    }

    updateEnv({ luminosite: 0, qualite_air: 0, niveau_sonore: 0 });
    if (!TEST_MODE)
        setTimeout(() => { getEnvData(); setInterval(getEnvData, 3000); }, 2000);
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

function sendPomodoro() {
    if (!currentSessionId) return;

    fetch(backendurl + "/pomodoros", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            session_id: currentSessionId
        })
    }).catch(err => console.error("Erreur pomodoro", err));
}

function startSession() {
    fetch(backendurl + "/sessions/start", {
        method: "POST",
        credentials: "include"
    })
        .then(res => res.json())
        .then(data => {
            currentSessionId = data.session_id;
            sessionStarted = true;
            console.log("Session démarrée:", currentSessionId);
        })
        .catch(err => console.error("Erreur start session", err));
}

function endSession() {
    if (!currentSessionId) return;
    fetchUserStats();//Update stats
    fetch(backendurl + "/sessions/end", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            session_id: currentSessionId
        })
    }).finally(() => {
        currentSessionId = null;
        sessionStarted = false;
    });
}

// Déconnexion
document.getElementById("logoutBtn").addEventListener("click", () => {
    fetch(backendurl + "/logout", {
        method: "GET",
        credentials: "include"
    })
        .then(() => {
            window.location.href = "login.html";
        });
});

function checkSession() {
    fetch(backendurl + "/me", {
        method: "GET",
        credentials: "include"
    })
        .then(res => {
            if (!res.ok) throw new Error("Session expirée ou non autorisée");
            return res.json();  // retourne la promesse JSON
        })
        .then(data => {
            if (!data.user) {
                // rediriger si pas connecté
                window.location.href = "login.html";
                return;
            }
            // afficher le username
            document.getElementById("username").textContent = "Bienvenue " + data.user;
        })
        .catch(err => {
            console.error(err);
            window.location.href = "login.html";
        });
}

function fetchUserStats() {
    fetch(backendurl + "/stats", {
        method: "GET",
        credentials: "include"  // nécessaire pour envoyer le cookie de session
    })
        .then(res => {
            if (!res.ok) throw new Error("Non autorisé");
            return res.json();
        })
        .then(data => {
            console.log("Stats utilisateur :", data);
            // Exemple : affichage dans le DOM
            document.getElementById("sessions-today").textContent = data.sessions_today;
            document.getElementById("sessions-yesterday").textContent = "vs " + data.sessions_yesterday + " hier";
            document.getElementById("study-time").textContent = data.total_week;
            document.getElementById("study-time").textContent = data.total_week_hours + "h" + data.total_week_minutes;
            document.getElementById("consecutive-days").textContent = data.consecutive_days;
            document.getElementById("record-streak").textContent = "Record : " + data.record_streak + " jours";
            document.getElementById("avg-focus").textContent = `${data.avg_focus.toFixed(1)}%`;
        })
        .catch(err => {
            console.error("Erreur fetch stats :", err);
        });
    fetch(backendurl + "/weekly_activity", { credentials: "include" })
        .then(res => res.json())
        .then(data => updateWeeklyChart(data))
        .catch(err => console.error(err));
}

function updateWeeklyChart(weeklyData) {
    // weeklyData = [{day: 'Mon', pomodoros: 4, sessions: 1}, ...]
    const chartBars = document.querySelectorAll('.chart-mock .chart-bar');
    // Normaliser les valeurs pour le pourcentage de hauteur
    const maxPomodoros = Math.max(...weeklyData.map(d => d.pomodoros));
    //const maxSessions = Math.max(...weeklyData.map(d => d.sessions));
    chartBars.forEach((bar, i) => {
        if (!weeklyData[i]) return;
        const pomodoroPercent = maxPomodoros ? (weeklyData[i].pomodoros / maxPomodoros) * 100 : 0;
        //const sessionPercent = maxSessions ? (weeklyData[i].sessions / maxSessions) * 100 : 0;

        bar.style.height = `${pomodoroPercent}%`;
        bar.style.backgroundColor = '#6b705c'; // temps d'étude
    });
}



// Données fictives pour tester l'affichage
const testweeklyData = [
    { day: "Lun", pomodoros: 3, sessions: 1 },
    { day: "Mar", pomodoros: 4, sessions: 2 },
    { day: "Mer", pomodoros: 2, sessions: 1 },
    { day: "Jeu", pomodoros: 5, sessions: 2 },
    { day: "Ven", pomodoros: 6, sessions: 3 },
    { day: "Sam", pomodoros: 1, sessions: 1 },
    { day: "Dim", pomodoros: 0, sessions: 0 }
];

function testupdateWeeklyChart(data) {
    const bars = document.querySelectorAll('.chart-bar');
    const maxPomodoros = Math.max(...data.map(d => d.pomodoros));

    bars.forEach((bar, i) => {
        if (!data[i]) return;
        const height = maxPomodoros ? (data[i].pomodoros / maxPomodoros) * 100 : 0;
        bar.style.height = height + '%';
    });
}
testupdateWeeklyChart(testweeklyData);
