import React, {Component} from 'react'
import "./../css/ConfirmationEnvoi.css";
export class ConfirmationEnvoi extends Component {
    render() {
        return (
                <div id={"confirmationEnvoi"}>
                    <div className={"EnvoiCorrect"}>Le message a correctement été envoyé !</div>
                    <br/><br/>
                    <div id={"DivBoutonConfirmer"}>
                        <a href={"/Messages"}>
                            <div id={"BoutonConfirmer"}>
                                Retour aux messages envoyés
                            </div>
                        </a>
                    </div>
                </div>
        );
    }
}