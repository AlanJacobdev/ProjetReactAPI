import React, {Component} from 'react'
import TableModuleRecherche from './TableModuleRecherche';
import TableUPRecherche from './TableUPRecherche';
import {Menu} from "./menu";
import "./../css/Accueil.css";

export class Consultation extends Component{
    constructor(){
        super();
        this.state = {
            idUtilisateur : -1,
            admin : -1
        }
    }

    componentDidMount = () => {
        let admin = localStorage.getItem("admin");
        this.setState({admin : admin});

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
                    <div>
                        <div className={"DivAccueil"}>
                            <TableModuleRecherche selectModule={this.selectModulPere} />
                            <div className={"DivChevron"}><i class="fa fa-chevron-right chevronAccueil"></i></div>
                            <TableUPRecherche ref={instance => { this.child = instance; }} />
                        </div>
                    </div>
                </React.Fragment>
            )
        }
        else
        {
            return(
                <React.Fragment>
                    <Menu/>
                    <div>
                    </div>
                </React.Fragment>
            )
        }
    }
};

export default Consultation;