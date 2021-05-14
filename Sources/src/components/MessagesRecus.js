import React, {Component} from 'react'
import "./../css/Message.css";

import 'font-awesome/css/font-awesome.min.css';
const fetch = require('node-fetch');

export class MessagesRecus extends Component {
    constructor (props) {
        super(props);
        this.state = {
            messagesRecus : [],
            classLu : ""
        }

        this.getMessagesRecus = this.getMessagesRecus.bind(this);
    }

    componentDidMount() {
        this.getMessagesRecus();
    }

    getMessagesRecus() {
        const url = 'http://obiwan2.univ-brest.fr:7155/getMessagesRecus/' + localStorage.getItem("idUtilisateur");

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => this.setState({messagesRecus : data}))
        .catch(error => console.error(error));
    }

    render() {
        return (
            this.state.messagesRecus.map((messageRecu) => {
                if(messageRecu.lu === false) {
                    this.classLu = "messageNonLu"
                } else {
                    this.classLu = "messageLu"
                }

                return ( 
                    <a href={"/LireMessage/" + messageRecu._id} key={messageRecu._id}>  
                        <div className={[this.classLu, "Message"].join(' ')}>
                            
                            <div className={"Expediteur"}> <strong>Expéditeur : </strong> {messageRecu.expediteur} </div>
                            <div className={"Date"}> <strong>Date : </strong> {messageRecu.dateMessage} </div>
                            <div><strong>Destinataires : </strong>
                                {messageRecu.destinataires}
                            </div>  
                            <div className={"TronquedMessage"}>
                                <strong>Message : </strong> {messageRecu.message}
                            </div> 
                        </div>
                    </a>
                );
            }
        ));
    }
}
export default MessagesRecus