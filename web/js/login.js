// Gestion de la page de connexion/inscription StudyBuddy+

let ticking = false;

// TRANSITION DU HEADER (comme la page d'accueil)
function updateHeader() {
    const header = document.querySelector('header');
    const pageTitle = document.querySelector('.page-title');
    const titleBottom = pageTitle.offsetTop + pageTitle.offsetHeight;

    if (window.scrollY > titleBottom - 80) {
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

// ANIMATIONS AU SCROLL
document.addEventListener('DOMContentLoaded', function () {
    const authBoxes = document.querySelectorAll('.auth-box');

    // Fonction pour vérifier si un élément est visible
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }

    // Fonction pour révéler les éléments visibles
    function revealVisibleElements() {
        authBoxes.forEach((box, index) => {
            if (isElementInViewport(box)) {
                setTimeout(() => {
                    box.classList.add('visible');
                }, index * 200);
            }
        });
    }

    // Initialiser l'état des boxes
    authBoxes.forEach(box => {
        box.classList.add('hidden');
    });

    // Révéler au chargement
    revealVisibleElements();

    // Révéler au scroll
    window.addEventListener('scroll', revealVisibleElements, { passive: true });

    // Révéler au redimensionnement
    window.addEventListener('resize', revealVisibleElements, { passive: true });

    // Initialiser les formulaires
    initForms();

    // Initialiser les effets d'entrée
    initInputEffects();
});

// GESTION DES FORMULAIRES
function initForms() {
    // Formulaire de connexion
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Formulaire d'inscription
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Validation en temps réel
    initRealTimeValidation();
}

// TRAITEMENT DE LA CONNEXION
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Validation simple
    if (!validateLoginForm(username, password)) {
        return;
    }

    // Désactiver le bouton pendant le traitement
    const button = e.target.querySelector('.auth-btn');
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
    button.disabled = true;

    // Simuler une requête serveur
    setTimeout(() => {
        showMessage(`Bienvenue, ${username} !`, 'success');

        // Réactiver le bouton
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;

            // Redirection vers la page principale
            window.location.href = 'home.html';
        }, 1000);
    }, 1500);
}

// TRAITEMENT DE L'INSCRIPTION
function handleSignup(e) {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (!validateSignupForm(username, password, confirmPassword)) {
        return;
    }

    // Désactiver le bouton pendant le traitement
    const button = e.target.querySelector('.auth-btn');
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Création du compte...';
    button.disabled = true;

    // Simuler une requête serveur
    setTimeout(() => {
        showMessage(`Compte créé avec succès pour ${username} !`, 'success');

        // Réactiver le bouton
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;

            // Réinitialiser le formulaire
            e.target.reset();

            // Pré-remplir le formulaire de connexion
            document.getElementById('loginUsername').value = username;
            document.getElementById('loginPassword').focus();

        }, 1000);
    }, 1500);
}

// VALIDATION DU FORMULAIRE DE CONNEXION
function validateLoginForm(username, password) {
    let isValid = true;

    // Réinitialiser les erreurs
    clearErrors('loginUsername');
    clearErrors('loginPassword');

    // Validation du pseudo
    if (!username) {
        showError('loginUsername', 'Le pseudo est requis');
        isValid = false;
    } else if (username.length < 3) {
        showError('loginUsername', 'Le pseudo doit contenir au moins 3 caractères');
        isValid = false;
    }

    // Validation du mot de passe
    if (!password) {
        showError('loginPassword', 'Le mot de passe est requis');
        isValid = false;
    }

    return isValid;
}

// VALIDATION DU FORMULAIRE D'INSCRIPTION
function validateSignupForm(username, password, confirmPassword) {
    let isValid = true;

    // Réinitialiser les erreurs
    clearErrors('signupUsername');
    clearErrors('signupPassword');
    clearErrors('confirmPassword');

    // Validation du pseudo
    if (!username) {
        showError('signupUsername', 'Le pseudo est requis');
        isValid = false;
    } else if (username.length < 3) {
        showError('signupUsername', 'Le pseudo doit contenir au moins 3 caractères');
        isValid = false;
    }

    // Validation du mot de passe
    if (!password) {
        showError('signupPassword', 'Le mot de passe est requis');
        isValid = false;
    } else if (password.length < 6) {
        showError('signupPassword', 'Le mot de passe doit contenir au moins 6 caractères');
        isValid = false;
    }

    // Validation de la confirmation
    if (!confirmPassword) {
        showError('confirmPassword', 'Veuillez confirmer votre mot de passe');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Les mots de passe ne correspondent pas');
        isValid
    }
}