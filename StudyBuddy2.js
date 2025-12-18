// ===== TRANSITION DU HEADER =====
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

// ===== SLIDE HEADER AUTOMATIQUE =====
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

// ===== ANIMATION SCROLL POUR LES BLOCS =====
document.addEventListener('DOMContentLoaded', function() {
    const allBlocksToReveal = [
        ...document.querySelectorAll('.session-status-block, .lofi-music-block, .work-environment-block'),
        ...document.querySelectorAll('.kpi-card, .main-chart, .mini-stat'),
        ...document.querySelectorAll('.agenda-card, .calendar-main')
    ];

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 && rect.bottom >= 0;
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
                            progressFill.style.width = '78%';
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
    initializeCalendar();
    initializePomodoroTimer();
    initializeEnvironment();
    initializeLofiPlayer();
});

// ===== INITIALISATION DES KPI =====
function initializeKPIValues() {
    setTimeout(() => {
        const sessionsToday = document.getElementById('sessions-today');
        if (sessionsToday) sessionsToday.textContent = '3';

        const studyTime = document.getElementById('study-time');
        if (studyTime) studyTime.textContent = '2h 45min';

        const consecutiveDays = document.getElementById('consecutive-days');
        if (consecutiveDays) consecutiveDays.textContent = '14';

        const avgFocus = document.getElementById('avg-focus');
        if (avgFocus) avgFocus.textContent = '78%';
    }, 1000);
}

// ===== BOUTONS DE PÉRIODE =====
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
            const originalHeight = bar.getAttribute('style')?.match(/height:\s*(\d+)%/);
            bar.style.height = '0%';
            if (originalHeight) {
                setTimeout(() => { bar.style.height = originalHeight[1] + '%'; }, 100);
            }
        });
    }
});

// ===== INITIALISATION DU CALENDRIER =====
function initializeCalendar() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const currentMonthElement = document.querySelector('.current-month');

    if (navButtons.length > 0 && currentMonthElement) {
        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                console.log('Navigation du calendrier cliquée');
            });
        });

        const daysWithEvents = [5, 10, 15, 20, 25];
        const dayElements = document.querySelectorAll('.day:not(.other-month)');
        dayElements.forEach(day => {
            const dayNumber = parseInt(day.textContent);
            if (daysWithEvents.includes(dayNumber)) day.classList.add('has-event');
        });
    }
}

// ===== TIMER POMODORO =====
function initializePomodoroTimer() {
    const toggleBtn = document.getElementById('toggleBtn');
    const resetBtn = document.getElementById('resetBtn');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const timerDisplay = document.getElementById('timer');
    const phaseDisplay = document.getElementById('phase');

    if (!toggleBtn || !resetBtn) return;

    let timerInterval = null;
    let isRunning = false;
    let timeLeft = 25 * 60;
    let currentMode = 'classic';
    const modes = { classic: { work: 25*60, break: 5*60, cycles: 4 }, long: { work: 50*60, break: 10*60, cycles: 2 } };
    let currentCycle = 1;
    let isWorkPhase = true;

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
        phaseDisplay.textContent = isWorkPhase ? 'TRAVAIL' : 'PAUSE';
    }

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
                    playNotificationSound();
                    if (isWorkPhase) {
                        if (currentCycle < modes[currentMode].cycles) {
                            isWorkPhase = false;
                            timeLeft = modes[currentMode].break;
                            currentCycle++;
                        } else {
                            isWorkPhase = true;
                            currentCycle = 1;
                            timeLeft = modes[currentMode].work;
                            alert('Session Pomodoro terminée ! Bon travail !');
                        }
                    } else {
                        isWorkPhase = true;
                        timeLeft = modes[currentMode].work;
                    }
                    updateTimerDisplay();
                    if (isRunning) toggleTimer();
                }
            }, 1000);
            toggleBtn.innerHTML = '<span class="btn-icon">⏸</span><span class="btn-text">Pause</span>';
        }
        isRunning = !isRunning;
    }

    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        isWorkPhase = true;
        currentCycle = 1;
        timeLeft = modes[currentMode].work;
        updateTimerDisplay();
        toggleBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">Démarrer</span>';
    }

    function changeMode(mode) {
        currentMode = mode;
        resetTimer();
        modeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
    }

    function playNotificationSound() {
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
        } catch (e) { console.log('Audio non supporté'); }
    }

    toggleBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    modeButtons.forEach(btn => btn.addEventListener('click', () => changeMode(btn.dataset.mode)));

    updateTimerDisplay();
}

// ===== GESTIONNAIRE DES BOUTONS AGENDA =====
function initializeAgendaButtons() {
    const agendaActionButtons = document.querySelectorAll('.agenda-action-btn');
    agendaActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.agenda-card');
            const cardType = card.classList.contains('add-homework') ? 'devoir' : card.classList.contains('add-exam') ? 'examen' : 'tâche';
            alert(`Ajout d'un ${cardType} - Fonctionnalité à venir !`);
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

    volume.addEventListener('input', () => { audio.volume = volume.value / 100; });
    audio.addEventListener('error', (e) => { status.textContent = 'ERROR'; if(card) card.classList.remove('lofi-playing'); });
    audio.addEventListener('ended', () => { toggle.innerHTML = '<i class="fas fa-play"></i>'; status.textContent = 'OFF'; if(card) card.classList.remove('lofi-playing'); });
}






