import { cookieValue } from "./function.js";

if (cookieValue === undefined) {
	window.location.href = "accueil.html"; //Si le cookie est vide, l'utilisateur n'est pas connecté donc on retourne à l'accueil.
}
let mdpOK = false;
const mdpErreurs = document.querySelectorAll('span[id^="mdpErreur"]');
mdpErreurs.forEach((mdpErreur) => {
	mdpErreur.style.display = "none";
});

document.getElementById("nouveauMdp").addEventListener("input", (e) => {
	mdpErreurs.forEach((mdpErreur) => {
		mdpErreur.style.display = "block";
	});
	if (document.getElementById("nouveauMdp").value === "") {
		mdpErreurs.forEach((mdpErreur) => {
			mdpErreur.style.display = "none";
		});
	}

	let testLg = /.{8,}/;
	let testMaj = /[A-Z]/;
	let testMin = /[a-z]/;
	let testCar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
	let testNb = /[0-9]/;

	let valeurTester = document.getElementById("nouveauMdp").value;
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

function ConfirmerMDP(mdpOK) {
	const motDePasse = document.getElementById("nouveauMdp");
	const confimation = document.getElementById("confirmation");
	const confirmationErreur = document.getElementById("confirmationErreur");

	if (motDePasse.value === confimation.value && mdpOK) {
		fetch("http://localhost/SAE-4.01/serveur/api/changerMDP.php", {
			method: "POST",
			body: new URLSearchParams({
				id_us: cookieValue,
				mdp: motDePasse.value,
			}),
		}).then((response) => {
			response.json().then((data) => {
				console.log(data);
				if (data["status"] === "success") {
					alert("Votre mot de passe a bien été changé");
					window.location.href = "accueil.html";
				} else {
					alert("Erreur lors du changement de mot de passe");
				}
			});
		});
	} else {
		confirmationErreur.style.display = "block";
		confirmationErreur.style.color = "red";
		//alert("Les mots de passe ne correspondent pas");
	}
}

let button = document.getElementById("envoie");
button.addEventListener("click", (e) => {
	e.preventDefault();
	console.log("click");
	ConfirmerMDP(mdpOK);
});
