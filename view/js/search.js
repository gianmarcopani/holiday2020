//inserire i parametri di input mancanti in cercaListaAnnunci
var filtri = [];
var dim;
window.onload = function() {
	if(window.location.href.match('ListaAnnunci.html') != null) {
		filtri = [];
		var localita = getQueryVariable("localita");
		var checkin = getQueryVariable("checkin");
		var checkout = getQueryVariable("checkout");
		var ospiti = getQueryVariable("ospiti");
		var camere = getQueryVariable("camere");

		localStorage.removeItem("annunci");
		localStorage.removeItem("soggiorno");

		mostra(localita, checkin, checkout, ospiti, camere);
	}

	else if(window.location.href.match('MostraAnnuncio.html') != null) {
		/*var localita = getQueryVariable("localita");
		var checkin = getQueryVariable("checkin");
		var checkout = getQueryVariable("checkout");
		var ospiti = getQueryVariable("ospiti");
		var camere = getQueryVariable("camere");*/
		var id_ann = getQueryVariable("id_ann");
		var id = getQueryVariable("id");  //indice di un annuncio nel localStorage.
		mostraAnnuncio(id_ann, id);

		//ricavo le coordinate per la mappa
	}
}

function applicaFiltri() {
	var scelte = [];
	for(var i=1; i<=6; i++) {
		if(i<=3) {
			scelte[i-1] = document.getElementById("filtro"+i).checked;
			if(scelte[i-1]==true)
				scelte[i-1]=1;
			else
				scelte[i-1]=0;	
		}
		else
			scelte[i-1] = document.getElementById("filtro"+i).value;			
	}

	for(var i=0; i<dim; i++) {
		var annhide = document.getElementById(i);
		if(filtri[i].parcheggio != scelte[0])
			annhide.style.display = "none";		
		else if(filtri[i].colazione != scelte[1])
			annhide.style.display = "none";
		else if(filtri[i].piscina != scelte[2])
			annhide.style.display = "none";
		else if(filtri[i].bagni < scelte[3]) 
			annhide.style.display = "none";
		else if(filtri[i].lettiMatrimoniali < scelte[4])
			annhide.style.display = "none";
		else if(filtri[i].lettiSingoli < scelte[5])
			annhide.style.display = "none";
		else
			annhide.style.display = "block";
	}
}

function clickCerca(localita, checkin, checkout, ospiti, camere) {
	window.open("../view/ListaAnnunci.html?action=searchlist&localita="+localita+"&checkin="+checkin+
	"&checkout="+checkout+"&ospiti="+ospiti+"&camere="+camere,"_self", true);

	return false;
}

function mostra(localita, checkin, checkout, ospiti, camere) {
	var res = richiedi("../../controller/search?action=searchlist&localita="+localita+"&checkin="+checkin+
						"&checkout="+checkout+"&ospiti="+ospiti+"&camere="+camere);

    if (res == "ERR") {
		alert("Errore!");
		return false;
	}

	else {
		if(res == "NORES") {
			alert("Nessun risultato!");
			return false;			
		}

		else {
			var listaAnnunci = JSON.parse(res);
			dim = listaAnnunci.length;
			var soggiorno = {'checkin' : checkin, 'checkout' : checkout, 'ospiti' : ospiti, 'camere' : camere};
			localStorage.setItem("soggiorno", JSON.stringify(soggiorno));
			localStorage.setItem("annunci", JSON.stringify(listaAnnunci));

			var container = document.getElementById("listaAnnunci");
			for(var i=0;i<listaAnnunci.length;i++) {
				filtri[i] = {'parcheggio':listaAnnunci[i].parcheggio, 'colazione':listaAnnunci[i].colazione,
							'bagni':listaAnnunci[i].bagni, 'piscina':listaAnnunci[i].piscina, 'lettiSingoli':listaAnnunci[i].lettiSingoli,
							'lettiMatrimoniali':listaAnnunci[i].lettiMatrimoniali};
				container.innerHTML+=
				"<div id='"+i+"' class='card mb-1'>"+
					"<div class='row no-gutters'>"+
						"<div class='col-md-2'>"+
							"<img src='immagini/montagna.jpg' class='card-img' alt='...'>"+
						"</div>"+
						"<div class='col-md-8'>"+
							"<div class='card-body'>"+
								"<a class='card-link' href='#'>"+listaAnnunci[i].titolo+"</a>"+
								"<p class='card-text'>"+listaAnnunci[i].descrizione+"</p>"+
								"<h3>"+listaAnnunci[i].prezzo+"€"+"</h3>"+
								"<button type='button' onClick='clickAnnuncio("+ listaAnnunci[i].id_annuncio +", "+i+")' class='btn btn-dark'>Mostra</button>"+
							"</div>"+
						"</div>"+
					"</div>"+
				"</div>";
			}
			console.log(filtri)
		}
	}
    return true;
}

function clickAnnuncio(id_ann, id) {
	var oldUrl = window.location.href.split("searchlist")[1];
	window.open("../view/MostraAnnuncio.html?action=searchad"+oldUrl+"&id_ann="+id_ann+"&id="+id,"_self", true);

	return false;
}

function mostraAnnuncio(id_ann, id) {
	var res = richiedi("../../controller/search?action=searchad&id_ann="+id_ann);

    if (res == "ERR") {
		alert("Errore!");
		return false;
	}

	var annuncio = JSON.parse(res);
	var storage = JSON.parse(localStorage.getItem("annunci"));

	var contattomail = document.getElementById("email");
	contattomail.innerHTML+="E-mail: "+annuncio[0].email_locatore_fk;

	var titolo = document.getElementById("titolo");
	titolo.innerHTML+=storage[id].titolo;

	var container = document.getElementById("annuncio");
	for(var i=0;i<annuncio.length;i++) {
		container.innerHTML+=
		"<h4>Descrizione completa</h4>"+
		"<p>"+storage[id].descrizione+"</p>"+
		"<br>"+
		"<h5>Capienza:</h5>"+
		"<ul>"+
			"<li>Numero ospiti massimo: "+annuncio[i].num_ospiti_max+"</li>"+
			"<li>Numero camere: "+annuncio[i].num_camere_max+"</li>"+
		"</ul>"+
		"<br>"+
		"<h5>Servizi disponibili:</h5>"+
		"<ul>"+
			"<li>Parcheggio</li>"+
			"<li>Colazione</li>"+
			"<li>Piscina</li>"+
		"</ul>"+
		"<h4 class='prezzo'>"+storage[id].prezzo+"€/notte</h4>"+
		"<h6 class='prezzo'>a persona</h6>";
	}

	var foto = richiedi("../../controller/search?action=searchfoto&id_ann="+id_ann);

	if (foto == "ERR") {
		alert("Errore!");
		return false;
	}
	f = JSON.parse(foto);

	for(var i=0; i<f.length; i++) {
		document.getElementById("img"+i).src = f[i].nome;
	}

	var prenota = document.getElementById("prenota");
	prenota.innerHTML+="<button type='button' class='btn btn-success btn-lg float-right' data-toggle='modal' data-target='#modalPrenota' onClick='clickPrenota("+annuncio[0].id_alloggio+")'>Prenota</button>";
	
	queryMap(annuncio[0].localita);

    return true;
}

function queryMap(l) {
	var query_addr = l;
	const provider = new window.GeoSearch.OpenStreetMapProvider()
	var query_promise = provider.search({
		query: query_addr
	});

	query_promise.then(value => {
		for (i = 0; i < value.length; i++) {
			// Success!
			var x_coor = value[i].x;
			var y_coor = value[i].y;
			var label = value[i].label;
			var marker = L.marker([y_coor, x_coor]).addTo(map)
			marker.bindPopup("<b>Posizione alloggio</b><br>" + label).openPopup();
		};
	}, reason => {
		console.log(reason); // Error!
	});
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}