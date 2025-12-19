-- Table utilisateurs
CREATE TABLE utilisateurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO utilisateurs (username, password)
VALUES ('admin', 'admin');

CREATE TABLE pomodoros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    FOREIGN KEY (user_id) REFERENCES utilisateurs(id)
);
-- Pomodoros correspondants
INSERT INTO pomodoros (session_id, user_id, date) VALUES
(1, 1, '2025-12-16'),
(1, 1, '2025-12-16'),
(1, 1, '2025-12-16'),
(1, 1, '2025-12-16'),

(2, 1, '2025-12-17'),
(2, 1, '2025-12-17'),
(2, 1, '2025-12-17'),
(2, 1, '2025-12-17'),

(3, 1, '2025-12-18'),
(3, 1, '2025-12-18'),
(3, 1, '2025-12-18'),
(3, 1, '2025-12-18'),

(4, 1, '2025-12-18'),
(4, 1, '2025-12-18'),
(4, 1, '2025-12-18'),
(4, 1, '2025-12-18'),

(5, 1, '2025-12-18'),
(5, 1, '2025-12-18'),
(5, 1, '2025-12-18'),
(5, 1, '2025-12-18');

CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES utilisateurs(id)
);
-- Sessions semaine en cours
INSERT INTO sessions (user_id, started_at, ended_at) VALUES
(1, '2025-12-16 09:00:00', '2025-12-16 11:00:00'), -- 4 Pomodoros
(1, '2025-12-17 14:00:00', '2025-12-17 16:00:00'),
(1, '2025-12-18 10:00:00', '2025-12-18 12:00:00'),
(1, '2025-12-18 12:00:00', '2025-12-18 14:00:00'),
(1, '2025-12-18 14:00:00', '2025-12-18 16:00:00');


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
