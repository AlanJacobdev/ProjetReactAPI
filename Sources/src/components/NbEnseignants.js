import React from 'react';

class NbEnseignants extends React.Component{
    constructor(props) {
            super(props);
            this.state = {
                    enseignants : "",
            };
    };

    componentDidMount() {
        let monAPI = "http://obiwan2.univ-brest.fr:7155/getNombreEnseignants";

        fetch(monAPI)
            .then(response => response.json())
            .then(response => this.setState({ enseignants : response }))
            .catch(err => console.error(err))
    };
    
    render() {
        return (
            <label> || Nombre d'enseignants : { this.state.enseignants } </label>
        );
    };
};

export default NbEnseignants;