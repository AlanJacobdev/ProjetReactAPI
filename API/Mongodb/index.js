/**
 * @description Import de l'application express
 */
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const mongo = require('mongodb');

const fetch = require('node-fetch');

/**
 * @description Import du MongoClient & connexion à la BDD
 */
const MongoClient = mongo.MongoClient;
const url = 'mongodb://obiwan2.univ-brest.fr:27017';
const nomBdd = 'bddMessagesGroupe5';
const nomCollection = 'messages';
let db;

/**
 * @description Port d'écoute du serveur
 */
const port = 7139;

/**
 * @description Ajoute un zéro devant un élément de la date inférieur à 0
 * @param {number} nb Un élément de la date
 * @returns L'élément de la date passé en paramètre avec un zéro devant si celui-ci est inférieur à 0
 */
function formaterElementDate(nb) {
    if(nb <= 9) {
        return "0" + nb;
    } else {
        return nb;
    }
}

/**
 * Transforme le tableau d'identifiants de destinataires en chaine de caractère où chaque identifiant est séparé par une virgule
 * @param {Array} destinataires Le tableau contenant les identifiants des destinataires
 */
 function formaterDestinataires(destinataires) {
    let index = 0;
    chaineDestinataires = "";

    while(index < destinataires.length - 1) {
        chaineDestinataires = chaineDestinataires + destinataires[index].id + ", ";
        index = index + 1;
    }

    chaineDestinataires = chaineDestinataires + destinataires[index].id;
    return chaineDestinataires;
}

/**
 * @description Met la date au format jj/mm/aaaa - hh:mm:ss
 * @param {Date} date La date à formater
 * @returns La chaine de caractère correspondant à la date formatée
 */
function formaterDate(date) {
    let jour = formaterElementDate(date.getDate());
    // Les mois vont de 0 à 11, on l'incrémente donc de 1
    let mois = formaterElementDate(date.getMonth() + 1);
    let annee = date.getFullYear();
    
    let heures = formaterElementDate(date.getHours());
    let minutes = formaterElementDate(date.getMinutes());
    let secondes = formaterElementDate(date.getSeconds());
    
    return jour + "/" + mois + "/" + annee +" - " + heures + ":" + minutes + ":" + secondes;
}

/**
 * @description Etablie la connexion à la bas de données.
 * @param url l'url de la base de données
 */
MongoClient.connect(url, function(err, client) {
  console.log("Connexion à la base de données " + nomBdd + " établie");
  console.log("Collection utilisée : " + nomCollection)
  db = client.db(nomBdd);
});

app.use(express.json());

/**
 * @description Renvoie la liste des messages envoyés par l'utilisateur connecté
 * Ceux-ci sont triés par date, du plus récent au plus ancien
 * @param idUtilisateur l'identifiant de l'utilisateur actuellement connecté
 */
app.get('/messagesEnvoyes/:idUtilisateur', async (req,res) => {
    try {
        const idUtilisateur = parseInt(req.params.idUtilisateur);

        let messagesEnvoyes = await db.collection(nomCollection).
            find({"expediteur" : idUtilisateur}, {"expediteur" : 0, "destinataires.lu" : 0}).toArray();

        // On met la date de chaque message au format jj/mm/aaaa - hh:mm:ss
        messagesEnvoyes.forEach(function(docs) {
            docs.dateMessage = formaterDate(new Date(docs.dateMessage));
            docs.destinataires = formaterDestinataires(docs.destinataires);
        });

        res.status(200).json(messagesEnvoyes);
    } catch (err) {
        console.log(err);
        res.status(409).json({"erreur" :  -1});
    }
});

/**
 * @description Renvoie la liste des messages reçus par l'utilisateur connecté
 * Ceux-ci sont triés par date, du plus récent au plus ancien
 * @param idUtilisateur l'identifiant de l'utilisateur actuellement connecté
 */
app.get('/messagesRecus/:idUtilisateur', async (req,res) => {
    try {
        const idUtilisateur = parseInt(req.params.idUtilisateur);

        var docs = await db.collection(nomCollection).
            find({"destinataires.id" : {"$in":[idUtilisateur]}}).toArray();

        docs.forEach(function(doc) {
            doc.dateMessage = formaterDate(new Date(doc.dateMessage));
            doc.destinataires.forEach(function(destinataire) {
                if(destinataire.id === idUtilisateur) {
                    doc.lu = destinataire.lu;
                }
                delete destinataire.lu;
            })

            doc.destinataires = formaterDestinataires(doc.destinataires);
        });

        res.status(200).json(docs);
        
    } catch (err) {
        console.log(err);
        res.status(409).json({"erreur" :  -1});
    }
});

/**
 * @description Renvoie le nombre de messages reçus et non lus par l'utilisateur connecté
 * @param idUtilisateur l'identifiant de l'utilisateur actuellement connecté
 */
app.get('/nbNotifications/:idUtilisateur', async (req,res) => {
    try {
        const idUtilisateur = parseInt(req.params.idUtilisateur);

        let nbNotifications = await db.collection(nomCollection).
            find({"destinataires" : {"$in":[ { "id" : idUtilisateur, "lu" : false }]}}).count();
        
        if(nbNotifications > 9) {
            nbNotifications = '9+';
        }

        res.status(200).json({"nombreNotifications" :  nbNotifications});
    } catch (err) {
        console.log(err);
        res.status(409).json({"erreur" :  -1});
    }
});

/**
 * @description Renvoie le nombre de messages reçus par l'utilisateur connecté
 * @param idUtilisateur l'identifiant de l'utilisateur actuellement connecté
 */
app.get('/nbMessagesRecus/:idUtilisateur', async (req,res) => {
    try {
        const idUtilisateur = parseInt(req.params.idUtilisateur);

        let nombreMessagesRecus = await nbMessagesRecus(idUtilisateur);

        if(nombreMessagesRecus > 9) {
            nombreMessagesRecus = '9+';
        }
        
        res.status(200).json({"nombreMessagesRecus" :  nombreMessagesRecus});
    } catch (err) {
        console.log(err);
        res.status(409).json({"erreur" :  -1});
    }
});

/**
 * @description Renvoie le nombre de messages reçus par l'utilisateur
 * @param {number} idUtilisateur l'identifiant de l'utilisateur
 * @returns le nombre de messages reçus
 */
function nbMessagesRecus(idUtilisateur){
    return db.collection(nomCollection).find({"destinataires.id" : idUtilisateur}).count();
}

/**
 * @description Renvoie le nombre de messages envoyés par l'utilisateur
 * @param {number} idUtilisateur l'identifiant de l'utilisateur
 * @returns le nombre de messages envoyés
 */
function nbMessagesEnvoyes(idUtilisateur) {
    return db.collection(nomCollection).find({"expediteur" : idUtilisateur}).count();
}

/**
 * @description Renvoie le nombre de messages envoyé par l'utilisateur connecté
 * @param idUtilisateur l'identifiant de l'utilisateur actuellement connecté
 */
app.get('/nbMessagesEnvoyes/:idUtilisateur', async (req,res) => {
    try {
        const idUtilisateur = parseInt(req.params.idUtilisateur);

        let nombreMessagesEnvoyes = await nbMessagesEnvoyes(idUtilisateur)

        if(nombreMessagesEnvoyes > 9) {
            nombreMessagesEnvoyes = '9+';
        }
        
        res.status(200).json({"nombreMessagesEnvoyes" :  nombreMessagesEnvoyes});
    } catch (err) {
        console.log(err);
        res.status(409).json({"erreur" :  -1});
    }
});

/**
 * @description Renvoie le nombre de messages envoyé et reçus par chaque utilisateur du tableau
 * @param tabUtilisateur Tableau d'identifiants d'enseignants
 */
app.get('/statistiquesMessages/:tabUtilisateur', async (req,res) => {
    try {
        const tabUtilisateur = JSON.parse(req.params.tabUtilisateur);
        
        let statistiquesMessages = [];

        // Pour chaque enseignant du tableau
        for (let index = 0; index < tabUtilisateur.length; index++) {
            console.log(tabUtilisateur[index]);

            // On récupère les informations de l'enseignant
            let idUtilisateur = tabUtilisateur[index].idUtilisateur;
            let Nom = tabUtilisateur[index].Nom;
            let Prenom = tabUtilisateur[index].Prenom;
            
            // On récupère les nombres de messages envoyés et reçus de l'enseignant
            let nombreMessagesEnvoyes = await nbMessagesEnvoyes(idUtilisateur);

            let nombreMessagesRecus = await nbMessagesRecus(idUtilisateur);

            // On ajoute l'enseignant au tableau de statistiques
            statistiquesMessages.push({"idUtilisateur" : idUtilisateur, "Nom" : Nom, "Prenom" : Prenom,
                "nbMessagesEnvoyes" : nombreMessagesEnvoyes, "nbMessagesRecus" : nombreMessagesRecus});
        }
        

        console.log(statistiquesMessages)

        res.status(200).json({"statistiquesMessages" :  statistiquesMessages});
    } catch (err) {
        console.log(err);
        res.status(409).json({"erreur" :  -1});
    }
});

/**
 * @description Renvoie le nombre d'occurence de le chaine dans l'ensemble des messages
 * @param mot le mot à rechercher
 */
app.get('/nbOccurenceMot/:mot', async (req,res) => {
    try {
        // les antislashs b servent à préciser qu'on recherche le mot complet
        const mot = "\\b" + req.params.mot + "\\b";

        // L'option i précise qu'on ignore la casse du mot
        let docs = await db.collection(nomCollection).
        find({"message" : {$regex : mot, $options : "i"}}).count();

        res.status(200).json({"nombreOccurenceMot" :  docs});
    } catch (err) {
        console.log(err);
        res.status(409).json({"erreur" :  -1});
    }
});

/**
 * @description Supprime les messages envoyés par l'utilisateur supprimé, et supprime son identifiant des tableaux
 * de destinataires des messages qui lui ont été envoyés
 * @param idUtilisateur l'identifiant de l'utilisateur supprimé
 */
app.post('/supprimerUtilisateur', async (req,res) => {
    try {
        const idUtilisateur = parseInt(req.body.idUtilisateur);

        // Supprime les messages envoyés par l'utilisateur supprimé
        await db.collection(nomCollection).remove({"expediteur" : idUtilisateur});

        // Compte le nombre de messages reçus par l'utilisateur supprimé
        let nombreMessagesRecus = await nbMessagesRecus(idUtilisateur);

        // Supprime l'utilisateur de chaque tableau de destinataires ou il figure
        for (let index = 0; index < nombreMessagesRecus; index++) {
            await db.collection(nomCollection).
                update({"destinataires.id" : idUtilisateur},
                {$pull: {destinataires:{id:{$in: [idUtilisateur]}}}})
        }

        res.status(200).json({"utilisateurSupprime" :  idUtilisateur});
    } catch (err) {
        console.log(err);
        res.status(409).json({"erreur" :  -1});
    }
});

/**
 * @description Permet à l'utilisateur connecté d'envoyer un message à un ou plusieurs utilisateurs
 * @param idUtilisateur l'identifiant de l'utilisateur qui envoie le message
 * @param destinataires tableau contenant les identifiants des utilisateurs destinataires du message
 * @param message le contenu du message
 */
app.post('/envoyerMessage', async (req,res) => {
    try {
        // Les messages envoyés sont considérés comme non-lus par défaut
        req.body.destinataires.forEach(destinataire => {
            destinataire["id"] = parseInt(destinataire["id"]);
            destinataire["lu"] = false;
        });

        const idUtilisateur = parseInt(req.body.idUtilisateur);
        const destinataires = req.body.destinataires;
        const contenuMessage = req.body.message;
        
        // On ajout le message à la BDD
        let docs = await db.collection(nomCollection).
            insert( { "expediteur" : idUtilisateur, "destinataires" : destinataires, 
            "dateMessage" : new Date(Date.now()), "message" : contenuMessage } );
        
        // On récupère le message qui a été envoyé
        let message = docs.ops[0];

        // On formate la date au format jj/mm/aaaa-hh:mm:ss
        message.dateMessage = formaterDate(new Date(message.dateMessage));
        
        res.status(200).json(message);

    } catch (err) {
        console.log(err);
        res.status(409).json({"erreur" :  -1});
    }
});

/**
 * @description Passe l'attribut lu d'un message associé à l'utilisateur connecté à true
 * @param idUtilisateur l'identifiant de l'utilisateur actuellement connecté
 * @param idMessage l'identifiant du message
 * @return Le message lu
 */
app.post('/lireMessage', async (req,res) => {
    try {
        const idUtilisateur = parseInt(req.body.idUtilisateur);

        // ObjectID est le type des ID par défaut de MongoDB
        const idMessage = new mongo.ObjectID(req.body.idMessage);

        // On récupère le message
        let message = await db.collection(nomCollection).
            find( { "_id" : idMessage }, {"destinataires" : 1, "_id" : 0} ).toArray();

        message = message[0];

        // On récupère les destinataires
        let destinataires = message.destinataires;

        // L'utilisateur peut lire un message qu'il a envoyé et donc ne pas faire partie des destinataires
        // On recherche le destinataires qui a lu le message
        let i = 0;

        while(i < destinataires.length && destinataires[i].id != idUtilisateur) {
            i = i + 1;
        }
        
        // Si l'enseignant fait partie des destinataires
        if(i < destinataires.length) {
            // On déclare le message comme étant lu par le destinataire
            destinataires[i].lu = true;

            // On met à jour le tableau de destinataires du messages afin qu'il ai l'attribut lu
            await db.collection(nomCollection).
                update( { "_id" : idMessage }, { $set : { "destinataires" : destinataires } });
        }

        // On récupère le message qui a été lu
        message = await db.collection(nomCollection).
        find( { "_id" : idMessage }, {"destinataires.lu" : 0} ).toArray();

        message = message[0];

        message.destinataires = formaterDestinataires(message.destinataires);

        // On formate la date au format jj/mm/aaaa - hh:mm:ss
        message.dateMessage = formaterDate(new Date(message.dateMessage));
        
        res.status(200).json({"messageLu" :  message});
    } catch (err) {
        console.log(err);
        res.status(409).json({"erreur" :  -1});
    }
});

/**
 * @description Mise en route du serveur
 * @param port le port d'écoute du serveur
 */
app.listen(port, () => {
    console.log("Serveur à l'écoute sur le port " + port);
});