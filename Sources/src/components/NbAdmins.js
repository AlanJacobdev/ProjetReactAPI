import React from 'react';

class NbAdmins extends React.Component{
    constructor(props) {
            super(props);
            this.state = {
                    admins : "",
            };
    };

    componentDidMount() {
        let monAPI = "http://obiwan2.univ-brest.fr:7155/getNombreAdmins";

        fetch(monAPI)
            .then(response => response.json())
            .then(response => this.setState({ admins : response }))
            .catch(err => console.error(err))
    };
    
    render() {
        return (
            <label> || Nombre d'admins : { this.state.admins } </label>
        );
    };
};

export default NbAdmins;