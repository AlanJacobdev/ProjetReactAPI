import React, { useState, useEffect } from 'react';
import "./../css/Formulaire.css";
const fetch = require('node-fetch');

function ModifierModule () {
    const [data, setData] = useState({});
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

    useEffect(() => {
        var url= "http://obiwan2.univ-brest.fr:7155/getUnModule/" + localStorage.getItem("idModuleSelected");
        var options = {
            method: 'GET',
            body: null,
            headers: { 'Content-Type': 'application/json' }
        }
        fetch(url,options).then(response => {
            response.json().then(infos => {
                setData(infos);
            });
        });
    }, []);

    const handleChangeNomModule = (e) => {
        const donnees = [...data];
        donnees.nom = e.target.text;
        setData(donnees);
    }

    const handleChangeDescription = (e) => {
        const donnees = [...data];
        donnees.description = e.target.text;
        setData(donnees);
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

    const submit = (e) => {
        e.preventDefault();
        var comp = document.getElementById("nomModule");
        var nomModule = comp.innerHTML;
        if(nomModule === ""){
            nomModule = comp.value;
        }
        comp = document.getElementById("MatiereModule");
        var descriptionModule = comp.innerHTML;
        if(descriptionModule === ""){
            descriptionModule = comp.value;
        }
        var data = {
            idModule : localStorage.getItem("idModuleSelected"),
            nomModule : nomModule.trim(),
            descriptionModule : descriptionModule.trim(),
            idEnseignant : localStorage.getItem("idUtilisateur"),
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
            var url = "http://obiwan2.univ-brest.fr:7155/majModule"
            var options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch(url,options).then(response => {
                response.json().then(infos => {
                    console.log(infos);
                    if(infos.error !== undefined){
                        document.getElementById("erreur").innerHTML = "Le module n'a pas été modifier !";
                    }else{
                        document.getElementById("erreur").innerHTML = "Le module à été modifier !";
                        localStorage.removeItem("idModuleSelected");
                        window.location.href = "/Accueil";
                    }
                });
            });
        }else{
            document.getElementById("erreur").innerHTML = "Il faut sélectionner au moins 1 niveau !";
        }
    }

    return(
        <React.Fragment>
            <div className={"centerForm"}>
                <form className={"formulaireUP"} onSubmit={submit}>
                    <div className={"identification"}>
                        <input id="nomModule" value={data.nom} type="text" required name="nomModule" onChange={e => handleChangeNomModule(e)} />
                        <label htmlFor="nomModule">Nom du module  </label>
                    </div>
                    <div className={"identification"}> 
                        <input id="MatiereModule" type="text" required value={data.description} name="MatiereModule" onChange={e => handleChangeDescription(e)} />
                        <label htmlFor="MatiereModule">Matière </label>
                    </div>  
                        <p className={"MessageSeparation"}>Niveau(x) </p>
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
                            <button className="ValiderForm" id="submit" type="submit">Modifier</button>
                        </div>
                    </form>
                </div>
            </React.Fragment>
    )
}

export default ModifierModule;

