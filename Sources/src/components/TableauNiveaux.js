import React from 'react';

class ListeNiveaux extends React.Component{
    constructor(props) {
            super(props);
            this.state = {
                    lstNiveaux : [],
            };
    };

    componentDidMount() {
        let monAPI = "http://obiwan2.univ-brest.fr:7155/getlisteNiveaux";

        fetch(monAPI)
            .then(response => response.json())
            .then(response => this.setState({ lstNiveaux : response }))
            .catch(err => console.error(err))
    };
    
    render() {
        return (
            <table key="tabLstNiveaux">                           
                <thead key="tabHeadLstNiveaux">
                    <tr>
                        <th> 
                            Intitulé
                        </th>
                    </tr>
                </thead>

                <tbody key="tabBodyLstNiveaux">
                    { this.state.lstNiveaux.map(niv => ( 
                            <tr key={niv.idNiveau}> 
                                <td>
                                    {niv.Niveau}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        );
    };
};

export default TableauNiveaux;