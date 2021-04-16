const fetch = require('node-fetch');

/**
 * @description Fonction qui permet de connecter un utilisateur, fait l'apelle à la fonction getDroit(...)
 * @param {*} options   Options de la reqête
 * @param {*} url       URL de l'API MySQL
 * @param {*} res       Requête du status pour envoyer la réponse au client
 * @param {*} serveur   URL de l'API MySQL (pour la fonction getDroit(...))
 */
exports.connexion = function (options, url, res, serveurMySQL){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            if(infos.id === -1){
                res.status(200).json(infos);
            }else{
                getDroit(res, serveurMySQL, infos);
            }
        });
    });
}
 
/**
 * @description Fonction appelé par connexion(...) récupère les droits de l'utilisateur
 * @param {*} res               Requête du status pour envoyer la réponse au client
 * @param {*} serveurMySQL      URL de l'API MySQL
 * @param {*} infos             Réponse de la connexion, contient l'identifiant de l'utilisateur
 */
function getDroit(res, serveurMySQL, infos){
    var url= serveurMySQL + 'droits';
    var id = infos.id
    var data = {
        idUtilisateur : id
    };
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    fetch(url,options).then(response => {
        response.json().then(infos => {
            res.status(200).json({
                "id" : id,
                "admin" : infos[0].Admin
            });
        });
    });
}

/**
 * @description Fonction appelé pour récupérer la liste des modules (id, nom, description et la liste de ces niveaux)
 * @param {*} options   Options de la reqête
 * @param {*} url       URL de l'API MySQL
 * @param {*} res       Requête du status pour envoyer la réponse au client
 * @param {*} serveurNeo4j   URL de l'API Neo4j
 */
exports.getModules = function (options, url, res, serveurNeo4j, foncNeo4j){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            if(infos.Modules.length == 0){
                res.status(200).json(infos);
            }else{
                foncNeo4j(infos, serveurNeo4j, res);
            }
        });
    });
}

/**
 * @description Fonction appelé pour mettre à jour un module
 * @param {*} options   Options de la requête
 * @param {*} url       URL de l'API MySQL
 * @param {*} res       Requête du status pour envoyer la réponse au client
 * @param {*} serveur   URL de l'API Neo4j
 */
exports.majModules = function (options, url, res, serveurNeo4j, datatNeo4j, foncNeo4j){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            if(infos.erreur === undefined) {
                foncNeo4j(datatNeo4j, serveurNeo4j, res);
            }else{
                res.status(200).json(infos);
            }
        });
    });
}

/**
 * @description Fonction appelé pour créer un nouvel utilisateur
 * @param {*} options   Options de la requête
 * @param {*} url       URL de l'API MySQL
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.creerUtilisateur = function (options, url, res){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            res.status(200).json(infos);
        });
    });
}

/**
 * @description Fonction appelé pour créer un nouveau module
 * @param {*} options       Options de la requête
 * @param {*} url           URL de l'API MySQL
 * @param {*} res           Requête du status pour envoyer la réponse au client
 * @param {*} foncNeo4j     Fonction Neo4j
 * @param {*} dataNeo4j     Objet contenant les données à envoyer à la fonction Neo4j
 * @param {*} serveurNeo4j  URL de l'API Neo4j
 */
exports.creerModule = function (options, url, res, foncNeo4j, dataNeo4j, serveurNeo4j){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            if(infos.message !== -1){
                dataNeo4j.idModule = infos.message;
                foncNeo4j(serveurNeo4j, dataNeo4j, res);
            }else{
                res.status(200).json({idModule : -1});
            }
        });
    });
}

/**
 * @description Fonction appelé pour supprimer un module
 * @param {*} options       Options de la requête
 * @param {*} urlMySQL      URL de l'API MySQL
 * @param {*} res           Requête du status pour envoyer la réponse au client
 * @param {*} urlNeo4j      URL de l'API Neo4j
 * @param {*} dataNeo4j     Objet contenant les données à envoyer à la fonction Neo4j
 * @param {*} foncNeo4j     Fonction Neo4j
 */ 
exports.supprimerModule = function (options, urlMySQL, res, urlNeo4j, dataNeo4j, foncNeo4j){
    fetch(urlMySQL,options).then(response => {
        response.json().then(infos => {
            foncNeo4j(res, urlNeo4j, dataNeo4j);
        });
    });
}

/**
 * @description Fonction appelé pour récupérer la liste des niveaux
 * @param {*} options   Options de la requête
 * @param {*} url       URL de l'API MySQL
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.getListeNiveaux = function(options, url, res){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            res.status(200).json(infos);
        });
    });
}

/**
 * @description Fonction appelé pour récupérer un module
 * @param {*} options           Options de la requête
 * @param {*} urlMySQL          URL de l'API MySQL
 * @param {*} res               Requête du status pour envoyer la réponse au client
 * @param {*} urlNeo4j          URL de l'API Neo4j
 * @param {*} fonctionNeo4j     Fonction Neo4j
 * @param {*} dataNeo4j         Objet contenant les données à envoyer à la fonction Neo4j
 */
exports.getUnModule = function(options, urlMySQL, res, urlNeo4j, fonctionNeo4j, dataNeo4j){
    fetch(urlMySQL,options).then(response => {
        response.json().then(infos => {
            fonctionNeo4j(urlNeo4j, dataNeo4j, res, infos);
        });
    });
}

/**
 * @description Fonction appelé pour récupérer la liste des utilisateurs
 * @param {*} options   Options de la requête
 * @param {*} url       URL de l'API MySQL
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.listeUtilisateurs = function(options, url, res){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            res.status(200).json(infos);
        });
    });
}

/**
 * @description Fonction appelé pour récupérer la liste des unitée pédagogique d'un enseignant
 * @param {*} options       Options de la requête
 * @param {*} url           URL de l'API MySQL
 * @param {*} res           Requête du status pour envoyer la réponse au client
 * @param {*} urlNeo4j      URL de l'API Neo4j
 * @param {*} urlMySQL      URL de l'API MySQL
 */
exports.getLesUPEnseignant = function(options, url, res, urlNeo4j, urlMySQL){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            /**
             * Pour chaques modules dans la liste :
             *  - Si la liste de modules est vide, alors envoie d'une unitée vide
             *  - Appelle de la fonction mysql_modules/upEnseignant(...)
             *  - Si la liste d'unitée pédagogique récupérer est vide, alors envoie d'une unitée vide
             *  - Sinon appelle de la fonction mysql_modules/getNomPrenom(...)
             */
            var lesModules = [...infos.Modules];
            if(lesModules.length > 0){
                var UPs = [];
                async function func() {
                    return new Promise((resolve) => {
                        for(let index = 0; index < lesModules.length; index++){
                            upEnseignant(urlNeo4j, lesModules[index].idModule).then(result => {
                                if(result !== undefined){
                                    ([...result]).forEach(up => {
                                        UPs.push(up);
                                    })
                                }
                                if(index === lesModules.length - 1) resolve();
                            })
                        }
                    })
                }
                func().then(_ => {
                    if(UPs.length === 0){
                        UPs = [
                            {
                                idUP : -1,
                                nomUP : "vide",
                                idEnseignant : -1,
                                lstCD : ["vide"],
                                lstURL : ["vide"],
                                nom : "vide",
                                prenom : "vide"
                            }
                        ]
                        res.status(200).json(UPs);
                    }else{
                        this.getNomPrenom(res, urlMySQL, UPs);
                    }
                })
            }else{
                var data = [
                    {
                        idUP : -1,
                        nomUP : "vide",
                        idEnseignant : -1,
                        lstCD : ["vide"],
                        lstURL : ["vide"],
                        nom : "vide",
                        prenom : "vide"
                    }
                ]
                res.status(200).json(data);
            }
        });
    });
}

/**
 * @description Fonction appelé pour récupérer les informations des unitée pédagogiques d'un module
 * @param {*} urlNeo4j      URL de l'API Neo4j
 * @param {*} idModule      Identifiant du module
 * @returns Objet type Promise
 */
const upEnseignant = (urlNeo4j, idModule) => {
    return new Promise((resolve) => {
        var options = {
            method: 'GET',
            body: null,
            headers: { 'Content-Type': 'application/json' }
        }
        fetch(urlNeo4j + '/' + idModule,options).then(response => {
            response.json().then((infos) => {
                /**
                 * Si la liste d'unitée pédagogique est vide, alors valide la promesse
                 * Sinon pour chaques unitées pédagogique récupérer :
                 *  - Récupération des informations
                 *  - Construction de l'objet et enregistrement dans une liste
                 *  - Valide la promesse en renvoyant la nouvelle liste d'unitées pédagogique
                 */
                var lesUPs = [...infos];
                var result = [];
                if(lesUPs.length > 0){
                    for(index = 0; index < lesUPs.length; index++){
                        var up = lesUPs[index]._fields;
                        var data = {
                            idUP : up[0].identity.low,
                            nomUP : up[0].properties.nom,
                            idEnseignant : up[0].properties.idEnseignant.low,
                            lstCD : [],
                            lstURL : [],
                            nom : "vide",
                            prenom : "vide"
                        };
                        var listeCD = [...up[2]];
                        listeCD.forEach(cd => {
                            data.lstCD.push(cd.properties.nom);
                        })
                        var listeURL = [...up[1]];
                        listeURL.forEach(url => {
                            data.lstURL.push(url.properties.url);
                        })
                        result.push(data);
                        if(index === lesUPs.length - 1) resolve(result);
                    }
                }else{
                    resolve();
                }
            });
        });
    })
}

/**
 * @description Fonction appelé pour récupérer les noms et prénom de chaques identifiant d'utilisateur
 * dans la liste d'unitées pédagogique.
 * @param {*} res               Requête du status pour envoyer la réponse au client
 * @param {*} serveurMySQL      URL de l'API MySQL
 * @param {*} lesUPs            Liste d'unitées pédagogique
 */
exports.getNomPrenom = function(res, serveurMySQL, lesUPs){
    var url= serveurMySQL + 'utilisateur/id';
    var result = [...lesUPs];
    async function func() {
        return new Promise((resolve) => {
            for(let index = 0; index < result.length; index++){
                var data = {
                    idUtilisateur : result[index].idEnseignant
                }
                var options = {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' }
                }
                fetch(url,options).then(response => {
                    response.json().then(infos => {
                        console.log("NOM PRENOM");
                        console.log(JSON.stringify(infos));
                        result[index].nom = infos[0].Nom;
                        result[index].prenom = infos[0].Prenom;
                        if(index === result.length - 1) resolve(result);
                    });
                });
            }
        })              
    }
    func().then((result) => {
        res.status(200).json(result);
    })
}

exports.modifUtilisateur = function (options, url, res){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

exports.getNombreAdmins = function (options, url, res){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

exports.getNombreEnseignants = function (options, url, res){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

exports.getLesAdmins = function (options, url, res){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

exports.getLesEnseignants = function (options, url, res){
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

exports.supprimerUtilisateur = function (options, urlMySQLSuppr, urlMySQLGetModules, res, urlNeo4j, urlMongoDB, data, foncMongoDB){
    fetch(urlMySQLGetModules,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            console.log("DEBUT SUPPR MODULES")
            let funcNeo4j = async function (){
                return new Promise((resolve) => {
                    ([...infos.Modules]).forEach((module, index, array) => {
                        let dataNeo4j = {
                            idModule : module.idModule
                        }
                        suppressionModule(urlNeo4j, dataNeo4j).then(_ => {
                            if(index === array.length - 1) resolve();
                        });
                    })
                })
            }
            funcNeo4j().then(_ => {
                console.log("FIN SUPPR MODULES");
                console.log("SUPPR UTIL MYSQL")
                let funcMysql = async () => {
                    return new Promise((resolve) => {
                        let options = {
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers: { 'Content-Type': 'application/json' }
                        }
                        fetch(urlMySQLSuppr,options).then(response => {
                            response.json().then(infos => {
                                console.log(infos);
                                resolve();
                            });
                        });
                    })
                }
                funcMysql().then(_ => {
                    console.log("FIN SUPPR UTIL MYSQL");
                    foncMongoDB(urlMongoDB, data, res);
                })
            })
        });
    });
}

async function suppressionModule(urlNeo4j, dataNeo4j){
    return new Promise((resolve) => {
        var options = {
            method: 'POST',
            body: JSON.stringify(dataNeo4j),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch(urlNeo4j,options).then(response => {
            response.json().then(infos => {
                console.log(infos);
                resolve();
            })
        })
    })
}