let form = document.querySelector("form");
let msgErreur = document.getElementById("MessageErreur");
const mdpErreurs = document.querySelectorAll('span[id^="mdpErreur"]');

let mdpOK = false;
let melOK = false;

//afficher/cacher le mot de passe lorsque l'on clique sur le bouton
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("togglePassword");
  const passwordField = document.getElementById("mdp");

  if (toggleButton && passwordField) {
    toggleButton.addEventListener("click", function () {
      console.log("Bouton cliqué !");
      passwordField.type =
        passwordField.type === "password" ? "text" : "password";
    });
  } else {
    console.error("Le bouton ou le champ de mot de passe est introuvable !");
  }
});

mdpErreurs.forEach((mdpErreur) => {
  mdpErreur.style.display = "none";
});

msgErreur.style.display = "none";
msgErreur.style.backgroundColor = "red";
msgErreur.style.color = "white";
msgErreur.style.fontSize = "16px";
msgErreur.style.padding = "10px";
msgErreur.style.marginBottom = "10px";
msgErreur.style.borderRadius = "5px";
msgErreur.style.textAlign = "center";
msgErreur.style.justifyContent = "center";

document.getElementById("mel").addEventListener("input", (e) => {
  let mel_conforme = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let msgErreurMail = document.getElementById("melErreur");
  melOK = mel_conforme.test(document.getElementById("mel").value);

  if (melOK) msgErreurMail.style.display = "none";
  else {
    msgErreurMail.style.display = "block";
    msgErreurMail.style.color = "red";
    msgErreurMail.innerHTML = "Adresse mail non conforme";
  }
});

document.getElementById("mdp").addEventListener("input", (e) => {
  mdpErreurs.forEach((mdpErreur) => {
    mdpErreur.style.display = "block";
  });

  let testLg = /.{8,}/;
  let testMaj = /[A-Z]/;
  let testMin = /[a-z]/;
  let testCar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  let testNb = /[0-9]/;

  let valeurTester = document.getElementById("mdp").value;
  mdpOK =
    testLg.test(valeurTester) &&
    testMaj.test(valeurTester) &&
    testMin.test(valeurTester) &&
    testCar.test(valeurTester) &&
    testNb.test(valeurTester);
  console.log(mdpOK);

  if (testLg.test(valeurTester)) mdpErreurs[0].style.display = "none";
  else {
    mdpErreurs[0].style.display = "block";
    mdpErreurs[0].style.color = "red";
  }

  if (testMaj.test(valeurTester)) mdpErreurs[1].style.display = "none";
  else {
    mdpErreurs[1].style.display = "block";
    mdpErreurs[1].style.color = "red";
  }

  if (testMin.test(valeurTester)) mdpErreurs[2].style.display = "none";
  else {
    mdpErreurs[2].style.display = "block";
    mdpErreurs[2].style.color = "red";
  }

  if (testCar.test(valeurTester)) mdpErreurs[3].style.display = "none";
  else {
    mdpErreurs[3].style.display = "block";
    mdpErreurs[3].style.color = "red";
  }

  if (testNb.test(valeurTester)) mdpErreurs[4].style.display = "none";
  else {
    mdpErreurs[4].style.display = "block";
    mdpErreurs[4].style.color = "red";
  }
});

function register() {
  let erreur = 0;

  const inputs = document.querySelectorAll(
    'form input[type="text"], form input[type="password"], form input[type="date"]'
  );
  const values = [];

  inputs.forEach((input) => {
    values.push(input.value);
    if (input.value === null) {
      erreur++;
    }
  });

  if (erreur !== 0) {
    msgErreur.innerHTML = "Remplissez tous les champs !";
    msgErreur.style.display = "block";
    setTimeout(() => {
      msgErreur.style.display = "none";
    }, 10000);
    return;
  }

  if (!melOK || !mdpOK) {
    msgErreur.innerHTML =
      "Votre mot de passe ou votre adresse mail n'est pas conforme !";
    msgErreur.style.display = "block";
    setTimeout(() => {
      msgErreur.style.display = "none";
    }, 10000);
    return;
  }

  const user = {
    nom: values[0],
    prenom: values[1],
    login: values[2],
    mdp: values[3],
    mel: values[4],
    date_naiss: values[5],
  };
  console.log(user);
  fetch(
    "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/newUser.php",
    {
      method: "POST",
      body: new URLSearchParams({
        nom: user.nom,
        prenom: user.prenom,
        login: user.login,
        mdp: user.mdp,
        mel: user.mel,
        date_naiss: user.date_naiss,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status == "success") {
        // L'Authentification a réussi
        fetch(
          "https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/connexion.php",
          {
            method: "POST",
            body: new URLSearchParams({
              login: user.login,
              mdp: user.mdp,
            }),
          }
        ).then((response) =>
          response.json().then((data) => {
            let date_expiration = new Date();
            date_expiration.setTime(
              date_expiration.getTime() + 1 * 60 * 60 * 1000
            );
            document.cookie =
              "id_user=" +
              data.id_us +
              ";expires=" +
              date_expiration.toUTCString() +
              ";path=/";

            window.location.href = "accueil.html";
            return;
          })
        );
      }

      // Echec
      msgErreur.innerHTML =
        data.message.split(":")[data.message.split(":").length - 1];
      msgErreur.style.display = "block";
      setTimeout(() => {
        msgErreur.style.display = "none";
      }, 10000);
    })
    .catch((error) => {
      msgErreur.innerHTML = "Une erreur serveur est survenue.";
      msgErreur.style.display = "block";
      setTimeout(() => {
        msgErreur.style.display = "none";
      }, 10000);
    });
}

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  register();
});
