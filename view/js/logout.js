/*
Script di frontend per deautenticare l'utente.
*/

var sessione_corrente = localStorage.getItem("BOOKSESSION_ID"); //Recupero della sessione corrente.

function clickLogout() {
    var res = richiedi("../../controller/logout?action=notificaLogout&session_id="+sessione_corrente);

    if (res == "ERR")
         alert("Errore!");
	else if (res == "NOSESSION")
		alert("Non sei loggato!");
    else {
		localStorage.removeItem("BOOKSESSION_ID");
        window.open("../view/Index.html", "_self", false);
	}
}
