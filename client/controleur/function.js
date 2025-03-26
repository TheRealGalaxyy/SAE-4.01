export const cookieValue = document.cookie //Correspond à la valeur de la clé "id_user" dans le cookie
  .split("; ")
  .find((row) => row.startsWith("id_user="))
  ?.split("=")[1];

export function isConnected() {
  return cookieValue !== undefined;
}
async function printHeader() {
  const header = document.querySelector("#printHeader");
  const connected = isConnected();

  let navLinks = `
    <a href='./accueil.html'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
  <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
</svg></a>
    
  `;
  if (connected) {
    const user = await getUser();
    navLinks += `
    <a href='./historique.html'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-credit-card" viewBox="0 0 16 16">
  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
  <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
</svg></a>
    <a href='./panier.html'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-basket2-fill" viewBox="0 0 16 16">
  <path d="M5.929 1.757a.5.5 0 1 0-.858-.514L2.217 6H.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h.623l1.844 6.456A.75.75 0 0 0 3.69 15h8.622a.75.75 0 0 0 .722-.544L14.877 8h.623a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1.717L10.93 1.243a.5.5 0 1 0-.858.514L12.617 6H3.383zM4 10a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0zm3 0a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0zm4-1a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1"/>
</svg></a>
    <a href='./favori.html'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
</svg></a>
    <a href='./compte.html'>${user.nom_us}</a>
    <a href='./logout.html'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-door-closed" viewBox="0 0 16 16">
  <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3zm1 13h8V2H4z"/>
  <path d="M9 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0"/>
</svg></a>
    `;
  } else {
    navLinks += `
      <a href='./login.html'>Connexion</a>
      <a href='./register.html'>Inscription</a>
    `;
  }

  header.innerHTML = `
    <a><img src='./img/logo.png' alt='logo_site' class='logo'>
    <input type="image" src="./img/btn_deroul_top.png" id="btn_deroul_top" class="form_img"> </a>
    <nav>
      ${navLinks}
    </nav>
  `;
  MenuPrincipaleDeroulant(999);
}

function MenuPrincipaleDeroulant(taille) {
  //Taille -> Taille en px à partir de laquelle le menu se cache
  let tailleEcran = window.matchMedia("(max-width: " + taille + "px)");

  if (tailleEcran.matches === true) {
    // Cache le menu de navigation si la taille d'écran est inférieure à 1000px
    document.querySelector("nav").style.display = "none";
  } else {
    // Sinon cache l'image qui sert de bouton
    document.getElementById("btn_deroul_top").style.display = "none";
  }

  // La variable select toutes les balises a qui ont dans le menu et les stock dans la variable (C'est un tableau)
  let categHeader = document.querySelectorAll("nav a");

  // Quand on appuie sur le bouton -> Lance la fonction
  document
    .getElementById("btn_deroul_top")
    .addEventListener("click", function () {
      let nav = document.querySelector("nav");
      const btn_deroul_recherche = document.getElementById(
        "btn_deroul_recherche"
      );

      if (nav.style.display === "block") {
        // Si il est en bloc, cela veut dire qu'il est actuellement affiché
        nav.style.display = "none"; // On le cache

        for (let i = 0; i < categHeader.length; i++) {
          categHeader[i].style.display = "none"; // On cache toutes les balises <a> de <nav> une par une
        }
        if (document.querySelector(".recherche"))
          btn_deroul_recherche.style.bottom = "3rem";
      } else {
        if (document.querySelector(".recherche"))
          btn_deroul_recherche.style.bottom = "0";
        nav.style.display = "block"; // Sinon on le définit en tant que block (Le nav n'est plus caché)
        for (let i = 0; i < categHeader.length; i++) {
          setTimeout(
            function (index) {
              categHeader[index].style.display = "block";
            },
            i * 100,
            i
          );
          // setTimeout() permet de créer un délai dans les actions : la fonction sert ici à ce que toutes les balises <a> ne s'affichent pas en même temps
        }
      }
    });
}

function menuRechercheDeroulant() {
  let tailleEcran = window.matchMedia("(max-width: 575px)");
  let form = document.querySelector(".recherche"); // Sélectionne le formulaire

  if (tailleEcran.matches === true) {
    form.style.display = "none";
    document.querySelector(".sticky").style.position = "relative";
  } else {
    document.getElementById("btn_deroul_recherche").style.display = "none";
  }

  let formImg = document.getElementById("btn_deroul_recherche");

  formImg.addEventListener("click", function () {
    if (form.style.display === "block") {
      // Si le formulaire est actuellement affiché
      form.style.display = "none"; // On le cache
    } else {
      form.style.display = "block"; // Sinon on le définit en tant que block (Le formulaire n'est plus caché)
    }
  });
}
if (document.querySelector(".recherche")) menuRechercheDeroulant();

function printFooter() {
  const footer = document.querySelector("#printFooter");
  footer.innerHTML = `
  <style>
  #mentionsLeg{
    color: black;
  }
   </style>
    <p>Paul Muller Pulls Moches - Site de vente  </p>
    <a id=mentionsLeg href="./mentionsLegal.html">Mentions Légales</a>
    `;
}

async function getUser() {
  try {
    const response = await fetch(
      "http://localhost/SAE-4.01/serveur/api/getUser.php",
      {
        method: "POST",
        body: new URLSearchParams({
          id_us: cookieValue,
        }),
      }
    );

    const data = await response.json();
    return data.data[0];
  } catch (error) {
    console.log(error);
  }
}

printHeader();
printFooter();
