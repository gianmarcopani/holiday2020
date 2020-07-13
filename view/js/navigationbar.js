$(document).ready(function() {
    var sessione_corrente = localStorage.getItem("BOOKSESSION_ID");
    var tipo = richiedi("../../controller/gestioneprofilo?action=getTipoAccount&session_id="+sessione_corrente);

    //Admin
    if(tipo == 0) {
        if(window.location.href.match('Index.html') != null || window.location.href.match('GestioneAnnunci.html') != null
        || window.location.href.match('GestionePrenotazioni.html') != null || window.location.href.match('GestioneProfilo.html') != null) {
            document.getElementById("gestall").style.display = "none";
            document.getElementById("comquest").style.display = "none";
            document.getElementById("rend").style.display = "none";
            document.getElementById("reg").style.display = "none";  
            document.getElementById("login").style.display = "none";  
        }       
    }
    //Affittuario
    if(tipo == 1) {
        if(window.location.href.match('Index.html') != null || window.location.href.match('GestionePrenotazioni.html') != null
        || window.location.href.match('GestionePrenotazioni.html') != null || window.location.href.match('Pagamento.html') != null
        || window.location.href.match('ListaAnnunci.html') != null || window.location.href.match('MostraAnnuncio.html') != null
        || window.location.href.match('GestioneProfilo.html')) {
            document.getElementById("gestann").style.display = "none";
            document.getElementById("gestall").style.display = "none";
            document.getElementById("comquest").style.display = "none";
            document.getElementById("rend").style.display = "none";
            document.getElementById("reg").style.display = "none";  
            document.getElementById("login").style.display = "none";  
        }
    }
    //Locatore
    if(tipo == 2) {
        if(window.location.href.match('Index.html') != null || window.location.href.match('ListaAnnunci.html') != null
        || window.location.href.match('MostraAnnuncio.html') != null) {
            document.getElementById("reg").style.display = "none";  
            document.getElementById("login").style.display = "none";  
        }
    }  

    if(tipo == "NOSESSION") {
        document.getElementById("ns").style.display = "none";    
        document.getElementById("comquest").style.display = "none"; 
        document.getElementById("rend").style.display = "none";    
        document.getElementById("logout").style.display = "none";            
    }
});
