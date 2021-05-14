import React, {Component} from 'react'
import "./../css/Top.css";
import { PageActuelle } from './PageActuelle.js';
import {Notifications} from './Notifications.js'
import { Parametres } from './Parametres.js';
import { Utilisateur } from './Utilisateur.js';

export class Top extends Component {
   
    render() {
        return (
           
                <div id={"top"}>
                    <PageActuelle/>
                    <Notifications />
                    <Utilisateur />
                    <Parametres />
                </div>
           
        );
    }
}
export default Top