import React from 'react';

class TableauUtilisateur extends React.Component{
    constructor(props) {
            super(props);
            this.state = {
                    utilisateurs : [],
            };
            this.selectUtilisateur = this.selectUtilisateur.bind(this)
            this.supprUtilisateur = this.supprUtilisateur.bind(this)
    };

    componentDidMount() {
        let monAPI = "http://obiwan2.univ-brest.fr:7155/listeUtilisateurs";

        fetch(monAPI)
            .then(response => response.json())
            .then(response => this.setState({ utilisateurs : response }))
            .catch(err => console.error(err))
    };


    selectUtilisateur(e){
        localStorage.setItem("idUtilisateurModif",document.getElementById("id" + e.target.name).innerText);
        localStorage.setItem("nomUtilisateur",document.getElementById("Nom" + e.target.name).innerText);
        localStorage.setItem("prenomUtilisateur",document.getElementById("Prenom" + e.target.name).innerText);
        localStorage.setItem("login",document.getElementById("Login" + e.target.name).innerText);
        localStorage.setItem("mdp",document.getElementById("Mdp" + e.target.name).innerText);
        localStorage.setItem("etablissement",document.getElementById("Etablissement" + e.target.name).innerText);

        window.location.href = "/PageModif";
    }

    async supprUtilisateur(e){
        const data = '{"idUtilisateur":' + e.target.name + '}';
        console.log(data);
    
        const url = 'http://obiwan2.univ-brest.fr:7140/supprUtilisateur'
    
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data
        };
    
        fetch(url, requestOptions)
        .then(response =>  window.location.href = "/Tableaux")
        .catch(error => console.error(error));

    }
    
    render() {
        return (
            <React.Fragment>
                <div className={"centerTableau"}>
                    <table key="tabUtilisateurs">                           
                        <thead key="tabHeadUtilisateurs">
                            <tr>
                                <th> 
                                    id 
                                </th>
                                <th> 
                                    Nom 
                                </th>
                                <th> 
                                    Prenom 
                                </th>
                                <th> 
                                    Login 
                                </th>
                                <th> 
                                    Mdp 
                                </th>
                                <th> 
                                    Etablissement 
                                </th>
                                <th> 
                                   Options
                                </th>
                            </tr>
                        </thead>

                        <tbody key="tabBodyUtilisateurs">
                            { this.state.utilisateurs.map(user => ( 
                                    <tr key={user.idUtilisateur}>
                                        <td className={"id"} id={"id" + user.idUtilisateur}>
                                            {user.idUtilisateur}
                                        </td>
                                        <td className={"nom"} id={"Nom" + user.idUtilisateur}>
                                            {user.Nom}
                                        </td>
                                        <td className={"prenom"} id={"Prenom" + user.idUtilisateur}>
                                            {user.Prenom}
                                        </td>
                                        <td className={"login"} id={"Login" + user.idUtilisateur}>
                                            {user.Login}
                                        </td>
                                        <td className={"password"} id={"Mdp" + user.idUtilisateur}>
                                            {user.Mdp}
                                        </td>
                                        <td className={"etablissement"} id={"Etablissement" + user.idUtilisateur}>
                                            {user.Etablissement}
                                        </td>

                                        <td className={"tdBouton"}>
                                            <button className={"modifierUser"} name={user.idUtilisateur} onClick={e => this.selectUtilisateur(e) }> Modifier </button>
                                            <button className={"supprimerUser"} name={user.idUtilisateur} onClick={e => this.supprUtilisateur(e) }> Supprimer </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div className={"AjouterUserDiv"}>
                        <a className={"AjoutUser"} href={"/PageAjt"}> 
                            Ajouter 
                        </a>
                    </div>
                    
                </div>
            </React.Fragment>
        );
    };
};

export default TableauUtilisateur;