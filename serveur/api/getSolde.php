<?php declare(strict_types=1);

require_once "../bdd/connexion.php";
require_once 'header.php';

$json = [];

$query =
    "SELECT * 
FROM SOLDE 
WHERE id_prod = :id_prod
AND CURDATE() BETWEEN date_deb AND date_fin";

$res = $db->prepare($query);
$res->bindParam(":id_prod", $_POST["id_prod"]);

try {
    $res->execute();
    $json["status"] = "success";
    $json["message"] = "Sélection réussie";
    $json["data"] = $res->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $exception) {
    $json["status"] = "error";
    $json["message"] = $exception->getMessage();
    $json["data"] = [];
}

echo json_encode($json);
