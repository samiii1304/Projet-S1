// TRANSITION DU HEADEEEEEERR : START

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

// TRANSITION DU HEADEEEEEERR : END

// SLIDE HEADER AUTOMATIQUE : START

document.addEventListener('DOMContentLoaded', function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    
    if (totalSlides > 0) {
        function showNextSlide() {
            slides[currentSlide].classList.remove('active');
            // Passe à la slide suivante avec un modulo, comme au TD sur l'ASCII où on revenait au début
            currentSlide = (currentSlide + 1) % totalSlides;
            slides[currentSlide].classList.add('active');
        }
        
        // Dchange l'image du header toutes les 3 secondes
        setInterval(showNextSlide, 3000);
    }
});

// SLIDE HEADER AUTOMATIQUE  : END



// ANIMATION SCROLL POUR LES BLOCS : START

document.addEventListener('DOMContentLoaded', function() {
    const blocksToReveal = document.querySelectorAll('.session-status-block, .lofi-music-block, .work-environment-block, .today-sessions-block, .study-time-block, .consecutive-days-block, .avg-focus-block, .graph-block, .add-homework-block, .add-exam-block, .upcoming-tasks-block, .calendar-block');
    
    // On vérifie si le bloc est sur l'écran
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    function revealVisibleBlocks() {
        blocksToReveal.forEach(block => {
            if (isElementInViewport(block)) {
                block.classList.add('visible');
                block.classList.remove('hidden');
            }
        });
    }
    
    // revael du bloc
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
    
    // Écouter l'événement scroll
    window.addEventListener('scroll', onScrollReveal, { passive: true });
    
    // Écouter l'événement resize au cas où
    window.addEventListener('resize', revealVisibleBlocks, { passive: true });
});

// ANIMATIO SCROLL POUR LES BLOCS : END

// ===== ENVIRONNEMENT DE TRAVAIL =====

// 1. Récupérer les données de la BDD
async function getEnvData() {
    try {
        const response = await fetch('get_environment.php');
        const data = await response.json();
        updateEnv(data);
    } catch {
        // Si erreur, données par défaut
        updateEnv({luminosite:408, qualite_air:"Bonne", niveau_sonore:31});
    }
}

// 2. Mettre à jour l'affichage
function updateEnv(data) {
    // Luminosité
    if (document.getElementById('light-value')) {
        document.getElementById('light-value').textContent = data.luminosite;
        document.getElementById('light-bar').style.width = (data.luminosite/10) + '%';
    }
    
    // Qualité air
    if (document.getElementById('air-quality')) {
        document.getElementById('air-quality').textContent = data.qualite_air;
        document.getElementById('air-bar').style.width = 
            data.qualite_air === "Bonne" ? "75%" : "50%";
    }

    // Niveau sonore
    if (document.getElementById('sound-value')) {
        document.getElementById('sound-value').textContent = data.niveau_sonore;
        document.getElementById('sound-bar').style.width = data.niveau_sonore + '%';
    }
}
// Lance au bout de 2 secondes
setTimeout(() => {
    getEnvData();
    setInterval(getEnvData, 5000);
}, 2000);
