import { cookieValue } from "./function.js";

if (cookieValue === undefined) {
  window.location.href = "accueil.html"; //Si le cookie est vide, l'utilisateur n'est pas connecté donc on retourne à l'accueil.
}

import { imprimerUnProduit } from "./accueil.js";

const id_us = cookieValue; // A changer en cookieValue

async function getFavori(id_us) {
  return await fetch("http://192.168.1.97/SAE-4.01/serveur/api/getFavori.php", {
    method: "POST",
    body: new URLSearchParams({
      id_us: id_us,
    }),
  })
    .then((response) =>
      response.json().then((json) => afficherFavoris(json.data))
    )
    .catch((error) => console.log(error));
}

function afficherFavoris(produits) {
  //console.log(produits);
  const listeFav = document.querySelector(".listeFav");
  // console.log(produits);

  produits.forEach((produit) => {
    const produitElement = imprimerUnProduit(produit);

    listeFav.appendChild(produitElement);
    produitElement.shadowRoot.querySelector("label").querySelector("img").src =
      "img/icones/star_plein.png";
  });
}

function btn() {
  const produits = document.querySelectorAll(".listeFav produit-generique");
  produits.forEach((produit) => {
    const button = produit.shadowRoot.querySelector("input");
    button.addEventListener("click", (event) => {
      //console.log("ptdr mais c'est quoi ce truc");
      // console.log(event.target.id);
      fetch("http://192.168.1.97/SAE-4.01/serveur/api/delFavori.php", {
        method: "POST",
        body: new URLSearchParams({
          id_us: id_us,
          id_prod: event.target.id.substring(2),
        }),
      }).then(() => {
        document.querySelector(".listeFav").innerHTML = "";

        getFavori(id_us).then(() => {
          btn();
        });
      });
    });
  });
}

getFavori(id_us).then(() => {
  //console.log("ok");
  btn();
});

document.getElementById("clear").addEventListener("click", () => {
  fetch("http://192.168.1.97/SAE-4.01/serveur/api/clearFavori.php", {
    method: "POST",
    body: new URLSearchParams({
      id_us: id_us,
    }),
  }).then(() => {
    document.querySelector(".listeFav").innerHTML = "<p>Aucun favori</p>";
  });
});
