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
