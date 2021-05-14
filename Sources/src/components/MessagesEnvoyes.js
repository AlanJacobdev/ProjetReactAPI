import React, {Component} from 'react'
import "./../css/Message.css";

import 'font-awesome/css/font-awesome.min.css';
const fetch = require('node-fetch');

export class MessagesEnvoyes extends Component {
    constructor (props) {
        super(props);
        this.state = {
            messagesEnvoyes : []
        }

        this.getMessagesEnvoyes = this.getMessagesEnvoyes.bind(this);

    }

    componentDidMount() {
        this.getMessagesEnvoyes();
    }

    getMessagesEnvoyes() {
        const url = 'http://obiwan2.univ-brest.fr:7155/messagesEnvoyes/'+ localStorage.getItem("idUtilisateur");

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => this.setState({messagesEnvoyes : data}))
        .catch(error => console.error(error));
    }
    
    

    render() {
        
        return (
            this.state.messagesEnvoyes.map((messageEnvoye) =>
            <a href={"/LireMessage/" + messageEnvoye._id} key={messageEnvoye._id}>    
                <div className={"Message"}>
                    <div className={"Date"}> <strong>Date : </strong> {messageEnvoye.dateMessage} </div>
                    <div><strong>Destinataires : </strong>
                        {messageEnvoye.destinataires}
                    </div>  
                    <div className={"TronquedMessage"}>
                    <strong>Message : </strong> {messageEnvoye.message}
                    </div> 
                </div>
            </a>
            ))
        }
}

export default MessagesEnvoyes