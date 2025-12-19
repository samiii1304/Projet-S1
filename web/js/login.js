fetch("http://127.0.0.1:5000/me", {
    method: "GET",
    credentials: "include"
})
.then(res => {
    if (!res.ok) throw new Error("Non autorisé");
    return res.json();
})
.then(data => {
    console.log(data);
    if (data.user) {
        window.location.href = "studybuddy.html";
    }
});
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
});

// GESTION DES FORMULAIRES
function initForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
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
    fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(res => {
            if (res.ok) window.location.href = "studybuddy.html";
            else alert("Login incorrect");
        });
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

    // Validation du pseudo
    if (!username) {
        alert('loginUsername', 'Le pseudo est requis');
        isValid = false;
    } else if (username.length < 3) {
        alert('loginUsername', 'Le pseudo doit contenir au moins 3 caractères');
        isValid = false;
    }

    // Validation du mot de passe
    if (!password) {
        alert('loginPassword', 'Le mot de passe est requis');
        isValid = false;
    }

    return isValid;
}

// VALIDATION DU FORMULAIRE D'INSCRIPTION
function validateSignupForm(username, password, confirmPassword) {
    let isValid = true;

    // Validation du pseudo
    if (!username) {
        alert('signupUsername', 'Le pseudo est requis');
        isValid = false;
    } else if (username.length < 3) {
        alert('signupUsername', 'Le pseudo doit contenir au moins 3 caractères');
        isValid = false;
    }

    // Validation du mot de passe
    if (!password) {
        alert('signupPassword', 'Le mot de passe est requis');
        isValid = false;
    } else if (password.length < 6) {
        alert('signupPassword', 'Le mot de passe doit contenir au moins 6 caractères');
        isValid = false;
    }

    // Validation de la confirmation
    if (!confirmPassword) {
        alert('confirmPassword', 'Veuillez confirmer votre mot de passe');
        isValid = false;
    } else if (password !== confirmPassword) {
        alert('confirmPassword', 'Les mots de passe ne correspondent pas');
        isValid
    }
}