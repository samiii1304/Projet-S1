CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_debut DATETIME NOT NULL,
    date_fin DATETIME,
    duree_reelle INT,
    source_declenchement ENUM('manuel','presence') NOT NULL,
    statut ENUM('en_cours','terminee') DEFAULT 'en_cours'
);

CREATE TABLE environnement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idsession INT NOT NULL,
    bruit INT,
    luminosite INT,
    air INT,
    presence TINYINT,
    FOREIGN KEY (idsession) REFERENCES sessions(id)
);



