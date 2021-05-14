import React from 'react';
import "./../css/Formulaire.css";
class Field extends React.Component {
  render(){
    const {name, value, onChange, children} = this.props
    return <div className="champs">
      <input type="text" value={value} onChange={onChange} id={name} name={name} className="form-control" required/>
      <label htmlFor={name}>{children}</label>
      
    </div>
  }
}


export class ModificationUtilisateur extends React.Component {
  constructor (props) {
    super(props)

    // LocalStorage récupère les valeurs placées lors de l'appel de "modifierUtilisateur"
    this.state = {
      idUtilisateur: localStorage.getItem("idUtilisateurModif"),
      Nom: localStorage.getItem("nomUtilisateur"),
      Prenom: localStorage.getItem("prenomUtilisateur"),
      Login: localStorage.getItem("login"),
      Mdp: localStorage.getItem("mdp"),
      Etablissement: localStorage.getItem("etablissement"),
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

    const url = 'http://obiwan2.univ-brest.fr:7155/modificationUtilisateur'

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    };

    fetch(url, requestOptions)
    .then(response =>  window.location.href = "/Tableaux")
    .catch(error => console.error(error));


  }

  render(){
    return (
      <div className={"centerForm"}>
        <form onSubmit={this.handleSubmit}>
          <Field name="Nom" value={this.state.Nom} onChange={this.handleChange}> Nom </Field>
          

          <Field name="Prenom" value={this.state.Prenom} onChange={this.handleChange}> Prénom </Field>
          

          <Field name="Login" value={this.state.Login} onChange={this.handleChange}> Login </Field>
          

          <Field name="Mdp" value={this.state.Mdp} onChange={this.handleChange}> Mot de passe </Field>
          

          <Field name="Etablissement" value={this.state.Etablissement} onChange={this.handleChange}> Etablissement </Field>
          
          
          <div className="DivBoutonForm">
            <a className="AnnulerForm" href={"/Tableaux"}> Annuler </a>
            <button className="ValiderForm" type="submit" > Valider </button>
          </div>
        </form>
      </div>
    )
  }
}

export default ModificationUtilisateur;
