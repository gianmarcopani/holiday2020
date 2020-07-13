function registra(nome, cognome, email, psw, cnf_psw, telefono, ddn, ldn, ldr, idr, tipo) {
    var res = -1;

    if (matchPSW(psw, cnf_psw) == true) {
        res = richiedi("../../controller/registrazione?action=notificaConferma&nome="+nome+"&cognome="+cognome+"&email="+email+""+
        "&password="+psw+"&telefono="+telefono+"&ddn="+ddn+"&ldn="+ldn+"&ldr="+ldr+"&idr="+idr+"&tipo="+tipo+"");
    }

    else {
        alert("Le password non coincidono");
        return false;
    }
    if(res == "REG") {
        alert("Registrato!");
        window.open("../view/Login.html", "_self", false);
    }
    else {
        alert("Errore!");
        return false;
    }
    return false;
}

function matchPSW(pwd1, pwd2) {
    if(pwd1 == pwd2){
      return true;
    }
    return false;
}