import React, {Component, Fragment} from 'react'
import "./../css/Utilisateur.css";

export class Utilisateur extends Component {
    constructor (props) {
        super(props);
        this.state = {
            Nom : " ",
            Prenom : " "
        }
    }

    componentDidMount() {
        if (localStorage.getItem("idUtilisateur") !== "" && localStorage.getItem("idUtilisateur") !== null){
            const url = 'http://obiwan2.univ-brest.fr:7140/utilisateur/id'

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "idUtilisateur" : localStorage.getItem("idUtilisateur")})
            };

            fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => this.setState({ Nom : data[0].Nom, Prenom : data[0].Prenom }))
            .catch(error => console.error(error));
        }
    }
    render() {
        if (localStorage.getItem("idUtilisateur") !== "" && localStorage.getItem("idUtilisateur") !== null){
            return (
            
                <Fragment>
                    <div id={"nomprenom"}>
                        <span id={"nom"} > {this.state.Nom}</span>
                        <span id={"prenom"}> {this.state.Prenom}</span>
                        
                    </div>
                    <div id={"icone"}>
                        <i className={"fa fa-user profil"}></i>
                    </div>
                </Fragment>
            );
        } else {
            return ("")
        }
        
    }
}
export default Utilisateur