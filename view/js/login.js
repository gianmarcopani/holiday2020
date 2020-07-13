/*
Script di frontend per l'autenticazione e costruzione del session_id.
*/

window.onload = checkSessioneGiaMemorizzata();

function checkSessioneGiaMemorizzata() {
	var sessione_corrente = localStorage.getItem("BOOKSESSION_ID");
	//alert(sessione_corrente);
	var res = richiedi("../../controller/login?action=check" + "&session_id=" + sessione_corrente);
	if (res != "NOSESSION") {
		window.open("../view/Index.html", "_self", false);
		return true;
	}
	return false;
}

function accedi(email, password) {
	var res = richiedi("../../controller/login?action=notificaConferma" + "&email=" + email + "&password=" + password);

	if (res != "ERR")	{
		if (res != "NOTAUTH") {
			//alert("Autenticato!");
			localStorage.setItem("BOOKSESSION_ID", res);
			window.open("../view/Index.html", "_self", false);
		}
		else
			alert("Dati errati"); //o utente non esistente
			//Decidere cosa fare.
	}

	else {
		alert("Errore!");
		//Decidere cosa fare.
	}

	return false;
}
