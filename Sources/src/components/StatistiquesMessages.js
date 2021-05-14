import React from 'react';

import OccurenceMot from "./OccurenceMot";

class StatistiquesMessages extends React.Component{
    constructor(props) {
            super(props);
            this.state = {
                enseignants : [],
                statistiquesMessages : []
            };
    };

    componentDidMount() {
        const url = 'http://obiwan2.univ-brest.fr:7155/statMessage';

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(response => this.setState({ statistiquesMessages : response.statistiquesMessages }))
            .catch(err => console.error(err))
    };
    
    render() {
        console.log(this.state.statistiquesMessages)

            return (            
                
                <div className={"centerTableau"}>
                    <OccurenceMot/>
                    <p className={"Titre"}>Messages envoyés / Reçus  </p>
                    <table className={"margin"} key="tabEnseignants">                           
                        <thead key="tabHeadEnseignants">
                            <tr>
                                <th> 
                                    Nom 
                                </th>
                                <th> 
                                    Prenom 
                                </th>
                                <th> 
                                    Messages envoyés
                                </th>
                                <th> 
                                    Messages reçus
                                </th>
                            </tr>
                        </thead>

                        <tbody key="tabBodyEnseignants">
                            { this.state.statistiquesMessages.map(user => ( 
                                    <tr key={user.idUtilisateur}> 
                                        <td>
                                            {user.Nom}
                                        </td>
                                        <td>
                                            {user.Prenom}
                                        </td>
                                        <td>
                                            {user.nbMessagesEnvoyes}
                                        </td>
                                        <td>
                                            {user.nbMessagesRecus}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

            );
        }
};

export default StatistiquesMessages;