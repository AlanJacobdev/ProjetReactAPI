import React from 'react';

class NbUtilisateurs extends React.Component{
    constructor(props) {
            super(props);
            this.state = {
                    enseignants : "",
                    admins : ""
            };
    };

    componentDidMount() {
        let monAPIEnseignant = "http://obiwan2.univ-brest.fr:7155/getNombreEnseignants";

        fetch(monAPIEnseignant)
            .then(response => response.json())
            .then(response => this.setState({ enseignants : response }))
            .catch(err => console.error(err))

        let monAPIAdmins = "http://obiwan2.univ-brest.fr:7155/getNombreAdmins";

        fetch(monAPIAdmins)
            .then(response => response.json())
            .then(response => this.setState({ admins : response }))
            .catch(err => console.error(err))
    };
    
    render() {
        return (
            <div className={"centerTableau"}>
                <div className={"DivParagraphe"}>
                    <p className={"Titre"}>Nombre d'enseignants </p>
                    <p className={"paragraphe"}> { this.state.enseignants } </p>
                    <p className={"Titre"}>Nombre d'admins </p>
                    <p className={"paragraphe"}> { this.state.admins }</p>
                </div>
            </div>
        );
    };
};

export default NbUtilisateurs;



