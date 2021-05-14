import React from 'react';

export class TableauAdmins extends React.Component{
    constructor(props) {
            super(props);
            this.state = {
                    admins : [],
            };
    };

    componentDidMount() {
        let monAPI = "http://obiwan2.univ-brest.fr:7155/getLesAdmins";

        fetch(monAPI)
            .then(response => response.json())
            .then(response => this.setState({ admins : response }))
            .catch(err => console.error(err))
    };
    
    render() {
        return (

                <div className={"centerTableau"}>
                    <table key="tabAdmins"> 
                        <thead key="tabHeadAdmins">
                            <tr>
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
                                    Etablissement
                                </th>
                            </tr>
                        </thead>

                        <tbody key="tabBodyAdmins">
                            { this.state.admins.map(user => ( 
                                    <tr key={user.idUtilisateur}> 
                                        <td>
                                            {user.Nom}
                                        </td>
                                        <td>
                                            {user.Prenom}
                                        </td>
                                        <td>
                                            {user.Login}
                                        </td>
                                        <td>
                                            {user.Etablissement}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

        );
    };
};

export default TableauAdmins;