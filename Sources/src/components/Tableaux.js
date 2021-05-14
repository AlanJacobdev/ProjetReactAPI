import React from 'react';
import {Menu} from "./menu";
import TableauAdmins from "./TableauAdmins";
import TableauUtilisateurs from "./TableauUtilisateurs";
import TableauEnseignants from "./TableauEnseignants";
import ReactDOM from "react-dom";
import "./../css/TableauxUtilisateurs.css";

export class Tableau extends React.Component{
    constructor(props) {
            super(props);
            this.state = {
                Actif : "" 
            };
    };

    componentDidMount() {
        let monAPI = "http://obiwan2.univ-brest.fr:7140/admins";

        fetch(monAPI)
            .then(response => response.json())
            .then(response => this.setState({ admins : response }))
            .catch(err => console.error(err))
    };
    
    choix = (e) => {
        const rootElement = document.getElementById("TableauxAfficher");
        var newElement;
        var oldElement
        switch(e.target.id){
            case "TabUtilisateurs":
                if(this.state.Actif !== ""){
                    oldElement = document.getElementById(this.state.Actif);
                    oldElement.classList.remove("Actif");
                }
                this.setState({ Actif : "TabUtilisateurs" })
                newElement = document.getElementById("TabUtilisateurs");
                newElement.classList.add("Actif");
                ReactDOM.render(<TableauUtilisateurs />, rootElement);
                break;
            case "TabEnseignants":
                if(this.state.Actif !== ""){
                    oldElement = document.getElementById(this.state.Actif);
                    oldElement.classList.remove("Actif");
                }
                this.setState({ Actif : "TabEnseignants" })
                newElement = document.getElementById("TabEnseignants");
                newElement.classList.add("Actif");
                ReactDOM.render(<TableauEnseignants />, rootElement);
                break;
            case "TabAdmins":
                if(this.state.Actif !== ""){
                    oldElement = document.getElementById(this.state.Actif);
                    oldElement.classList.remove("Actif");
                }
                this.setState({ Actif : "TabAdmins" })
                newElement = document.getElementById("TabAdmins");
                newElement.classList.add("Actif");
                ReactDOM.render(<TableauAdmins />, rootElement);
                break;
            default:
                break;
        }
    }

    
    render() {
        return (
            <React.Fragment>
                <Menu />
                <div className={"centerTableau"}>
                        <div onClick={e => this.choix(e)} id={"TabUtilisateurs"} >Utilisateurs</div>
                        <div onClick={e => this.choix(e)} id={"TabEnseignants"}>Enseignants</div>
                        <div onClick={e => this.choix(e)} id={"TabAdmins"}>Administrateurs</div>
                </div>
                <div id={"TableauxAfficher"} >

                </div>
            </React.Fragment>
        );
    };
};

export default Tableau;