import React, {Component} from 'react'
import "./../css/Notifications.css";
import 'font-awesome/css/font-awesome.min.css';

const fetch = require('node-fetch');

export class Notifications extends Component {
    constructor (props) {
        super(props);
        this.state = {
            nbNotifications: 0
        }

       this.getNbNotification = this.getNbNotification.bind(this);
    }

    componentDidMount() {
        this.getNbNotification();

        this.timer = window.setInterval(() => {
            this.getNbNotification();
        }, 50000)
        
    }

    getNbNotification() {
        if (localStorage.getItem("idUtilisateur") !== "" && localStorage.getItem("idUtilisateur") !== null){
            const url = 'http://obiwan2.univ-brest.fr:7155/nbNotifications/' + localStorage.getItem("idUtilisateur");

            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            };

            fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => this.setState({ nbNotifications: data.nombreNotifications }))
            .catch(error => console.error(error));
        }
    }

    render() {
        if (localStorage.getItem("idUtilisateur") !== "" && localStorage.getItem("idUtilisateur") !== null){
            return (
                <div id={"notification"}>
                    <a href="/Messages"><i className={"fa fa-comment bulle"}></i></a>
                    <div id={"cercle"}><div id={"textecercle"}>{this.state.nbNotifications}</div></div>
                </div>
            );
            }
            else
            {
               return ("")
            }
    }
}

export default Notifications