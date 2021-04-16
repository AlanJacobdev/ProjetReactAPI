const fetch = require('node-fetch');

/**
 * @description Fonction appelé pour récupérer la description d'un module, pour chaques modules, 
 * appelle la fonction neo4j_modules/integrationDescription(...).
 * @param {*} infos             La liste des modules venant de la fonction mysql_modules/getModules(...)
 * @param {*} serveurNeo4j      URL de l'API Neo4j
 * @param {*} res               Requête du status pour envoyer la réponse au client
 */
exports.descriptionModules = function (infos, serveurNeo4j, res){
    var lesModules = infos;
    var url = serveurNeo4j + 'Module';
    var options;
    console.log("debut boucle");
    let func = async () => {
        return new Promise((resolve) => {
            lesModules.Modules.forEach((element, index, array) => {
                options = {
                    method: 'GET',
                    body: null,
                    headers: { 'Content-Type': 'application/json' }
                }
                console.log(url + '/' + element.idModule)
                integrationDescription(url + '/' + element.idModule, options, element).then((result) => {
                    element = result;
                    console.log(element);
                    if(index === array.length - 1) resolve(lesModules);
                });
            })
        })
    }
    func().then((result) => {
        console.log("Fin boucle");
        console.log(result);
        res.status(200).json(result);
    })
}

/**
 * @description Fonction appelé pour récupérer la description d'un module.
 * @param {*} url       URL de l'API Neo4j
 * @param {*} options   Options de la requête
 * @param {*} element   L'objet correspondant au module
 * @returns Objet de type Promise
 */
const integrationDescription = (url, options, element) => {
    return new Promise((resolve) => {
        fetch(url,options).then(response => {
            response.json().then(infos => {
                element["description"] = infos[0]['_fields'][0].properties.description;
                resolve(element);
            });
        });
    });    
}

/**
 * @description Fonction appelé pour créer un nouveau module.
 * @param {*} url       URL de l'API Neo4j
 * @param {*} data      Données pour la requête
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.creerModule = function (url, data, res){
    url += 'creationModule'
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

/**
 * @description Fonction appelé pour supprimer un module
 * @param {*} res           Requête du status pour envoyer la réponse au client
 * @param {*} urlNeo4j      URL de l'API Neo4j
 * @param {*} dataNeo4j     Données pour la requête
 */
exports.supprimerModule = function (res, urlNeo4j, dataNeo4j){
    var options = {
        method: 'POST',
        body: JSON.stringify(dataNeo4j),
        headers: { 'Content-Type': 'application/json' }
    }
    fetch(urlNeo4j,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

/**
 * @description Fonction appelé pour créer une nouvelle unitée pédagogique
 * @param {*} options   Options de la requête
 * @param {*} url       URL de l'API Neo4j
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.creerUP = function (options, url, res){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

/**
 * @description Fonction appelé pour retourner les unitées pédagogiques
 * @param {*} options   Options de la requête
 * @param {*} url       URL de l'API Neo4j
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.getLesUP = function (options, url, res, data){
    fetch(url + '/' + data.idModule,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            var lesUPs = [];
            var up = {};
            if(infos.length === 0){
                up = {
                    idUP : "-1",
                    nom : "vide",
                    lien : [{url : "vide"}],
                    chainesDescriptives : [{cd : "vide"}]
                }
                lesUPs.push(up);
                res.status(200).json(lesUPs);
            }else{
                infos.forEach(element => {
                    up = this.constructUP(up, element);
                    lesUPs.push(up);
                    up = {};
                })
                res.status(200).json(lesUPs);
            }
        });
    });
}

/**
 * @description Fonction appelé pour retourner les unitées pédagogiques
 * @param {*} up        
 * @param {*} element 
 * @returns 
 */
exports.constructUP = function (up, element) {
    up.idUP = element._fields[0].identity.low;
    up.nom = element._fields[0].properties.nom;
    up.idUtilisateur = element._fields[0].properties.idEnseignant.low;
    up.liens = [];
    element._fields[1].forEach(lien => {
        up.liens.push({
            url : lien.properties.url
        })
    })
    up.chainesDescriptives = [];
    element._fields[2].forEach(cd => {
        up.chainesDescriptives.push({
            cd : cd.properties.nom
        })
    })
    return up;
}

/**
 * @description Fonction appelé pour supprimer une unitée pédagogique
 * @param {*} options   Options de la requête
 * @param {*} url       URL de l'API Neo4j
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.supprimerUP = function (options, url, res){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

/**
 * @description Fonction appelé pour mettre à jour un module
 * @param {*} dataNeo4j         Données pour la requête
 * @param {*} serveurNeo4j      URL de l'API Neo4j
 * @param {*} res               Requête du status pour envoyer la réponse au client
 */
exports.majModule = function (dataNeo4j, serveurNeo4j, res){
    var url = serveurNeo4j + 'ModificationModule';
    var options = {
        method: 'POST',
        body: JSON.stringify(dataNeo4j),
        headers: { 'Content-Type': 'application/json' }
    }
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

/**
 * @description Fonction appelé pour mettre à jour une unitée pédagogique
 * @param {*} options   Options de la requête
 * @param {*} url       URL de l'API Neo4j
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.majUP = function (options, url, res){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

/**
 * @description Fonction appelé pour récupérer une unitée pédagogique
 * @param {*} options   Options de la requête
 * @param {*} url       URL de l'API Neo4j
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.getUP = function (options, url, res, data){
    console.log(url + '/' + data.id);
    fetch(url + '/' + data.id,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            var data = {
                url : [],
                cd : []
            };
            data.idUP = infos[0]._fields[0].identity.low;
            data.nomUP = infos[0]._fields[0].properties.nom;
            data.idUtilisateur = infos[0]._fields[0].properties.idEnseignant.low;
            var listeURL = infos[0]._fields[1];
            listeURL.forEach(element => {
                data.url.push(element.properties.url);
            })
            var listeCD = infos[0]._fields[2];
            listeCD.forEach(element => {
                data.cd.push(element.properties.nom);
            })
            res.status(200).json(data);
        });
    });
}

/**
 * @description Fonction appelé pour récupérer la description d'un seul module
 * @param {*} urlNeo4j      URL de l'API Neo4j
 * @param {*} dataNeo4j     Données pour la requête
 * @param {*} res           Requête du status pour envoyer la réponse au client
 * @param {*} resMySQL      Résultat de la fonction mysql_modules/getUnModule(...)
 */
exports.getUnModule = function (urlNeo4j, dataNeo4j, res, resMySQL){
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    fetch(urlNeo4j + '/' + dataNeo4j.idModule,options).then(response => {
        response.json().then(infos => {
            resMySQL.description = infos[0]._fields[0].properties.description;
            console.log(resMySQL);
            res.status(200).json(resMySQL);
        });
    });
}

/**
 * @description Fonction appelé pour ajouter une unitée pédagogique existante au module d'un autre enseignant
 * @param {*} options   Options de la requête
 * @param {*} url       URL de l'API Neo4j
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.ajoutUP = function (options, url, res){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

/**
 * @description Fonction appelé pour récupérer une liste de chaines descriptives
 * @param {*} options   Options de la requête
 * @param {*} url       URL de l'API Neo4j
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.getChainesDescriptives = function (options, url, res){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            var lesCD = [...infos];
            var data = [];
            lesCD.forEach(element => {
                data.push({
                    nom : element._fields[0].properties.nom
                })
            })
            res.status(200).json(data);
        });
    });
}

/**
 * @description Fonction appelé pour récupérer une liste d'unitée pédagogique qui possède une chaine descriptive demandée.
 * @param {*} options           Options de la requête
 * @param {*} url               URL de l'API Neo4j
 * @param {*} res               Requête du status pour envoyer la réponse au client
 * @param {*} serveurMySQL      URL de l'API MySQL
 * @param {*} fonctionMySQL     Fonction mysql_modules/getNomPrenom(...)
 */
exports.getUPChaineDescriptive = function (options, url, res, data, serveurMySQL, fonctionMySQL){
    fetch(url + '/' + data.chaine,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            /**
             * Si la liste d'unitée pédagogique est vide, alors renvoie une liste d'une unitée pédagogique vide
             * Sinon, pour chaques unitée pédagogique dans la liste
             *  - création des objets d'unitée pédagogique avec leurs données
             *  - Appelle à la fonction mysql_modules/getNomPrenom(...)
             */
            var lesUPs = [];
            if(([...infos]).length !== 0){
                ([...infos]).forEach(element => {
                    let data = {
                        idUP : element[0].identity.low,
                        nomUP : element[0].properties.nom,
                        idEnseignant : element[0].properties.idEnseignant.low,
                        lstCD : [],
                        lstURL : []
                    }
                    var listeCD = [...element[2]];
                    listeCD.forEach(cd => {
                        data.lstCD.push(cd.properties.nom);
                    })
                    var listeURL = [...element[1]];
                    listeURL.forEach(url => {
                        data.lstURL.push(url.properties.url);
                    })
                    lesUPs.push(data);
                })
                fonctionMySQL(res, serveurMySQL, lesUPs);
            }else{
                lesUPs.push(
                    {
                        idUP : -1,
                        nomUP : "vide",
                        idEnseignant : -1,
                        lstCD : ["vide"],
                        lstURL : ["vide"]
                    }
                )
                res.status(200).json(lesUPs);
            }
        });
    });
}

/**
 * Reenvoie les données du graphique, avec la valeur maximale de chaque axe
 * @param {*} options
 * @param {*} url 
 * @param {*} res 
 */
exports.getDonneesGraphique = function (options, url, res) {
    fetch(url,options).then(response => {
        response.json().then(donnees => {
            let donnesMisesEnForme = {graphique : [['Nombre d\'Unités Pédagogiques', 'Nombre d\'enseignants']], infos : {nbUpMax : 0, nbEnseignantsMax : 0}};

            donnees.forEach(donnee => {
            
                // Nombre d'UP créé par l'enseignant
                let nbUp = donnee._fields[0].low;
                

                let index = 0;
                let tailleTableau = donnesMisesEnForme.graphique.length;

                // Si au moins un autre enseignant a créé autant d'UP, on incrémente le nombre d'enseignant qui ont créé ce nombre d'UP
                while (index < tailleTableau && donnesMisesEnForme.graphique[index][0] !== nbUp) {
                    index = index + 1;
                }

                if(index < tailleTableau) {
                    // Si au moins un autre enseignant a créé autant d'UP, on incrémente le nombre d'enseignant qui ont créé ce nombre d'UP
                    donnesMisesEnForme.graphique[index][1] = donnesMisesEnForme.graphique[index][1] + 1;
                } else {
                    // Sinon, on ajoute un nouveau tableau avec le nombre d'UP et le nombre d'enseignants qui ont créé ce nombre d'UP
                    donnesMisesEnForme.graphique[index] = [nbUp, 1];
                }

                if(donnesMisesEnForme.graphique[index][0] > donnesMisesEnForme.infos.nbUpMax) {
                    // S'il s'agit du plus grand nombre d'unités pédagogiques, on met à jour le nombre maximum d'UP
                    donnesMisesEnForme.infos.nbUpMax = donnesMisesEnForme.graphique[index][0];
                }

                if(donnesMisesEnForme.graphique[index][1] > donnesMisesEnForme.infos.nbEnseignantsMax) {
                    // S'il s'agit du plus grands nombre d'enseignants, on met à jour le nombre maximum d'enseigants
                    donnesMisesEnForme.infos.nbEnseignantsMax = donnesMisesEnForme.graphique[index][1];
                }
            })

            // On renvoie le graphique
            res.status(200).json(donnesMisesEnForme);
        }).catch(err => {
            console.log(err);
            res.status(409).json({"erreur" :  -1});
        });
    });
}

exports.supprimerUtilisateur = function (options, url, res){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}