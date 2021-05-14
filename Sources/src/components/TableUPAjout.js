import React from 'react';
const fetch = require('node-fetch');

class TableUPAjout extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            idUtilisateur : -1,
            lesUP : [],
            idUPSelected : -1,
            lesUPsTrier : [],
            cdSelected : "",
        } 
    }

    majTableauEnseignant = (e) => {
        console.log("MAJ TABLEAU ENSEIGNANT : " + e);
        this.setState({idUtilisateur : e});
        if(e !== -1){
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            var url = 'http://obiwan2.univ-brest.fr:7155/getLesUPEnseignant/' + e;
            console.log(url);
            fetch(url, requestOptions)
            .then(result => result.json())
            .then(result => {
                this.setState({lesUP : result});
                this.setState({lesUPsTrier : result});
            });
        }
    }

    filtreCD = (e) => {
        console.log("FILTRE CD : " + e);
        if(e !== -1){
            var nouvelleListe = [];
            if(this.state.lesUP.length > 0){
                ([...this.state.lesUP]).forEach(element => {
                    let listeCD = [...element.lstCD];
                    listeCD.forEach(cd => {
                        if(cd === e){
                            nouvelleListe.push(element);
                        }
                    })
                })
            }
            this.setState({lesUPsTrier : nouvelleListe});
        }else{
            this.setState({lesUPsTrier : this.state.lesUP});
        }
    }

    majTableauCD = (e) => {
        console.log("MAJ TABLEAU CD : " + e);
        this.setState({cdSelected : e});
        if(e !== ""){
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            var url = 'http://obiwan2.univ-brest.fr:7155/getUPChaineDescriptive/' + e;
            console.log(url);
            fetch(url, requestOptions)
            .then(result => result.json())
            .then(result => {
                this.setState({lesUP : result});
                this.setState({lesUPsTrier : result});
            });
        }
    }

    filtreEns = (e) => {
        console.log("FILTRE ENS : " + e);
        if(e !== -1){
            var nouvelleListe = [];
            if(this.state.lesUP.length > 0){
                console.log(this.state.lesUP);
                ([...this.state.lesUP]).forEach(element => {
                    console.log(element.idEnseignant + " " + e)
                    if(element.idEnseignant === parseInt(e, 10)){
                        nouvelleListe.push(element);
                    }
                })
            }
            console.log(nouvelleListe);
            this.setState({lesUPsTrier : nouvelleListe});
        }else{
            this.setState({lesUPsTrier : this.state.lesUP});
        }
    }

    ajouter = (e) => {
        console.log("UP SELECTED : " + this.state.idUPSelected);
        console.log("ID UTILISATEUR : " + this.state.idUtilisateur);
        if(this.state.idUPSelected !== -1 && this.state.idUtilisateur !== -1){
            switch(e.target.value){
                case "Ajouter":
                    var infosModule = JSON.parse(localStorage.getItem("infosModule"));
                    var data = {
                        idUP : this.state.idUPSelected,
                        idModule : infosModule.idModule,
                        nomModule : infosModule.nomModule,
                        idEnseignant : localStorage.getItem("idUtilisateur"),
                        descriptionModule : infosModule.descriptionModule
                    }
                    const requestOptions = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    };
                    var url = 'http://obiwan2.univ-brest.fr:7155/ajoutUP';
                    fetch(url, requestOptions)
                    .then(result => result.json())
                    .then(result => {
                        console.log(result)
                        window.location.href = "/Accueil";
                    });
                    break;
                default:
                    break;
            }
        }
    }

    check = (e) => {
        this.setState({idUPSelected : e.target.id});
    }

    render(){
        return(
            <div id="tableUP">
                <table className={"TableauUPAdd"} key="tableUP">
                    <thead key="theadUP">
                        <tr key="colonnesUP">
                            <th></th>
                            <th>Créateur de l'unitée</th>
                            <th>Intitulé de l'unité</th>
                            <th>Chaines descriptives</th>
                            <th>Les URL</th>
                        </tr>
                    </thead>
                    <tbody key="tbodyUP">
                        {
                            this.state.lesUPsTrier.map(up => (
                                <tr key={up.idUP}>
                                    <td >
                                        <input type="radio" id={up.idUP} key={"checkbox-" + up.idUP} name="up" onChange={e => this.check(e)} />
                                    </td>
                                    <td className={"tabRowEnseignant"}>
                                        {up.nom + " " + up.prenom}
                                    </td>
                                    <td className={"tabRowUP"}>
                                        {up.nomUP}
                                    </td>
                                    <td className={"tabRowCD"}>
                                        {up.lstCD.map(cd => {
                                            return(cd + " - ");
                                        })}
                                    </td>
                                    <td className={"tabRowURL"}>
                                        {up.lstURL.map(url => {
                                            return(url + " - ");
                                        })}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className="DivBoutonForm">
                    <a className="AnnulerForm" href={"/Accueil"}> Annuler </a>
                    <input className="ValiderForm" type="button" value="Ajouter" onClick={e => this.ajouter(e)}/>
                 </div>
                
            </div>
        )
    }
}

export default TableUPAjout;