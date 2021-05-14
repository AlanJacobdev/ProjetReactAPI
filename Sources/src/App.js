import React from "react";
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';


import Top from "./components/Top";
import { Accueil } from './components/Accueil';
import { Messages } from './components/Messages';
import { LireMessage } from './components/LireMessage';
import   {Login} from './components/Login';
import { EcrireMessage } from "./components/EcrireMessage";
import { ConfirmationEnvoi } from "./components/ConfirmationEnvoi";
import { ModificationUtilisateur } from "./components/ModificationUtilisateur";
import FormulaireUtilisateur from "./components/FormulaireUtilisateur";
import TableauEnseignants from "./components/TableauEnseignants";
import AjoutModule from "./components/AjoutModule";
import AjoutUP from "./components/AjoutUP";
import ModifierModule from "./components/ModifierModule";
import ModifierUP from "./components/ModifierUP";
import { Graphique } from "./components/Graphique";
import Statistiques from './components/Statistiques'
import Tableau from "./components/Tableaux";
import Consultation from "./components/Consultation";
import ConsultationUP from "./components/ConsultationUP";


const App = () => {
    if (!(localStorage.getItem("idUtilisateur") === "")) {
      if (localStorage.getItem("admin") === '1'){
        return (
          <div>
            <Top />
              <BrowserRouter basename={process.env.REACT_APP_ROUTER_BASE || ''}>
                  <Switch>
                    <Route path="/LireMessage/:idMessage" component={LireMessage} /> 
                    <Route path="/EcrireMessage" component={EcrireMessage} />    
                    <Route path="/Messages" component={Messages} /> 
                    <Route path="/PageAjt" component={FormulaireUtilisateur} />
                    <Route path="/Graphique" component={Graphique} />
                    <Route path="/Statistiques" component={Statistiques} />
                    <Route path="/PageModif" component={ModificationUtilisateur} />
                    <Route path="/Tableaux" component={Tableau} />
                    <Route path="/Accueil" component={Accueil} />
                    <Route path="/" component={Login} />
                  </Switch>
              </BrowserRouter>
          </div>
        );
        }
        else if (localStorage.getItem("admin") === '0')
        {
          return (
            <div>
              <Top />
                <BrowserRouter basename={process.env.REACT_APP_ROUTER_BASE || ''}>
                    <Switch>
                        <Route path="/ConsultationUP" component={ConsultationUP} />
                        <Route path="/Consultation" component={Consultation} />
                        <Route path="/Enseignants" component={TableauEnseignants} />
                        <Route path="/ModifierUP" component={ModifierUP} />
                        <Route path="/AjoutUP" component={AjoutUP} />
                        <Route path="/ModifierModule" component={ModifierModule} />
                        <Route path="/AjoutModule" component={AjoutModule} />
                        <Route path="/ConfirmationEnvoi" component={ConfirmationEnvoi} />   
                        <Route path="/EcrireMessage" component={EcrireMessage} />                
                        <Route path="/Messages" component={Messages} /> 
                        <Route path="/LireMessage/:idMessage" component={LireMessage} /> 
                        <Route path="/Accueil" component={Accueil} />
                        <Route path="/" component={Login} />
                    </Switch>
                </BrowserRouter>
            </div>
          );
        }
        else{
          return ( 
            <div>
              <Top />
              <Login/>
            </div>
          )
        }
  } 
  else 
  {
    return ( 
      <div>
        <Top />
        <Login/>
      </div>
    )
  }
}
export default App;
