import React from 'react'
import "./../css/Login.css";


const fetch = require('node-fetch');


export class Login extends React.Component {
    constructor(){
      super();
      this.state = {
          login : "",
          pass : "",
          valid: false
      };
      this.submit = this.submit.bind(this);
    }

    changeLogin = (event) => {
        this.setState({login : event.target.value})
    }

    changePass = (event) => {
        this.setState({pass : event.target.value})
    }

    submit(event) {
        //Empeche le form de refresh la page
        event.preventDefault();
        if(this.state.login === "" || this.state.pass === ""){
            document.getElementById("etat").innerHTML = "Nom d'utilisateur ou mot de passe incorrect !"
            return
        }
        var data = {
            login: this.state.login,
            pass: this.state.pass
        }
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        var url = 'http://obiwan2.univ-brest.fr:7155/login'
        fetch(url, requestOptions)
        .then(result => result.json())
        .then(result => {
            console.log(result);
            if(result.id === -1){
                document.getElementById("etat").innerHTML = "Pas connecté !"
            }else{
                document.getElementById("etat").innerHTML = "Connecté !"  
                this.setState({valid : true})
                this.setState({idUtilisateur : result.id});
                localStorage.setItem("idUtilisateur", result.id)
                localStorage.setItem("admin", result.admin)
                window.location.href = "/Accueil";            }
        });
    }

    render(){
        
      return(
          
        <div className={"centerLogin"} >
            <form className={"formulaire"} onSubmit={this.submit}>
                <div className={"identification"} >
                    <input type="text" name="login" onChange={this.changeLogin} required ></input>
                    <label htmlFor="login"> Nom d'utilisateur </label>
                </div>
                <div className={"identification"}> 
                    <input  className={"bottom"} type="text" name="pass" onChange={this.changePass} required></input>
                    <label htmlFor="pass"> Mot de passe </label>
                </div>
                <p id="etat"></p>
                <button className={"submit"} id="submit" type="submit">Connexion</button>

            </form>
        </div>
        
      )
     
    }
}

export default Login;