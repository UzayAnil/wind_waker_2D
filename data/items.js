// Ce fichier contient les fonctions relatives à l'utilisation d'items par les héros
// Il y a ici les fonctions attack() GPS() changeColor() addObj() donnerHeros()

function attack(n,x){
    // Sert quand le joueur appuie sur sa touche d'action 
    if (edition == 1){
        if (editPlate == 0){
            edition = 0;
            drawInterface = AInterface;
            casePencil = ["ah","ah"];
            console.log(Map.getString());
        }
        return;
    }
    if (heros[n].imgUp != 0){
        if (heros[n].plane == 1) {
            heros[n].plane = 0;
            heros[n].imgUp = 0;
            heros[n].imgN = 0;
        }
        return;
    }
    if (heros[n].carry[0] != 0){
        heros[n].carry[0] = 0;
        ennemis[heros[n].carry[1]].throw(heros[n].sens);
        heros[n].img = 0;
        return;
    }
    if (x == 1) {
        var use = heros[0].prim;
    }
    else var use = heros[n].invent[heros[n].objet];
    var controlKeys = [[38,39,40,37],[101,99,98,97]];
    var grassContent = ["","","","rubisVert","rubisVert","rubisBleu"];
    var truc = Map.getObject(heros[n].x + vecteurs[heros[n].sens][1],heros[n].y + vecteurs[heros[n].sens][0],0);
    ennemis.forEach(
        function (e,ii){
            if (e.isThere(heros[n].x + vecteurs[heros[n].sens][1]*0.5,heros[n].y + vecteurs[heros[n].sens][0]*0.5,heros[n].z)){
                heros[n].carry[0] = 1;
                heros[n].carry[1] = ii;
                e.carried(n);
                heros[n].img = 12;
            }
        }
    );
    if (heros[n].carry[0] != 0) return;
    var XX = heros[n].x + vecteurs[heros[n].sens][1];
    var YY = heros[n].y + vecteurs[heros[n].sens][0];
    if ((truc == "coffre0" || truc == "porte0" || truc == "pot" || truc == "PNJ" || truc == "checkPoint" || truc == "unCheckPoint") &&
        Math.abs(Map.getAlti(XX,YY) - Map.getAlti(heros[n].x,heros[n].y)) < 1){
        
        if (truc == "coffre0"){
            Map.replaceObject(XX,YY,"coffre1",0);
            var contenu = Map.getObj(XX,YY);
            if (contenu.length > 1)donnerHeros(contenu[1],n);
            else donnerHeros("",n);
        }
        else if (truc == "porte0"){
            if (heros[n].cles > 0) {
                Map.replaceObject(XX,YY,"",0);
                heros[n].cles -= 1;
            }
            else{ alert("Cette porte est verouillée."); figer = 1;}
        }
        else if (truc == "PNJ"){
            if (alerting == 0){
                questPNJ(XX,YY,n);
                say(Map.getObj(XX,YY)[2],XX,YY,n);
            }
            else unsay();
        }
        else if (truc == "pot"){
            if (heros[n].etat != 0) return;
            if (x == 1){
                if (heros[0].prim == "blank"){
                    heros[0].prim = "pot";
                }
                else{
                    return;
                }
            }
            else {
                heros[n].invent.push("pot");
                heros[n].objet = heros[n].invent.length - 1;
            }
            Map.suppressObject(XX,YY,1);
        }
        else if (truc == "checkPoint"){
            save();
        }
        else if (truc == "unCheckPoint"){
            unSave();
        }
    }
    else if (Map.getObject(XX,YY,1) == "PNJ"){
        var powerRanger = Map.getObj(XX,YY);
        powerRanger.splice(0,1);
        addParticles("object",XX + 0.5,YY + 0.5,heros[n].z+0.1,12,0,0,truc,powerRanger,"deliver");
        Map.setObject(XX,YY,[""],true);
    }
    else if (heros[n].etat == 0){
        if (use == "sword"){
            heros[n].wear = 1;
            chooseAnimObject(n);
        }
        else if (use == "boomerang"){
            boomerang.push({"x":heros[n].x,"y":heros[n].y,"vx":0,"vy":0,"sx":heros[n].x,"sy":heros[n].y,"r":0,"alti":Map.getAlti(heros[n].x,heros[n].y),"sens":heros[n].sens,"endu":10,"content":[]});
            if (x == 1) heros[n].prim = "blank";
            else{
                if (heros[n].invent.length == 1) heros[n].invent[0] = "blank";
                else {
                    heros[n].invent.splice(heros[n].objet,1);
                }
                if (heros[n].objet >= heros[n].invent.length) heros[n].objet -= 1;
            }
        }
        else if (use == "flowerRod"){
            if (Map.getFloor(heros[n].x,heros[n].y,heros[n].z) != Map.getAlti(XX,YY)) return;
            var machin = Map.getObject(XX,YY);
            if (machin[0] == ""){
                machin[0] = "herbe0";
            }
            else if (machin[0] == "herbe0") machin[0] = "herbe1";
            else if (machin[0] == "palmier") machin[0] = "palmier1";
            else if (machin[0] == "palmier1") machin[0] = "palmier";
            else if (machin[0] == "arbre0") machin[0] = "arbre1";
            else if (machin[0] == "arbre1") machin[0] = "arbre0";
            Map.setObject(XX,YY,machin,true);
            addParticles("flower",heros[n].x + vecteurs[heros[n].sens][1],heros[n].y + vecteurs[heros[n].sens][0],niveau[heros[n].y + vecteurs[heros[n].sens][0]][heros[n].x + vecteurs[heros[n].sens][1]],0,0,40);
        }
        else if (use == "pencil"){
            editHand = editObject[out];
            drawInterface = AEditInterface;
            editnumber = 1;
            editM = 0;
            if (edition == 0)edition = 1;
        }
        else if (use == "pot"){
            addParticles("object",heros[n].x+0.5,heros[n].y+0.5,heros[n].z+0.9,15,0.1*vecteurs[heros[n].sens][1],0.1*vecteurs[heros[n].sens][0],"pot",[""],"break");
            if (x == 1) heros[0].prim = "blank";
            else{
                heros[n].invent.splice(heros[n].objet,1);
                if (heros[n].objet == heros[n].invent.length) heros[n].objet -= 1;
                if (heros[n].invent.length == 0) heros[n].invent[0] = "blank";
            }
        }
        else if (use == "parachale"){
            if (heros[n].grap == 0 && heros[n].z != Map.getAlti(heros[n].x,heros[n].y)){
                heros[n].plane = 1;
                heros[n].imgUp = 2;
                heros[n].imgN = 0;
                heros[n].z = Math.ceil(heros[n].z);
            }
        }
        else if (use == "seeds"){
            if (heros[0].seedCount == 0) return;
            else if (out == 7){
                var machin = Map.getObject(XX,YY);
                if (machin[0] == "spe0"){
                    addParticles("flower",XX,YY,Map.getAlti(XX,YY),0,0,40);
                    heros[0].seedCount -= 1;
                    Map.setObject(XX,YY,["spe1",0,nPas],true);
                }
            }
        }
        else if (use == "maskWind"){
            cinematicos = 4;
            heros[n].etat = 1;
            imgCinema[0] = n;
            imgCinema[1] = "maskWind";
            imgCinema[2] = "hWind";
        }
        else if (use == "lettre"){
            /*
            var to = "martin@memora.tolokoban.org";
            var subject = "Niveau Maker's Pencil " + goto + " out="+out;
            var nnn = niveau;
            var ooo = objNiveau;
            var eee = ennemis;
            var to = "martin@memora.tolokoban.org";
            var subject = "Niveau Maker's Pencil out=" + out + " part A";
            var body = JSON.stringify(nnn);

            var link = document.createElement('a');
            link.setAttribute(
                'href',
                'mailto:' + to
                    + "?subject=" + encodeURI(subject)
                    + "&body=" + encodeURI(body)
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            subject = "Niveau Maker's Pencil out=" + out + " part B";
            body = JSON.stringify(ooo);

            link = document.createElement('a');
            link.setAttribute(
                'href',
                'mailto:' + to
                    + "?subject=" + encodeURI(subject)
                    + "&body=" + encodeURI(body)
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            subject = "Niveau Maker's Pencil out=" + out + " part C";
            body = JSON.stringify(eee);

            link = document.createElement('a');
            link.setAttribute(
                'href',
                'mailto:' + to
                    + "?subject=" + encodeURI(subject)
                    + "&body=" + encodeURI(body)
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            markedLevels.forEach(
                function (ee){
                    if (ee[0] != goto){
                        if (ee[1] == 1){
                            var llevel = iles[ee[0]];
                        }
                        else {
                            var llevel = interieurs[ee[0]];
                        }
                        var nnn = llevel.alti;
                        var ooo = llevel.obj;
                        var eee = llevel.ennemis;
                        var to = "martin@memora.tolokoban.org";
                        var subject = "Niveau Maker's Pencil " + ee[0] + " out=" + ee[1] + " part A";
                        var body = JSON.stringify(nnn);

                        var link = document.createElement('a');
                        link.setAttribute(
                            'href',
                            'mailto:' + to
                                + "?subject=" + encodeURI(subject)
                                + "&body=" + encodeURI(body)
                        );
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        subject = "Niveau Maker's Pencil " + ee[0] + " out=" + ee[1] + " part B";
                        body = JSON.stringify(ooo);

                        link = document.createElement('a');
                        link.setAttribute(
                            'href',
                            'mailto:' + to
                                + "?subject=" + encodeURI(subject)
                                + "&body=" + encodeURI(body)
                        );
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        subject = "Niveau Maker's Pencil " + ee[0] + " out=" + ee[1] + " part C";
                        body = JSON.stringify(eee);

                        link = document.createElement('a');
                        link.setAttribute(
                            'href',
                            'mailto:' + to
                                + "?subject=" + encodeURI(subject)
                                + "&body=" + encodeURI(body)
                        );
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }
            );
             */
        }
    }
}


function donnerHeros(obj,n){
    // Donne l'objet obj au héros n
    heros[n].sens = 2;
    heros[n].wear = 0;
    heros[n].aura = obj;
    alert(descriptionObj[obj]);
    figer = 1;
    if (obj == "rubisVert") heros[n].rubis += 1;
    else if (obj == "rubisBleu") heros[n].rubis += 5;
    else if (obj == "rubisRouge") heros[n].rubis += 20;
    else if (obj == "sword" || obj == "hookShot" || obj == "boomerang" || obj == "pencil" || obj == "lettre" || obj == "boat" || obj == "pot" || obj == "parachale" || obj == "baton" || obj == "maskWind" || obj == "flowerRod" || obj == "seeds"){
        quests.armes[obj] = 1;
        addObj(obj,n);
    }
    else if (obj == "cle0") {heros[n].cles += 1;}
    else if (obj == "cle1") {heros[n].cles += 5;}
    else if (obj == "fragment") {if (heros[n].vieTotale<20){heros[n].vieTotale += 1;}heros[n].vie = heros[n].vieTotale;}
    else if (obj == "rubisRouge") heros[n].rubis += 10000;
    else if (obj == "aiguille") quests.boussole += 2;
    else if (obj == "vitre") quests.boussole += 3;
}

function addObj(type,n){
    // Rajoute l'objet type dans l'inventaire de n
    if (heros[n].invent.length < 5){
        heros[n].invent.push(type);
        heros[n].objet = heros[n].invent.length - 1;
    }
    else if (n == 0 && heros[0].prim == "blank"){
        if (heros[0].prim == "blank") heros[0].prim = type;
    }
    else{
        objInvent.push(type);
    }
    chooseAnimObject(n);
}

function changeColor(){
    // Switch l'état des interrupteurs rouges et bleus
    // LOL bon bah à revoir absolument

}

function waterLevel(n){
    // Change la hauteur d'eau d'un facteur de n et déclenche la cinématique associée
    cinematicos = 7;
    imgCinema[0] = n;
}
