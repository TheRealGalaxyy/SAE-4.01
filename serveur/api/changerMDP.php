<?php declare(strict_types=1);

require_once "../bdd/connexion.php";
require_once 'header.php';

$json = [];

try {
    $password = password_hash($_POST["mdp"], PASSWORD_BCRYPT);

    $query =
        "UPDATE `USER` SET `mdp` = :mdp_us 
    WHERE `id_us` = :id_us";

    $res = $db->prepare($query);

    $res->bindParam(':mdp_us', $password);
    $res->bindParam(':id_us', $_POST['id_us']);

    try {
        $res->execute();
        $json["status"] = "success";
        $json["message"] = "Modification réussie";

    } catch (Exception $exception) {
        $json["status"] = "error";
        $json["message"] = $exception->getMessage();
    }

} catch (Exception $exception) {
    $json["status"] = "error";
    $json["message"] = $exception->getMessage();
}

echo json_encode($json);