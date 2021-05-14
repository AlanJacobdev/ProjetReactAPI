import React from 'react';
import {Menu} from './menu'

class TableauEnseignants extends React.Component{
    constructor(props) {
            super(props);
            this.state = {
                enseignants : [],
            };
    };

    componentDidMount() {
        let monAPI = "http://obiwan2.univ-brest.fr:7155/getLesEnseignants";

        fetch(monAPI)
            .then(response => response.json())
            .then(response => this.setState({ enseignants : response }))
            .catch(err => console.error(err))
    };
    
    render() {
        if (localStorage.getItem("admin") === '0'){
            return (
                <React.Fragment>
                    <Menu />
                    <div className={"centerTableau"}>
                        <table key="tabEnseignants">                           
                            <thead key="tabHeadEnseignants">
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
                                        Etablissement 
                                    </th>
                                </tr>
                            </thead>

                            <tbody key="tabBodyEnseignants">
                                { this.state.enseignants.map(user => ( 
                                        <tr key={user.idUtilisateur}> 
                                            <td className={"id"} id={"id" + user.idUtilisateur}>
                                                {user.idUtilisateur}
                                            </td>
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
                </React.Fragment>
            );
        }
        else
        {
            return (           
                    <div className={"centerTableau"}>
                        <table key="tabEnseignants">                           
                            <thead key="tabHeadEnseignants">
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

                            <tbody key="tabBodyEnseignants">
                                { this.state.enseignants.map(user => ( 
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
        }
                          
    };
};

export default TableauEnseignants;