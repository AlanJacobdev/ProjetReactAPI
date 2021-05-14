import React, {Component} from 'react'
import "./../css/Message.css";
import {Menu} from "./menu";
import 'font-awesome/css/font-awesome.min.css';
import MessagesEnvoyes from './MessagesEnvoyes'
import MessagesRecus from './MessagesRecus'
import ReactDOM from "react-dom";
const fetch = require('node-fetch');

export class Messages extends Component {
    constructor (props) {
        super(props);
        this.state = {
            Actif : "libelleMessageEnvoye",
            nbMessagesRecus : 0,
            nbMessagesEnvoyes : 0
        }

        this.getNombreMessagesEnvoyes = this.getNombreMessagesEnvoyes.bind(this);
        this.getNombreMessagesRecus = this.getNombreMessagesRecus.bind(this);
    }

    getNombreMessagesEnvoyes() {
        const url = 'http://obiwan2.univ-brest.fr:7155/nombreMessageEnvoyes/' + localStorage.getItem("idUtilisateur");

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => this.setState({nbMessagesEnvoyes : data.nombreMessagesEnvoyes}))
        .catch(error => console.error(error));

        if(this.state.nbMessagesEnvoyes > 9) {
            this.setState({nbMessagesEnvoyes : '9+'});
        }
    }

    getNombreMessagesRecus() {
        const url = 'http://obiwan2.univ-brest.fr:7155/nombreMessageRecus/' + localStorage.getItem("idUtilisateur");

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => this.setState({nbMessagesRecus : data.nombreMessagesRecus}))
        .catch(error => console.error(error));
    }

    choix = (e) => {
        const rootElement = document.getElementById("Messages");
        var newElement;
        var oldElement
        switch(e.target.id){
            case "libelleMessageEnvoye":
                if(this.state.Actif !== ""){
                    oldElement = document.getElementById(this.state.Actif);
                    oldElement.classList.remove("Actif");
                }
                this.setState({ Actif : "libelleMessageEnvoye" })
                newElement = document.getElementById("libelleMessageEnvoye");
                newElement.classList.add("Actif");
                ReactDOM.render(<MessagesEnvoyes />, rootElement);
                break;
            case "libelleMessageRecu":
                if(this.state.Actif !== ""){
                    oldElement = document.getElementById(this.state.Actif);
                    oldElement.classList.remove("Actif");
                }
                this.setState({ Actif : "libelleMessageRecu" })
                newElement = document.getElementById("libelleMessageRecu");
                newElement.classList.add("Actif");
                ReactDOM.render(<MessagesRecus />, rootElement);
                break;
            default:
                break;
        }
    }

    componentDidMount() {
        this.getNombreMessagesEnvoyes();
        this.getNombreMessagesRecus();
        const rootElement = document.getElementById("Messages");
        this.setState({ Actif : "libelleMessageEnvoye" })
        ReactDOM.render(<MessagesEnvoyes />, rootElement);
    }

    render() {
        return (
            <React.Fragment>
                <Menu/>

                        <div id={"messagesEnvoyes"}>
                        <div onClick={e => this.choix(e)} id={"libelleMessageEnvoye"} className={"Actif"}>
                            Messages Envoyés
                            <div className={"cercleMessages"}><div className={"texteCercleMessage"}>{this.state.nbMessagesEnvoyes}</div></div>
                        </div>
                        <div onClick={e => this.choix(e)} id={"libelleMessageRecu"}>
                            Messages Recus
                            <div className={"cercleMessages"}><div className={"texteCercleMessage"}>{this.state.nbMessagesRecus}</div></div>
                        </div>
                        <a href ={"/EcrireMessage"}><div className={"EnvoieIcon"}> <i className={"fa fa-paper-plane"}></i></div></a>
                        <div id="Messages" class="scrollable">
                        
                        </div>
                    </div>
                
            </React.Fragment>
        );
    }
}

export default Messages