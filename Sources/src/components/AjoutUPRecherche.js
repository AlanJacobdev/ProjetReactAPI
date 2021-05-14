import React, { useState, useEffect } from 'react';
import TableUPAjout from './TableUPAjout';
const fetch = require('node-fetch');

function AjoutUPRecherche() {
    const [options, setOptions] = useState(["nom", "prenom"]);
    const [ChainesDescriptives, setChainesDescriptives] = useState([]);
    const [instance, setInstance] = useState();

    useEffect(() => {
        var url = "http://obiwan2.univ-brest.fr:7155/listeUtilisateurs"
        var options = {
            method: 'GET',
            body: null,
            headers: { 'Content-Type': 'application/json' }
        }
        fetch(url,options).then(response => {
            response.json().then(infos => {
                console.log(infos);
                var data = [];
                for (let index = 0; index < infos.length; index++) {
                    data.push({
                        idUtilisateur : infos[index].idUtilisateur,
                        Nom : infos[index].Nom,
                        Prenom : infos[index].Prenom
                    })
                }
                setOptions(data);
            });
        });
    }, []);

    useEffect(() => {
        var url = "http://obiwan2.univ-brest.fr:7155/getChaineDescriptives"
        var options = {
            method: 'GET',
            body: null,
            headers: { 'Content-Type': 'application/json' }
        }
        fetch(url,options).then(response => {
            response.json().then(infos => {
                console.log(infos);
                setChainesDescriptives([...infos]);
            });
        });
    }, []);

    const onSelectedEns = (e) => {
        if(e.target.value !== "-1"){
            document.getElementById("select-filtreCD").selectedIndex = 0;
            document.getElementById("select-rechercheCD").selectedIndex = 0;
            document.getElementById("select-filtreUtilisateur").selectedIndex = 0;
            
            instance.majTableauEnseignant(e.target.value);
        }
    }

    const onSelectedCDFilter = (e) => {
        console.log(e.target.value)
        instance.filtreCD(e.target.value);
    }

    const onSelectedCD = (e) => {
        if(e.target.value !== -1){
            document.getElementById("select-RechercheUtilisateur").selectedIndex = 0;
            document.getElementById("select-filtreCD").selectedIndex = 0;        
            document.getElementById("select-filtreUtilisateur").selectedIndex = 0;
            
            instance.majTableauCD(e.target.value);
        }
    }

    const onSelectedEnsFilter = (e) => {
        console.log(e);
        instance.filtreEns(e.target.value);
    }

    const addinstance = (instance) => {
        setInstance(instance);
    }

    return(
        <div className={"DivSelectUP"} id="tableModule">
            <div id="ajoutUPRecherche-enseignant">
                <p className={"MessageSeparation"}>Recherche par Utilisateur avec un filtre sur une chaine descriptive</p>
                <div id="rechercheUtilisateur">
                <div class="selectdiv">
                    <select id={"select-RechercheUtilisateur"} onChange={e => onSelectedEns(e)}>
                        <option value={-1}>Selectionnez un utilisateur</option>
                        {
                            options.map((x, i) => {
                                return(
                                    <option key={i} value={x.idUtilisateur}>{x.Nom + " " + x.Prenom}</option>
                                )
                            })
                        }
                    </select>
                </div>
                </div>
                <div id="filtreCD"> 
                    <div class="selectdiv">
                        <select id={"select-filtreCD"} onChange={e => onSelectedCDFilter(e)}>

                            <option value={-1}>Selectionnez une chaine descriptive</option>
                            {
                                ChainesDescriptives.map((x, i) => {
                                    return(
                                        <option key={i} value={x.nom}>{x.nom}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div id="ajoutUPRecherche-chainesDescriptives">
                <p className={"MessageSeparation"}>Recherche par chaine descriptive avec un filtre sur un utilisateur</p>
                <div id="rechercheCD">
                    <div class="selectdiv">
                        <select id={"select-rechercheCD"} onChange={e => onSelectedCD(e)}>
                            <option value={-1}>Selectionnez une chaine descriptive</option>
                            {
                                ChainesDescriptives.map((x, i) => {
                                    return(
                                        <option key={i} value={x.nom}>{x.nom}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
                <div id="filtreUtilisateur">
                    <div class="selectdiv">
                        <select id={"select-filtreUtilisateur"} onChange={e => onSelectedEnsFilter(e)}>
                            <option value={-1}>Selectionnez un utilisateur</option>
                            {
                                options.map((x, i) => {
                                    return(
                                        <option key={i} value={x.idUtilisateur}>{x.Nom + " " + x.Prenom}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
            </div>
            <TableUPAjout ref={instance => addinstance(instance)} />
        </div>
    )
}

export default AjoutUPRecherche;