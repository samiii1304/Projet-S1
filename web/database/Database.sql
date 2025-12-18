-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 18 déc. 2025 à 00:03
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `db`
--

-- --------------------------------------------------------

--
-- Structure de la table `environnement`
--

CREATE TABLE `environnement` (
  `id` int(11) NOT NULL,
  `idsession` int(11) NOT NULL,
  `bruit` int(11) DEFAULT NULL,
  `luminosite` int(11) DEFAULT NULL,
  `air` int(11) DEFAULT NULL,
  `presence` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `environnement`
--

INSERT INTO `environnement` (`id`, `idsession`, `bruit`, `luminosite`, `air`, `presence`) VALUES
(1, 1, 32, 450, 85, 1),
(2, 1, 34, 460, 83, 1),
(3, 2, 40, 500, 78, 1),
(4, 3, 30, 420, 90, 1),
(5, 4, 45, 390, 70, 1),
(6, 5, 33, 480, 82, 1),
(7, 6, 29, 510, 92, 1),
(8, 7, 36, 430, 84, 1),
(9, 8, 34, 490, 88, 1),
(10, 9, 41, 450, 76, 1),
(11, 10, 35, 460, 80, 1);

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `date_debut` datetime NOT NULL,
  `date_fin` datetime DEFAULT NULL,
  `duree_reelle` int(11) DEFAULT NULL,
  `source_declenchement` enum('manuel','presence') NOT NULL,
  `statut` enum('en_cours','terminee') DEFAULT 'en_cours'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `sessions`
--

INSERT INTO `sessions` (`id`, `date_debut`, `date_fin`, `duree_reelle`, `source_declenchement`, `statut`) VALUES
(1, '2025-12-11 09:00:00', '2025-12-11 09:25:00', 25, 'manuel', 'terminee'),
(2, '2025-12-11 14:00:00', '2025-12-11 14:50:00', 50, 'presence', 'terminee'),
(3, '2025-12-12 10:00:00', '2025-12-12 10:25:00', 25, 'manuel', 'terminee'),
(4, '2025-12-13 09:30:00', '2025-12-13 10:20:00', 50, 'presence', 'terminee'),
(5, '2025-12-13 16:00:00', '2025-12-13 16:25:00', 25, 'manuel', 'terminee'),
(6, '2025-12-14 15:00:00', '2025-12-14 15:50:00', 50, 'presence', 'terminee'),
(7, '2025-12-15 17:00:00', '2025-12-15 17:25:00', 25, 'manuel', 'terminee'),
(8, '2025-12-16 09:00:00', '2025-12-16 09:25:00', 25, 'manuel', 'terminee'),
(9, '2025-12-16 14:00:00', '2025-12-16 14:50:00', 50, 'presence', 'terminee'),
(10, '2025-12-17 10:00:00', '2025-12-17 10:25:00', 25, 'manuel', 'terminee');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `environnement`
--
ALTER TABLE `environnement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idsession` (`idsession`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `environnement`
--
ALTER TABLE `environnement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `environnement`
--
ALTER TABLE `environnement`
  ADD CONSTRAINT `environnement_ibfk_1` FOREIGN KEY (`idsession`) REFERENCES `sessions` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;




