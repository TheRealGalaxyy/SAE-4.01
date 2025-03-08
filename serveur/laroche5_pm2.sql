-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 08 mars 2025 à 21:56
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `laroche5_pm2`
--

DELIMITER $$
--
-- Procédures
--
DROP PROCEDURE IF EXISTS `DELETE_FAVORI`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DELETE_FAVORI` (IN `v_id_prod` INT, IN `v_id_us` INT)  NO SQL BEGIN

DECLARE v_id_prod_existe, v_id_us_existe BOOLEAN;

CALL id_prod_existe(v_id_prod, v_id_prod_existe);
CALL id_us_existe(v_id_us, v_id_us_existe);

IF v_id_prod_existe AND v_id_us_existe THEN

	DELETE FROM FAVORI
    WHERE id_prod = v_id_prod
    AND id_us = v_id_us;
END IF;

END$$

DROP PROCEDURE IF EXISTS `id_cat_existe`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `id_cat_existe` (IN `v_id_cat` INT, OUT `v_id_cat_existe` BOOLEAN)   BEGIN

DECLARE v_id_cat_invalide CONDITION FOR SQLSTATE "45004";
DECLARE error_message VARCHAR(80);

SELECT v_id_cat IN (SELECT id_cat FROM CATEGORIE) INTO v_id_cat_existe;

IF v_id_cat_existe = 0 THEN
    SET error_message := CONCAT("Erreur 45004 : La catégorie n°", v_id_cat, " n'existe pas");
    SIGNAL v_id_cat_invalide SET MYSQL_ERRNO = "45004",
    MESSAGE_TEXT = error_message;
END IF;

END$$

DROP PROCEDURE IF EXISTS `id_col_existe`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `id_col_existe` (IN `v_id_col` INT, OUT `v_id_col_existe` BOOLEAN)   BEGIN

DECLARE v_id_col_invalide CONDITION FOR SQLSTATE "45002";
DECLARE error_message VARCHAR(80);

SELECT v_id_col IN (SELECT id_col FROM COULEUR) INTO v_id_col_existe;

IF v_id_col_existe = 0 THEN
    SET error_message := CONCAT("Erreur 45002 : La couleur n°", v_id_col, " n'existe pas");
    SIGNAL v_id_col_invalide SET MYSQL_ERRNO = "45002",
    MESSAGE_TEXT = error_message;
END IF;

END$$

DROP PROCEDURE IF EXISTS `id_com_existe`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `id_com_existe` (IN `v_id_com` INT, OUT `v_id_com_existe` BOOLEAN)   BEGIN

DECLARE v_id_com_invalide CONDITION FOR SQLSTATE "45005";
DECLARE error_message VARCHAR(80);

SELECT v_id_com IN (SELECT id_com FROM COMMANDE) INTO v_id_com_existe;

IF v_id_com_existe = 0 THEN
    SET error_message := CONCAT("Erreur 45005 : La commande n°", v_id_com, " n'existe pas");
    SIGNAL v_id_com_invalide SET MYSQL_ERRNO = "45005",
    MESSAGE_TEXT = error_message;
END IF;

END$$

DROP PROCEDURE IF EXISTS `id_perm_existe`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `id_perm_existe` (IN `v_id_perm` INT, OUT `v_id_perm_existe` BOOLEAN)   BEGIN

DECLARE v_id_perm_invalide CONDITION FOR SQLSTATE "45007";
DECLARE error_message VARCHAR(80);

SELECT v_id_perm IN (SELECT id_perm FROM PERMISSION) INTO v_id_perm_existe;

IF v_id_perm_existe = 0 THEN
    SET error_message := CONCAT("Erreur 45007 : La permission n°", v_id_perm, " n'existe pas");
    SIGNAL v_id_perm_invalide SET MYSQL_ERRNO = "45007",
    MESSAGE_TEXT = error_message;
END IF;

END$$

DROP PROCEDURE IF EXISTS `id_prod_existe`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `id_prod_existe` (IN `v_id_prod` INT, OUT `v_id_prod_existe` BOOLEAN)   BEGIN

DECLARE v_id_prod_invalide CONDITION FOR SQLSTATE "45001";
DECLARE error_message VARCHAR(80);

SELECT v_id_prod IN (SELECT id_prod FROM PRODUIT) INTO v_id_prod_existe;

IF v_id_prod_existe = 0 THEN
    SET error_message := CONCAT("Erreur 45001 : Le produit n°", v_id_prod, " n'existe pas");
    SIGNAL v_id_prod_invalide SET MYSQL_ERRNO = "45001",
    MESSAGE_TEXT = error_message;
END IF;

END$$

DROP PROCEDURE IF EXISTS `id_tail_existe`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `id_tail_existe` (IN `v_id_tail` INT, OUT `v_id_tail_existe` BOOLEAN)   BEGIN

DECLARE v_id_tail_invalide CONDITION FOR SQLSTATE "45003";
DECLARE error_message VARCHAR(80);

SELECT v_id_tail IN (SELECT id_tail FROM TAILLE) INTO v_id_tail_existe;

IF v_id_tail_existe = 0 THEN
    SET error_message := CONCAT("Erreur 45003 : La taille n°", v_id_tail, " n'existe pas");
    SIGNAL v_id_tail_invalide SET MYSQL_ERRNO = "45003",
    MESSAGE_TEXT = error_message;
END IF;

END$$

DROP PROCEDURE IF EXISTS `id_us_existe`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `id_us_existe` (IN `v_id_us` INT, OUT `v_id_us_existe` BOOLEAN)   BEGIN

DECLARE v_id_us_invalide CONDITION FOR SQLSTATE "45006";
DECLARE error_message VARCHAR(80);

SELECT v_id_us IN (SELECT id_us FROM USER) INTO v_id_us_existe;

IF v_id_us_existe = 0 THEN
    SET error_message := CONCAT("Erreur 45006 : L'user n°", v_id_us, " n'existe pas");
    SIGNAL v_id_us_invalide SET MYSQL_ERRNO = "45006",
    MESSAGE_TEXT = error_message;
END IF;

END$$

DROP PROCEDURE IF EXISTS `INSERT_FAVORI`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `INSERT_FAVORI` (IN `v_id_prod` INT, IN `v_id_us` INT)  DETERMINISTIC NO SQL BEGIN

INSERT INTO FAVORI
(id_prod, id_us)
VALUES
(v_id_prod, v_id_us);

END$$

DROP PROCEDURE IF EXISTS `login_non_existe`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `login_non_existe` (IN `v_login` VARCHAR(20), OUT `v_login_non_existe` BOOLEAN)  NO SQL BEGIN

DECLARE v_login_invalide CONDITION FOR SQLSTATE "45018";
DECLARE error_message VARCHAR(80);

SELECT TRIM(v_login) IN (SELECT login FROM USER) INTO v_login_non_existe;

IF v_login_non_existe <> 0 THEN
    SET error_message := CONCAT("Erreur 45018 : Le login ", v_login, " existe déjà");
    SIGNAL v_login_invalide SET MYSQL_ERRNO = "45018",
    MESSAGE_TEXT = error_message;
END IF;

END$$

DROP PROCEDURE IF EXISTS `mail_non_existe`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `mail_non_existe` (IN `v_mail` VARCHAR(100), OUT `v_mail_non_existe` BOOLEAN)   BEGIN

DECLARE v_mail_invalide CONDITION FOR SQLSTATE "45019";
DECLARE error_message VARCHAR(80);

SELECT TRIM(v_mail) IN (SELECT mel FROM USER) INTO v_mail_non_existe;

IF v_mail_non_existe <> 0 THEN
    SET error_message := CONCAT("Erreur 45019 : Le mail ", v_mail, " existe déjà");
    SIGNAL v_mail_invalide SET MYSQL_ERRNO = "45019",
    MESSAGE_TEXT = error_message;
END IF;

END$$

DROP PROCEDURE IF EXISTS `verifier_date`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `verifier_date` (IN `v_date` DATE, OUT `v_date_conforme` BOOLEAN)   BEGIN

DECLARE v_date_superieure CONDITION FOR SQLSTATE "45101";
DECLARE v_date_inferieure CONDITION FOR SQLSTATE "45102";
DECLARE v_age_invalide CONDITION FOR SQLSTATE "45020";
DECLARE error_message VARCHAR(80);
DECLARE v_age INT;


DECLARE v_now, v_1900 DATE;

SELECT NOW() INTO v_now;

IF v_date > v_now THEN
    SET v_date_conforme := FALSE;

    SET error_message := CONCAT("Erreur 45101 : La date ", v_date, " est supérieure à la date d'aujourd'hui");
    SIGNAL v_date_superieure SET MYSQL_ERRNO = "45101",
    MESSAGE_TEXT = error_message;
END IF;

SELECT MAKEDATE(1900, 1) INTO v_1900;

IF v_date < v_1900 THEN
    SET v_date_conforme := FALSE;

    SET error_message := CONCAT("Erreur 45102 : La date ", v_date, " est trop vieille (< 1900)");
    SIGNAL v_date_inferieure SET MYSQL_ERRNO = "45102",
    MESSAGE_TEXT = error_message;
END IF;

SELECT  floor(DATEDIFF(NOW() , v_date)/365) INTO v_age;

IF v_age < 16 THEN
    SET v_date_conforme := FALSE;
    SET error_message := CONCAT("Erreur 45020 : vous devez avoir au moins 16 ans pour vous inscrire");
    SIGNAL v_age_invalide SET MYSQL_ERRNO = "45020",
    MESSAGE_TEXT = error_message;
END IF;

SET v_date_conforme := TRUE;

END$$

DROP PROCEDURE IF EXISTS `verifier_prix`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `verifier_prix` (IN `v_prix` FLOAT, OUT `v_prix_correct` BOOLEAN)   BEGIN

DECLARE v_prix_negatif CONDITION FOR SQLSTATE "45103";
DECLARE error_message VARCHAR(80);

IF v_prix < 0 THEN
    SET v_prix_correct := FALSE;

    SET error_message := CONCAT("Erreur 45103 : Le prix ", v_prix, " ne peut pas être négatif");
    SIGNAL v_prix_negatif SET MYSQL_ERRNO = "45103",
    MESSAGE_TEXT = error_message;
END IF;

SET v_prix_correct := TRUE;

END$$

DROP PROCEDURE IF EXISTS `verifier_qte`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `verifier_qte` (IN `v_qte` INT, OUT `v_qte_correcte` BOOLEAN)   BEGIN

DECLARE v_qte_negative CONDITION FOR SQLSTATE "45104";
DECLARE error_message VARCHAR(80);

IF v_qte < 0 THEN
    SET v_qte_correcte := FALSE;

    SET error_message := CONCAT("Erreur 45104 : La quantité ", v_qte, " ne peut pas être négative");
    SIGNAL v_qte_negative SET MYSQL_ERRNO = "45104",
    MESSAGE_TEXT = error_message;
END IF;

SET v_qte_correcte := TRUE;

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

DROP TABLE IF EXISTS `categorie`;
CREATE TABLE IF NOT EXISTS `categorie` (
  `id_cat` int NOT NULL AUTO_INCREMENT,
  `nom_cat` varchar(30) NOT NULL,
  PRIMARY KEY (`id_cat`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `categorie`
--

INSERT INTO `categorie` (`id_cat`, `nom_cat`) VALUES
(1, 'Bonnet'),
(2, 'Pull'),
(3, 'Gants'),
(4, 'Chaussettes'),
(5, 'Décoration'),
(6, 'Schysautre');

-- --------------------------------------------------------

--
-- Structure de la table `col_prod`
--

DROP TABLE IF EXISTS `col_prod`;
CREATE TABLE IF NOT EXISTS `col_prod` (
  `id_prod` int NOT NULL,
  `id_col` int NOT NULL,
  `diff_prix_col` float NOT NULL,
  `path_img` varchar(34) NOT NULL,
  PRIMARY KEY (`id_prod`,`id_col`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `col_prod`
--

INSERT INTO `col_prod` (`id_prod`, `id_col`, `diff_prix_col`, `path_img`) VALUES
(1, 2, 0, 'bonnet noel rouge.jpg'),
(1, 16, 1, 'bonnetNoelDoré.jpg'),
(2, 2, 0, 'BonnetMocheRouge.jpeg'),
(2, 3, 0, 'bonnet moche vert.jpg'),
(2, 5, 0, 'bonnetMocheBlanc.webp'),
(2, 8, 0, 'bonnetMocheMarron.jpg'),
(3, 2, 0, 'pull-moche-noel-renne.jpeg'),
(4, 2, 0, 'pullLaineRouge.jpg'),
(4, 3, 0, 'pullLaineVert.webp'),
(4, 6, 0, 'pull_laine_blanc.jpg'),
(4, 7, 0, 'pullLaineNoir.jpg'),
(5, 5, 0, 'gants ski blanc.webp'),
(5, 6, 0, 'gantSkiGris.webp'),
(5, 7, 0, 'gantSkiNoir.jpg'),
(6, 2, 0, 'sousGantRouge.webp'),
(6, 3, 0, 'sousGantVert.webp'),
(6, 4, 0, 'sousGantBleu.jpg'),
(6, 5, 0, 'sousGantBlanc.jpg'),
(6, 6, 0, 'sousGantGris.webp'),
(6, 7, 0, 'sous gants noirs.jpg'),
(6, 9, 0, 'sousGantViolet.webp'),
(6, 11, 0, 'sousGantCyan.webp'),
(6, 12, 0, 'sousGantMagenta.webp'),
(6, 14, 0, 'sousGantTurquoise.webp'),
(7, 2, 0, 'gants en laine rouge.jpg'),
(7, 3, 0, 'gantLaineVert.jpg'),
(7, 5, 0, 'gantLaineBlanc.webp'),
(7, 6, 0, 'gantLaineGris.jpg'),
(7, 7, 0, 'gantLaineNoir.jpg'),
(7, 8, 0, 'gantLaineMarron.webp'),
(8, 2, 0, 'chaussette de noel.jpg'),
(8, 5, 0, 'chaussettePereNoelblanc.webp'),
(8, 6, 0, 'chaussettePereNoelGris.jpg'),
(9, 2, 0, 'chaussetteHauteRouge.jpg'),
(9, 5, 0, 'chaussetteHauteBlanc.avif'),
(9, 6, 0, 'chaussetteHauteGris.webp'),
(9, 7, 0, 'chaussettes hautes noires.jpg'),
(9, 13, 0, 'chaussetteHauteOrange.avif'),
(10, 2, 0, 'chaussetteLaineRouge.webp'),
(10, 5, 0, 'chaussetteLaineBlanc.jpg'),
(10, 6, 0, 'chaussetteLaineGris.jpg'),
(10, 7, 0, 'chaussetteLaineNoir.jpg'),
(10, 10, 0, 'chaussetteLaineRose.webp'),
(10, 12, 0, 'chaussettelaineMagenta.jpg'),
(10, 15, 0, 'chaussettes laine multicolores.jpg'),
(11, 2, 0, 'girlandeRouge.jpg'),
(11, 5, 0, 'girlandeBlanc.jpg'),
(11, 15, 0, 'girlandeMulti.jpg'),
(12, 1, 0, 'bouleNoelJaune.jpg'),
(12, 2, 0, 'bouleNoelRouge.jpg'),
(12, 3, 0, 'bouleNoelVert.jpg'),
(12, 5, 0, 'bouleNoelBlanc.jpg'),
(12, 16, 0, 'bouleNoelDoré.jpg'),
(12, 17, 0, 'bouleNoelArgent.jpg'),
(13, 3, 0, 'sapinPlastiqueVert.jpg'),
(13, 5, 0, 'sapinPlastiqueBlanc.jpg'),
(14, 3, 0, 'sapinNaturelVert.jpg'),
(14, 5, 0, 'sapinNaturelBlanc.jpg'),
(15, 2, 0, 'pere_noel.png');

--
-- Déclencheurs `col_prod`
--
DROP TRIGGER IF EXISTS `COL_PROD_BEFORE_INSERT`;
DELIMITER $$
CREATE TRIGGER `COL_PROD_BEFORE_INSERT` BEFORE INSERT ON `col_prod` FOR EACH ROW BEGIN

DECLARE v_id_prod_existe, v_id_col_existe, v_prix_correct BOOLEAN;

CALL id_prod_existe(NEW.id_prod, v_id_prod_existe);
CALL id_col_existe(NEW.id_col, v_id_col_existe);
CALL verifier_prix(NEW.diff_prix_col, v_prix_correct);

END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `COL_PROD_BEFORE_UPDATE`;
DELIMITER $$
CREATE TRIGGER `COL_PROD_BEFORE_UPDATE` BEFORE UPDATE ON `col_prod` FOR EACH ROW BEGIN

DECLARE v_id_prod_existe, v_id_col_existe, v_prix_correct BOOLEAN;

CALL id_prod_existe(NEW.id_prod, v_id_prod_existe);
CALL id_col_existe(NEW.id_col, v_id_col_existe);
CALL verifier_prix(NEW.diff_prix_col, v_prix_correct);

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `commande`
--

DROP TABLE IF EXISTS `commande`;
CREATE TABLE IF NOT EXISTS `commande` (
  `id_com` int NOT NULL AUTO_INCREMENT,
  `date_com` date NOT NULL,
  `id_us` int NOT NULL,
  PRIMARY KEY (`id_com`)
) ENGINE=MyISAM AUTO_INCREMENT=71 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `commande`
--

INSERT INTO `commande` (`id_com`, `date_com`, `id_us`) VALUES
(54, '2023-04-05', 11),
(55, '2023-04-05', 11),
(56, '2023-04-05', 11),
(57, '2023-04-05', 11),
(58, '2023-04-05', 11),
(59, '2023-04-05', 11),
(60, '2023-04-05', 11),
(61, '2023-04-05', 7),
(62, '2023-04-05', 7),
(63, '2023-04-05', 7),
(64, '2023-04-05', 16),
(65, '2023-04-05', 18),
(66, '2023-04-05', 18),
(67, '2025-02-25', 7),
(68, '2025-03-08', 7),
(69, '2025-03-08', 7),
(70, '2025-03-08', 7);

--
-- Déclencheurs `commande`
--
DROP TRIGGER IF EXISTS `COMMANDE_BEFORE_INSERT`;
DELIMITER $$
CREATE TRIGGER `COMMANDE_BEFORE_INSERT` BEFORE INSERT ON `commande` FOR EACH ROW BEGIN

DECLARE v_id_us_existe, v_date_conforme BOOLEAN;

CALL id_us_existe(NEW.id_us, v_id_us_existe);
#CALL verifier_date(NEW.date_com, v_date_conforme);

END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `COMMANDE_BEFORE_UPDATE`;
DELIMITER $$
CREATE TRIGGER `COMMANDE_BEFORE_UPDATE` BEFORE UPDATE ON `commande` FOR EACH ROW BEGIN

DECLARE v_id_us_existe, v_date_conforme BOOLEAN;

CALL id_us_existe(NEW.id_us, v_id_us_existe);
#CALL verifier_date(NEW.date_com, v_date_conforme);

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `couleur`
--

DROP TABLE IF EXISTS `couleur`;
CREATE TABLE IF NOT EXISTS `couleur` (
  `id_col` int NOT NULL AUTO_INCREMENT,
  `nom_col` varchar(20) NOT NULL,
  PRIMARY KEY (`id_col`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `couleur`
--

INSERT INTO `couleur` (`id_col`, `nom_col`) VALUES
(1, 'Jaune'),
(2, 'Rouge'),
(3, 'Vert'),
(4, 'Bleu'),
(5, 'Blanc'),
(6, 'Gris'),
(7, 'Noir'),
(8, 'Marron'),
(9, 'Violet'),
(10, 'Rose'),
(11, 'Cyan'),
(12, 'Magenta'),
(13, 'Orange'),
(14, 'Turquoise'),
(15, 'Multicolore'),
(16, 'Doré'),
(17, 'Argenté');

-- --------------------------------------------------------

--
-- Structure de la table `detail_com`
--

DROP TABLE IF EXISTS `detail_com`;
CREATE TABLE IF NOT EXISTS `detail_com` (
  `id_com` int NOT NULL,
  `id_prod` int NOT NULL,
  `id_col` int NOT NULL,
  `id_tail` int NOT NULL,
  `qte_com` int NOT NULL,
  `prix_total` float NOT NULL,
  PRIMARY KEY (`id_com`,`id_prod`,`id_col`,`id_tail`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `detail_com`
--

INSERT INTO `detail_com` (`id_com`, `id_prod`, `id_col`, `id_tail`, `qte_com`, `prix_total`) VALUES
(53, 8, 5, 12, 1, 15.6),
(53, 15, 2, 17, 50, 0),
(53, 3, 2, 4, 9, 162),
(53, 2, 8, 17, 1, 4.8),
(53, 12, 17, 3, 1, 9.6),
(53, 6, 2, 3, 1, 13.2),
(53, 1, 16, 17, 1, 7.2),
(53, 1, 2, 17, 1, 6),
(54, 8, 5, 12, 1, 15.6),
(54, 15, 2, 17, 50, 0),
(54, 3, 2, 4, 9, 162),
(54, 2, 8, 17, 1, 4.8),
(54, 12, 17, 3, 1, 9.6),
(54, 6, 2, 3, 1, 13.2),
(54, 1, 16, 17, 1, 7.2),
(54, 1, 2, 17, 1, 6),
(55, 8, 5, 12, 1, 15.6),
(55, 15, 2, 17, 50, 0),
(55, 3, 2, 4, 9, 162),
(55, 2, 8, 17, 1, 4.8),
(55, 12, 17, 3, 1, 9.6),
(55, 6, 2, 3, 1, 13.2),
(55, 1, 16, 17, 1, 7.2),
(55, 1, 2, 17, 1, 6),
(56, 8, 5, 12, 1, 15.6),
(56, 15, 2, 17, 50, 0),
(56, 3, 2, 4, 9, 162),
(56, 2, 8, 17, 1, 4.8),
(56, 12, 17, 3, 1, 9.6),
(56, 6, 2, 3, 1, 13.2),
(56, 1, 16, 17, 1, 7.2),
(56, 1, 2, 17, 1, 6),
(57, 8, 5, 12, 1, 15.6),
(57, 15, 2, 17, 50, 0),
(57, 3, 2, 4, 9, 162),
(57, 2, 8, 17, 1, 4.8),
(57, 12, 17, 3, 1, 9.6),
(57, 6, 2, 3, 1, 13.2),
(57, 1, 16, 17, 1, 7.2),
(57, 1, 2, 17, 1, 6),
(58, 10, 5, 12, 1, 12),
(58, 12, 17, 3, 1, 9.6),
(59, 8, 5, 12, 1, 15.6),
(59, 10, 5, 12, 1, 12),
(60, 10, 5, 12, 1, 12),
(60, 12, 17, 3, 1, 9.6),
(61, 1, 16, 17, 1, 7.2),
(61, 8, 5, 12, 1, 15.6),
(61, 12, 17, 3, 19, 182.4),
(62, 2, 5, 17, 1, 4.8),
(62, 14, 3, 7, 3, 324),
(63, 8, 2, 12, 1, 15.6),
(63, 10, 2, 12, 1, 12),
(64, 12, 1, 3, 5, 48),
(65, 9, 13, 15, 4, 86.4),
(66, 5, 7, 1, 1, 12),
(66, 12, 16, 1, 1, 8.4),
(67, 2, 2, 17, 1, 4.8),
(68, 1, 2, 17, 1, 6),
(69, 1, 2, 17, 1, 6),
(70, 1, 2, 17, 1, 6);

--
-- Déclencheurs `detail_com`
--
DROP TRIGGER IF EXISTS `DETAIL_COM_BEFORE_INSERT`;
DELIMITER $$
CREATE TRIGGER `DETAIL_COM_BEFORE_INSERT` BEFORE INSERT ON `detail_com` FOR EACH ROW BEGIN

DECLARE v_id_com_existe, v_id_prod_existe, v_id_col_existe, v_id_tail_existe, v_prix_correct, v_qte_correcte BOOLEAN;

CALL id_com_existe(NEW.id_com, v_id_com_existe);
CALL id_prod_existe(NEW.id_prod, v_id_prod_existe);
CALL id_col_existe(NEW.id_col, v_id_col_existe);
CALL id_tail_existe(NEW.id_tail, v_id_tail_existe);
CALL verifier_prix(NEW.prix_total, v_prix_correct);
CALL verifier_qte(NEW.qte_com, v_qte_correcte);

END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `DETAIL_COM_BEFORE_UPDATE`;
DELIMITER $$
CREATE TRIGGER `DETAIL_COM_BEFORE_UPDATE` BEFORE UPDATE ON `detail_com` FOR EACH ROW BEGIN

DECLARE v_id_com_existe, v_id_prod_existe, v_id_col_existe, v_id_tail_existe, v_prix_correct, v_qte_correcte BOOLEAN;

CALL id_com_existe(NEW.id_com, v_id_com_existe);
CALL id_prod_existe(NEW.id_prod, v_id_prod_existe);
CALL id_col_existe(NEW.id_col, v_id_col_existe);
CALL id_tail_existe(NEW.id_tail, v_id_tail_existe);
CALL verifier_prix(NEW.prix_total, v_prix_correct);
CALL verifier_qte(NEW.qte_com, v_qte_correcte);

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `favori`
--

DROP TABLE IF EXISTS `favori`;
CREATE TABLE IF NOT EXISTS `favori` (
  `id_us` int NOT NULL,
  `id_prod` int NOT NULL,
  PRIMARY KEY (`id_us`,`id_prod`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `favori`
--

INSERT INTO `favori` (`id_us`, `id_prod`) VALUES
(11, 1),
(11, 2),
(11, 7),
(11, 12),
(11, 15),
(16, 8),
(16, 10),
(16, 12),
(18, 8),
(18, 12);

--
-- Déclencheurs `favori`
--
DROP TRIGGER IF EXISTS `FAVORI_BEFORE_INSERT`;
DELIMITER $$
CREATE TRIGGER `FAVORI_BEFORE_INSERT` BEFORE INSERT ON `favori` FOR EACH ROW BEGIN

DECLARE v_id_prod_existe, v_id_us_existe BOOLEAN;

CALL id_prod_existe(NEW.id_prod, v_id_prod_existe);
CALL id_us_existe(NEW.id_us, v_id_us_existe);

END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `FAVORI_BEFORE_UPDATE`;
DELIMITER $$
CREATE TRIGGER `FAVORI_BEFORE_UPDATE` BEFORE UPDATE ON `favori` FOR EACH ROW BEGIN

DECLARE v_id_prod_existe, v_id_us_existe BOOLEAN;

CALL id_prod_existe(NEW.id_prod, v_id_prod_existe);
CALL id_us_existe(NEW.id_us, v_id_us_existe);

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `panier`
--

DROP TABLE IF EXISTS `panier`;
CREATE TABLE IF NOT EXISTS `panier` (
  `id_us` int NOT NULL,
  `id_prod` int NOT NULL,
  `id_col` int NOT NULL,
  `id_tail` int NOT NULL,
  `qte_pan` int NOT NULL,
  PRIMARY KEY (`id_us`,`id_prod`,`id_col`,`id_tail`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `panier`
--

INSERT INTO `panier` (`id_us`, `id_prod`, `id_col`, `id_tail`, `qte_pan`) VALUES
(11, 9, 13, 12, 2),
(16, 2, 2, 17, 1),
(16, 9, 2, 12, 1),
(11, 1, 16, 17, 3),
(16, 10, 2, 12, 1),
(18, 12, 1, 3, 1),
(11, 12, 17, 3, 10),
(11, 8, 2, 12, 11),
(11, 15, 2, 11, 10),
(16, 1, 16, 17, 1),
(16, 11, 2, 11, 1);

--
-- Déclencheurs `panier`
--
DROP TRIGGER IF EXISTS `PANIER_BEFORE_INSERT`;
DELIMITER $$
CREATE TRIGGER `PANIER_BEFORE_INSERT` BEFORE INSERT ON `panier` FOR EACH ROW BEGIN

DECLARE v_id_us_existe, v_id_prod_existe, v_id_col_existe, v_id_tail_existe, v_qte_correcte BOOLEAN;

CALL id_us_existe(NEW.id_us, v_id_us_existe);
CALL id_prod_existe(NEW.id_prod, v_id_prod_existe);
CALL id_col_existe(NEW.id_col, v_id_col_existe);
CALL id_tail_existe(NEW.id_tail, v_id_tail_existe);
CALL verifier_qte(NEW.qte_pan, v_qte_correcte);

END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `PANIER_BEFORE_UPDATE`;
DELIMITER $$
CREATE TRIGGER `PANIER_BEFORE_UPDATE` BEFORE UPDATE ON `panier` FOR EACH ROW BEGIN

DECLARE v_id_us_existe, v_id_prod_existe, v_id_col_existe, v_id_tail_existe, v_qte_correcte BOOLEAN;

CALL id_us_existe(NEW.id_us, v_id_us_existe);
CALL id_prod_existe(NEW.id_prod, v_id_prod_existe);
CALL id_col_existe(NEW.id_col, v_id_col_existe);
CALL id_tail_existe(NEW.id_tail, v_id_tail_existe);
CALL verifier_qte(NEW.qte_pan, v_qte_correcte);

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `permission`
--

DROP TABLE IF EXISTS `permission`;
CREATE TABLE IF NOT EXISTS `permission` (
  `id_perm` int NOT NULL AUTO_INCREMENT,
  `nom_perm` varchar(15) NOT NULL,
  `num_grade` int NOT NULL,
  PRIMARY KEY (`id_perm`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `permission`
--

INSERT INTO `permission` (`id_perm`, `nom_perm`, `num_grade`) VALUES
(1, 'Administrateur', 0),
(2, 'Client', 1);

-- --------------------------------------------------------

--
-- Structure de la table `produit`
--

DROP TABLE IF EXISTS `produit`;
CREATE TABLE IF NOT EXISTS `produit` (
  `id_prod` int NOT NULL AUTO_INCREMENT,
  `nom_prod` varchar(50) NOT NULL,
  `description` varchar(700) NOT NULL,
  `prix_base` float NOT NULL,
  `id_cat` int NOT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `stock_quantity` int DEFAULT NULL,
  PRIMARY KEY (`id_prod`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `produit`
--

INSERT INTO `produit` (`id_prod`, `nom_prod`, `description`, `prix_base`, `id_cat`, `sku`, `stock_quantity`) VALUES
(1, 'Bonnet du père noël', 'Un bonnet du père noël classique, bien pour se déguiser et apporter la bonne ambiance.', 5, 1, 'SKU1', 50),
(2, 'Bonnet moche de noël', 'Un bonnet pas très beau, mais qui fait l\'affaire pour se réchauffer', 4, 1, 'SKU2', 103),
(3, 'Pull de rennes', 'Un pull avec un rennes dessus, un indémodable', 15, 2, 'SKU3', 146),
(4, 'Pull en laine', 'Un pull en laine très sobre, très confortable, très cosy', 30, 2, 'SKU4', 325),
(5, 'Gants de ski', 'Des gants adaptés à tous types de neige, de pluie ou d\'intempéries diverses', 10, 3, 'SKU5', 281),
(6, 'Sous-gants', 'Des sous-gants adaptés au gants de ski, très léger et qui tiennent chaud', 10, 3, 'SKU6', 754),
(7, 'Gants en laine', 'Gants en laine adaptés à n\'importe quel besoin', 11, 3, 'SKU7', 397),
(8, 'Chaussettes du père noël', 'Des chaussettes conviviales pour cacher les cadeaux et mettre près de la cheminée', 13, 4, 'SKU8', 339),
(9, 'Chaussettes hautes', 'Chaussettes idéales pour se maintenir au chaud en toute circonstance', 17, 4, 'SKU9', 499),
(10, 'Chaussettes en laine', 'Des chaussettes classiques mais néanmoins pratiques', 10, 4, 'SKU10', 921),
(11, 'Guirlande lumineuse', 'Une guirlande sympatique pour égayer les réveillons de noël', 30, 5, 'SKU11', 288),
(12, 'Boules de noël', 'Des boules variées à accrocher à votre sapin', 7, 5, 'SKU12', 406),
(13, 'Sapin de Noël en plastique', 'Un sapin de noël passe partout, sans la corvée du ménage', 60, 5, 'SKU13', 106),
(14, 'Sapin de Noël naturel', 'Un sapin de noël naturel, avec les épines qui tombent et la déforestation qui va avec', 70, 5, 'SKU14', 110),
(15, 'Le père noël', 'Un père noël à la mode, visiblement trop cool pour ce monde. La légende dit qu\'il fait trembler internet lui-même. Il est si fort qu\'il a pu se battre contre Chuck Norris et Rambo en même temps et il a gagné tout en distribuant ses cadeaux. Il est tellement puissant qu\'on ne peut pas lui attribuer de prix. Et si on ne peut pas lui attribuer de prix, c\'est que c\'est gratuit.', 0, 6, 'SKU15', 28);

--
-- Déclencheurs `produit`
--
DROP TRIGGER IF EXISTS `PRODUIT_BEFORE_INSERT`;
DELIMITER $$
CREATE TRIGGER `PRODUIT_BEFORE_INSERT` BEFORE INSERT ON `produit` FOR EACH ROW BEGIN

DECLARE v_id_cat_existe, v_prix_correct BOOLEAN;

CALL id_cat_existe(NEW.id_cat, v_id_cat_existe);
CALL verifier_prix(NEW.prix_base, v_prix_correct);

END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `PRODUIT_BEFORE_UPDATE`;
DELIMITER $$
CREATE TRIGGER `PRODUIT_BEFORE_UPDATE` BEFORE UPDATE ON `produit` FOR EACH ROW BEGIN

DECLARE v_id_cat_existe, v_prix_correct BOOLEAN;

CALL id_cat_existe(NEW.id_cat, v_id_cat_existe);
CALL verifier_prix(NEW.prix_base, v_prix_correct);

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `select_commandes`
-- (Voir ci-dessous la vue réelle)
--
DROP VIEW IF EXISTS `select_commandes`;
CREATE TABLE IF NOT EXISTS `select_commandes` (
`id_com` int
,`id_us` int
,`id_prod` int
,`id_col` int
,`id_tail` int
,`date_com` date
,`qte_com` int
,`prix_total` float
);

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `select_paniers`
-- (Voir ci-dessous la vue réelle)
--
DROP VIEW IF EXISTS `select_paniers`;
CREATE TABLE IF NOT EXISTS `select_paniers` (
`id_us` int
,`id_prod` int
,`stock` bigint
,`nom_prod` varchar(50)
,`id_cat` int
,`nom_cat` varchar(30)
,`id_col` int
,`nom_col` varchar(20)
,`id_tail` int
,`nom_tail` varchar(13)
,`path_img` varchar(34)
,`prix_unit` double
,`qte_pan` int
,`prix_total` double
);

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `select_produits`
-- (Voir ci-dessous la vue réelle)
--
DROP VIEW IF EXISTS `select_produits`;
CREATE TABLE IF NOT EXISTS `select_produits` (
`id_prod` int
,`nom_prod` varchar(50)
,`description` varchar(700)
,`sku` varchar(100)
,`stock` bigint
,`stock_general` int
,`id_cat` int
,`nom_cat` varchar(30)
,`id_col` int
,`nom_col` varchar(20)
,`id_tail` int
,`nom_tail` varchar(13)
,`path_img` varchar(34)
,`prix_unit` double
);

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `select_users`
-- (Voir ci-dessous la vue réelle)
--
DROP VIEW IF EXISTS `select_users`;
CREATE TABLE IF NOT EXISTS `select_users` (
`id_us` int
,`nom_us` varchar(30)
,`prenom_us` varchar(20)
,`mel` varchar(100)
,`date_naiss` date
,`login` varchar(20)
,`mdp` varchar(255)
,`id_perm` int
,`nom_perm` varchar(15)
);

-- --------------------------------------------------------

--
-- Structure de la table `taille`
--

DROP TABLE IF EXISTS `taille`;
CREATE TABLE IF NOT EXISTS `taille` (
  `id_tail` int NOT NULL AUTO_INCREMENT,
  `nom_tail` varchar(13) NOT NULL,
  `id_cat` int NOT NULL,
  PRIMARY KEY (`id_tail`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `taille`
--

INSERT INTO `taille` (`id_tail`, `nom_tail`, `id_cat`) VALUES
(1, 'XS', 0),
(2, 'S', 0),
(3, 'M', 0),
(4, 'L', 0),
(5, 'XL', 0),
(6, '30cm', 5),
(7, '60cm', 5),
(8, '50cm', 5),
(9, '100cm', 5),
(10, '150cm', 5),
(11, '200cm', 5),
(12, '32-34', 4),
(13, '35-38', 4),
(14, '39-42', 4),
(15, '43-46', 4),
(16, '47-48', 4),
(17, 'Pas de taille', 0);

-- --------------------------------------------------------

--
-- Structure de la table `taille_col_prod`
--

DROP TABLE IF EXISTS `taille_col_prod`;
CREATE TABLE IF NOT EXISTS `taille_col_prod` (
  `id_prod` int NOT NULL,
  `id_col` int NOT NULL,
  `id_taille` int NOT NULL,
  `prix` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  PRIMARY KEY (`id_prod`,`id_col`,`id_taille`),
  KEY `id_col` (`id_col`),
  KEY `id_taille` (`id_taille`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `taille_col_prod`
--

INSERT INTO `taille_col_prod` (`id_prod`, `id_col`, `id_taille`, `prix`, `stock`) VALUES
(1, 2, 17, 5.00, 19),
(1, 16, 17, 6.00, 31),
(2, 2, 17, 4.00, 47),
(2, 3, 17, 4.00, 41),
(2, 5, 17, 4.00, 15),
(2, 8, 17, 4.00, 0),
(3, 2, 1, 15.00, 8),
(3, 2, 2, 15.00, 39),
(3, 2, 3, 15.00, 21),
(3, 2, 4, 15.00, 40),
(3, 2, 5, 15.00, 38),
(4, 2, 1, 30.00, 20),
(4, 3, 1, 30.00, 36),
(4, 6, 1, 30.00, 22),
(4, 7, 1, 30.00, 1),
(4, 2, 2, 31.00, 42),
(4, 3, 2, 31.00, 6),
(4, 6, 2, 31.00, 4),
(4, 7, 2, 31.00, 5),
(4, 2, 3, 32.00, 11),
(4, 3, 3, 32.00, 39),
(4, 6, 3, 32.00, 15),
(4, 7, 3, 32.00, 9),
(4, 2, 4, 33.00, 0),
(4, 3, 4, 33.00, 23),
(4, 6, 4, 33.00, 14),
(4, 7, 4, 33.00, 1),
(4, 2, 5, 34.00, 15),
(4, 3, 5, 34.00, 22),
(4, 6, 5, 34.00, 18),
(4, 7, 5, 34.00, 22),
(5, 5, 1, 10.00, 8),
(5, 6, 1, 10.00, 23),
(5, 7, 1, 10.00, 40),
(5, 5, 2, 10.50, 34),
(5, 6, 2, 10.50, 48),
(5, 7, 2, 10.50, 41),
(5, 5, 3, 11.00, 12),
(5, 6, 3, 11.00, 35),
(5, 7, 3, 11.00, 40),
(6, 2, 1, 10.00, 46),
(6, 3, 1, 10.00, 10),
(6, 4, 1, 10.00, 13),
(6, 5, 1, 10.00, 35),
(6, 6, 1, 10.00, 35),
(6, 7, 1, 10.00, 22),
(6, 9, 1, 10.00, 7),
(6, 11, 1, 10.00, 16),
(6, 12, 1, 10.00, 12),
(6, 14, 1, 10.00, 13),
(6, 2, 2, 10.50, 28),
(6, 3, 2, 10.50, 4),
(6, 4, 2, 10.50, 35),
(6, 5, 2, 10.50, 14),
(6, 6, 2, 10.50, 17),
(6, 7, 2, 10.50, 43),
(6, 9, 2, 10.50, 15),
(6, 11, 2, 10.50, 45),
(6, 12, 2, 10.50, 31),
(6, 14, 2, 10.50, 21),
(6, 2, 3, 11.00, 11),
(6, 3, 3, 11.00, 44),
(6, 4, 3, 11.00, 38),
(6, 5, 3, 11.00, 8),
(6, 6, 3, 11.00, 28),
(6, 7, 3, 11.00, 16),
(6, 9, 3, 11.00, 46),
(6, 11, 3, 11.00, 33),
(6, 12, 3, 11.00, 28),
(6, 14, 3, 11.00, 40),
(7, 2, 1, 11.00, 18),
(7, 3, 1, 11.00, 20),
(7, 5, 1, 11.00, 45),
(7, 6, 1, 11.00, 15),
(7, 7, 1, 11.00, 42),
(7, 8, 1, 11.00, 16),
(7, 2, 2, 11.50, 4),
(7, 3, 2, 11.50, 21),
(7, 5, 2, 11.50, 44),
(7, 6, 2, 11.50, 10),
(7, 7, 2, 11.50, 17),
(7, 8, 2, 11.50, 5),
(7, 2, 3, 12.00, 27),
(7, 3, 3, 12.00, 19),
(7, 5, 3, 12.00, 12),
(7, 6, 3, 12.00, 7),
(7, 7, 3, 12.00, 49),
(7, 8, 3, 12.00, 26),
(8, 2, 12, 13.00, 31),
(8, 5, 12, 13.00, 30),
(8, 6, 12, 13.00, 8),
(8, 2, 13, 13.50, 48),
(8, 5, 13, 13.50, 19),
(8, 6, 13, 13.50, 0),
(8, 2, 14, 13.50, 43),
(8, 5, 14, 13.50, 18),
(8, 6, 14, 13.50, 10),
(8, 2, 15, 14.00, 46),
(8, 5, 15, 14.00, 0),
(8, 6, 15, 14.00, 12),
(8, 2, 16, 14.00, 10),
(8, 5, 16, 14.00, 16),
(8, 6, 16, 14.00, 48),
(9, 2, 12, 17.00, 44),
(9, 5, 12, 17.00, 28),
(9, 6, 12, 17.00, 8),
(9, 7, 12, 17.00, 7),
(9, 13, 12, 17.00, 12),
(9, 2, 13, 17.50, 39),
(9, 5, 13, 17.50, 8),
(9, 6, 13, 17.50, 25),
(9, 7, 13, 17.50, 3),
(9, 13, 13, 17.50, 38),
(9, 2, 14, 17.50, 30),
(9, 5, 14, 17.50, 39),
(9, 6, 14, 17.50, 7),
(9, 7, 14, 17.50, 17),
(9, 13, 14, 17.50, 13),
(9, 2, 15, 18.00, 15),
(9, 5, 15, 18.00, 35),
(9, 6, 15, 18.00, 31),
(9, 7, 15, 18.00, 1),
(9, 13, 15, 18.00, 13),
(9, 2, 16, 18.00, 13),
(9, 5, 16, 18.00, 28),
(9, 6, 16, 18.00, 0),
(9, 7, 16, 18.00, 16),
(9, 13, 16, 18.00, 29),
(10, 2, 12, 10.00, 0),
(10, 5, 12, 10.00, 13),
(10, 6, 12, 10.00, 15),
(10, 7, 12, 10.00, 35),
(10, 10, 12, 10.00, 30),
(10, 12, 12, 10.00, 45),
(10, 15, 12, 10.00, 38),
(10, 2, 13, 10.50, 5),
(10, 5, 13, 10.50, 10),
(10, 6, 13, 10.50, 36),
(10, 7, 13, 10.50, 49),
(10, 10, 13, 10.50, 38),
(10, 12, 13, 10.50, 44),
(10, 15, 13, 10.50, 5),
(10, 2, 14, 10.50, 43),
(10, 5, 14, 10.50, 49),
(10, 6, 14, 10.50, 20),
(10, 7, 14, 10.50, 4),
(10, 10, 14, 10.50, 10),
(10, 12, 14, 10.50, 39),
(10, 15, 14, 10.50, 14),
(10, 2, 15, 11.00, 3),
(10, 5, 15, 11.00, 23),
(10, 6, 15, 11.00, 9),
(10, 7, 15, 11.00, 25),
(10, 10, 15, 11.00, 0),
(10, 12, 15, 11.00, 25),
(10, 15, 15, 11.00, 25),
(10, 2, 16, 11.00, 1),
(10, 5, 16, 11.00, 30),
(10, 6, 16, 11.00, 47),
(10, 7, 16, 11.00, 48),
(10, 10, 16, 11.00, 48),
(10, 12, 16, 11.00, 48),
(10, 15, 16, 11.00, 47),
(11, 2, 8, 30.00, 41),
(11, 5, 8, 30.00, 15),
(11, 15, 8, 30.00, 1),
(11, 2, 9, 33.00, 10),
(11, 5, 9, 33.00, 49),
(11, 15, 9, 33.00, 16),
(11, 2, 10, 37.00, 33),
(11, 5, 10, 37.00, 16),
(11, 15, 10, 37.00, 32),
(11, 2, 11, 40.00, 14),
(11, 5, 11, 40.00, 26),
(11, 15, 11, 40.00, 35),
(12, 1, 1, 7.00, 0),
(12, 2, 1, 7.00, 45),
(12, 3, 1, 7.00, 27),
(12, 5, 1, 7.00, 0),
(12, 16, 1, 7.00, 20),
(12, 17, 1, 7.00, 1),
(12, 1, 2, 7.50, 46),
(12, 2, 2, 7.50, 26),
(12, 3, 2, 7.50, 42),
(12, 5, 2, 7.50, 33),
(12, 16, 2, 7.50, 42),
(12, 17, 2, 7.50, 9),
(12, 1, 3, 8.00, 18),
(12, 2, 3, 8.00, 16),
(12, 3, 3, 8.00, 25),
(12, 5, 3, 8.00, 27),
(12, 16, 3, 8.00, 10),
(12, 17, 3, 8.00, 19),
(13, 3, 6, 60.00, 16),
(13, 5, 6, 60.00, 24),
(13, 3, 7, 80.00, 23),
(13, 5, 7, 80.00, 43),
(14, 3, 6, 70.00, 46),
(14, 5, 6, 70.00, 3),
(14, 3, 7, 90.00, 28),
(14, 5, 7, 90.00, 33),
(15, 2, 11, 0.00, 28);

-- --------------------------------------------------------

--
-- Structure de la table `tail_prod`
--

DROP TABLE IF EXISTS `tail_prod`;
CREATE TABLE IF NOT EXISTS `tail_prod` (
  `id_prod` int NOT NULL,
  `id_tail` int NOT NULL,
  `diff_prix_tail` float NOT NULL,
  PRIMARY KEY (`id_prod`,`id_tail`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `tail_prod`
--

INSERT INTO `tail_prod` (`id_prod`, `id_tail`, `diff_prix_tail`) VALUES
(3, 5, 0),
(3, 4, 0),
(3, 3, 0),
(3, 2, 0),
(3, 1, 0),
(4, 1, 0),
(4, 2, 1),
(4, 3, 2),
(4, 4, 3),
(4, 5, 4),
(5, 1, 0),
(5, 2, 0.5),
(5, 3, 1),
(6, 1, 0),
(6, 2, 0.5),
(6, 3, 1),
(7, 1, 0),
(7, 2, 0.5),
(7, 3, 1),
(8, 12, 0),
(8, 13, 0.5),
(8, 14, 0.5),
(8, 15, 1),
(8, 16, 1),
(9, 12, 0),
(9, 13, 0.5),
(9, 14, 0.5),
(9, 15, 1),
(9, 16, 1),
(10, 12, 0),
(10, 13, 0.5),
(10, 14, 0.5),
(10, 15, 1),
(10, 16, 1),
(11, 8, 0),
(11, 9, 3),
(11, 10, 7),
(11, 11, 10),
(12, 1, 0),
(12, 2, 0.5),
(12, 3, 1),
(13, 6, 0),
(13, 7, 20),
(14, 6, 0),
(14, 7, 20),
(1, 17, 0),
(2, 17, 0),
(15, 11, 0);

--
-- Déclencheurs `tail_prod`
--
DROP TRIGGER IF EXISTS `TAIL_PROD_BEFORE_INSERT`;
DELIMITER $$
CREATE TRIGGER `TAIL_PROD_BEFORE_INSERT` BEFORE INSERT ON `tail_prod` FOR EACH ROW BEGIN

DECLARE v_id_prod_existe, v_id_tail_existe, v_prix_correct BOOLEAN;

CALL id_prod_existe(NEW.id_prod, v_id_prod_existe);
CALL id_tail_existe(NEW.id_tail, v_id_tail_existe);
CALL verifier_prix(NEW.diff_prix_tail, v_prix_correct);

END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `TAIL_PROD_BEFORE_UPDATE`;
DELIMITER $$
CREATE TRIGGER `TAIL_PROD_BEFORE_UPDATE` BEFORE UPDATE ON `tail_prod` FOR EACH ROW BEGIN

DECLARE v_id_prod_existe, v_id_tail_existe, v_prix_correct BOOLEAN;

CALL id_prod_existe(NEW.id_prod, v_id_prod_existe);
CALL id_tail_existe(NEW.id_tail, v_id_tail_existe);
CALL verifier_prix(NEW.diff_prix_tail, v_prix_correct);

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id_us` int NOT NULL AUTO_INCREMENT,
  `nom_us` varchar(30) NOT NULL,
  `prenom_us` varchar(20) NOT NULL,
  `mel` varchar(100) NOT NULL,
  `date_naiss` date NOT NULL,
  `login` varchar(20) NOT NULL,
  `mdp` varchar(255) NOT NULL,
  `id_perm` int NOT NULL,
  PRIMARY KEY (`id_us`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id_us`, `nom_us`, `prenom_us`, `mel`, `date_naiss`, `login`, `mdp`, `id_perm`) VALUES
(7, 'admin', 'admin', 'admin@gmail.com', '2005-03-14', 'admin', '$2y$10$dTT23nTVJfEUkp.9stMO8.W6ynbfnPTEyMkTdtolpbv7RRTefpxAe', 1),
(11, 'Falschenbuhl', 'Rémi', 'remi.falschenbuhl@yahoo.fr', '2003-12-04', 'remiF', 'rOo9.RCDnsGfY', 2),
(16, 'Philippe', 'Kévin', 'kph@gmail.com', '2003-12-04', 'new', '9l9KCmTBMCeDo', 2),
(18, 'Laroche', 'Pierre', 'laroche5@univ-lorraine.fr', '1991-02-24', 'laroche5', 'Mw6FchtZ8zKKY', 2);

--
-- Déclencheurs `user`
--
DROP TRIGGER IF EXISTS `USER_BEFORE_INSERT`;
DELIMITER $$
CREATE TRIGGER `USER_BEFORE_INSERT` BEFORE INSERT ON `user` FOR EACH ROW BEGIN

DECLARE v_id_perm_existe, v_login_non_existe, v_date_conforme,
v_mail_non_existe BOOLEAN;

CALL id_perm_existe(NEW.id_perm, v_id_perm_existe);
CALL login_non_existe(NEW.login, v_login_non_existe);
CALL mail_non_existe(NEW.mel,
v_mail_non_existe);
CALL verifier_date(NEW.date_naiss, v_date_conforme);


END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `USER_BEFORE_UPDATE`;
DELIMITER $$
CREATE TRIGGER `USER_BEFORE_UPDATE` BEFORE UPDATE ON `user` FOR EACH ROW BEGIN

DECLARE v_id_perm_existe, v_login_non_existe, v_date_conforme BOOLEAN;

CALL id_perm_existe(NEW.id_perm, v_id_perm_existe);
#CALL login_non_existe(NEW.login, v_login_non_existe);
#CALL verifier_date(NEW.date_naiss, v_date_conforme);

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la vue `select_commandes`
--
DROP TABLE IF EXISTS `select_commandes`;

DROP VIEW IF EXISTS `select_commandes`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `select_commandes`  AS SELECT `c`.`id_com` AS `id_com`, `c`.`id_us` AS `id_us`, `dc`.`id_prod` AS `id_prod`, `dc`.`id_col` AS `id_col`, `dc`.`id_tail` AS `id_tail`, `c`.`date_com` AS `date_com`, `dc`.`qte_com` AS `qte_com`, `dc`.`prix_total` AS `prix_total` FROM (((`commande` `c` join `detail_com` `dc` on((`dc`.`id_com` = `c`.`id_com`))) join `couleur` `co` on((`dc`.`id_col` = `co`.`id_col`))) join `taille` `t` on((`dc`.`id_tail` = `t`.`id_tail`))) ORDER BY `c`.`id_us` ASC, `c`.`id_com` ASC, `dc`.`id_prod` ASC, `dc`.`id_col` ASC, `dc`.`id_tail` ASC ;

-- --------------------------------------------------------

--
-- Structure de la vue `select_paniers`
--
DROP TABLE IF EXISTS `select_paniers`;

DROP VIEW IF EXISTS `select_paniers`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `select_paniers`  AS SELECT `pa`.`id_us` AS `id_us`, `p`.`id_prod` AS `id_prod`, `p`.`stock` AS `stock`, `p`.`nom_prod` AS `nom_prod`, `p`.`id_cat` AS `id_cat`, `p`.`nom_cat` AS `nom_cat`, `p`.`id_col` AS `id_col`, `p`.`nom_col` AS `nom_col`, `p`.`id_tail` AS `id_tail`, `p`.`nom_tail` AS `nom_tail`, `p`.`path_img` AS `path_img`, `p`.`prix_unit` AS `prix_unit`, `pa`.`qte_pan` AS `qte_pan`, (`pa`.`qte_pan` * `p`.`prix_unit`) AS `prix_total` FROM (`panier` `pa` join (select `sp`.`id_prod` AS `id_prod`,`sp`.`nom_prod` AS `nom_prod`,`sp`.`id_cat` AS `id_cat`,`sp`.`nom_cat` AS `nom_cat`,`sp`.`id_col` AS `id_col`,`sp`.`nom_col` AS `nom_col`,`sp`.`id_tail` AS `id_tail`,`sp`.`nom_tail` AS `nom_tail`,`sp`.`path_img` AS `path_img`,`sp`.`prix_unit` AS `prix_unit`,`sp`.`stock` AS `stock` from `select_produits` `sp`) `p` on(((`pa`.`id_prod` = `p`.`id_prod`) and (`pa`.`id_col` = `p`.`id_col`) and (`pa`.`id_tail` = `p`.`id_tail`)))) ;

-- --------------------------------------------------------

--
-- Structure de la vue `select_produits`
--
DROP TABLE IF EXISTS `select_produits`;

DROP VIEW IF EXISTS `select_produits`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `select_produits`  AS SELECT `p`.`id_prod` AS `id_prod`, `p`.`nom_prod` AS `nom_prod`, `p`.`description` AS `description`, `p`.`sku` AS `sku`, coalesce(`tcp`.`stock`,0) AS `stock`, `p`.`stock_quantity` AS `stock_general`, `ca`.`id_cat` AS `id_cat`, `ca`.`nom_cat` AS `nom_cat`, `co`.`id_col` AS `id_col`, `co`.`nom_col` AS `nom_col`, `t`.`id_tail` AS `id_tail`, `t`.`nom_tail` AS `nom_tail`, `cp`.`path_img` AS `path_img`, round((((coalesce(`tcp`.`prix`,`p`.`prix_base`) + coalesce(`cp`.`diff_prix_col`,0)) + coalesce(`tp`.`diff_prix_tail`,0)) * 1.2),2) AS `prix_unit` FROM ((((((`produit` `p` left join `col_prod` `cp` on((`cp`.`id_prod` = `p`.`id_prod`))) left join `tail_prod` `tp` on((`tp`.`id_prod` = `p`.`id_prod`))) join `categorie` `ca` on((`ca`.`id_cat` = `p`.`id_cat`))) left join `couleur` `co` on((`co`.`id_col` = `cp`.`id_col`))) left join `taille` `t` on((`t`.`id_tail` = `tp`.`id_tail`))) left join `taille_col_prod` `tcp` on(((`tcp`.`id_prod` = `p`.`id_prod`) and (`tcp`.`id_col` = `co`.`id_col`) and (`tcp`.`id_taille` = `t`.`id_tail`)))) ORDER BY `p`.`nom_prod` ASC, `ca`.`nom_cat` ASC, `co`.`nom_col` ASC, `t`.`nom_tail` ASC ;

-- --------------------------------------------------------

--
-- Structure de la vue `select_users`
--
DROP TABLE IF EXISTS `select_users`;

DROP VIEW IF EXISTS `select_users`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `select_users`  AS SELECT `u`.`id_us` AS `id_us`, `u`.`nom_us` AS `nom_us`, `u`.`prenom_us` AS `prenom_us`, `u`.`mel` AS `mel`, `u`.`date_naiss` AS `date_naiss`, `u`.`login` AS `login`, `u`.`mdp` AS `mdp`, `p`.`id_perm` AS `id_perm`, `p`.`nom_perm` AS `nom_perm` FROM (`user` `u` join `permission` `p` on((`p`.`id_perm` = `u`.`id_perm`))) ORDER BY `p`.`id_perm` ASC, `u`.`nom_us` ASC, `u`.`prenom_us` ASC ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
