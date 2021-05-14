import React from 'react';
const fetch = require('node-fetch');


class TableUP extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            idUtilisateur : -1,
            idModule : -1,
            nomModule : "",
            descriptionModule : "",
            lesUP : [],
            idUPSelected : -1,
            idCreateurUPSelected : -1
        } 
    }

    majTableau = (e) => {
        this.setState({idUtilisateur : e.idUtilisateur});
        this.setState({idModule : e.idModule});
        this.setState({nomModule : e.nomModule});
        this.setState({descriptionModule : e.descriptionModule});
        if(e !== -1){
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            var url = 'http://obiwan2.univ-brest.fr:7155/getLesUP/' + e.idModule;
            console.log(url);
            fetch(url, requestOptions)
            .then(result => result.json())
            .then(result => {
                console.log(result);
                this.setState({lesUP : result});
            });
        }
    }

    disable = (e) => {
        if(this.state.idModule !== -1){
            e.disabled=false;
        }else{
            e.disabled=true;
        }
    }

    choix = (e) => {
        if(this.state.idModule !== -1){
            var data;
            switch(e.target.value){
                case "Créer":
                    data = {
                        idModule : this.state.idModule,
                        nomModule : this.state.nomModule,
                        descriptionModule : this.state.descriptionModule
                    }
                    localStorage.setItem("infosModule", JSON.stringify(data));
                    window.location.href = "/AjoutUP";
                    break;
                case "Modifier":
                    localStorage.setItem("idUniteSelected", this.state.idUPSelected);
                    if(this.state.idUPSelected !== -1){
                        window.location.href = "/ModifierUP";
                    }else
                    {
                        document.getElementById("erreur").innerHTML = "Il faut sélectionner 1 unité pédagogique !";
                    }
                    break;
                case "Supprimer":
                    if(this.state.idUPSelected !== -1){
                        data = {
                            idModule : this.state.idModule,
                            idUnite : this.state.idUPSelected,
                            idUtilisateur : localStorage.getItem("idUtilisateur"),
                            idCreateur : this.state.idCreateurUPSelected
                        }
                        const requestOptions = {
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        };
                        var url = 'http://obiwan2.univ-brest.fr:7155/supprimerUP'
                        fetch(url, requestOptions)
                        .then(result => result.json())
                        .then(result => {
                            console.log(result);
                            window.location.href = "/Accueil";
                        });
                    }else{
                        document.getElementById("erreur").innerHTML = "Il faut sélectionner 1 unité pédagogique !";
                    }
                    break;
                default:
                    break;
            }
        }
        else
        {
            document.getElementById("erreur").innerHTML = "Il faut sélectionner 1 module !";
        }
    }

    check = (e) => {
        var data = e.target.id.split('-');
        this.setState({idUPSelected : data[0]});
        this.setState({idCreateurUPSelected : data[1]});
    }

    show = (e) => { 
        var rowId = e.target.parentNode.id; 
        if(rowId !== '-1' ){
            localStorage.setItem("idUpSelect", rowId)
            window.location.href = "/ConsultationUP";
        }
    } 

    render(){
        return(
            <div className={"TabUp"} id="tableUP">
                <div className={"Intitule"}>Mes Unités</div>
                <table key="tableUP">
                    <thead key="theadUP">
                        <tr key="colonnesUP">
                            <th></th>
                            <th>Intitulé de l'unité</th>
                            <th>Chaines descriptives</th>
                        </tr>
                    </thead>
                    <tbody key="tbodyUP">
                        {
                            this.state.lesUP.map(up => (
                                <tr id={up.idUP} key={up.idUP}>
                                    <td>
                                        <input type="radio" id={up.idUP + "-" + up.idUtilisateur} key={"checkbox-" + up.idUP} name="up" onChange={e => this.check(e)} />
                                    </td>
                                    <td onClick={e => this.show(e)}>
                                        {up.nom}
                                    </td>
                                    <td onClick={e => this.show(e)}>
                                        {up.chainesDescriptives.map(cd => {
                                            return(cd.cd + " - ");
                                        })}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                
                <div className="DivBoutonTab">
                    <input disable={e => this.disable(e)} className="Creer" type="button" value="Créer" onClick={e => this.choix(e)}/>
                    <input disable={e => this.disable(e)} className="Supprimer" type="button" value="Supprimer" onClick={e => this.choix(e)}/>
                    <input disable={e => this.disable(e)} className="Modifier" type="button" value="Modifier" onClick={e => this.choix(e)}/>
                </div>
                <p id={"erreur"}></p>
                <div id="choixUP"></div>
            </div>
        )
    }
}

export default TableUP;