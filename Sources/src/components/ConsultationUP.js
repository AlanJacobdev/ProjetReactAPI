import React from 'react';
import "./../css/Formulaire.css";
import {Menu} from "./menu";
const fetch = require('node-fetch');

export class ConsultationUP extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            NomUp : "",
            Descriptions : [],
            Urls : [],
            idUtilisateur : 0
        } 
    }


    componentDidMount() {
        let monAPI = "http://obiwan2.univ-brest.fr:7155/getUP/"+localStorage.getItem("idUpSelect");

        fetch(monAPI)
            .then(response => response.json())
            .then(response => this.setState({ NomUp : response.nomUP, idUtilisateur : response.idUtilisateur, Descriptions : response.cd, Urls : response.url  }))
            .catch(err => console.error(err))
    };


    render (){
        return(
            <React.Fragment>
                <Menu />
                <div id="CreationUP">
                    <div className={"centerForm"}>
                        <form className={"formulaireUP"} >
                            <div className={"identification"} >
                                <input required type="text" name="nomUP"  value={this.state.NomUp} />
                                <label htmlFor="nomUP">Nom de l'unité pédagogique </label>
                            </div>
                            <div className={"identification"} >
                                <input required type="text" name="nomUP"  value={this.state.idUtilisateur} />
                                <label htmlFor="nomUP">Identifiant de l'utilisateur</label>
                            </div>
                                <div className="listeInputURL">
                                    <p className="MessageSeparation">Listes des URLS</p>
                                    {this.state.Urls.map((x, i) => {
                                        return (
                                            <div className={"identification"} key={"urlBlock" + i} >
                                                <input key={"URLinput" + i} name="url" value={x}/>
                                                <label htmlFor="nomUP">URL </label>   
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="listeInputCD">
                                    <p className="MessageSeparation">Listes des chaines descriptives</p>
                                    {this.state.Descriptions.map((x, i) => {
                                        return(
                                                <div key={"chainesDescriptives" + i} className={"identification"}>
                                                    <input key={"CDinput" + i} name="cd" value={x} disable />
                                                    <label htmlFor="nomUP">Nom de la chaine descriptive </label>
                                                </div>
                                        )
                                    })}
                                </div>
                                <div className="DivBoutonForm">
                                <a className="AnnulerForm" href={"/Consultation"}> Retour </a>
                                </div>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default ConsultationUP;