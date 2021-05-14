import React, {Component} from 'react'
import "./../css/PageActuelle.css";
import {
    BrowserRouter,
    Route,
    Switch
  } from 'react-router-dom';


export class PageActuelle extends Component {
    
    render() {
        if (localStorage.getItem("idUtilisateur") === ""){
            return (
                <div id={"pageactuelle"}>
                     <p id={"pagecat"}>Accueil</p>
                </div>

            )
        }
        else
        {
            return (
                <div id={"pageactuelle"}>
                    
                    <BrowserRouter basename={process.env.REACT_APP_ROUTER_BASE || ''}>
                    <p id={"pagecat"}>
                        <Switch>
                            <Route path="/Consultation" component={() =>  <span id={"page"} > Consultation </span> } />
                            <Route path="/AjoutUP" component={() =>  <span id={"page"} > Ajout d'unité pédagogique </span> } />
                            <Route path="/Admins" component={() =>  [<span id={"page"} > Utilisateurs </span>,<i class="fa fa-chevron-right chevron"></i>, <span id={"categorie"}>  Liste d'administrateurs </span> ]}  /> 
                            <Route path="/Enseignants" component={() => [<span id={"page"} > Utilisateurs </span>,<i class="fa fa-chevron-right chevron"></i>,<span id={"categorie"}>  Liste d'enseignants </span> ]} /> 
                            <Route path="/Utilisateurs" component={() => [<span id={"page"} > Utilisateurs </span>,<i class="fa fa-chevron-right chevron"></i>,<span id={"categorie"}> Liste d'utilisateurs </span> ]}/> 
                            <Route path="/Messages" component={() =>  <span id={"page"} > Messages </span> } /> 
                            <Route path="/Statistiques" component={() =>  <span id={"page"} > Statistiques </span> } /> 
                            <Route path="/MessagesRecus" component={() =>  <span id={"page"} > Messages </span> } /> 
                            <Route path="/EcrireMessage" component={() =>  <span id={"page"} > Messages </span> } /> 
                            <Route path="/LireMessage" component={() =>  <span id={"page"} > Messages </span> } /> 
                            <Route path="/Test" component={() =>  <span id={"page"} > Test </span> } />
                            <Route path="/" component={() =>  <span id={"page"} > Accueil </span> } />
                        </Switch>
                        </p>
                    </BrowserRouter>    
                    
                </div>
            );
        }
    }
}

export default PageActuelle


