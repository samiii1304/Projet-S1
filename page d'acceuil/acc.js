// Gestion du header qui change au scroll
let ticking = false;

function updateHeader() {
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero-section');
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    
    if (window.scrollY > heroBottom - 80) {
        header.style.backgroundColor = '#2d2d2d';
        header.style.width = '100%';
        header.style.borderRadius = '0';
        header.style.top = '0';
        header.style.left = '0';
        header.style.transform = 'none';
    } else {
        header.style.backgroundColor = 'rgba(61, 61, 61, 0.1)';
        header.style.width = 'calc(100% - 120px)';
        header.style.borderRadius = '10px';
        header.style.top = '15px';
        header.style.left = '50%';
        header.style.transform = 'translateX(-50%)';
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

// Animation des cartes de fonctionnalités au scroll
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Fonction pour vérifier si un élément est dans le viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    // Fonction pour animer les cartes
    function animateCards() {
        featureCards.forEach((card, index) => {
            if (isElementInViewport(card)) {
                // Ajouter un délai pour un effet en cascade
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }
    
    // Initialiser les cartes avec une opacité réduite
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Animer les cartes visibles au chargement
    animateCards();
    
    // Réanimer les cartes au scroll
    window.addEventListener('scroll', animateCards, { passive: true });
    
    // Animation des boutons au survol
    const heroButtons = document.querySelectorAll('.hero-btn');
    
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Animation de clic
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = '';
                
                // Message pour indiquer que c'est visuel
                if (this.classList.contains('btn-primary')) {
                    alert('Bouton "S\'inscrire" - Fonctionnalité à implémenter');
                } else if (this.classList.contains('btn-secondary')) {
                    alert('Bouton "Se Connecter" - Fonctionnalité à implémenter');
                }
            }, 200);
        });
    });
    
    // Animation d'apparition progressive
    const heroElements = document.querySelectorAll('.hero-logo, .hero-subtitle, .hero-buttons');
    
    // Masquer les éléments au début
    heroElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Les faire apparaître avec des délais
    setTimeout(() => {
        document.querySelector('.hero-logo').style.opacity = '1';
        document.querySelector('.hero-logo').style.transform = 'translateY(0)';
    }, 300);
    
    setTimeout(() => {
        document.querySelector('.hero-subtitle').style.opacity = '1';
        document.querySelector('.hero-subtitle').style.transform = 'translateY(0)';
    }, 600);
    
    setTimeout(() => {
        document.querySelector('.hero-buttons').style.opacity = '1';
        document.querySelector('.hero-buttons').style.transform = 'translateY(0)';
    }, 900);
});
