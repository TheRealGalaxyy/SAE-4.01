<?php declare(strict_types=1);

require_once "../bdd/connexion.php";
require_once 'header.php';

$json = [];

// Requête SQL modifiée pour vérifier la date de la commande
$query = "
SELECT 
    p.nom_tail, 
    p.nom_col, 
    p.nom_prod, 
    p.path_img, 
    p.prix_unit, 
    p.description, 
    c.qte_com,
    COALESCE(s.reduction, 0) AS reduction
FROM 
    SELECT_COMMANDES c
INNER JOIN 
    SELECT_PRODUITS p ON p.id_prod = c.id_prod AND p.id_col = c.id_col AND p.id_tail = c.id_tail
LEFT JOIN 
    SOLDE s ON p.id_prod = s.id_prod 
        AND c.date_com BETWEEN s.date_deb AND s.date_fin
WHERE 
    c.id_us = :id_us 
    AND c.id_com = :id_com
";

$res = $db->prepare($query);
$res->bindParam(":id_us", $_POST["id_us"]);
$res->bindParam(":id_com", $_POST["id_com"]);

try {
    $res->execute();
    $json["status"] = "success";
    $json["message"] = "Récupération réussie";
    $json["data"] = $res->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $exception) {
    $json["status"] = "error";
    $json["message"] = $exception->getMessage();
}

echo json_encode($json);
