import React, {Component} from 'react'
import TableModule from './TableModule';
import TableUP from './TableUP';
import {Menu} from "./menu";
import "./../css/Accueil.css";
import logo from './../css/logo.png';
export class Accueil extends Component{
    constructor(){
        super();
        this.state = {
            idUtilisateur : -1,
            admin : -1,
            heure :""
        }
    }

    componentDidMount = () => {
        let admin = localStorage.getItem("admin");
        this.setState({admin : admin});
        var d = new Date();
        var hours = d.getHours() + ":" + (d.getMinutes()<10?'0':'') + d.getMinutes();
        this.setState({heure : hours});

    }

    selectModulPere = (result) => {
        console.log("Accueil result : " + JSON.stringify(result));
        this.child.majTableau(result);
    }

    render(){
        if (localStorage.getItem("admin") === '0'){
            return(
                <React.Fragment>
                    <Menu/>
                    
                        <div className={"DivAccueil"}>
                            <TableModule selectModule={this.selectModulPere} />
                            <div className={"DivChevron"}><i class="fa fa-chevron-right chevronAccueil"></i></div>
                            <TableUP ref={instance => { this.child = instance; }} />
                        </div>
                    
                </React.Fragment>
            )
        }
        else
        {
            return(
                <React.Fragment>
                    <Menu/>
                    <div className={"DivAccueilAdmin"}>
                        <p className={"texteWeight"}>Vous êtes connecté en administrateur</p>
                        <p className={"texte"}>Il est {this.state.heure}</p>
                        
                        <img alt="logo" src={logo}></img>
                    </div>
                </React.Fragment>
            )
        }
    }
};

export default Accueil;