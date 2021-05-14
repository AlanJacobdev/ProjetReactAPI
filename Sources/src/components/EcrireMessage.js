import React, {Component} from 'react'
import "./../css/EcrireMessage.css";
import Menu from './menu';
const fetch = require('node-fetch');

export class EcrireMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            destinataires: '',
            message: '',
            chars : 0
        };
        this.setDestinataires = this.setDestinataires.bind(this);
        this.setMessage = this.setMessage.bind(this);
        this.envoyerMessage = this.envoyerMessage.bind(this);
    }
  
    setDestinataires(event) {
        this.setState({destinataires: event.target.value});
    }

    setMessage(event) {
        this.setState({message: event.target.value, chars: event.target.value.length});
    }

    handleChange(event) {
        var input = event.target.value;
        this.setState({
            chars_left: input.length
        });
    }

    envoyerMessage(event) {
      event.preventDefault();

      let tabDestinataires = this.state.destinataires.split(',');

      for (let index = 0; index < tabDestinataires.length; index++) {
          tabDestinataires[index] = {"id" : tabDestinataires[index]};
      }

      const url = 'http://obiwan2.univ-brest.fr:7155/envoyerMessage'

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUtilisateur : localStorage.getItem("idUtilisateur"), 
                message : this.state.message, destinataires : tabDestinataires})
        };
        
        fetch(url, requestOptions)
        .catch(error => console.error(error));
        this.props.history.push('/ConfirmationEnvoi');
    }
  
    render() {
      return (
        <React.Fragment>
            <Menu/>
            <div id={"CenterEcrire"}>
                <form onSubmit={this.envoyerMessage}>
                    <label>
                        <div className={"DestinataireEnvoie"}>Destinataires
                            <div class="icon ">
                                <div class="tooltip tooltipinfo">
                                Dans le cas de plusieurs destinataires, séparer ces derniers par des <strong>virgules</strong>.
                                </div>		
                                <i className={"fa fa-question-circle"}></i>
                            </div> 
                        </div>
                        <textarea className={"DestinataireSaisie"} value={this.state.destinataires} onChange={this.setDestinataires} />
                    </label>

                    <label>
                        <div className={"MessageDenvoie"}>Message  </div>
                        <textarea maxlength="1000" className={"MessageSaisie"} value={this.state.message} onChange={this.setMessage} />
                    </label>
                    <div id="the-count">
                        <span id="current">{this.state.chars} </span>
                        <span id="maximum">/ 1000</span>
                    </div>
                    <div className={"EnvoieMessage"}>
                        <a className={"DivAnnuler"} href={"/Messages/"+this.props.match.params.id}><div id={"BoutonAnnule"}>Annuler</div></a>
                        <input id={"BoutonEnvoie"} type="submit" value="Envoyer" />
                    </div>
                </form>
            </div>
        </React.Fragment>
      );
    }
  } 