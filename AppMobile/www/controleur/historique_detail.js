import { cookieValue } from "./function.js";

// Retour sur l'historique
let btn = document.getElementById("retour");
btn.addEventListener("click", (event) => {
  window.location.href = "historique.html";
});

async function getCommande(id_com) {
  // Fonction qui récupère les données de la commande en fonction de l'id de la commande & de l'id de l'utilisateur
  const body = new URLSearchParams({
    id_us: cookieValue, // Remplacer par 3 pour tester
    id_com: id_com,
  });
  const response = await fetch(
    "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/getCommande.php",
    { method: "POST", body }
  );
  const { data } = await response.json();
  console.log("Données reçues :", data);
  return data;
}

async function recupDonnees() {
  // Récupère les données de la commande et des produits commandés
  const id_com = new URLSearchParams(window.location.search).get("id_com");
  const commande = await getCommande(id_com);
  afficherLesProduits(commande);
}

async function afficherLesProduits(produits) {
  // Fonction qui affiche les produits commandés avec leurs noms, catégories et descriptions, ajoute le même css que sur la page d'accueil
  const produitsDiv = document.querySelector(".produitsDet");
  let prixT = 0;
  produits.forEach(
    ({ nom_prod, description, path_img, prix_unit, qte_com, reduction }) => {
      const produitDiv = document.createElement("div");
      produitDiv.classList.add("produit");
      let path = path_img
        ? "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/img/articles/" +
          path_img
        : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

      const ancienPrix = prix_unit * qte_com;

      if (reduction != 0) {
        prix_unit *= 1 - reduction / 100;
      }

      let prix = prix_unit * qte_com;
      prixT += prix;

      produitDiv.innerHTML = `
            <img id="img_prod" src="${path}" style="width:10vw; height:auto; display:block; margin: 10px auto;">
            <div class="detail-title">
              <h2>${nom_prod}</h2>
              <p>${description}</p>
            </div>
            <div>
              ${
                reduction != 0
                  ? `<p><span style="text-decoration: line-through; color: red;">${ancienPrix.toFixed(
                      2
                    )}€</span> ${prix.toFixed(2)}€</p>`
                  : `<p>Prix : ${prix.toFixed(2)}€</p>`
              }
              <p>Quantité : ${qte_com}</p>
            </div>
        `;
      produitDiv.classList.add("descProduit");
      produitsDiv.appendChild(produitDiv);
    }
  );
  const produitDiv = document.createElement("div");
  produitDiv.innerHTML += `
            <h2>Prix total de la commande : ${prixT.toFixed(2)}€</h2>
        `;
  produitsDiv.appendChild(produitDiv);
}

recupDonnees();
