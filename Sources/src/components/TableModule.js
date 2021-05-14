import React from 'react';
const fetch = require('node-fetch');

class TableModule extends React.Component {
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
        var url = 'http://obiwan2.univ-brest.fr:7155/getModules/' + localStorage.getItem("idUtilisateur");
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
                <div className={"Intitule"}>Mes Modules</div>
                <table className={"scroll"} key="tableModule">
                    <thead key="theadModule">
                        <tr key="colonnesModule">
                            <th></th>
                            <th>Nom du module</th>
                            <th>Niveau(x)</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody key="tbodyModule">
                        {
                            this.state.modules.map(module => (
                                <tr key={"ligne " + module.idModule} >
                                    <td>
                                        <input type="radio" id={module.idModule} name="module" key={module.idModule} onChange={e => this.selectModule(e)} />
                                    </td>
                                    <td id={"nomModule-" + module.idModule}>
                                        {module.nom}
                                    </td>
                                    <td id={"niveauxModule-" + module.idModule}>
                                        {module.niveaux.map(n => {
                                                return(n +" ") 
                                            }
                                        )}
                                    </td>
                                    <td id={"descriptionModule-" + module.idModule}>
                                        {module.description}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className="DivBoutonTab">
                        <input className="Creer" type="button" value="Créer" onClick={e => this.choix(e)}/>
                        <input className="Supprimer" type="button" value="Supprimer" onClick={e => this.choix(e)}/>
                        <input className="Modifier" type="button" value="Modifier" onClick={e => this.choix(e)}/>
                </div>
                <p id="etat"></p>
                <div id="choixModule">
                </div>
            </div>
        )
    }
}

export default TableModule;