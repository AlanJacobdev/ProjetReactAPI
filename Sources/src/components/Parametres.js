import React, {Component} from 'react'
import "./../css/Parametres.css";

export class Parametres extends Component {
    constructor (props) {
        super(props);
        this.state = {

        }
    }

    handleClick = () => {   localStorage.setItem("idUtilisateur", "") }

    render() {
        if (localStorage.getItem("idUtilisateur") !== "" && localStorage.getItem("idUtilisateur") !== null){
        return (
            <div id={"parametre"}>
                <div className={"triggermenuparam"}>
                    <i className={"fa fa-caret-down param "}></i>
                    <a href="/">
                        <div onClick={this.handleClick} className={"menuparam deco"}>
                            <p>Deconnexion</p>
                        </div>
                    </a>
                </div>
            </div>
        );
        }
        else
        {
            return ("")
        }
    }
}
export default Parametres