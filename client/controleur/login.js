let id_user = -1;
let form = document.querySelector("form");
let msgErreur = document.querySelector("#MessageErreur");

msgErreur.style.display = "none";
msgErreur.style.backgroundColor = "red";
msgErreur.style.color = "white";
msgErreur.style.fontSize = "16px";
msgErreur.style.padding = "10px";
msgErreur.style.marginBottom = "10px";
msgErreur.style.borderRadius = "5px";
msgErreur.style.textAlign = "center";
msgErreur.style.justifyContent = "center";

async function authentifier() {
	var login = $("#login").val();
	var motdepasse = $("#motdepasse").val();

	if (!login || !motdepasse) {
		msgErreur.innerHTML = "Remplissez tous les champs !";
		msgErreur.style.display = "block";
		setTimeout(() => {
			msgErreur.style.display = "none";
		}, 10000);

		return;
	}
	const reponse = await fetch(
		"https://devweb.iutmetz.univ-lorraine.fr/~riese3u/2A/SAE-4.01_Final/serveur/api/connexion.php",
		{
			method: "POST",
			body: new URLSearchParams({
				login: login,
				mdp: motdepasse,
			}),
		}
	);

	const data = await reponse.json();
	console.log("M : ", data.message);
	console.log("Data : ", data);

	if (data.status === "success") {
		let date_expiration = new Date();
		date_expiration.setTime(date_expiration.getTime() + 10800 * 1000); // 3 heures

		// console.log("User :",data.id_us);
		document.cookie =
			"id_user=" +
			data.id_us +
			";expires=" +
			date_expiration.toUTCString() +
			";path=/;SameSite=Strict";

		// console.log("Cookie : ", document.cookie);
		window.location.href = "accueil.html?login_success=true";
		return;
	}

	// Echec
	msgErreur.innerHTML = data.message;
	msgErreur.style.display = "block";
	setTimeout(() => {
		msgErreur.style.display = "none";
	}, 10000);
}

//afficher/cacher le mot de passe lorsque l'on clique sur le bouton

const toggleButton = document.getElementById("togglePassword");
const passwordField = document.getElementById("motdepasse");

toggleButton.addEventListener("click", function () {
	console.log("Bouton cliqué !");
	passwordField.type =
		passwordField.type === "password" ? "text" : "password";
});
