import React from 'react';
import AjoutUPFormulaire from './AjoutUPFormulaire';
import AjoutUPRecherche from './AjoutUPRecherche';
import {Menu} from './menu'
import "./../css/Creation.css";

export class AjoutUP extends React.Component {
    render() {
        return(
            <React.Fragment>
                <Menu/>
                <div className={"DivAccueil"}>
                    
                        <div id="AjoutUPExistant">
                            <p className={"Intitule"}>Ajouter une unité pédagogique existante</p>
                            <AjoutUPRecherche />
                        </div>
                        <div id="AjoutUPFormulaire">
                            <p className={"Intitule"}>Créer une nouvelle UP</p>
                            <AjoutUPFormulaire />
                        </div>
                    
                </div>
            </React.Fragment>
        )
    }
}

export default AjoutUP;
