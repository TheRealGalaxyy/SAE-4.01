import { cookieValue, isConnected } from "./function.js";
import { ajouterFavori, supprimerFavori, getFavori } from "./accueil.js";
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const id_col = urlParams.get("id_col");
const id_us = cookieValue;

class ProduitDetail extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
    <style>
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type=number] {
        -moz-appearance:textfield;
        width: 50px;
        background-color: whitesmoke;
        border: none;
        text-align: center;
    }
    input[type=button] {
        background-color: whitesmoke;
        color: black;
        border: none;
        padding: 10px 20px;
        margin: 8px 0;
        cursor: pointer;
        font-size: medium;
        border-radius: 4px;
    }
    .produitDetail {
        margin: 30px auto;
        text-align: center;
        background-color: #5f8755;
        box-shadow: 5px 5px green;
        max-width: 800px;
        border-radius: 10px;
        padding: 15px;
    }
    .main_info_prod, .sub_info_prod {
        display: grid;
        grid-template-columns: repeat(auto-fill, 380px);
        column-gap: 10px;
    }
    @media screen and (max-width: 840px) {
        .produitDetail {
            margin: 20px;
        }
        .main_info_prod, .sub_info_prod {
            grid-template-columns: none;
        }
    }
    .img_prod {
        max-width: 100%;
        border-radius: 4px;
    }
    #taille, #couleur {
        display: inline-block;
    }
    .etoile{
        width: 20px;
        height: 20px;
    }
    .etoile, .prix {
        display: inline-block;
    }
    .etoile, .prix, label {
        vertical-align: middle;
    }
    .checkbox{
        display: none;
    }
    .solde {
        display: inline-block;
        padding: 3px 8px;
        background-color: red;
        color: white;
        font-weight: bold;
        border-radius: 5px;
        margin-left: 10px;
    }
    .prix-original {
        text-decoration: line-through;
        color: white;
        margin-right: 5px;
    }
    .prix-original-total {
        text-decoration: line-through;
        color: white;
        margin-right: 5px;
    }
        .erreur {
        color: red;
        display: none;
        font-weight: bold;
  }
    </style>
    <div class="produitDetail">
    <input type="checkbox" class="checkbox" id="ch${id}" ${this.getAttribute(
      "checked"
    )}>
    <div class="flex">
        <label for="ch${id}"><img class="etoile" src='${this.getAttribute(
      "fav"
    )}'/></label>
    </div>
    <div class="solde" style="${this.getAttribute(
      "soldeAffiche"
    )}">EN SOLDE <span class="solde-valeur">-${this.getAttribute(
      "soldeValeur"
    )}%</span></div>
    <center><h1>${this.getAttribute("name")}</h1></center>
    <span class="main_info_prod">
        <center><img class="img_prod" alt="Image produit" src="${this.getAttribute(
          "path_img"
        )}"></center>
        <center><p class="desc_prod">${this.getAttribute(
          "description"
        )}</p></center>
    </span>
    <br>
    <div class="sub_info_prod">
        <div>
            <p>Prix TTC : 
                <span class="prix-original" style="${this.getAttribute(
                  "prixOriginalAffiche"
                )}">${this.getAttribute("prixOriginal")}€</span>
                <span id="prix">${this.getAttribute("prix")}</span> €
            </p>
            <p>SKU : <span id="sku">${this.getAttribute("sku")}</span></p>
            <p style="${this.getAttribute(
              "stockAffiche"
            )}">Stock disponible : <span id="stock">${this.getAttribute(
      "stock"
    )}</span><span> unités</span></p>
            <p style="${this.getAttribute(
              "ruptureAffiche"
            )}">Stock disponible : <span>RUPTURE DE STOCK</span></p>
            <div id="taille">Taille : </div>
            <div id="couleur">Couleur : </div>
        </div>
        <div>
            <label for="nbrCommande">Quantité :</label>
            <input type="number" id="nbrCommande" name="nbrCommande" step="1" value="1" min="1">
            <p>Prix total : 
                <span class="prix-original-total" style="${this.getAttribute(
                  "prixTotalOriginalAffiche"
                )}">${this.getAttribute("prixTotalOriginal")}€</span>
                <span id="prix_tot">${this.getAttribute("prix")}</span>€
            </p>
            <input type="button" value="Ajouter au panier">
            </br>
            <p class="erreur" id="erreur">dd</p>
        </div>
    </div>
    </div>
    `;

    document.title = this.getAttribute("name") + " - PM2";

    const nbrCommande = this.shadowRoot.getElementById("nbrCommande");
    const prixTotal = this.shadowRoot.getElementById("prix_tot");

    nbrCommande.addEventListener("input", (event) => {
      const stock = parseInt(this.shadowRoot.getElementById("stock").innerHTML);
      const prix = parseFloat(this.shadowRoot.getElementById("prix").innerHTML);
      const contenu = parseInt(event.target.value);

      if (contenu <= 0 || isNaN(contenu) || contenu > stock) {
        event.target.style.background = "red";
        prixTotal.innerHTML = prix;
      } else {
        event.target.style.background = "whitesmoke";
        prixTotal.innerHTML = (prix * contenu).toFixed(2);
        
        // Mettre à jour le prix total original si solde
        if (this.getAttribute("soldeAffiche") === "display:block;") {
          const prixOriginal = parseFloat(this.getAttribute("prixOriginal"));
          this.shadowRoot.querySelector(".prix-original-total").innerHTML = 
            (prixOriginal * contenu).toFixed(2) + "€";
        }
      }
    });

    const checkbox = this.shadowRoot.querySelector(".checkbox");
    const img = this.shadowRoot.querySelector(".etoile");

    checkbox.addEventListener("change", (event) => {
      if (event.target.checked) {
        ajouterFavori(event, id_us);
        img.src = "./img/icones/star_plein.png";
      } else {
        supprimerFavori(event, id_us);
        img.src = "./img/icones/star_vide.png";
      }
    });
  }
}

customElements.define("produit-detail", ProduitDetail);

async function getSolde(id_prod) {
  return fetch("https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/getSolde.php", {
    method: "POST",
    body: new URLSearchParams({ id_prod: id_prod }),
  })
    .then((response) => response.json())
    .then((data) => (data.data.length > 0 ? data.data[0]["reduction"] : null))
    .catch((error) => {
      console.log(error);
      return null;
    });
}

async function AfficherProd() {
  return fetch("https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/getProduit.php", {
    method: "POST",
    body: new URLSearchParams({
      id_prod: new URLSearchParams(window.location.search).get("id"), // id_prod
    }),
  })
    .then((reponse) => reponse.json())
    .then((data) => {
      console.log(data.data);
      imprimerProduit(
        data.data.filter((produit) => produit.id_col == id_col)[0]
      );
      setTimeout(() => {
        imprimerSelectionCouleur(data.data);
      }, 100);
      setTimeout(() => {
        imprimerSelectionTaille(data.data);
      }, 100);
      setTimeout(() => {
        boutonCommander(
          data.data.filter((produit) => produit.id_col == id_col)[0].id_prod
        );
      }, 100);
    });
}

function quantiteCommandeeValide(qtte, stock) {
  return !(
    parseInt(stock) - parseInt(qtte) < 0 ||
    parseInt(qtte) <= 0 ||
    isNaN(parseInt(qtte))
  );
}

async function imprimerSelectionCouleur(produits) {
  let couleurs = new Map();
  produits.forEach((produit) => {
    if (!couleurs.has(produit["nom_col"])) {
      couleurs.set(produit["id_col"], produit["nom_col"]);
    }
  });

  const selecteur = document.createElement("select");
  selecteur.setAttribute("id", "selectCouleur");
  couleurs.forEach((couleur, id) => {
    let option = document.createElement("option");
    option.text = couleur;
    if (id == id_col) {
      option.selected = true;
    }
    option.value = id;
    selecteur.add(option);
  });

  const root = document.querySelector("produit-detail").shadowRoot;
  root.getElementById("couleur").appendChild(selecteur);

  root.getElementById("selectCouleur").addEventListener("change", async (event) => {
    let id = event.target.value;
    let produit = produits.find((p) => p.id_col == id && root.getElementById("selectTaille").value == p.id_tail);

    if (produit) {
      let path = produit.path_img
        ? "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/img/articles/" + produit.path_img
        : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

      const qte = root.querySelector("#nbrCommande").value;
      const solde = await getSolde(produit.id_prod);
      let prixFinal = produit.prix_unit;
      let prixOriginal = produit.prix_unit;

      if (solde) {
        prixFinal = (produit.prix_unit * (1 - solde/100)).toFixed(2);
        root.querySelector(".prix-original").style.display = "inline";
        root.querySelector(".prix-original").innerHTML = produit.prix_unit + "€";
        root.querySelector(".prix-original-total").style.display = "inline";
        root.querySelector(".prix-original-total").innerHTML = (produit.prix_unit * qte).toFixed(2) + "€";
        root.querySelector(".solde").style.display = "block";
        root.querySelector(".solde-valeur").innerHTML = solde;
      } else {
        root.querySelector(".prix-original").style.display = "none";
        root.querySelector(".prix-original-total").style.display = "none";
        root.querySelector(".solde").style.display = "none";
      }

      root.querySelector(".img_prod").setAttribute("src", path);
      root.getElementById("prix").innerHTML = prixFinal;
      root.getElementById("prix_tot").innerHTML = (prixFinal * qte).toFixed(2);
      root.getElementById("stock").innerHTML = produit.stock;

      // Gestion de la rupture de stock
      if (produit.stock <= 0) {
        root.getElementById("stock").parentElement.style.display = "none";
        root.getElementById(
          "stock"
        ).parentElement.nextElementSibling.style.display = "block";
        root.getElementById(
          "stock"
        ).parentElement.nextElementSibling.style.color = "red";
      } else {
        root.getElementById("stock").parentElement.style.display = "block";
        root.getElementById(
          "stock"
        ).parentElement.nextElementSibling.style.display = "none";
      }

      const nbrCommande = root.getElementById("nbrCommande");
      const prixTotal = root.getElementById("prix_tot");
      const stock = parseInt(root.getElementById("stock").textContent);
      const prix = parseFloat(root.getElementById("prix").innerHTML);
      const contenu = parseInt(nbrCommande.value);

      if (contenu <= 0 || isNaN(contenu) || contenu > stock) {
        nbrCommande.style.background = "red";
        prixTotal.innerHTML = prix;
      } else {
        nbrCommande.style.background = "whitesmoke";
        prixTotal.innerHTML = (prix * contenu).toFixed(2);
      }
    }
  });
}

async function imprimerSelectionTaille(produits) {
  let tailles = new Map();
  produits.forEach((produit) => {
    if (!tailles.has(produit["id_tail"])) {
      tailles.set(produit["id_tail"], produit["nom_tail"]);
    }
  });

  const selecteur = document.createElement("select");
  selecteur.setAttribute("id", "selectTaille");
  tailles.forEach((taille, id) => {
    let option = document.createElement("option");
    option.text = taille;
    option.value = id;
    selecteur.add(option);
  });

  const root = document.querySelector("produit-detail").shadowRoot;
  root.getElementById("taille").appendChild(selecteur);

  root.getElementById("selectTaille").addEventListener("change", async (event) => {
    let produit = produits.find((p) => p.id_tail == event.target.value && root.getElementById("selectCouleur").value == p.id_col);

    if (produit) {
      const qte = root.querySelector("#nbrCommande").value;
      const solde = await getSolde(produit.id_prod);
      let prixFinal = produit.prix_unit;
      let prixOriginal = produit.prix_unit;

      if (solde) {
        prixFinal = (produit.prix_unit * (1 - solde/100)).toFixed(2);
        root.querySelector(".prix-original").style.display = "inline";
        root.querySelector(".prix-original").innerHTML = produit.prix_unit + "€";
        root.querySelector(".prix-original-total").style.display = "inline";
        root.querySelector(".prix-original-total").innerHTML = (produit.prix_unit * qte).toFixed(2) + "€";
        root.querySelector(".solde").style.display = "block";
        root.querySelector(".solde-valeur").innerHTML = solde;
      } else {
        root.querySelector(".prix-original").style.display = "none";
        root.querySelector(".prix-original-total").style.display = "none";
        root.querySelector(".solde").style.display = "none";
      }

      root.getElementById("prix").innerHTML = prixFinal;
      root.getElementById("prix_tot").innerHTML = (prixFinal * qte).toFixed(2);
      root.getElementById("stock").innerHTML = produit.stock;

      // Gestion de la rupture de stock
      if (produit.stock <= 0) {
        root.getElementById("stock").parentElement.style.display = "none";
        root.getElementById(
          "stock"
        ).parentElement.nextElementSibling.style.display = "block";
        root.getElementById(
          "stock"
        ).parentElement.nextElementSibling.style.color = "red";
      } else {
        root.getElementById("stock").parentElement.style.display = "block";
        root.getElementById(
          "stock"
        ).parentElement.nextElementSibling.style.display = "none";
      }
      
      const nbrCommande = root.getElementById("nbrCommande");
      const prixTotal = root.getElementById("prix_tot");
      const stock = parseInt(root.getElementById("stock").textContent);
      const prix = parseFloat(root.getElementById("prix").innerHTML);
      const contenu = parseInt(nbrCommande.value);

      if (contenu <= 0 || isNaN(contenu) || contenu > stock) {
        nbrCommande.style.background = "red";
        prixTotal.innerHTML = prix;
      } else {
        nbrCommande.style.background = "whitesmoke";
        prixTotal.innerHTML = (prix * contenu).toFixed(2);
      }
    }
  });
}

async function imprimerProduit(produit) {
  let path = produit.path_img
    ? "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/SAE_401/serveur/img/articles/" +
      produit.path_img
    : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

  // Récupérer le solde
  let solde = await getSolde(produit.id_prod);
  let prixFinal = produit.prix_unit;
  let prixOriginal = produit.prix_unit;
  
  if (solde) {
      prixFinal = (produit.prix_unit * (1 - solde/100)).toFixed(2);
  }

  const prod_affiche = document.createElement("produit-detail");
  prod_affiche.setAttribute("name", produit.nom_prod);
  prod_affiche.setAttribute("description", produit.description);
  prod_affiche.setAttribute("prix", prixFinal);
  prod_affiche.setAttribute("prixOriginal", prixOriginal);
  prod_affiche.setAttribute("prixTotalOriginal", prixOriginal);
  prod_affiche.setAttribute("couleur", produit.nom_col);
  prod_affiche.setAttribute("taille", produit.nom_tail);
  prod_affiche.setAttribute(
    "path_img",
    "../serveur/img/articles/" + produit.path_img
  );
  prod_affiche.setAttribute("id", "produit");

  // Gestion du solde
  if (solde) {
      prod_affiche.setAttribute("soldeAffiche", "display:block;");
      prod_affiche.setAttribute("soldeValeur", solde);
      prod_affiche.setAttribute("prixOriginalAffiche", "display:inline");
      prod_affiche.setAttribute("prixTotalOriginalAffiche", "display:inline");
  } else {
      prod_affiche.setAttribute("soldeAffiche", "display:none");
      prod_affiche.setAttribute("prixOriginalAffiche", "display:none");
      prod_affiche.setAttribute("prixTotalOriginalAffiche", "display:none");
  }

  // Ajout des nouvelles informations
  prod_affiche.setAttribute("sku", produit.sku);
  prod_affiche.setAttribute("stock", produit.stock);
  
  // Gere la rupture stock
  if (produit["stock"] <= 0) {
    prod_affiche.setAttribute("stockAffiche", "display:none");
    prod_affiche.setAttribute("ruptureAffiche", "color:red");
  } else {
    prod_affiche.setAttribute("stockAffiche", "");
    prod_affiche.setAttribute("ruptureAffiche", "display:none");
  }

  // Gestion favori
  const id_fav = [];
  await getFavori(id_us).then((data) => {
    data.forEach((fav) => {
      id_fav.push(fav["id_prod"]);
    });
  });

  if (id_fav.includes(parseInt(id))) {
    prod_affiche.setAttribute("checked", "checked");
    prod_affiche.setAttribute("fav", "./img/icones/star_plein.png");
  } else {
    prod_affiche.setAttribute("fav", "./img/icones/star_vide.png");
  }

  document.querySelector("#detail").appendChild(prod_affiche);
}

function boutonCommander(id_produit) {
  const root = document.querySelector("produit-detail").shadowRoot;

  const boutton = root.querySelector("input[type=button]");
  boutton.addEventListener("click", (event) => {
    const nbCommandee = root.getElementById("nbrCommande").valueAsNumber;
    const stock = root.getElementById("stock").textContent;

    const tailleSelect = root.getElementById("taille").querySelector("select");
    const couleurSelect = root
      .getElementById("couleur")
      .querySelector("select");
    const tailleID = tailleSelect.options[tailleSelect.selectedIndex].value;
    const couleurID = couleurSelect.options[couleurSelect.selectedIndex].value;
    const erreur = root.getElementById("erreur");

    if (quantiteCommandeeValide(nbCommandee, stock)) {
      fetch("https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/newPanier.php", {
        method: "POST",
        body: new URLSearchParams({
          id_us: cookieValue,
          id_prod: id,
          id_tail: tailleID,
          id_col: couleurID,
          qte_pan: nbCommandee,
        }),
      })
        .then((reponse) => {
          reponse.json().then((data) => {
            if (data.status === "error") {
              if (isConnected()) {
                console.log(erreur);
                erreur.style.display = "block";
                erreur.innerHTML = `Article déjà dans votre panier !\nVous pouvez toutefois changer votre commande dans la rubrique "Panier"`;
              } else {
                erreur.style.display = "block";
                erreur.innerHTML = `Connectez vous pour commencer à commander !`;
              }
            } else if (data.status === "success") {
              window.location.href = "accueil.html";
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      erreur.style.display = "block";
      erreur.innerHTML = "La quantité de produit voulant être ajoutée au panier est impossible"
    }
  });
}

AfficherProd();