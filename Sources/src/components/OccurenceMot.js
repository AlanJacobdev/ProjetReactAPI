import React, {Component} from 'react'
const fetch = require('node-fetch');

export class OccurenceMot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mot: '',
            resultatOccurence : ''
        };
        this.setMot = this.setMot.bind(this);
        this.nombreOccurenceMot = this.nombreOccurenceMot.bind(this);
    }

    setMot(event) {
        this.setState({mot: event.target.value});
    }

    nombreOccurenceMot(event) {
      event.preventDefault();

      const url = 'http://obiwan2.univ-brest.fr:7139/nbOccurenceMot/' + this.state.mot;

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        
        const leMot = this.state.mot
        
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            if(leMot.length > 45){
                this.setState({resultatOccurence : "Le mot " + leMot.substr(0, 45)+"... a été utilisé dans " +
                data.nombreOccurenceMot+ " message(s)"})
            }else{
                this.setState({resultatOccurence : "Le mot " + leMot + " a été utilisé dans " +
                data.nombreOccurenceMot+ " message(s)"})
            }

            
        })
        .catch(error => console.error(error));

        this.setState({mot : ''});
    }
  
    render() {
      return (
        <React.Fragment>
            <div id={"Statistiques"}>
                <form onSubmit={this.nombreOccurenceMot}>
                    
                        <p className={"Titre"}>Recherche du nombre d'occurence d'un mot</p>
                        <div className={"identification"}> 
                            <input required id="MotOccurence" type="text" className={"Mot"} onChange={this.setMot} />
                            <label htmlFor="MotOccurence">Mot  </label>
                        </div>
                        <div className={"resultatRecherche"}>{this.state.resultatOccurence}</div>
                        
                    <div className={"RechercheDiv"}>
                        <input className={"Recherche"} id={"Bouton"} type="submit" value="Rechercher" />
                    </div>
                </form>
            </div>
        </React.Fragment>
      );
    }
  }

  export default OccurenceMot;