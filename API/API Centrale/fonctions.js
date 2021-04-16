const express = require('express')
const fetch = require('node-fetch');
const app = express()
const cors = require('cors');
app.use(cors());
app.use(express.json());
const port = 7155

const serveurMySQL = 'http://obiwan2.univ-brest.fr:7140/'
const serveurNeo4j = 'http://obiwan2.univ-brest.fr:7142/'
const serveurMongo = 'http://obiwan2.univ-brest.fr:7139/'
const mysql = require('./mysql_modules')
const neo4j = require('./neo4j_modules')
const mongodb = require('./mongodb_modules')

// Attente de l'applciation sur le port
app.listen(port, () => {
    console.log('le serveur fonctionne sur le port : '+ port );
})

// // Quand on modifie l'URL
// app.get('/neo', (req, res) => {
//     fetch(serveurNeo4j + "utilisateurs").then(response => {
//         response.json().then(infos => {
//             console.log(infos); // affiche dans nodejs
//             res.status(200).json(infos); //Renvoie à chrome
//         });        
//     }).catch(err => console.error(err))
// })


/**
 * Connexion du client
 * Param : user et mot de passe
 * Retour : identifiant de l'utilisateur
 * Appelle fonction mysql_modules/connexion(...)
 */
app.post('/login', (req, res) => {
    var url= serveurMySQL + 'login';
    var data = { 
        login : req.body.login,
        pass : req.body.pass
    };
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    mysql.connexion(options, url, res, serveurMySQL);
})

/**
 * Récupération des informations d'un module identifier par son identifiant
 * Param : identifiant du module
 * Retour : les informations d'un module
 * Appelle fonction mysql_modules/getUnModule(...)
 * Appelle fonction neo4j_modules/getUnModule(...) dans la fonction mysql.getUnModule(...)
 */
app.get('/getUnModule/:idModule', (req, res) => {
    var urlMySQL= serveurMySQL + 'getModule/id';
    var urlNeo4j = serveurNeo4j + 'Module';
    var dataMySQL = {
        idModule : req.params.idModule
    };
    var dataNeo4j = {
        idModule : req.params.idModule
    }
    var options = {
        method: 'POST',
        body: JSON.stringify(dataMySQL),
        headers: { 'Content-Type': 'application/json' }
    }
    mysql.getUnModule(options, urlMySQL, res, urlNeo4j, neo4j.getUnModule, dataNeo4j);
})

/**
 * Récupère les modules d'un enseignants identifier par son identifiant
 * Param : identifiant de l'enseignant
 * Retour : Liste de modules (identifiant, nom du module et une liste de niveau (nom du niveau))
 * Apelle fonction mysql_modules/getModules(...)
 * Apelle fonction neo4j_modules/descriptionModule dans fonction mysql_modules/getModules(...)
 */
app.get('/getModules/:idEnseignant', (req, res) => {
    var url= serveurMySQL + 'modulesEnseignant';
    var data = {
        idUtilisateur : req.params.idEnseignant
    };
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    mysql.getModules(options, url, res, serveurNeo4j, neo4j.descriptionModules);
})

/**
 * Récupère la liste des niveaux dans la base de données MySQL
 * Param : /
 * Retour : liste des niveaux
 * Apelle fonction mysql_modules/getListeNiveaux(...)
 */
app.get('/getlisteNiveaux', (req, res) => {
    var url= serveurMySQL + 'listeNiveaux';
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    mysql.getListeNiveaux(options, url, res);
})

/**
 * Récupère la liste des chaines descriptives
 * Param : /
 * Retour : liste des chaines descriptives
 * Appelle fonction neo4j_modules/getChainesDescriptives()
 */
app.get('/getChaineDescriptives', (req, res) => {
    var url= serveurNeo4j + 'touteChaine';
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    neo4j.getChainesDescriptives(options, url, res);
})


/**
 * Récupère la liste des unitées pédagogiques qui possèdent dans sa liste de chaines descriptives
 * la chaine descriptive envoyer en paramètre.
 * Param : la chaine descriptive à rechercher
 * Retour : une liste d'unitée pédagogique
 * Appelle fonction neo4j_modules/getUPChaineDescriptive(...)
 * Appelle fonction mysql_modules/getNomPrenom(...) dans neo4j_modules/getUPChaineDescriptive(...)
 */
app.get('/getUPChaineDescriptive/:chaine', (req, res) => {
    var url= serveurNeo4j + 'UniteChaineDescriptive';
    var data = {
        chaine : req.params.chaine
    }
    var options = {
        method: 'POST',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    neo4j.getUPChaineDescriptive(options, url, res, data, serveurMySQL, mysql.getNomPrenom);
})

/**
 * Création d'un nouveau module
 * Param : identifiant de l'utilisateur, nom, niveau, description du module
 * Retour : identifiant du module
 * Appelle fonction mysql_modules/creerModule(...)
 * Appelle fonction neo4j_modules/creerModule(...) dans fonction mysql_modules/creerModule(...)
 */
app.post('/creerModule', (req, res) => {
    var url= serveurMySQL + 'ajtModule';
    var dataMysql = {
        idUtilisateur : req.body.idEnseignant,
        nomModule : req.body.nomModule,
        lstIdNiveaux : req.body.lstIdNiveaux
    };
    var dataNeo4j = {
        nomModule : req.body.nomModule,
        idEnseignant : req.body.idEnseignant,
        descriptionModule : req.body.descriptionModule
    };
    var options = {
        method: 'POST',
        body: JSON.stringify(dataMysql),
        headers: { 'Content-Type': 'application/json' }
    }
    mysql.creerModule(options, url, res, neo4j.creerModule, dataNeo4j, serveurNeo4j);
})

/**
 * Récupérer les unités pédagogique relatives à un identifiant de module recus en paramètre
 * Param : identifiant du module
 * Retour : Liste d'unités pédagogique
 * Appelle fonction neo4j_modules/getLesUP(...)
 */
app.get('/getLesUP/:idModule', (req, res) => {
    var url= serveurNeo4j + 'Unites';
    var data = {
        idModule : req.params.idModule
    };
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    neo4j.getLesUP(options, url, res, data);
})

/**
 * Récupère les unitées pédagogiques créer par un enseignant identifier par son identifiant d'utilisateur
 * recus en paramètre.
 * Param : identifiant de l'enseignant
 * Retour : une liste d'unitées pédagogique
 * Appelle fonction mysql_modules/getLesUPEnseignant(...)
 */
app.get('/getLesUPEnseignant/:idEnseignant', (req, res) => {
    var url= serveurMySQL + 'modulesEnseignant';
    var data = {
        idUtilisateur : req.params.idEnseignant
    };
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    mysql.getLesUPEnseignant(options, url, res, serveurNeo4j + "Unites", serveurMySQL);
})



/**
 * Récupère les informations d'une unitée pédagogique identifier par son identifiant
 * recus en paramètre.
 * Param : identifiant du module
 * Retour : une unitée pédagogique
 * Appelle fonction neo4j_modules/getUP(...)
 */
app.get('/getUP/:idUP', (req, res) => {
    var url= serveurNeo4j + 'Unite';
    var data = {
        id : req.params.idUP
    };
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    neo4j.getUP(options, url, res, data);
})

/**
 * Mise à jour des informations d'un modules
 * Param : identifiant du module, nom et niveau du module
 * Retour : identifiant du module
 * Appelle fonction mysql_modules/majModules(...)
 * Appelle fonction neo4j_modules/majModule(...) appelé dans fonction mysql_modules/majModules(...)
 */
app.post('/majModule', (req, res) => {
    var url = serveurMySQL + 'modifModule';
    var dataMySQL = {
        idModule : req.body.idModule,
        nomModule : req.body.nomModule,
        lstIdNiveaux : req.body.lstIdNiveaux
    };
    var dataNeo4j = {
        idModule : req.body.idModule,
        nomModule : req.body.nomModule,
        idEnseignant : req.body.idEnseignant,
        descriptionModule : req.body.descriptionModule
    };
    var options = {
        method: 'POST',
        body: JSON.stringify(dataMySQL),
        headers: { 'Content-Type': 'application/json' }
    }
    mysql.majModules(options, url, res, serveurNeo4j, dataNeo4j, neo4j.majModule);
})

/**
 * Création d'une nouvelle unitée pédagogique
 * Param : identiant de l'enseignant, identifiant du module, nom du module, la description du module,
 * le nom de l'unitée ainsi que sa liste d'URL et sa liste de chaines descriptives.
 * Retour : identifiant de l'unite pédagogique
 * Appelle fonction neo4j_modules/creerUP(...)
 */
app.post('/creerUP', (req, res) => {
    var url= serveurNeo4j + 'CreationUnite';
    var data = {
        idEnseignant : req.body.idEnseignant,
        idModule : req.body.idModule,
        nomModule : req.body.nomModule,
        descriptionModule : req.body.descriptionModule,
        nomUnite : req.body.nomUnite,
        chaineDesc : req.body.chaineDesc,
        urlUnite : req.body.urlUnite
    };
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    neo4j.creerUP(options, url, res);
})

/**
 * Ajout d'une unitée pédagogique à un enseignant, l'unitée à été créer par
 *  un autre enseignant au préalable.
 * Param : identifiant du module, nom du module, la description du module, identifiant de l'enseignant
 * et l'identifiant de l'unitée pédagogique à ajouter.
 * Retour : identifiant de l'unitée pédagogique
 * Appelle fonction neo4j_module/ajoutUP(...)
 */
app.post('/ajoutUP', (req, res) => {
    var url= serveurNeo4j + 'CreationUniteId';
    var data = {
        id : req.body.idUP,
        idModule : req.body.idModule,
        nomModule : req.body.nomModule,
        idEnseignant : req.body.idEnseignant,
        descriptionModule : req.body.descriptionModule
    };
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    neo4j.ajoutUP(options, url, res);
})

/**
 * Suppression d'une unitée pédagogique
 * Param : identifiant de l'unitée pédagogique
 * Retour : identifiant de l'unitée pédagogique
 * Apelle fonction neo4j_modules/.supprimerUP(...)
 */
app.post('/supprimerUP', (req, res) => {
    var url= serveurNeo4j + 'suppressionUnite';
    var data = {
        idModule : req.body.idModule,
        idUnite : req.body.idUnite,
        Courant : req.body.idUtilisateur,
        idCreateur : req.body.idCreateur
    };
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    neo4j.supprimerUP(options, url, res);
})

/**
 * Suppression d'un module
 * Param : identidiant du module
 * Retour : identifiant du module
 * Appelle fonction mysql_modules/supprimerModule(...)
 * Appelle fonction neo4j_modules/supprimerModule(...) dans mysql_modules/supprimerModule(...)
 */
app.post('/supprimerModule', (req, res) => {
    var urlMySQL = serveurMySQL + 'supprModule';
    var urlNeo4j= serveurNeo4j + 'suppressionModule';
    var dataMySQL = {
        idModule : req.body.idModule
    };
    var dataNeo4j = {
        idModule : req.body.idModule
    };
    var options = {
        method: 'POST',
        body: JSON.stringify(dataMySQL),
        headers: { 'Content-Type': 'application/json' }
    }
    mysql.supprimerModule(options, urlMySQL, res, urlNeo4j, dataNeo4j, neo4j.supprimerModule);
})

/**
 * Mise à jour d'une unitée pédagogique
 * Param : identifiant de l'unitée, nom de l'unitée, sa liste de chaines descriptives,
 * sa liste d'URL et l'identifiant de l'enseignant.
 * Retour : identifiant de l'unité pédagogique
 * Apelle fonction neo4j_modules/majUP(...)
 */
app.post('/majUP', (req, res) => {
    var url= serveurNeo4j + 'modificationUnite';
    var data = {
        idEnseignant : req.body.idEnseignant,
        id : req.body.idUP,
        nom : req.body.nomUP,
        url : req.body.urlUP,
        chaineDesc : req.body.descriptionUP
    };
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    neo4j.majUP(options, url, res);
})

/**
 * Retourne une liste d'utilisateurs
 * Param : /
 * Retour : Liste d'utilisateurs
 * Appelle fonction mysql_modules/listeUtilisateurs(...)
 */
app.get('/listeUtilisateurs', (req, res) => {
    var url= serveurMySQL + 'utilisateurs';
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    mysql.listeUtilisateurs(options, url, res);
})

/**
 * Cration d'un nouvel utilisateur
 * Param : nom, prenom, login, mot de passe, établissement de l'utilisateur
 * et si c'est un administrateur ou non.
 * Retour : identifiant de l'utilisateur
 * Apelle fonction mysql_modules/creerUtilisateur(...)
 */
app.post('/creerUtilisateur', (req, res) => {
    var url = serveurMySQL + 'ajtUtilisateur';
    var data = {
        Nom : req.body.Nom,
        Prenom : req.body.Prenom,
        Login : req.body.Login,
        Mdp : req.body.Mdp,
        Etablissement : req.body.Etablissement,
        Admin : req.body.Admin
    };
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    mysql.creerUtilisateur(options, url, res);
})

/**
 * Récupère tous les messages envoyer par un enseignant
 * Param : identifiant de l'enseignant
 * Retour : une liste de messages
 * Appelle fonction mongodb_modules/getMessagesEnvoyes(...)
 */
app.get('/messagesEnvoyes/:idUtilisateur', (req, res) => {
    var url= serveurMongo + 'messagesEnvoyes/' + req.params.idUtilisateur;
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    mongodb.getMessagesEnvoyes(options, url, res);
})

/**
 * Revoie le nombres de notification d'un enseignants
 * Param : identifiant de l'enseignant
 * Retour : le nombre de notification
 * Appelle fonction mongodb_modules/nbNotifications(...)
 */
app.get('/nbNotifications/:idUtilisateur', (req, res) => {
    var url= serveurMongo + 'nbNotifications/' + req.params.idUtilisateur;
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    mongodb.nbNotifications(options, url, res);
})

/**
 * Revoie le nombres de messages recus
 * Param : identifiant de l'enseignant
 * Retour : le nombre de messages recus
 * Appelle fonction mongodb_modules/nbMessagesRecus(...)
 */
app.get('/nombreMessageRecus/:idUtilisateur', (req, res) => {
    var url= serveurMongo + 'nbMessagesRecus/' + req.params.idUtilisateur;
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    mongodb.nbMessagesRecus(options, url, res);
})

/**
 * Revoie le nombres de messages envoyés
 * Param : identifiant de l'enseignant
 * Retour : le nombre de messages envoyés
 * Appelle fonction mongodb_modules/nbMessagesEnvoyes(...)
 */
app.get('/nombreMessageEnvoyes/:idUtilisateur', (req, res) => {
    var url= serveurMongo + 'nbMessagesEnvoyes/' + req.params.idUtilisateur;
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    mongodb.nbMessagesEnvoyes(options, url, res);
})

/**
 * Récupère tous les messages recus d'un utilisateur
 * Param : identifiant de l'enseignant
 * Retour : le nombre de messages envoyés
 * Appelle fonction mongodb_modules/getMessagesRecus(...)
 */
app.get('/getMessagesRecus/:idUtilisateur', (req, res) => {
    var url= serveurMongo + 'messagesRecus/' + req.params.idUtilisateur;
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    mongodb.getMessagesRecus(options, url, res);
})

/**
 * Envoyer un message
 * Param : identifiant et message de l'enseignant
 * Retour : le nombre de messages envoyés
 * Appelle fonction mongodb_modules/envoyerMessage(...)
 */
app.post('/envoyerMessage', (req, res) => {
    var url= serveurMongo + 'envoyerMessage';
    var data = {
        idUtilisateur : req.body.idUtilisateur,
        message : req.body.message,
        destinataires : req.body.destinataires
        
    };
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    mongodb.envoyerMessage(options, url, res);
})

/**
 * Renvoie le message a lire et indique que le message a été lu par le destinataire
 * Param : identifiant de l'utilisateur et l"identifiant du message
 * Retour : un message
 * Appelle fonction mongodb_modules/lireMessage(...)
 */
app.post('/lireMessage', (req, res) => {
    var url= serveurMongo + 'lireMessage';
    var data = {
        idUtilisateur : req.body.idUtilisateur,
        idMessage : req.body.idMessage
    };
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    mongodb.lireMessage(options, url, res);
})

app.get('/getIdUtilisateurLogin/:login', (req, res) => {
    var url= serveurMySQL + 'utilisateur/login';
    var data = {
        Login : req.params.login
    };
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    //FAIRE FONCTION
})

app.get('/getLesEnseignants', (req, res) => {
    var url = serveurMySQL + 'enseignants';
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    mysql.getLesEnseignants(options, url, res);
})

app.get('/getLesAdmins', (req, res) => {
    var url = serveurMySQL + 'admins';
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    mysql.getLesAdmins(options, url, res);
})

app.get('/getNombreAdmins', (req, res) => {
    var url = serveurMySQL + 'admins/nb';
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    mysql.getNombreAdmins(options, url, res)
})

app.get('/getNombreEnseignants', (req, res) => {
    var url = serveurMySQL + 'enseignants/nb';
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    mysql.getNombreEnseignants(options, url, res)
})

app.get('/consultationGetModules', (req, res) => {
    var url = serveurMySQL + 'modules';
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    //FAIRE FONCTION
})

app.post('/modificationUtilisateur', (req, res) => {
    var url = serveurMySQL + 'modifUtilisateur';
    var data = {
        idUtilisateur : req.body.idUtilisateur,
        Nom : req.body.Nom,
        Prenom : req.body.Prenom,
        Login : req.body.Login,
        Mdp : req.body.Mdp,
        Etablissement : req.body.Etablissement
    }
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    mysql.modifUtilisateur(options, url, res);
})

app.post('/suppressionUtilisateur', (req, res) => {
    var urlMySQLSuppr = serveurMySQL + 'supprUtilisateur';
    var urlMySQLGetModules = serveurMySQL + 'modulesEnseignant'
    var urlNeo4j = serveurNeo4j + 'suppressionModule';
    var urlMongoDB = serveurMongo + 'supprimerUtilisateur';

    var data = {
        idUtilisateur : req.body.idUtilisateur
    }
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }
    mysql.supprimerUtilisateur(options, urlMySQLSuppr, urlMySQLGetModules, res, urlNeo4j, urlMongoDB, data, mongodb.supprimerUtilisateur);
})

app.get('/uniteParProf', (req, res) => {
    var url = serveurNeo4j + 'uniteParProf';
    var options = {
        method: 'GET',
        body : null,
        headers: { 'Content-Type': 'application/json' }
    }
    neo4j.getDonneesGraphique(options, url, res);
})

app.get('/nbOccurenceMot/:mot', (req, res) => {
    var url = serveurMongo + 'nbOccurenceMot/' + req.params.mot;
    var options = {
        method: 'GET',
        body: null,
        headers: { 'Content-Type': 'application/json' }
    }
    mongodb.nbOccurenceMot(options, url, res);
})

//mongo -> mysql
app.get('/statMessage', (req, res) => {
    var urlMySQL = serveurMySQL + 'enseignants';
    var urlMongoDB = serveurMongo + 'statistiquesMessages';
    mongodb.statMessage(urlMySQL, res, urlMongoDB);
})