-- Table utilisateurs
CREATE TABLE utilisateurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL
);

-- Table methodes_travail
CREATE TABLE methodes_travail (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom VARCHAR(50) NOT NULL,
    duree_session INTEGER NOT NULL,
    duree_pause INTEGER NOT NULL,
    description TEXT
);

-- Méthodes de travail utilisables
INSERT INTO methodes_travail (nom, duree_session, duree_pause, description) VALUES
('Pomodoro Classique', 25, 5, 'Méthode traditionnelle 25/5'),
('Pomodoro Long', 50, 10, 'Sessions plus longues pour concentration intense');

-- Table sessions
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utilisateur_id INTEGER NOT NULL,
    methode_id INTEGER NOT NULL,
    date_debut DATETIME,
    date_fin DATETIME,
    duree_reelle INTEGER,
    statut TEXT DEFAULT 'En cours...',
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id),
    FOREIGN KEY (methode_id) REFERENCES methodes_travail(id)
);

-- Table mesures_environnement
CREATE TABLE mesures_environnement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    timestamp DATETIME,
    luminosite INTEGER,
    qualite_air INTEGER,
    bruit INTEGER,
    presence BOOLEAN,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Table pauses
CREATE TABLE pauses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    date_debut DATETIME,
    date_fin DATETIME,
    duree_reelle INTEGER,
    type TEXT DEFAULT 'programmee',
    FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Table agenda
CREATE TABLE agenda (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utilisateur_id INTEGER NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    date_echeance DATETIME NOT NULL,
    type TEXT,
    priorite TEXT DEFAULT 'moyenne',
    notifie BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

-- Table recompenses
CREATE TABLE recompenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utilisateur_id INTEGER NOT NULL,
    date DATE NOT NULL,
    sessions_completees INTEGER DEFAULT 0,
    jours_consecutifs INTEGER DEFAULT 0,
    objectif_atteint BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);
