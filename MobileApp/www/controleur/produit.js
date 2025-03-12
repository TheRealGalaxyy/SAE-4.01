import { cookieValue } from "./function.js";
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const id_col = urlParams.get("id_col");

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
    </style>
    <div class="produitDetail">
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
                <p>Prix : <span id="prix">${this.getAttribute(
                  "prix"
                )}</span> €</p>
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
                <p>Prix total : <span id="prix_tot">${this.getAttribute(
                  "prix"
                )}</span>€</p>
                <input type="button" value="Ajouter au panier">
            </div>
        </div>
    </div>
    `;

    document.title = this.getAttribute("name") + " - PM2";

    const nbrCommande = this.shadowRoot.getElementById("nbrCommande");
    const prixTotal = this.shadowRoot.getElementById("prix_tot");
    const stock = parseInt(this.getAttribute("stock"));

    nbrCommande.addEventListener("input", (event) => {
      const prix = parseFloat(this.shadowRoot.getElementById("prix").innerHTML);
      const contenu = parseInt(event.target.value);

      if (contenu <= 0 || isNaN(contenu) || contenu > stock) {
        event.target.style.background = "red";
        prixTotal.innerHTML = prix;
      } else {
        event.target.style.background = "whitesmoke";
        prixTotal.innerHTML = (prix * contenu).toFixed(2);
      }
    });
  }
}

customElements.define("produit-detail", ProduitDetail);
async function AfficherProd() {
  return fetch(
    "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01/serveur/api/getProduit.php",
    {
      method: "POST",

      body: new URLSearchParams({
        id_prod: new URLSearchParams(window.location.search).get("id"), // id_prod
      }),
    }
  )
    .then((reponse) => reponse.json())
    .then((data) => {
      imprimerProduit(
        data.data.filter((produit) => produit.id_col == id_col)[0]
      );
      imprimerSelectionCouleur(data.data);
      imprimerSelectionTaille(data.data);
      boutonCommander(
        data.data.filter((produit) => produit.id_col == id_col)[0].id_prod
      );
    });
}

function quantiteCommandeeValide(qtte, stock) {
  return !(
    parseInt(stock) - parseInt(qtte) < 0 ||
    parseInt(qtte) <= 0 ||
    isNaN(parseInt(qtte))
  );
}

function imprimerSelectionCouleur(produits) {
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

  root.getElementById("selectCouleur").addEventListener("change", (event) => {
    let id = event.target.value;
    let produit = produits.find((p) => p.id_col == id);

    if (produit) {
      let path = produit.path_img
        ? "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01/serveur/img/articles/" +
          produit.path_img
        : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

      root.querySelector("img").setAttribute("src", path);
      root.getElementById("prix").innerHTML = produit.prix_unit;
      root.getElementById("prix_tot").innerHTML = produit.prix_unit;
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
    }
  });
}

function imprimerSelectionTaille(produits) {
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

  root.getElementById("selectTaille").addEventListener("change", (event) => {
    let produit = produits.find((p) => p.id_tail == event.target.value);

    if (produit) {
      const qte = root.querySelector("#nbrCommande").value;
      root.getElementById("prix").innerHTML = produit.prix_unit;
      root.getElementById("prix_tot").innerHTML = produit.prix_unit * qte;
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
    }
  });
}

function imprimerProduit(produit) {
  let path = produit.path_img
    ? "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01/SAE_401/serveur/img/articles/" +
      produit.path_img
    : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

  const prod_affiche = document.createElement("produit-detail");
  prod_affiche.setAttribute("name", produit.nom_prod);
  prod_affiche.setAttribute("description", produit.description);
  prod_affiche.setAttribute("prix", produit.prix_unit);
  prod_affiche.setAttribute("couleur", produit.nom_col);
  prod_affiche.setAttribute("taille", produit.nom_tail);
  prod_affiche.setAttribute(
    "path_img",
    "../serveur/img/articles/" + produit.path_img
  );
  prod_affiche.setAttribute("id", "produit");

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

    if (quantiteCommandeeValide(nbCommandee, stock)) {
      fetch(
        "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01/serveur/api/newPanier.php",
        {
          method: "POST",
          body: new URLSearchParams({
            id_us: cookieValue,
            id_prod: id,
            id_tail: tailleID,
            id_col: couleurID,
            qte_pan: nbCommandee,
          }),
        }
      )
        .then((reponse) => {
          reponse.json().then((data) => {
            if (data.status === "error") {
              alert("Vous avez déjà ce produit dans votre panier");
            } else if (data.status === "success") {
              window.location.href = "accueil.html";
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert(
        "La quantité de produit voulant être ajoutée au panier est impossible"
      );
    }
  });
}

// function verifierPanierUtilisateur() {
//     fetch(
//             "https://devweb.iutmetz.univ-lorraine.fr/~laroche5/SAE_401/serveur/api/getPanier.php", {
//                 method: "POST",

//                 body: new URLSearchParams({
//                     id_us: cookieValue,
//                 }),
//             }
//         )
//         .then((reponse) => reponse.json())
//         .then((data) => {
//             console.log(data.data);
//         });
// }

AfficherProd();
// verifierPanierUtilisateur();
