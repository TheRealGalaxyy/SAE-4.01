import { cookieValue } from "./function.js";
export class ProduitGenerique extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = `
        <style>
        *,
        *::before,
        *::after {
            transition: 200ms;
        }
        a {
            text-decoration: none;
            color: black;
        }
        .img_prod {
            margin: 3%;
            height: auto;
            max-width: 94%;
            border-radius: 4px;
        }
        .etoile{
            /*margin: 3%;*/
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
        .descProduit {
            border-radius: 8px;
            background-color: lightgray;
            box-shadow: 3px 3px gray;
        }
        .descProduit:hover {
            box-shadow: 3px 3px green;
            background-color: #5f8755;
        }
        .name {
            margin: 3%;
        }
        .prix {
            height: 20px;
            margin: 0;
            /*rigth: -50%;
            position: relative;*/
        }
        .flex {
            display: flex;
            justify-content: space-between;
            padding: 3%;
        }
        .solde {
            display: inline-block;
            padding: 3px 8px;
            background-color: red;
            color: white;
            font-weight: bold;
            border-radius: 5px;
        }
        </style>
        <a href="detail_produit.html?id=${this.getAttribute(
          "id"
        )}&id_col=${this.getAttribute("id_col")}" class="descProduit">
        <div class="descProduit">
            <input type="checkbox" class="checkbox" id="ch${this.getAttribute(
              "id"
            )}">
            <div class="flex">
                <label for="ch${this.getAttribute(
                  "id"
                )}"><img class="etoile" src='img/icones/star_vide.png'/></label>
            </div>
            <div class="solde" style="${this.getAttribute(
              "soldeAffiche"
            )}">EN SOLDE <span class="solde-valeur">-${this.getAttribute(
      "soldeValeur"
    )}%</span></div>
            <p class="name">${this.getAttribute("name")}</p>
            <img class="img_prod" src="${this.getAttribute(
              "path_img"
            )}" alt="${this.getAttribute("path_img")}"
            style="height: 210px; display: block; margin: 0 auto;"  />
            <div class="stock" style="${this.getAttribute(
              "stockAffiche"
            )}" >&nbsp&nbsp${this.getAttribute("stock")} unités restantes</div>
            <div class="rupture" style="${this.getAttribute(
              "ruptureAffiche"
            )}" >&nbsp&nbspRUPTURE DE STOCK</div>
        </div>
        </a>
        `;
  }
}

customElements.define("produit-generique", ProduitGenerique);

function afficherTousLesProduits() {
  const urlParams = new URLSearchParams(window.location.search);
  const taille = urlParams.get("taille");
  const couleur = urlParams.get("idCouleur");

  const produitGenerique =
    "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Tag3/serveur/api/getGenericProduits.php";
  const produitComplet =
    "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Tag3/serveur/api/getProduits.php";
  const url = taille || couleur ? produitComplet : produitGenerique;

  return (
    fetch(url)
      .then((reponse) => reponse.json())
      // .then((data) => {
      //     console.log("data");
      //     console.log(data.data);
      //     const mapProd = new Map();
      //     data.data.forEach((element) => {
      //       if (!mapProd.has(element.id_prod)) {
      //         mapProd.set(element.id_prod, element);
      //       }
      //     });
      //     imprimerTousLesProduits(Array.from(mapProd.values()));
      //   })
      .then((data) => {
        imprimerTousLesProduits(data.data);
      })
      .catch((error) => console.log(error))
  );
}

function produitsRecherche(recherche, data) {
  let dejaSortit = [];
  data.forEach((produit) => {
    if (produitContientMot(produit, recherche)) {
      dejaSortit.push(produit);
    }
  });
  data = purgerListeProduit(dejaSortit, data);
  recherche.split(" ").forEach((mot) => {
    data.forEach((produit) => {
      if (produitContientMot(produit, mot) && !dejaSortit.includes(produit)) {
        dejaSortit.push(produit);
      }
    });
  });
  return dejaSortit;
}

function purgerListeProduit(dejaSortit, data) {
  dejaSortit.forEach((produit) => {
    if (data.includes(produit)) {
      data.splice(data.indexOf(produit), 1);
    }
  });
  return data;
}

function produitsCategorie(idCategorie, data) {
  let dejaSortit = [];
  data.forEach((produit) => {
    if (produit.id_cat == idCategorie) dejaSortit.push(produit);
  });
  return dejaSortit;
}

function produitsCouleur(idCouleur, data) {
  let dejaSortit = [];
  data.forEach((produit) => {
    if (produit.id_col == idCouleur) dejaSortit.push(produit);
  });
  return dejaSortit;
}

function produitsTaille(idTaille, data) {
  let dejaSortit = [];
  data.forEach((produit) => {
    if (produit.id_tail == idTaille) dejaSortit.push(produit);
  });
  return dejaSortit;
}

export async function imprimerUnProduit(produit) {
  let path = produit["path_img"]
    ? "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Tag3/serveur/img/articles/" + produit["path_img"]
    : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

  let produitElement = document.createElement("produit-generique");
  produitElement.classList.add(
    "col-xs-12",
    "col-sm-6",
    "col-md-4",
    "col-lg-3",
    "col-xl-2",
    "descProduit"
  );
  produitElement.setAttribute("name", produit["nom_prod"]);
  produitElement.setAttribute("id", produit["id_prod"]);
  produitElement.setAttribute("id_col", produit["id_col"]);
  produitElement.setAttribute("path_img", path);
  produitElement.setAttribute("stock", produit["stock_general"]);

  if (produit["stock_general"] == 0) {
    produitElement.setAttribute("stockAffiche", "display:none");
    produitElement.setAttribute("ruptureAffiche", "color:red");
  } else {
    produitElement.setAttribute("stockAffiche", "");
    produitElement.setAttribute("ruptureAffiche", "display:none");
  }

  let solde = await getSolde(produit["id_prod"]);
  if (solde) {
    produitElement.setAttribute("soldeAffiche", "display:block;");
    produitElement.setAttribute("soldeValeur", solde);
  } else {
    produitElement.setAttribute("soldeAffiche", "display:none");
  }

  return produitElement;
}

async function getSolde(id_prod) {
  return fetch("https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Tag3/serveur/api/getSolde.php", {
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

function produitContientMot(produit, mot) {
  return produit.nom_prod
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .includes(
      mot
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    );
}

async function imprimerTousLesProduits(produits) {
  const urlParams = new URLSearchParams(window.location.search);
  const recherche = urlParams.get("search");
  const categorie = urlParams.get("idCategorie");
  const taille = urlParams.get("idTaille");
  const couleur = urlParams.get("idCouleur");
  const id_us = cookieValue;

  if (recherche) {
    produits = produitsRecherche(recherche, produits);
  }
  if (categorie) {
    produits = produitsCategorie(categorie, produits);
  }
  if (taille) {
    produits = produitsTaille(taille, produits);
  } else {
    // Retrait doublon
    const mapProd1 = new Map();

    for (let i = produits.length - 1; i >= 0; i--) {
      const element = produits[i];
      const key = element.nom_prod + "-" + element.nom_col;

      if (!mapProd1.has(key)) {
        mapProd1.set(key, element);
      } else {
        produits.splice(i, 1);
      }
    }
  }

  if (couleur) {
    produits = produitsCouleur(couleur, produits);
  }

  produits.sort((a, b) => a.id_prod - b.id_prod);

  const listeProd = document.querySelector(".produits");
  listeProd.innerHTML = "";

  const elements = await Promise.all(
    produits.map((produit) => imprimerUnProduit(produit))
  );

  elements.forEach((produitElement) => listeProd.appendChild(produitElement));

  traiterFavori(id_us);
}

export async function getFavori(id_us) {
  return await fetch("https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Tag3/serveur/api/getFavori.php", {
    method: "POST",
    body: new URLSearchParams({
      id_us: id_us,
    }),
  })
    .then((response) => response.json().then((data) => data.data))
    .catch((error) => console.log(error));
}

export function ajouterFavori(event, id_us) {
  fetch("https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Tag3/serveur/api/newFavori.php", {
    method: "POST",
    body: new URLSearchParams({
      id_us: id_us,
      id_prod: event.target.id.substring(2),
    }),
  }).catch((error) => console.log(error));
}

export function supprimerFavori(event, id_us) {
  fetch("https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Tag3/serveur/api/delFavori.php", {
    method: "POST",
    body: new URLSearchParams({
      id_us: id_us,
      id_prod: event.target.id.substring(2),
    }),
  }).catch((error) => console.log(error));
}

function traiterFavori(id_us) {
  const id_fav = [];
  getFavori(id_us).then((data) => {
    data.forEach((fav) => {
      id_fav.push(fav["id_prod"]);
    });
    //console.log(id_fav);
    document
      .querySelector(".produits")
      .querySelectorAll("produit-generique")
      .forEach((produit) => {
        const checkbox = produit.shadowRoot.querySelector(".checkbox");
        const img = produit.shadowRoot
          .querySelector("label")
          .querySelector("img");
        //console.log(checkbox.id.substring(1));
        if (id_fav.includes(parseInt(checkbox.id.substring(2)))) {
          checkbox.checked = true;
          img.src = "./img/icones/star_plein.png";
        }
        checkbox.addEventListener("click", (event) => {
          if (event.target.checked === true) {
            ajouterFavori(event, id_us);
            img.src = "./img/icones/star_plein.png";
          } else {
            supprimerFavori(event, id_us);
            img.src = "./img/icones/star_vide.png";
          }
        });
        document
          .querySelector(".produits")
          .querySelectorAll("produit-generique")
          .forEach((produit) => {
            const checkbox = produit.shadowRoot.querySelector(".checkbox");
            if (id_fav.includes(parseInt(checkbox.id))) checkbox.checked = true;
            checkbox.addEventListener("click", (event) => {
              if (cookieValue == null) window.location.href = "login.html";
              if (event.target.checked === true) {
                ajouterFavori(event, id_us);
              } else {
                supprimerFavori(event, id_us);
              }
            });
          });
      });
  });
}
afficherTousLesProduits();
