import React, { useState } from 'react';
const fetch = require('node-fetch');

const state = {
    nomUP : ""
}

function AjoutUPFormulaire() {
    const [inputListURL, setInputListURL] = useState([{url : ""}]);
    const [inputListCD, setInputListCD] = useState([{cd : ""}]);

    

    const handleInputChangeURL = (e, index) => {
        const {name, value} = e.target;
        const list = [...inputListURL];
        list[index][name] = value;
        setInputListURL(list);
    }

    const handleRemoveClickURL = index => {
        const list = [...inputListURL];
        list.splice(index, 1);
        setInputListURL(list);
    }

    const handleAddClickURL = () => {
        setInputListURL([...inputListURL, {url : ""}]);
    }

    const handleInputChangeCD = (e, index) => {
        const {name, value} = e.target;
        const list = [...inputListCD];
        list[index][name] = value;
        setInputListCD(list);
    }

    const handleRemoveClickCD = index => {
        const list = [...inputListCD];
        list.splice(index, 1);
        setInputListCD(list);
    }

    const handleAddClickCD = () => {
        setInputListCD([...inputListCD, {cd : ""}]);
    }

    const changeNomUP = (e) => {
        state.nomUP = e.target.value;
    }

    const submit = (event) => {
        console.log(state.nomUP);   
        event.preventDefault();
        var infosModule = JSON.parse(localStorage.getItem("infosModule"));
        var data = {
            idEnseignant : localStorage.getItem("idUtilisateur"),
            idModule : infosModule.idModule,
            nomModule : infosModule.nomModule,
            descriptionModule : infosModule.descriptionModule,
            nomUnite : state.nomUP,
            chaineDesc : [],
            urlUnite : []
        }
        
        const listURL = [...inputListURL];
        listURL.forEach(url => {
            data.urlUnite.push(url.url.trim());
        })
        
        const listCD = [...inputListCD];
        listCD.forEach(cd => {
            data.chaineDesc.push(cd.cd);
        })

        console.log(data);

        var url = "http://obiwan2.univ-brest.fr:7155/creerUP"
        var options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch(url,options).then(response => {
            response.json().then(infos => {
                console.log(infos);
                if(infos.erreur !== undefined){
                    document.getElementById("etat").innerHTML = "L'unitée pédagogique n'a pas été créer !"
                }else{
                    document.getElementById("etat").innerHTML = "L'unitée pédagogique à été créer !"
                    localStorage.removeItem("infosModule");
                    window.location.href = "/Accueil";
                }
            });
        });
    }

    

    return(
        <div id="CreationUP">
            <div className={"TabCreateUP"} id="tableUP">
                <form className={["paddingTop", "formulaireUP"].join(' ')} onSubmit={submit}>
                    <div className={"identification"} >
                        <input maxLength={120}  type="text" name="nomUP" required onChange={e => changeNomUP(e)} />
                        <label htmlFor="nomUP">Nom de l'unité pédagogique </label>
                    </div>
                        <div className="listeInputURL">
                            <p className="MessageSeparation">Saisir une ou plusieurs URL</p>
                            {inputListURL.map((x, i) => {
                                return (
                                    <React.Fragment>
                                        <div className={"identification"} key={"urlBlock" + i} >
                                            <input maxLength={120} key={"URLinput" + i} required name="url" value={x.url} onChange={e => handleInputChangeURL(e, i)}/>
                                            <label htmlFor="nomUP">URL </label>
                                            
                                        </div>
                                        <div key={"btn-boxURL" + i} >
                                        {inputListURL.length !== 1 && <button key={"URLsuppr" + i} className="RemoveBouton" onClick={() => handleRemoveClickURL(i)}>Supprimer</button>}
                                        {inputListURL.length - 1 === i && <button key={"URLadd" + i} className="AnnulerForm" onClick={handleAddClickURL}>Ajouter</button>}
                                        </div>
                                    </React.Fragment>
                                    
                                )
                            })}
                        </div>
                        <div className="listeInputCD">
                            <p className="MessageSeparation">Saisir une ou plusieurs chaines descriptives</p>
                            {inputListCD.map((x, i) => {
                                return(
                                    <React.Fragment>
                                        <div key={"chainesDescriptives" + i} className={"identification"}>
                                            <input maxLength={30} key={"CDinput" + i} name="cd" value={x.cd} required onChange={e => handleInputChangeCD(e, i)} />
                                            <label htmlFor="nomUP">Nom de la chaine descriptive </label>
                                        </div>
                                        <div key={"btn-boxCD" + i} >
                                                {inputListCD.length !== 1 && <button key={"CDsuppr" + i} className="RemoveBouton" onClick={() => handleRemoveClickCD(i)}>Supprimer</button>}
                                                {inputListCD.length -1 === i && <button key={"CDadd" + i} className="AnnulerForm" onClick={handleAddClickCD}>Ajouter</button>}
                                        </div>
                                    </React.Fragment>
                                )
                            })}
                        </div>
                        <div className="DivBoutonForm">
                            <a className="AnnulerForm" href={"/Accueil"}> Annuler </a>
                            <button className="ValiderForm" type="submit"> Créer </button>
                        </div>
                    <p id="etat"></p>
                </form>
            </div>
        </div>
    )
}

export default AjoutUPFormulaire;