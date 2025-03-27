<?php declare(strict_types=1);

require_once "../bdd/connexion.php";
require_once 'header.php';

try {

    $id_us = $_POST["id_us"];
    $adresse = $_POST['adresse']; 
    $ville = $_POST['ville']; 
    $codePostal = $_POST['codePostal'];
    $telephone = $_POST['telephone']; 

    $query = "SELECT * FROM PANIER WHERE id_us = :id_us";
    $res = $db->prepare($query);
    $res->bindParam(":id_us", $id_us);
    $res->execute();
    $panier = $res->fetchAll(PDO::FETCH_ASSOC);

    $query = "INSERT INTO COMMANDE
              (`id_com`, `date_com`, `id_us`, `adresse`, `ville`, `codePostal`, `telephone`)
              VALUES
              (NULL, NOW(), :id_us, :adresse, :ville, :codePostal, :telephone)";
    $res = $db->prepare($query);
    $res->bindParam(":id_us", $id_us);
    $res->bindParam(":adresse", $adresse);
    $res->bindParam(":ville", $ville);
    $res->bindParam(":codePostal", $codePostal);
    $res->bindParam(":telephone", $telephone);
    $res->execute();

    $query = "SELECT MAX(id_com) as id_com FROM COMMANDE";
    $res = $db->prepare($query);
    $res->execute();
    $id_com = $res->fetchAll(PDO::FETCH_ASSOC)[0]["id_com"];

    for ($i = 0; $i < count($panier); $i++) {

        $query = "UPDATE `TAILLE_COL_PROD` 
                  SET `stock` = `stock` - :qte_pan
                  WHERE `TAILLE_COL_PROD`.`id_prod` = :id_prod
                  AND `TAILLE_COL_PROD`.`id_col` = :id_col
                  AND `TAILLE_COL_PROD`.`id_taille` = :id_tail";
        $res = $db->prepare($query);
        $res->bindParam(":id_prod", $panier[$i]["id_prod"]);
        $res->bindParam(":id_col", $panier[$i]["id_col"]);
        $res->bindParam(":id_tail", $panier[$i]["id_tail"]);
        $res->bindParam(":qte_pan", $panier[$i]["qte_pan"]);
        $res->execute();

        $query = "UPDATE `produit` 
                  SET `stock_quantity` = `stock_quantity` - :qte_pan
                  WHERE `produit`.`id_prod` = :id_prod";
        $res = $db->prepare($query);
        $res->bindParam(":id_prod", $panier[$i]["id_prod"]);
        $res->bindParam(":qte_pan", $panier[$i]["qte_pan"]);
        $res->execute();

        $query = "SELECT p.prix_unit, COALESCE(s.reduction, 0) AS reduction
            FROM SELECT_PRODUITS p
            LEFT JOIN SOLDE s ON p.id_prod = s.id_prod
            AND NOW() BETWEEN s.date_deb AND s.date_fin
            WHERE p.id_prod = :id_prod
            AND p.id_col = :id_col
            AND p.id_tail = :id_tail";

        $res = $db->prepare($query);
        $res->bindParam(":id_prod", $panier[$i]["id_prod"]);
        $res->bindParam(":id_col", $panier[$i]["id_col"]);
        $res->bindParam(":id_tail", $panier[$i]["id_tail"]);
        $res->execute();
        $result = $res->fetch(PDO::FETCH_ASSOC);

        $prix_unit = $result["prix_unit"];
        $reduction = $result["reduction"];

        if ($reduction != 0) {
            $prix_unit = $prix_unit * (1 - ($reduction / 100));
        }

        $prix_total = $prix_unit * $panier[$i]["qte_pan"];

        $query = "INSERT INTO DETAIL_COM
                  (`id_com`, `id_prod`, `id_col`, `id_tail`, `qte_com`, `prix_total`) 
                  VALUES 
                  (:id_com, :id_prod, :id_col, :id_tail, :quantite, :prix_total)";
        $res = $db->prepare($query);
        $res->bindParam(":id_com", $id_com);
        $res->bindParam(":id_prod", $panier[$i]["id_prod"]);
        $res->bindParam(":id_col", $panier[$i]["id_col"]);
        $res->bindParam(":id_tail", $panier[$i]["id_tail"]);
        $res->bindParam(":quantite", $panier[$i]["qte_pan"]);
        $res->bindParam(":prix_total", $prix_total);
        $res->execute();

        $json["status"] = "success";
        $json["message"] = "Commande effectuée";
    }
} catch (Exception $exception) {
    $json["status"] = "error";
    $json["message"] = $exception->getMessage();
}

echo json_encode($json);
?>
