import { cookieValue } from "./function.js";

if (cookieValue === undefined) {
  window.location.href = "login.html"; //Si le cookie est vide, l'utilisateur n'est pas connecté donc on retourne à l'accueil.
}

async function getPanier(id_us) {
  return await fetch(
    "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/getPanier.php",
    {
      method: "POST",
      body: new URLSearchParams({
        id_us: id_us,
      }),
    }
  )
    //.then(reponse => console.log(reponse.json()))
    .then((reponse) => reponse.json());
}

async function getProduit(id_produit) {
  return await fetch(
    "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/getProduit.php",
    {
      method: "POST",
      body: new URLSearchParams({
        id_prod: id_produit,
      }),
    }
  );
}

function findId(id, array) {
  let test = null;
  array.forEach((element) => {
    if (element.id == id) {
      test = element;
    }
  });
  return test;
}

function delButton(id) {
  const test = findId(id, document.querySelectorAll(".del"));

  test.addEventListener("click", (e) => {
    const id_prod = e.target.id.split("|")[0];
    const id_col = e.target.id.split("|")[1];
    const id_tail = e.target.id.split("|")[2];
    // console.log(e.target.id)
    // console.log(id_prod, id_col, id_tail);
    fetch(
      "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/delPanier.php",
      {
        method: "POST",
        body: new URLSearchParams({
          id_us: id_us,
          id_prod: id_prod,
          id_col: id_col,
          id_tail: id_tail,
        }),
      }
    ).then((response) => {
      response.json().then((json) => {
        if (json.status !== "success") {
          console.log("suppression échouée");
          return;
        }
        console.log("suppression réussie");
        appelPanier();
      });
    });
  });
}

function modifCouleur(id) {
  document
    .getElementById(`couleur${id}`)
    .addEventListener("change", (e) => ChangerInfoProd(id, e));
}

function modifQuantite(id, stock) {
  const quantite = findId(id, document.querySelectorAll(".qte"));
  let previousValue = quantite.value; // Sauvegarde de la valeur actuelle

  quantite.addEventListener("change", (e) => {
    if (e.target.value > stock) {
      alert("La quantité demandée est supérieure au stock disponible");
      e.target.value = previousValue; // Rétablir la valeur précédente
    } else if (e.target.value <= 0) {
      alert("La quantité demandée est invalide");
      e.target.value = previousValue; // Rétablir la valeur précédente
    } else {
      previousValue = e.target.value; // Mettre à jour la valeur précédente
      ChangerInfoProd(id, e);
    }
  });
}

function modifTaille(id) {
  document
    .getElementById(`taille${id}`)
    .addEventListener("change", (e) => ChangerInfoProd(id, e));
}

function ChangerInfoProd(id, e) {
  let id_prod = e.target.id.split("|")[0];
  if (id_prod.length > 1) {
    id_prod = id_prod.replace(/^\D+/g, ""); // Supprime tous les caractères non numériques au début
  }
  console.log("e.target = ", e.target.id.split("|"));
  console.log(id_prod);
  const id_col = e.target.id.split("|")[1];
  const id_tail = e.target.id.split("|")[2];
  const qte_pan = document.getElementById(id).value;
  let new_id_col = null;
  let new_id_tail = null;
  document
    .getElementById(`couleur${id}`)
    .querySelectorAll("option")
    .forEach((element) => {
      if (element.selected) {
        new_id_col = element.id;
      }
    });
  if (document.getElementById(`taille${id}`) === null) {
    new_id_tail = 17;
  } else {
    document
      .getElementById(`taille${id}`)
      .querySelectorAll("option")
      .forEach((element) => {
        if (element.selected) {
          new_id_tail = element.id;
        }
      });
  }
  // console.log("id_us",id_us);
  // console.log("id_prod",id_prod);
  // console.log("id_col",id_col);
  // console.log("id_tail",id_tail);
  // console.log("qte_pan",qte_pan);
  // console.log("new_id_col",new_id_col);
  // console.log("new_id_tail",new_id_tail);
  fetch(
    "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/setPanier.php",
    {
      method: "POST",
      body: new URLSearchParams({
        id_us: id_us,
        id_prod: id_prod,
        id_col: id_col,
        id_tail: id_tail,
        qte_pan: qte_pan,
        new_id_col: new_id_col,
        new_id_tail: new_id_tail,
      }),
    }
  ).then((response) => {
    response.json().then((json) => {
      //console.log(json);
      if (json.status !== "success") {
        alert("modif échouée");
        appelPanier();
        return;
      }
      console.log("modif réussie");
      document.getElementById("panier").innerHTML = "";
      appelPanier();
    });
  });
}

function rempliSelect(select, array, arrayId, def) {
  array = array.filter((value, index) => array.indexOf(value) === index);
  arrayId = arrayId.filter((value, index) => arrayId.indexOf(value) === index);
  array.forEach((element) => {
    const option = document.createElement("option");
    option.id = arrayId[array.indexOf(element)];
    if (element == def) {
      option.selected = true;
    }
    option.value = element;
    option.innerHTML = element;
    select.appendChild(option);
  });
}

function casNulltaill(id, panier) {
  return panier === 17;
}

async function getSolde(id_prod) {
  return fetch(
    "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/getSolde.php",
    {
      method: "POST",
      body: new URLSearchParams({ id_prod: id_prod }),
    }
  )
    .then((response) => response.json())
    .then((data) => (data.data.length > 0 ? data.data[0]["reduction"] : null))
    .catch((error) => {
      console.log(error);
      return null;
    });
}

async function affichePanier(
  panier,
  qte,
  taille,
  couleur,
  couleurId,
  tailleId
) {
  const prix = document.getElementById("prixTotal");
  const panierDiv = document.createElement("div");
  panierDiv.classList.add("panierElement");
  const id = `${panier.id_prod}|${panier.id_col}|${panier.id_tail}`;

  let stockAffiche = "";
  let ruptureAffiche = "color:red";

  if (panier.stock <= 0) {
    stockAffiche = "display:none";
  } else {
    ruptureAffiche = "display:none";
  }

  const solde = await getSolde(panier.id_prod);
  let prixAffiche = panier.prix_unit;
  let prixReduced = null;
  let pourcentageReduction = 0;

  if (solde) {
    prixReduced = panier.prix_unit * (1 - solde / 100);
    pourcentageReduction = solde;
  }

  panierDiv.innerHTML = `
        <center><img id="img${id}" src="https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/img/articles/${
    panier.path_img
  }" alt="image du produit"></center>
        <p>${panier.nom_prod}</p>
        <div id="select">
            <select  id="couleur${id}"></select>
            ${
              casNulltaill(id, panier.id_tail)
                ? ""
                : `<select id="taille${id}"></select>`
            }
        </div> 
        <center>
            <div id="input_qte">Quantité : <input class="qte" id="${id}" type="number" value="${qte}"></div>
            
            <!-- Affichage du prix avec réduction si applicable -->
            <p id="prix">
                Prix : ${
                  prixReduced
                    ? `<span style="text-decoration: line-through; color: red;">${
                        Math.round(panier.prix_unit * 100) / 100
                      }€</span> 
                        ${Math.round(prixReduced * 100) / 100}€ 
                        <span style="color: red;">(-${pourcentageReduction}%)</span>`
                    : Math.round(prixAffiche * 100) / 100
                }
            </p>

            <p id="stock" style="${stockAffiche}">Stock : <span id="stockValue">${
    panier.stock
  } unités</p>
            <p id="rupture" style="${ruptureAffiche}">Stock : RUPTURE DE STOCK</p>
            <div id="button">
                <button class="del form_button" id="${id}">Supprimer</button>
            </div>
        </center>
        `;

  document.getElementById("panier").appendChild(panierDiv);

  delButton(id);
  modifCouleur(id);
  modifQuantite(id, panier.stock);
  if (panier.id_tail !== 17) {
    modifTaille(id);
  }
  rempliSelect(
    document.getElementById(`couleur${id}`),
    couleur,
    couleurId,
    panier.nom_col
  );
  panier.id_tail !== 17
    ? rempliSelect(
        document.getElementById(`taille${id}`),
        taille,
        tailleId,
        panier.nom_tail
      )
    : casNulltaill(id, panier.id_tail);

  prix.innerHTML =
    Math.round(
      (parseFloat(prix.innerHTML) + (prixReduced || prixAffiche) * qte) * 100
    ) / 100;

  document.getElementById(`couleur${id}`).addEventListener("change", (e) => {
    getProduit(panier.id_prod).then((response) => {
      response.json().then((BDDproduit) => {
        BDDproduit.data.forEach((element) => {
          if (element.nom_col === e.target.value) {
            document.getElementById(
              `img${id}`
            ).src = `https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/img/articles/${element.path_img}`;
          }
        });
      });
    });
  });
}

let produitsDansPanier = [];

async function appelPanier() {
  document.getElementById("panier").innerHTML = "";
  document.getElementById("titre").innerHTML = "";
  document.getElementById("prixTotal").innerHTML = 0;
  getPanier(id_us).then((panier) => {
    produitsDansPanier = panier.data;
    const section = document.createElement("section");
    section.classList.add("accueil");
    const titre = document.createElement("h1");
    if (panier.data.length !== 0) {
      document.getElementById("footer").style.display = "block";
      titre.innerHTML = "Votre panier";
      section.appendChild(titre);
      document.getElementById("titre").appendChild(section);
    } else {
      document.getElementById("footer").style.display = "none";
      titre.innerHTML = "Votre panier est vide";
      section.appendChild(titre);
      document.getElementById("titre").appendChild(section);
      document.getElementById("titre").id = "accueil";
    }
    panier.data.forEach((produit) => {
      getProduit(produit.id_prod).then((response) => {
        let couleur = [];
        let couleurId = [];
        let taille = [];
        let tailleId = [];

        response.json().then((BDDproduits) => {
          BDDproduits.data.forEach((BDDproduit) => {
            if (BDDproduit.id_prod == produit.id_prod) {
              couleur.push(BDDproduit.nom_col);
              taille.push(BDDproduit.nom_tail);
              couleurId.push(BDDproduit.id_col);
              tailleId.push(BDDproduit.id_tail);
            }
          });
          BDDproduits.data.forEach((BDDproduit) => {
            if (
              BDDproduit.id_col == produit.id_col &&
              BDDproduit.id_tail == produit.id_tail
            ) {
              affichePanier(
                BDDproduit,
                produit.qte_pan,
                taille,
                couleur,
                couleurId,
                tailleId
              );
            }
          });
        });
      });
    });
  });
}

// Attach payer to the window object
window.payer = function () {
  const infosLivraison = JSON.parse(localStorage.getItem("infosLivraison"));

  const adresse = infosLivraison.adresse;
  const ville = infosLivraison.ville;
  const codePostal = infosLivraison.codePostal;
  const telephone = infosLivraison.telephone;

  fetch(
    "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/payer.php",
    {
      method: "POST",
      body: new URLSearchParams({
        id_us: id_us,
        adresse: adresse,
        ville: ville,
        codePostal: codePostal,
        telephone: telephone,
      }),
    }
  ).then((reponse) => {
    reponse.json().then((data) => {
      if (data.status == "success") {
        console.log("paiement réussi");
        fetch(
          "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/clearPanier.php",
          {
            method: "POST",
            body: new URLSearchParams({
              id_us: id_us,
            }),
          }
        ).then((response) => {
          response.json().then((data) => {
            if (data.status == "success") {
              console.log("suppression réussie");
              appelPanier();
              window.location.href = "accueil.html";
            } else {
              console.log("suppression échouée");
            }
          });
        });
      } else {
        console.log("paiement échoué");
      }
    });
  });
};

document
  .getElementById("boutonPaiement")
  .addEventListener("click", function (event) {
    event.preventDefault();
    let panierValide = true;

    produitsDansPanier.forEach((produit) => {
      if (produit.qte_pan <= 0) {
        panierValide = false;
        alert("La quantité de '" + produit.nom_prod + "' est invalide");
      } else if (produit.stock <= 0) {
        panierValide = false;
        alert("La produit '" + produit.nom_prod + "' est en rupture de stock");
      } else if (produit.stock - produit.qte_pan < 0) {
        panierValide = false;
        alert(
          "La quantité de '" +
            produit.nom_prod +
            "' est trop élevée par rapport au stock disponible"
        );
      }
    });

    if (panierValide) {
      let modal = new bootstrap.Modal(document.getElementById("exampleModal"));
      modal.show();
    }
  });

const id_us = cookieValue; // A changer en cookieValue

appelPanier();

document
  .getElementById("confirmerCommande")
  .addEventListener("click", function () {
    const adresse = document.getElementById("adresse").value;
    const ville = document.getElementById("ville").value;
    const codePostal = document.getElementById("codePostal").value;
    const telephone = document.getElementById("telephone").value;

    let erreurMessage = "";

    if (!adresse) {
      erreurMessage += "L'adresse est requise.\n";
    }

    if (!ville) {
      erreurMessage += "La ville est requise.\n";
    }

    const codePostalRegex = /^[0-9]{5}$/;
    if (!codePostal || !codePostal.match(codePostalRegex)) {
      erreurMessage += "Le code postal doit être un nombre de 5 chiffres.\n";
    }

    const telephoneRegex = /^[0-9]{10}$/;
    if (!telephone || !telephone.match(telephoneRegex)) {
      erreurMessage += "Le téléphone doit être composé de 10 chiffres.\n";
    }

    if (erreurMessage) {
      document.getElementById("erreurMessage").innerText = erreurMessage;
      document.getElementById("erreurMessage").style.display = "block";
    } else {
      document.getElementById("erreurMessage").style.display = "none";

      const infosLivraison = {
        adresse: adresse,
        ville: ville,
        codePostal: codePostal,
        telephone: telephone,
      };
      localStorage.setItem("infosLivraison", JSON.stringify(infosLivraison));

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("exampleModal")
      );
      modal.hide();

      $("#exampleModalPaypal").modal("show");
    }
  });

document.getElementById("modifierInfos").addEventListener("click", function () {
  const modalPaypal = bootstrap.Modal.getInstance(
    document.getElementById("exampleModalPaypal")
  );
  modalPaypal.hide();

  const modalLivraison = new bootstrap.Modal(
    document.getElementById("exampleModal")
  );
  modalLivraison.show();
});
