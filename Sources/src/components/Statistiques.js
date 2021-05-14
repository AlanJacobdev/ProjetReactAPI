import React, {Component} from 'react'
import StatistiquesMessages from "./StatistiquesMessages"
import NbUtilisateurs from "./NbUtilisateurs";
import Graphique from "./Graphique";

import {Menu} from "./menu";
import ReactDOM from "react-dom";
import "./../css/Statistiques.css";


export class Statistiques extends Component{
    constructor(){
        super();
        this.state = {
            Actif : "",
        };
    }

    choix = (e) => {
        const rootElement = document.getElementById("divAffichage");
        var newElement;
        var oldElement
        switch(e.target.id){
            case "Statistiques":
                if(this.state.Actif !== ""){
                    oldElement = document.getElementById(this.state.Actif);
                    oldElement.classList.remove("Actif");
                }
                this.setState({ Actif : "Statistiques" })
                newElement = document.getElementById("Statistiques");
                newElement.classList.add("Actif");
                ReactDOM.render(<StatistiquesMessages />, rootElement);
                break;
            case "Utilisateurs":
                if(this.state.Actif !== ""){
                    oldElement = document.getElementById(this.state.Actif);
                    oldElement.classList.remove("Actif");
                }
                this.setState({ Actif : "Utilisateurs" })
                newElement = document.getElementById("Utilisateurs");
                newElement.classList.add("Actif");
                ReactDOM.render(<NbUtilisateurs />, rootElement);
                break;
            case "Histogramme":
                if(this.state.Actif !== ""){
                    oldElement = document.getElementById(this.state.Actif);
                    oldElement.classList.remove("Actif");
                }
                this.setState({ Actif : "Histogramme" })
                newElement = document.getElementById("Histogramme");
                newElement.classList.add("Actif");
                ReactDOM.render(<Graphique />, rootElement);
                break;
            default:
                break;
        }
    }

    

    render(){

        
            return(
                <React.Fragment>
                    <Menu/>
                    
                    <div className={"centerTableau"}>
                        <div className={["Choix", "Gauche"].join(' ')} onClick={e => this.choix(e)} id="Statistiques">Messages</div>
                        <div className={"Choix"} onClick={e => this.choix(e)} id="Utilisateurs">Utilisateurs</div>
                        <div className={["Choix", "Droit"].join(' ')} onClick={e => this.choix(e)} id="Histogramme">Histogramme</div>
                    </div>
                    
                    <div id="divAffichage"></div>
                </React.Fragment>
            )
        }
    
};

export default Statistiques;