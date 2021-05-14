import React, {Component} from 'react'
import "./../css/LireMessage.css";
import {Menu} from "./menu";
const fetch = require('node-fetch');


export class LireMessage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            messageLu : {}
        }
    }

    componentDidMount() {
        const url = 'http://obiwan2.univ-brest.fr:7155/lireMessage'

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUtilisateur : localStorage.getItem("idUtilisateur"), idMessage : this.props.match.params.idMessage })
        };

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => this.setState({ messageLu: data.messageLu }))
        .catch(error => console.error(error));
    }

    render() {

        return (
            <React.Fragment>  
                <Menu/>
                <div id={"messagesRecus"}>
                  <div id={"DivBoutonBack"}> <a href={"/Messages/"+this.props.match.params.id}><div id={"BoutonBack"}>Retour</div></a></div>
                  <div id={"libelleMessagesRecus"}>Message Lu</div>
                        <div className={"Message"}>
                            <div className={"Expediteur"}> <strong>Expéditeur : </strong> {this.state.messageLu.expediteur} </div>
                            <div className={"Date"}> <strong>Date :</strong> {this.state.messageLu.dateMessage} </div>
                            <div><strong>Destinataires : </strong>
                                {this.state.messageLu.destinataires}
                            </div>  
                            <div className={"DisplayMessage"}>
                                <strong>Message :</strong><br/> {this.state.messageLu.message}
                            </div> 
                        </div>
                </div>
            </React.Fragment>
        );
    }
}