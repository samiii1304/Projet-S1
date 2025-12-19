const backendurl = "http://127.0.0.1:5000";

fetch(backendurl + "/me", {
    method: "GET",
    credentials: "include"
})
    .then(res => {
        if (!res.ok) throw new Error("Non autorisé");
        return res.json();
    })
    .then(data => {
        const btns = document.getElementById("boutons-accueils");
        if (!btns) return; // sécurité si l'élément n'existe pas
        if (data.user) {
            // connecté → afficher
            btns.style.display = "none";
        } else {
            // non connecté → cacher
            btns.style.display = "flex";
        }
    });
// Gestion du header qui change quand on scroll 
let ticking = false;

function updateHeader() {
    const header = document.querySelector('header');
    const sectionPrincipale = document.querySelector('.section-principale');
    const basSection = sectionPrincipale.offsetTop + sectionPrincipale.offsetHeight;

    if (window.scrollY > basSection - 80) {
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

// Animation des cases quand on scroll
document.addEventListener('DOMContentLoaded', function () {
    const toutesLesCases = document.querySelectorAll('.case');

    // Vérifie si une case est visible à l'écran
    function estVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }

    // Anime les cases visibles
    function animerCases() {
        toutesLesCases.forEach((caseItem, index) => {
            if (estVisible(caseItem)) {
                // Délai pour un effet en cascade
                setTimeout(() => {
                    caseItem.style.opacity = '1';
                    caseItem.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }

    // Initialise les cases (invisibles au départ)
    toutesLesCases.forEach(caseItem => {
        caseItem.style.opacity = '0';
        caseItem.style.transform = 'translateY(30px)';
        caseItem.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Anime les cases visibles au chargement
    animerCases();

    // Ré-anime les cases quand on scroll
    window.addEventListener('scroll', animerCases, { passive: true });

    // Animation des boutons au clic
    const tousLesBoutons = document.querySelectorAll('.bouton');

    tousLesBoutons.forEach(bouton => {
        bouton.addEventListener('click', function (e) {

            // Animation de clic seulement
            this.style.transform = 'scale(0.95)';
            this.style.opacity = '0.9';

            setTimeout(() => {
                this.style.transform = '';
                this.style.opacity = '';
            }, 150);
        });
    });

    // Animation simple d'apparition
    setTimeout(() => {
        const logo = document.querySelector('.logo-grand');
        const texte = document.querySelector('.texte-presentation');
        const boutons = document.querySelector('.boutons-accueil');

        if (logo && texte && boutons) {
            logo.style.transition = 'opacity 1s ease, transform 1s ease';
            texte.style.transition = 'opacity 1s ease, transform 1s ease';
            boutons.style.transition = 'opacity 1s ease, transform 1s ease';

            logo.style.opacity = '1';
            logo.style.transform = 'translateY(0)';

            setTimeout(() => {
                texte.style.opacity = '1';
                texte.style.transform = 'translateY(0)';

                setTimeout(() => {
                    boutons.style.opacity = '1';
                    boutons.style.transform = 'translateY(0)';
                }, 300);
            }, 300);
        }
    }, 100);

    // Initialise les éléments comme invisibles
    const elementsInit = document.querySelectorAll('.logo-grand, .texte-presentation, .boutons-accueil');
    elementsInit.forEach(el => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
        }
    });
});