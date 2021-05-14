import {Menu} from './menu'
import React, { useState, useEffect } from 'react';
const fetch = require('node-fetch');

function AjoutModule() {
    const [nomModule, setNomModule] = useState("");
    const [matiereModule, setMatiereModule] = useState("");
    const [lstNiveaux, setLstNiveaux] = useState([]);

    useEffect(() => {
        var url= "http://obiwan2.univ-brest.fr:7155/getListeNiveaux";
        var options = {
            method: 'GET',
            body: null,
            headers: { 'Content-Type': 'application/json' }
        }
        fetch(url,options).then(response => {
            response.json().then(infos => {
                var liste = [...infos];
                liste.forEach(element => {
                    element.isChecked = false;
                })
                setLstNiveaux(liste);
            });
        });
    }, []);

    const handleChangeNomModule = (e) => {
        var nom = nomModule;
        nom = e.target.text;
        setNomModule(nom);
    }

    const handleChangeMatiereModule = (e) => {
        var matiere = matiereModule;
        matiere = e.target.text;
        setMatiereModule(matiere);
    }

    const check = (e) => {
        var idNiveau = parseInt(e.target.id, 10);
        var listeNiveaux = [...lstNiveaux];
        listeNiveaux.forEach(element => {
            if(element.idNiveau === idNiveau){
                if(element.isChecked){
                    element.isChecked = false;
                }else{
                    element.isChecked = true;
                }
            }
        })
        console.log(listeNiveaux);
        setLstNiveaux(listeNiveaux);
    }

    const submit = (event) => {
        event.preventDefault();
        var nom = document.getElementById("nomModule").value;
        var matiere = document.getElementById("MatiereModule").value;
        if(nom !== "" && matiere !== ""){
            var data = {
                idEnseignant : localStorage.getItem("idUtilisateur"),
                nomModule : nom.trim(),
                descriptionModule : matiere.trim(),
                lstIdNiveaux : []
            }
            const niveaux = [...lstNiveaux];
            niveaux.forEach(element => {
                if(element.isChecked){
                    data.lstIdNiveaux.push(element.idNiveau);
                }
            })
            console.log("DATA : " + JSON.stringify(data));
            if(data.lstIdNiveaux.length !== 0){
                const requestOptions = {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                var url = 'http://obiwan2.univ-brest.fr:7155/creerModule'
                fetch(url,requestOptions).then(response => {
                    response.json().then(infos => {
                        console.log(infos);
                        var idModule = infos._fields[0].properties.id.low;
                        if(idModule === -1){
                            document.getElementById("erreur").innerHTML = "Pas marcher !";
                        }else{
                            document.getElementById("erreur").innerHTML = "module créer, id : " + idModule + " !";
                            window.location.href = "/Accueil";
                        }
                    });
                });
            }else{
                document.getElementById("erreur").innerHTML = "Il faut sélectionner au moins 1 niveau !";
            }
        }else{
            document.getElementById("erreur").innerHTML = "Il faut nommer et décrire le nouveau module !";
        }
    }

    return (
        <React.Fragment>
            <Menu />
            <div className={"centerForm"}>
                <form  className={"formulaireUP"} onSubmit={submit}>
                    <div className={"identification"}>
                        <input id="nomModule" type="text" name="nomModule" required onChange={e => handleChangeNomModule(e)} />
                        <label htmlFor="nomModule">Nom du module </label>
                    </div>
                    <div className={"identification"}>
                        <input id="MatiereModule" type="text" name="MatiereModule" required onChange={e => handleChangeMatiereModule(e)} />
                        <label htmlFor="MatiereModule">Matière </label>
                    </div>
                        <p className={"MessageSeparation"} id="NiveauxModule">Niveau(x) </p>
                        <div className={"Separator"}></div>
                        {
                            lstNiveaux.map((x, i) => {
                                return (
                                    <div id={"lstNiveauxBlock-" + x.idNiveau} key={"lstNiveauxBlock-" + x.idNiveau}>
                                                <div class="grid">
                                                        <label key={"label-" + x.idNiveau} htmlFor={x.Niveau} class ="CheckLabel">{x.Niveau}</label>
                                                        <label class="checkbox path">  
                                                        <input id={x.idNiveau} key={"input-" + x.idNiveau} name={x.Niveau} checked={x.isChecked} type="checkbox" onChange={e => check(e)}/>
                                                            <svg viewBox="0 0 21 21">
                                                            <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                                                            </svg> 
                                                        </label>
                                                </div>
                                            </div>
                                )
                            })
                        }
                        <p id={"erreur"} className={"erreur"}></p>
                        <div className="DivBoutonForm">
                            <a className="AnnulerForm" href={"/Accueil"}> Annuler </a>
                            <button className="ValiderForm" id="submit" type="submit">Creer</button>
                        </div>
                </form>
            </div>
        </React.Fragment>
    )
}

export default AjoutModule;