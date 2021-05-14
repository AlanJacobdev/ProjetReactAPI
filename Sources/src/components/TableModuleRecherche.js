import React from 'react';
const fetch = require('node-fetch');

class TableModuleRecherche extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            modules : [],
            idModuleSelected : -1
        }
    }

    componentDidMount = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        var url = 'http://obiwan2.univ-brest.fr:7140/modules';
        fetch(url, requestOptions)
        .then(result => result.json())
        .then(result => {
            console.log("GET MODULES : " + result);
            this.setState({modules : result.Modules});
        });
    }

    choix = (e) => {
        if(this.idModuleSelected === -1) {
            document.getElementById("etat").innerHTML = "Il faut sélectionner un module !";
        }else{
            switch(e.target.value){
                case "Créer":
                    window.location.href = "/AjoutModule";
                    break;
                case "Modifier":
                    localStorage.setItem("idModuleSelected", this.state.idModuleSelected);
                    if(this.state.idModuleSelected !== -1){
                    window.location.href = "/ModifierModule";
                    }else{
                        document.getElementById("etat").innerHTML = "Il faut sélectionner 1 module !";
                    }
                    break;
                case "Supprimer":
                    if(this.state.idModuleSelected !== -1){
                        var data = {
                            idModule : this.state.idModuleSelected
                        }
                        const requestOptions = {
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        };
                        var url = 'http://obiwan2.univ-brest.fr:7155/supprimerModule/'
                        fetch(url, requestOptions)
                        .then(result => result.json())
                        .then(result => {
                            console.log(result);
                            window.location.href = "/Accueil";
                        });
                    }else{
                        document.getElementById("etat").innerHTML = "Il faut sélectionner 1 module !";
                    }
                    break;
                default:
                    break;
            }
        }
    }

    selectModule = (e) => {
        this.setState({idModuleSelected : e.target.id});
        var data = {
            idUtilisateur : localStorage.getItem("idUtilisateur"),
            idModule : e.target.id,
            nomModule : document.getElementById("nomModule-" + e.target.id).innerText,
            descriptionModule : document.getElementById("descriptionModule-" + e.target.id).innerText
        }
        this.props.selectModule(data);
    }

    render(){
        return(
            <div className={"TabModule"} id="tableModule">
                <div className={"Intitule"}>Les Modules</div>
                <table className={"scroll"} key="tableModule">
                    <thead key="theadModule">
                        <tr key="colonnesModule">
                            <th></th>
                            <th >Enseignant</th>
                            <th >Nom du module</th>
                            <th>Niveau(x)</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody key="tbodyModule">
                        {
                            this.state.modules.map(module => (
                                <tr key={"ligne " + module.idModule} >
                                    <td id={"id-" + module.idModule} >
                                        <input type="radio" id={module.idModule} name="module" key={module.idModule} onChange={e => this.selectModule(e)} />
                                    </td>
                                    <td className ={"tabEnseignant"} id={"Enseignant-" + module.idModule}>
                                        {module.nomUtilisateur +' '+module.prenomUtilisateur}
                                    </td>
                                    <td className ={"tabModule"} id={"nomModule-" + module.idModule}>
                                        {module.nom}
                                    </td>
                                    <td className ={"tabNiveaux"} id={"niveauxModule-" + module.idModule}>
                                        {module.niveaux.map(n => {
                                                return(n +" ") 
                                            }
                                        )}
                                    </td>
                                    <td className={"tabDescription"}  id={"descriptionModule-" + module.idModule}>
                                        {module.description}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default TableModuleRecherche;