import { cookieValue, isConnected } from "./function.js";

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
            flex-direction: column; /* Aligner les éléments verticalement */
            align-items: center; /* Centrer horizontalement */
            justify-content: center; /* Centrer verticalement */
            text-align: center; /* Centrer le texte */
            width: 250px; /* Taille fixe pour les balises <a> */
            height: 400px; /* Taille fixe pour les balises <a> */
            margin: 10px; /* Espacement entre les éléments */
            border-radius: 8px;
            background-color: lightgray;
            box-shadow: 3px 3px gray;
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

        .etoile, label {
            display: flex;
            justify-content: center; /* Centre horizontalement */
            align-items: center; /* Centre verticalement */
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
            justify-content: center; /* Centre horizontalement */
            align-items: center; /* Centre verticalement */
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

    if (!isConnected()) {
      this.shadowRoot.querySelector(".etoile").style.display = "none";
    }
  }
}

customElements.define("produit-generique", ProduitGenerique);
let produits = null;

function afficherTousLesProduits() {
  const urlParams = new URLSearchParams(window.location.search);
  const taille = urlParams.get("idTaille");
  const couleur = urlParams.get("idCouleur");

  const produitGenerique =
    "http://localhost/SAE-4.01/serveur/api/getGenericProduits.php";
  const produitComplet =
    "http://localhost/SAE-4.01/serveur/api/getProduits.php";
  const url = taille || couleur ? produitComplet : produitGenerique;
  // console.log("bool");
  // console.log(taille || couleur ? true : false);
  // console.log(taille);
  // console.log(couleur);

  return fetch(url)
    .then((reponse) => reponse.json())
    .then((data) => {
      produits = data.data;
      imprimerTousLesProduits(produits);
    })
    .catch((error) => console.log(error));
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
  // console.log(dejaSortit);
  // dejaSortit = dejaSortit.filter((produit, index, self) => {
  //   return index === self.findIndex((p) => p.id_prod === produit.id_prod);
  // });
  // console.log(dejaSortit);
  return dejaSortit;
}

export async function imprimerUnProduit(produit) {
  let path = produit["path_img"]
    ? "http://localhost/SAE-4.01/serveur/img/articles/" + produit["path_img"]
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

export async function getSolde(id_prod) {
  return fetch("http://localhost/SAE-4.01/serveur/api/getSolde.php", {
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

let nbProdAffi = 0;
const nbProd = 12;

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
  } else {
    // Retrait doublon
    const mapProd1 = new Map();

    for (let i = produits.length - 1; i >= 0; i--) {
      const element = produits[i];
      const key = element.nom_prod + "-" + element.id_tail;

      if (!mapProd1.has(key)) {
        mapProd1.set(key, element);
      } else {
        produits.splice(i, 1);
      }
    }
  }

  // Bandeau déffilant
  let spanSoldes = document.getElementById("soldes");
  let textSolde = "";
  spanSoldes.innerHTML = "🔖 <strong>Soldes : </strong>";

  for (let produit of produits) {
    let solde = await getSolde(produit["id_prod"]);
    if (solde) {
      textSolde += `<strong>
${produit.nom_prod} - ${Math.round(solde * 100) / 100}%, </strong>`;
    }
  }
  if (textSolde.length > 0) {
    spanSoldes.innerHTML += textSolde;
    spanSoldes.innerHTML = spanSoldes.innerHTML.replace(/, $/, "") + "🔖";
  } else {
    spanSoldes.innerHTML = "<strong>Pas de soldes actuellement</strong>";
  }

  // console.log(produits);
  produits.sort((a, b) => a.id_prod - b.id_prod);

  const listeProd = document.querySelector(".produits");
  const deb = nbProdAffi;
  const fin = Math.min(deb + nbProd, produits.length);
  const produitsPage = produits.slice(deb, fin);

  const elements = await Promise.all(
    produitsPage.map((produit) => imprimerUnProduit(produit))
  );

  elements.forEach((produitElement) => listeProd.appendChild(produitElement));

  nbProdAffi = fin;

  if (nbProdAffi >= produits.length) {
    document.querySelector("#loadMoreButton").style.display = "none";
  }

  traiterFavori(id_us);
}

let btn = document.querySelector("#loadMoreButton");
if (btn) {
  btn.addEventListener("click", (event) => {
    imprimerTousLesProduits(produits);
  });
}

export async function getFavori(id_us) {
  return await fetch("http://localhost/SAE-4.01/serveur/api/getFavori.php", {
    method: "POST",
    body: new URLSearchParams({
      id_us: id_us,
    }),
  })
    .then((response) => response.json().then((data) => data.data))
    .catch((error) => console.log(error));
}

export function ajouterFavori(event, id_us) {
  fetch("http://localhost/SAE-4.01/serveur/api/newFavori.php", {
    method: "POST",
    body: new URLSearchParams({
      id_us: id_us,
      id_prod: event.target.id.substring(2),
    }),
  }).catch((error) => console.log(error));
}

export function supprimerFavori(event, id_us) {
  fetch("http://localhost/SAE-4.01/serveur/api/delFavori.php", {
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
if (btn) {
  afficherTousLesProduits();
}

window.addEventListener("DOMContentLoaded", (event) => {
  const urlParams = new URLSearchParams(window.location.search);
  const loginSuccess = urlParams.get("login_success");

  if (loginSuccess === "true") {
    const modal = document.getElementById("cookieModal");

    modal.style.display = "block";
    modal.classList.add("show");
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-hidden", "false");

    const closeButtons = document.getElementById("btn-close");

    closeButtons.addEventListener("click", () => {
      modal.classList.remove("show");
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (
    window.location.search === "" ||
    window.location.search === "?login_success=true"
  ) {
    const headerSpan = document.getElementById("header");
    headerSpan.innerHTML = `
              <div class="header">
                  <h1 class="display-4 white">PM2 <span>Votre boutique en ligne</span></h1>
                  <p class="lead white">Affichez votre esprit de Noël avec fierté…<br> et une touche de mauvais goût assumé !</p>
              </div>
          `;
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML += `<div class="item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          class="bi bi-cart"
          viewBox="0 0 16 16"
        >
          <path
            d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"
          />
        </svg>
        <strong>PAIEMENT SÉCURISÉ</strong>
        <p>Commandez en toute sécurité</p>
      </div>
      <div class="item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          class="bi bi-telephone-outbound"
          viewBox="0 0 16 16"
        >
          <path
            d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5"
          />
        </svg>
        <strong>SERVICE CLIENT</strong>
        <p>À vos côtés 7j / 7 !</p>
      </div>
      <div class="item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          class="bi bi-stars"
          viewBox="0 0 16 16"
        >
          <path
            d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"
          />
        </svg>
        <strong>QUALITÉ</strong>
        <p>Fiable et durable</p>
      </div>
      `;
    const faq = document.getElementById("faq");
    faq.innerHTML += `<div class="faq">
      <div class="faq-content">
        <div class="faq-text mb-4">
          <h1 class="d-inline">
            <span class="custom-faq d-inline">F</span>oire<br />
            <span class="custom-faq d-inline">A</span>ux<br />
            <span class="custom-faq d-inline">Q</span>uestions
          </h1>
          <h5>
            Pour toute autre question, nous vous invitons à nous contacter par
            email à pm2_metz@sfr.fr. Nous serons ravis de vous aider !
          </h5>
        </div>
      </div>
      <div class="accordion">
        <div
          class="accordion accordion-flush custom-accordion"
          id="accordionFlushExample"
        >
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed mt-n1"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                Quelle est la qualité de vos produits ?
              </button>
            </h2>
            <div
              id="flush-collapseOne"
              class="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div class="accordion-body">
                Nos pulls et accessoires sont conçus avec des matériaux
                <code>confortables</code> et <code>durables</code>. La mocheté
                est volontaire, mais la qualité est bien réelle !
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed mt-n1"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseTwo"
                aria-expanded="false"
                aria-controls="flush-collapseTwo"
              >
                Quels sont vos délais de livraison ?
              </button>
            </h2>
            <div
              id="flush-collapseTwo"
              class="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div class="accordion-body">
                Nos lutins travaillent dur pour expédier votre commande en
                <code>24</code> à <code>48</code>h. La livraison standard prend
                généralement entre <code>3</code> et <code>5</code> jours
                ouvrés.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed mt-n1"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseThree"
                aria-expanded="false"
                aria-controls="flush-collapseThree"
              >
                Puis-je retourner un article s'il ne me convient pas ?
              </button>
            </h2>
            <div
              id="flush-collapseThree"
              class="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div class="accordion-body">
                Bien sûr ! Vous avez <code>14</code> jours après réception pour
                nous retourner votre article s'il ne vous va pas ou si vous avez
                changé d'avis.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }
});
