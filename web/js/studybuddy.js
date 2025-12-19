// TRANSITION DU HEADER
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
    const allBlocksToReveal = [
        ...document.querySelectorAll('.session-status-block, .lofi-music-block, .work-environment-block'),
        ...document.querySelectorAll('.kpi-card, .main-chart-full'),
        ...document.querySelectorAll('.agenda-simple-block')
    ];

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }

    function revealVisibleBlocks() {
        allBlocksToReveal.forEach(block => {
            if (isElementInViewport(block)) {
                block.classList.add('visible');
                block.classList.remove('hidden');

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

    revealVisibleBlocks();

    let scrollTicking = false;

    function onScrollReveal() {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                revealVisibleBlocks();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }

    window.addEventListener('scroll', onScrollReveal, { passive: true });
    window.addEventListener('resize', revealVisibleBlocks, { passive: true });

    initializeKPIValues();
    initializePomodoroTimer();
    initializeEnvironment();
    initializeLofiPlayer();
});

// INITIALISATION DES VALEURS DES KPI
function initializeKPIValues() {
    console.log('Statistiques initialisées à 0');
}

// INTERACTIVITÉ DES BOUTONS DE PÉRIODE
document.addEventListener('DOMContentLoaded', function() {
    const periodButtons = document.querySelectorAll('.period-btn');

    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            periodButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const period = this.textContent;
            console.log(`Changement de période: ${period}`);
            animateChartBars();
        });
    });

    function animateChartBars() {
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach(bar => {
            bar.style.height = '0%';
        });
    }
});

// ===== POMODORO TIMER =====
function initializePomodoroTimer() {
    const toggleBtn = document.getElementById('toggleBtn');
    const resetBtn = document.getElementById('resetBtn');
    const timerDisplay = document.getElementById('timer');
    const phaseDisplay = document.getElementById('phase');
    const statusDot = document.getElementById('pomodoroDot');
    const statusText = document.getElementById('pomodoroStatusText');
    const ledIndicator = document.getElementById('sessionLED'); // LED session

    if (!toggleBtn || !resetBtn || !statusDot) return;

    let timerInterval = null;
    let isRunning = false;
    let timeLeft = 25 * 60;
    let isWorkPhase = true;

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
        phaseDisplay.textContent = isWorkPhase ? 'TRAVAIL' : 'PAUSE';
    }

    function updateStatusIndicator() {
        if (isRunning) {
            statusDot.style.backgroundColor = '#10b981';
            statusText.textContent = isWorkPhase ? 'En session' : 'En pause';
            statusText.style.color = '#10b981';
            if (ledIndicator) ledIndicator.classList.add('on');
        } else {
            statusDot.style.backgroundColor = '#ef4444';
            statusText.textContent = 'Arrêté';
            statusText.style.color = '#ef4444';
            if (ledIndicator) ledIndicator.classList.remove('on');
        }
    }

    function playNotificationSound(duration = 500, freq = 800) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.type = 'sine';
            oscillator.frequency.value = freq;
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration/1000);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + duration/1000);
        } catch(e) { console.log('Audio non supporté'); }
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        updateStatusIndicator();

        if (isWorkPhase) playNotificationSound(700, 1000); // bip début session

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                playNotificationSound(1000, 500); // bip fin session
                if (isWorkPhase) {
                    isWorkPhase = false;
                    timeLeft = 5*60; // pause 5min
                } else {
                    isWorkPhase = true;
                    timeLeft = 25*60; // nouvelle session travail
                    alert('Nouvelle session Pomodoro ! Appuyez sur Démarrer.');
                }
                isRunning = false;
                updateStatusIndicator();
            }
        }, 1000);
    }

    function toggleTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            toggleBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">Démarrer</span>';
        } else {
            toggleBtn.innerHTML = '<span class="btn-icon">⏸</span><span class="btn-text">Pause</span>';
            startTimer();
        }
        updateStatusIndicator();
    }

    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        isWorkPhase = true;
        timeLeft = 25*60;
        toggleBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">Démarrer</span>';
        updateTimerDisplay();
        updateStatusIndicator();
    }

    toggleBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);

    updateTimerDisplay();
    updateStatusIndicator();
}

// ===== ENVIRONNEMENT DE TRAVAIL =====
function initializeEnvironment() {
    const RASPBERRY_IP = '192.168.1.2';
    const API_URL = `http://${RASPBERRY_IP}:5000/api/environment`;

    function updateEnv(data) {
        const lightValue = Math.round(data.luminosite || 0);
        const lightBar = document.getElementById('light-bar');
        document.getElementById('light-value').textContent = lightValue;
        const lightPercent = data.light_percent ?? Math.min(lightValue / 10, 100);
        lightBar.style.width = lightPercent + '%';
        lightBar.style.backgroundColor = lightValue < 300 ? 'red' : '#6b705c';

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
        const airBar = document.getElementById('air-bar');
        document.getElementById('air-quality-value').textContent = airPercent;
        airBar.style.width = airPercent + '%';
        airBar.style.backgroundColor = airPercent <= 25 ? 'red' : '#b7b7a4';
        const airStatus = airPercent > 85 ? "Excellent" : airPercent > 70 ? "Bonne" : airPercent > 50 ? "Moyenne" : airPercent > 25 ? "Mauvaise" : "Dangereux";
        document.getElementById('air-quality-status').textContent = airStatus;

        const soundValue = Math.round(data.niveau_sonore || 0);
        const soundBar = document.getElementById('sound-bar');
        document.getElementById('sound-value').textContent = soundValue;
        soundBar.style.width = Math.min(soundValue, 100) + '%';
        soundBar.style.backgroundColor = soundValue > 600 ? 'red' : '#cb997e';
    }

    async function getEnvData() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (!data || Object.keys(data).length === 0) {
                updateEnv({ luminosite: 0, qualite_air: 0, niveau_sonore: 0 });
                return;
            }
            updateEnv(data);
        } catch (error) {
            console.log('Raspberry Pi non connecté');
            updateEnv({ luminosite: 0, qualite_air: 0, niveau_sonore: 0 });
        }
    }

    updateEnv({ luminosite: 0, qualite_air: 0, niveau_sonore: 0 });
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

    audio.volume = 0.4;

    toggle.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            toggle.innerHTML = '<i class="fas fa-pause"></i>';
            status.textContent = 'ON';
            if (card) card.classList.add('lofi-playing');
        } else {
            audio.pause();
            toggle.innerHTML = '<i class="fas fa-play"></i>';
            status.textContent = 'OFF';
            if (card) card.classList.remove('lofi-playing');
        }
    });

    volume.addEventListener('input', () => {
        audio.volume = volume.value / 100;
    });

    const prevBtn = document.querySelector('.lofi-btn .fa-backward')?.closest('.lofi-btn');
    const nextBtn = document.querySelector('.lofi-btn .fa-forward')?.closest('.lofi-btn');

    if (prevBtn) prevBtn.addEventListener('click', () => { audio.currentTime = 0; });
    if (nextBtn) nextBtn.addEventListener('click', () => { audio.currentTime = 0; });

    audio.addEventListener('error', (e) => { status.textContent = 'ERROR'; if(card) card.classList.remove('lofi-playing'); });
    audio.addEventListener('ended', () => { toggle.innerHTML = '<i class="fas fa-play"></i>'; status.textContent = 'OFF'; if(card) card.classList.remove('lofi-playing'); });
}



