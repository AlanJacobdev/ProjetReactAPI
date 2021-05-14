import React from 'react';
import {Menu} from './menu';
import "./../css/Formulaire.css";
class Field extends React.Component {
  render(){
    const {name, value, onChange, children} = this.props
    return (
      <div className="champs">
        <input type="text" value={value} onChange={onChange} id={name} name={name} className="form-control" required/>
        <label htmlFor={name}>{children}</label>
      </div>
    )
  }
}

class FormulaireUtilisateur extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      Nom: "",
      Prenom: "",
      Login: "",
      Mdp: "",
      Etablissement: "",
      Admin: 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    const name = e.target.name
    const value = e.target.value

    this.setState({
      [name] : value
    })
  }

  handleSubmit(e) {
    console.log(this.state);
    e.preventDefault()
    const data = JSON.stringify(this.state);

    const url = 'http://obiwan2.univ-brest.fr:7155/creerUtilisateur'

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    };

    fetch(url, requestOptions)
    .then(response =>  window.location.href = "/Tableaux")
    .catch(error => console.error(error));


  }

  checked = () => {
    console.log(this.state.Admin);
    if(this.state.Admin === 0){
      this.setState({ Admin : 1});
    }else{
      this.setState({Admin : 0});
    }
    console.log(this.state.Admin);
  }

  render(){
    return (
      <React.Fragment>
        <Menu />
        <div className={"centerForm"}>
          <form onSubmit={this.handleSubmit}>
            <Field name="Nom" value={this.state.Nom} onChange={this.handleChange}> Nom </Field>
            

            <Field name="Prenom" value={this.state.Prenom} onChange={this.handleChange}> Prénom </Field>
            

            <Field name="Login" value={this.state.Login} onChange={this.handleChange}> Login </Field>
          

            <Field name="Mdp" value={this.state.Mdp} onChange={this.handleChange}> Mot de passe </Field>
            

            <Field name="Etablissement" value={this.state.Etablissement} onChange={this.handleChange}> Etablissement </Field>
            


            <div class="grid">
            <label class ="CheckLabel">Admin</label>
            <label class="checkbox path">  
            <input onChange={this.checked} type="checkbox"/>
              <svg viewBox="0 0 21 21">
                <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
              </svg> 
            </label>
            </div>

            <div className="DivBoutonForm">
              <a className="AnnulerForm" href={"/Utilisateurs"}> Annuler </a>
              <button className="ValiderForm" type="submit"> Créer </button>
            </div>
            
          </form>
        </div>
      </React.Fragment>
    )
  }
}

export default FormulaireUtilisateur;
