import React, { useEffect, useState } from 'react';
const fetch = require('node-fetch');

// const state = {
//     nomUP : "",
//     idEnseignant : -1,
//     idUP : -1
// }

function ModifierUP(){
    const [inputListURL, setInputListURL] = useState([{url : ""}]);
    const [inputListCD, setInputListCD] = useState([{cd : ""}]);
    const [nomUP, setNomUP] = useState("");
    const [idEnseignant, setidEnseignant] = useState(-1);
    const [idUP, setidUP] = useState(-1);

    useEffect(() => {
        console.log(localStorage.getItem("idUniteSelected"));
        var url = "http://obiwan2.univ-brest.fr:7155/getUP/" + localStorage.getItem("idUniteSelected");
        var options = {
            method: 'GET',
            body: null,
            headers: { 'Content-Type': 'application/json' }
        }
        fetch(url,options).then(response => {
            response.json().then(infos => {
                console.log(infos);
                // state.nomUP = infos.nomUP;
                // state.idEnseignant = infos.idUtilisateur;
                // state.idUP = infos.idUP;
                var listeURL = [...infos.url];
                var listeCD = [...infos.cd];
                var lesURL = [];
                var lesCD = [];
                listeURL.forEach(element => {
                    lesURL.push({url : element})
                })
                listeCD.forEach(element => {
                    lesCD.push({cd : element});
                })
                setNomUP(infos.nomUP);
                setidEnseignant(infos.idUtilisateur);
                setidUP(infos.idUP);
                setInputListURL(lesURL);
                setInputListCD(lesCD);
            });
        });
    }, []);
    

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
        // state.nomUP = e.target.value;
        var nom = nomUP;
        nom = e.target.value;
        setNomUP(nom);
    }

    const submit = (event) => {
        event.preventDefault();
        if(idEnseignant !== -1 && idUP !== -1 && nomUP !== ""){ 
            var data = {
                idEnseignant : idEnseignant,
                idUP : idUP,
                nomUP : nomUP.trim(),
                urlUP : [],
                descriptionUP : []
            }
            var lesURL = [...inputListURL];
            var lesCD = [...inputListCD];
            if(lesURL.length !== 0 && lesCD.length !== 0){
                lesURL.forEach(element => {
                    data.urlUP.push(element.url.trim());
                })
                lesCD.forEach(element => {
                    data.descriptionUP.push(element.cd.trim());
                })
                var url = "http://obiwan2.univ-brest.fr:7155/majUP"
                var options = {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' }
                }
                console.log(data);
                fetch(url,options).then(response => {
                    response.json().then(infos => {
                        console.log(infos);
                        if(infos.error !== undefined){
                            document.getElementById("etat").innerHTML = "L'unité pédagogique n'a pas été modifiée !";
                        }else{
                            document.getElementById("etat").innerHTML = "L'unité pédagogique à été modifiée !";
                            localStorage.removeItem("idUniteSelected");
                            window.location.href = "/Accueil";
                        }
                    });
                });
            }else{
                document.getElementById("etat").innerHTML = "Il faut indiquer au moins 1 url et 1 chaine descriptive !";
            }
        }
    }

    return(
        <div id="ModificationUP">
            <div className={"centerForm"}>
                <form className={"formulaireUP"} onSubmit={submit}>
                    <div className={"identification"} >
                        <input type="text" name="nomUP" value={nomUP} className="nomUP" required onChange={e => changeNomUP(e)} />
                        <label htmlFor="nomUP">Nom de l'unité pédagogique : </label>
                    </div>
                    <div className="listeInputURL">
                        <p className="MessageSeparation">Saisir une ou plusieurs URL</p>
                        {
                            inputListURL.map((x, i) => {
                                return(
                                    <React.Fragment>
                                        <div className={"identification"} key={"urlBlock" + i}>
                                            
                                            <input key={"URLinput" + i} name="url" value={x.url} required onChange={e => handleInputChangeURL(e, i)} />
                                            <label htmlFor="nomUP">URL </label>
                                        </div>
                                            <div key={"btn-boxURL" + i} className="btn-boxURL">
                                                {inputListURL.length !== 1 && <button key={"URLsuppr" + i} className="RemoveBouton" onClick={() => handleRemoveClickURL(i)}>Remove</button>}
                                                {inputListURL.length - 1 === i && <button key={"URLadd" + i} className="AnnulerForm"  onClick={handleAddClickURL}>Add</button>}
                                            </div>
                                    </React.Fragment>
                                )
                            })
                        }
                    </div>
                    <div className="listeInputCD">
                    <p className="MessageSeparation">Saisir une ou plusieurs chaines descriptives</p>
                        {inputListCD.map((x, i) => {
                            return(
                                <React.Fragment> 
                                    <div key={"chainesDescriptives" + i}  className={"identification"}>
                                        <input key={"CDinput" + i} name="cd" value={x.cd} required  onChange={e => handleInputChangeCD(e, i)} />
                                        <label htmlFor="nomUP">Nom de la chaine descriptive </label>
                                    </div>
                                    <div key={"btn-boxCD" + i} className="btn-boxCD">
                                            {inputListCD.length !== 1 && <button key={"CDsuppr" + i} className="RemoveBouton" onClick={() => handleRemoveClickCD(i)}>Remove</button>}
                                            {inputListCD.length -1 === i && <button key={"CDadd" + i} className="AnnulerForm" onClick={handleAddClickCD}>Add</button>}
                                        </div>
                                </React.Fragment>
                            )
                        })}
                    </div>
                        <div className="DivBoutonForm">
                            <a className="AnnulerForm" href={"/Accueil"}> Annuler </a>
                            <button className="ModifierForm" type="submit"> Modifier </button>
                        </div>
                    <p id="etat"></p>
                </form>
            </div>
        </div>
    )
}

export default ModifierUP;