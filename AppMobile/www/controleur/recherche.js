const divRecherche = document.querySelectorAll(".recherche")[0];
const barreRecherche = document.createElement("input");
const boutonRechercher = document.createElement("input");
const selectCategorie = document.createElement("select");
const selectCouleur = document.createElement("select");
const selectTaille = document.createElement("select");

const maps = await fillMaps();
const tailleByCategorie = maps[0];
const couleurByCategorie = maps[1];

const tailleByCategorieTriee = new Map(
  [...tailleByCategorie.entries()].sort((a, b) => a[0] - b[0])
);

const couleurByCategorieTriee = new Map(
  [...couleurByCategorie.entries()].sort((a, b) => a[0] - b[0])
);

barreRecherche.setAttribute("type", "text");
boutonRechercher.setAttribute("type", "button");
boutonRechercher.setAttribute("value", "Rechercher");
boutonRechercher.classList.add("form_button");

const searchValue = new URLSearchParams(window.location.search).get("search");

barreRecherche.value = searchValue ? searchValue.replaceAll("+", " ") : "";
barreRecherche.classList.add("col-sm-12");
barreRecherche.classList.add("col-xl-7");
barreRecherche.placeholder = "🔎 - Que recherchez-vous ?";

selectCategorie.classList.add("col-xl-2");
selectCategorie.classList.add("col-sm-2");
selectCouleur.classList.add("col-xl-1");
selectCouleur.classList.add("col-sm-2");
selectTaille.classList.add("col-xl-1");
selectTaille.classList.add("col-sm-2");
boutonRechercher.classList.add("col-xl-1");
boutonRechercher.classList.add("col-sm-12");

// xs, sm, md, lg, xl

async function getInfoProd() {
  return await fetch(
    "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/getProduits.php",
    {
      method: "POST",
      body: new URLSearchParams({}),
    }
  ).then((reponse) => reponse.json());
}
async function fillMaps() {
  var tailleByCategorie = new Map();
  var couleurByCategorie = new Map();
  const produits = (await getInfoProd()).data;

  produits.forEach((produit) => {
    if (tailleByCategorie.has(produit.id_cat)) {
      const categorie = tailleByCategorie.get(produit.id_cat);
      if (!categorie.includes(produit.id_tail)) {
        categorie.push(produit.id_tail);
      }
      tailleByCategorie.set(produit.id_cat, categorie);
    } else {
      tailleByCategorie.set(produit.id_cat, [produit.id_tail]);
    }
  });
  // console.log("tailleByCategorie");
  // console.log(tailleByCategorie);
  produits.forEach((produit) => {
    if (couleurByCategorie.has(produit.id_cat)) {
      const categorie = couleurByCategorie.get(produit.id_cat);
      if (!categorie.includes(produit.id_col)) {
        categorie.push(produit.id_col);
      }
      couleurByCategorie.set(produit.id_cat, categorie);
    } else {
      couleurByCategorie.set(produit.id_cat, [produit.id_col]);
    }
  });
  // console.log("couleurByCategorie");
  // console.log(couleurByCategorie);
  return [couleurByCategorie, tailleByCategorie];
}

fetchSpecification(
  selectCategorie,
  "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/getCategories.php",
  "Catégorie",
  "idCategorie"
);
fetchSpecification(
  selectCouleur,
  "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/getCouleurs.php",
  "Couleur",
  "idCouleur"
);
fetchSpecification(
  selectTaille,
  "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/getTailles.php",
  "Taille",
  "idTaille"
);

divRecherche.appendChild(barreRecherche);
divRecherche.appendChild(selectCategorie);
divRecherche.appendChild(selectCouleur);
divRecherche.appendChild(selectTaille);
divRecherche.appendChild(boutonRechercher);

barreRecherche.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    rechercher();
  }
});
boutonRechercher.addEventListener("click", (e) => {
  e.preventDefault();
  rechercher();
});

function rechercher() {
  let params = new URLSearchParams();

  if (barreRecherche.value.trim() !== "") {
    params.append("search", traiterChaine(barreRecherche));
  }
  if (selectCategorie.value !== "") {
    params.append("idCategorie", selectCategorie.value);
  }
  if (selectCouleur.value !== "") {
    params.append("idCouleur", selectCouleur.value);
  }
  if (selectTaille.value !== "") {
    params.append("idTaille", selectTaille.value);
  }

  window.location.href =
    window.location.href.split("?")[0] + "?" + params.toString();
}

function fetchSpecification(select, url, default_name, searchParam) {
  return fetch(url)
    .then((reponse) => reponse.json())
    .then((data) => {
      if (default_name == "Catégorie")
        ajouterOptions(select, data.data, default_name, searchParam);
      else ajouterOptions(select, [], default_name, searchParam);
    })
    .catch((error) => console.log(error));
}

function ajouterOptions(select, data, default_name, searchParam) {
  const searchParams = new URLSearchParams(window.location.search);

  let option = document.createElement("option");
  option.value = "";
  option.text = default_name;
  select.add(option, null);
  data.forEach((type) => {
    type = Object.values(type);
    const selected = parseInt(searchParams.get(searchParam)) == type[0];
    let option = document.createElement("option");
    option.value = type[0];
    option.text = type[1];
    option.selected = selected;
    select.add(option, null);
  });
}

function removeAll(selectBox) {
  while (selectBox.options.length > 0) {
    select.remove(0);
  }
}

function traiterChaine(barreRecherche) {
  let chaine = barreRecherche;
  if (chaine.value.includes("  ")) {
    chaine.value = chaine.value.replaceAll("  ", " ");
    return traiterChaine(chaine);
  } else return chaine.value.replaceAll(" ", "+");
}

function loadProduits() {
  fetch(
    "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/getProduits.php"
  ).then((reponse) =>
    reponse.json().then((data) => {
      const prod_cat = data.data.filter(
        (produit) => produit.id_cat == selectCategorie.value
      );
      let couleur = [];
      let taille = [];
      prod_cat.forEach((produit) => {
        couleur.push(produit.id_col);
        taille.push(produit.id_tail);
      });
      couleur = couleur.filter((v, i, a) => a.indexOf(v) === i);
      taille = taille.filter((v, i, a) => a.indexOf(v) === i);
      fetch(
        "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/getCouleurs.php"
      ).then((reponse) =>
        reponse.json().then((data) => {
          const nom_couleur = data.data.filter((couleu) =>
            couleur.includes(couleu.id_col)
          );
          selectCouleur.innerHTML = "";
          ajouterOptions(selectCouleur, nom_couleur, "Couleur", "idCouleur");
        })
      );
      fetch(
        "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/getTailles.php"
      ).then((reponse) =>
        reponse.json().then((data) => {
          const nom_tail = data.data.filter((taill) =>
            taille.includes(taill.id_tail)
          );
          selectTaille.innerHTML = "";
          ajouterOptions(selectTaille, nom_tail, "Taille", "idTaille");
        })
      );
    })
  );
}

const urlParams = new URLSearchParams(window.location.search);

let idCategorie = urlParams.get("idCategorie");
let idCouleur = urlParams.get("idCouleur");
let idTaille = urlParams.get("idTaille");

if (idCategorie) {
  selectCategorie.value = idCategorie;
  // console.log("Id catégorie : " + idCategorie);
  // console.log("selectCategorie : ", selectCategorie);
  // console.log(selectCategorie);
  // console.log(
  //   "Nombre de couleurs dispo : " + maps[1].get(parseInt(idCategorie)).length
  // );

  // ********
  // TAILLES
  // ********
  let lstTaille = [];
  maps[1].get(parseInt(idCategorie)).forEach((taille) => {
    // console.log("Taille : " + taille);
    lstTaille.push(taille);
  });

  // console.log("Taille/Categ : ", lstTaille);

  fetch(
    "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/getTailles.php"
  )
    .then((reponse) => reponse.json())
    .then((data) => {
      // console.log(data.data);
      const nom_tail = data.data.filter((taill) =>
        lstTaille.includes(taill.id_tail)
      );
      // console.log(nom_tail);
      selectTaille.innerHTML = "";
      ajouterOptions(selectTaille, nom_tail, "Taille", "idTaille");
    })
    .catch((error) => console.error("Pb recup taille :", error));

  // ********
  // COULEURS
  // ********
  let lstCouleur = [];
  maps[0].get(parseInt(idCategorie)).forEach((couleur) => {
    // console.log("Couleur : " + couleur);
    lstCouleur.push(couleur);
  });

  // console.log("Couleur/Categ : ", lstCouleur);

  fetch(
    "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/getCouleurs.php"
  )
    .then((reponse) => reponse.json())
    .then((data) => {
      // console.log(data.data);
      const nom_col = data.data.filter((col) =>
        lstCouleur.includes(col.id_col)
      );
      // console.log(nom_col);
      selectCouleur.innerHTML = "";
      ajouterOptions(selectCouleur, nom_col, "Couleur", "idCol");
    })
    .then(() => {
      if (idCouleur) {
        selectCouleur.value = idCouleur;
        // console.log("Id couleur : " + idCouleur);
      }

      if (idTaille) {
        selectTaille.value = idTaille;
        // console.log("Id taille : " + idTaille);
      }
    })
    .catch((error) => console.error("Pb recup couleur  :", error));
}

selectCategorie.addEventListener("change", (e) => {
  e.preventDefault();
  loadProduits();
});
