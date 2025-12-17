CREATE TABLE utilisateurs (
    pseudo VARCHAR(100) PRIMARY KEY,
    mot_de_passe VARCHAR(255) NOT NULL
);

CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pseudo VARCHAR(100) NOT NULL,
    date_debut DATETIME NOT NULL,
    date_fin DATETIME,
    duree_reelle INT,
    source_declenchement ENUM('manuel','presence') NOT NULL,
    statut ENUM('en_cours','terminee') DEFAULT 'en_cours',
    FOREIGN KEY (pseudo) REFERENCES utilisateurs(pseudo)
);
CREATE TABLE environnement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pseudo VARCHAR(100) ,
    idsession INT ,
    bruit INT,
    luminosite INT,
    air INT,
    presence TINYINT,
    FOREIGN KEY (pseudo) REFERENCES utilisateurs(pseudo),
    FOREIGN KEY (idsession) REFERENCES sessions(id)

);
