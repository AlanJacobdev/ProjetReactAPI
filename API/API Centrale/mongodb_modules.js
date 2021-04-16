const fetch = require('node-fetch');

/**
 * @description Fonction appelé pour retourné les messages envoyés
 * @param {*} options   Options de la reqête
 * @param {*} url       URL de l'API MongoDB
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.getMessagesEnvoyes = function(options, url, res) {
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

/**
 * @description Fonction appelé pour retourné le nombre de notifications
 * @param {*} options   Options de la reqête
 * @param {*} url       URL de l'API MongoDB
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.nbNotifications = function(options, url, res) {
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

/**
 * @description Fonction appelé pour retourné le nombre de messages recus
 * @param {*} options   Options de la reqête
 * @param {*} url       URL de l'API MongoDB
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.nbMessagesRecus = function(options, url, res) {
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

/**
 * @description Fonction appelé pour retourné le nombre de messages envoyés
 * @param {*} options   Options de la reqête
 * @param {*} url       URL de l'API MongoDB
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.nbMessagesEnvoyes = function(options, url, res) {
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

/**
 * @description Fonction appelé pour retourné une liste de messages recus d'un utilisateur
 * @param {*} options   Options de la requête
 * @param {*} url       URL de l'API MongoDB
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.getMessagesRecus = function(options, url, res) {
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

/**
 * @description Fonction appelé pour envoyé un message
 * @param {*} options   Options de la requête
 * @param {*} url       URL de l'API MongoDB
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.envoyerMessage = function(options, url, res) {
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

/**
 * @description Fonction qui renvoie le message a lire et indique que le message a été lu par le destinataire
 * @param {*} options   Options de la requête
 * @param {*} url       URL de l'API MongoDB
 * @param {*} res       Requête du status pour envoyer la réponse au client
 */
exports.lireMessage = function(options, url, res) {
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

exports.nbOccurenceMot = function(options, url, res) {
    fetch(url,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}

exports.statMessage = function(urlMySQL, res, urlMongoDB) {
    // On commence par récupérer la liste des identifiants d'enseignants
    fetch(urlMySQL)
        .then(response => response.json())
        .then(response => {
            // On récupère ensuite les statistiques de messages grâce au tableau d'enseignant
            urlMongoDB += '/' + JSON.stringify(response);

            var options = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }

            fetch(urlMongoDB,options).then(response2 => {
                response2.json().then(donnees => {
                    // On renvoie ensuite le tableau de statistiques
                    res.status(200).json(donnees);
                }).catch(err => {
                    // S'il y a eu un problème dans la récupération des statistiques, on renvoie une erreur
                    console.log(err);
                    res.status(409).json({"erreur" :  -1});
                });
            });
        }).catch(err => {
            // S'il y a eu un problème dans la récupération des enseignants, on renvoie une erreur
            console.error(err)
            res.status(409).json({"erreur" :  -1});
        })
}

exports.supprimerUtilisateur = function (urlMongoDB, data, res){
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    fetch(urlMongoDB,options).then(response => {
        response.json().then(infos => {
            console.log(infos);
            res.status(200).json(infos);
        });
    });
}