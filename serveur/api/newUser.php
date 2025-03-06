<?php declare(strict_types=1);

require_once "../bdd/connexion.php";
require_once 'header.php';

$json = [];

do{
    $password = password_hash($_POST["mdp"], PASSWORD_BCRYPT);
}while($password == "*0");

$query =
"INSERT INTO USER
(`id_us`, `nom_us`, `prenom_us`, `mel`, `date_naiss`, `login`, `mdp`, `id_perm`)
VALUES
(NULL, :nom, :prenom, :mel, :date_naiss, :login, :mdp, 2)";

$res = $db->prepare($query);

$res->bindParam(':nom', $_POST['nom']);
$res->bindParam(':prenom', $_POST['prenom']);
$res->bindParam(':mel', $_POST['mel']);
$res->bindParam(':date_naiss', $_POST['date_naiss']);
$res->bindParam(':login', $_POST['login']);
$res->bindParam(':mdp', $password);

try {
    $res->execute();
    $json["status"] = "success";
    $json["message"] = "Insertion réussie";

} catch(Exception $exception) {
    $json["status"] = "error";
    $json["message"] = $exception->getMessage();
}


echo json_encode($json);