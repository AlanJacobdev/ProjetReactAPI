/**
 * Constante utile à l'api 
 */
const express = require('express')
const cors = require('cors');
const mysql = require('mysql');

//Ajout de méthodes utilitaires HTTP
let app = express();

//  ---  SESSION  ---
require('dotenv').config({path:"mdp.env"})
//  ---  SESSION  ---

// Middleware Express
app.use(express.json())
app.use(cors());


/**
 * Port d'écoute de l'API
 */
app.listen(7199, () => {
  console.log('Serveur CalculVolume à l\'écoute sur le port 7199')
})


/**
 * Retourne l'ensemble des catégories d'un logement
 * @return JSON contenant l'ensemble des catégories (idCatégorie, libelle).
 */
app.get('/categorie', (req,res) => {
    let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
    console.log("Categories")
	connection.connect();
    connection.query("SELECT idCategorie, libelle FROM `Categorie`" , function (error, result) {
        if (error) throw error;
        res.status(200).json(result);
    });
    connection.end();
})



/**
 * Retourne l'ensemble des objets liés à une catégorie donnée.
 * @param categorie identifiant de la Catégorie du logement
 * @return JSON contenant l'ensemble des objets de la catégorie donnée (idObjet, libelle)
 */
app.get('/getObjets/:categorie', (req,res) => {
    let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
    const categorie = req.params.categorie;

    
    console.log(categorie)
    
	connection.connect();
    connection.query("SELECT Objet.idObjet, Objet.libelle FROM `Objet` INNER JOIN `LiaisonCategorie` ON Objet.idObjet = LiaisonCategorie.idObjet JOIN `Categorie` ON Categorie.idCategorie = LiaisonCategorie.idCategorie  WHERE Categorie.idCategorie="+categorie, function (error, result) {
        if (error) throw error;
        res.status(200).json(result);
    });
    connection.end();
})

/**
 * Créer un récapitulatif
 * @return Un JSON contenant un message de bon insertion
 */
app.post('/createRecapitulatif', (req,res) => {
    const categories = req.body.lstCategorie;
    
    (async () => {
        return await newRecap(req,res);
    })().then(async (resultat) => {
        for (var i = 0; i < categories.length; i++) {
            await parcoursListeObjet(resultat, categories[i]);
        }
        res.status(200).send({ "message": "Le recapitulatif à bien été ajouté"});
    })
})

/**
 * Promise permettant d'insérer un récapitulatif lié à son idClient
 * @param {} req Requête reçu du client
 * @return Resolve quand l'insertion est finie
 */
const newRecap = (req) => {
    return new Promise((resolve) => {
        let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
        
        const idClient = req.body.idClient;

        connection.connect();
        connection.query("INSERT INTO `Recapitulatif` (`idClient`)VALUES (?); ", [idClient] , function (error, result) {
        if (error) throw error;
        console.log(result.insertId)
            resolve(result.insertId);
        });
        connection.end();
    })
}

/**
 * Promise permettant le parcours de la liste des objets liés à une catégorie précedement créée
 * @param {*} idRecap identifiant du récapitulatif précedemment créée
 * @param {*} categorie l'objet catégorie contenant sa liste d'objets associés.
 * @return Resolve quand l'insertion de tout les objets est finie
 */
const parcoursListeObjet = (idRecap, categorie) => {
    return new Promise(async (resolve) => {
        for (var i = 0; i < categorie.lstObjets.length; i++) {
            console.log("Ajout de Récapitulatif " + idRecap + " pour l'objet " + categorie.lstObjets[i].libelle +" de la catégorie "+ categorie.categorie);
            await insertObjetRecap(idRecap, categorie.lstObjets[i], categorie.idCategorie);
            if(i === categorie.lstObjets.length - 1) resolve();
        }
    })
}

/**
 * Promise permettant de récupérer l'objet à un recap
 * @param {*} idRecap identifiant du récapitulatif précedemment créer
 * @param {*} objet Objet à ajouter
 * @param {*} idCategorie Identifiant de la catégorie à laquelle est lié l'objet
 * @returns 
 */
const insertObjetRecap = (idRecap, objet, idCategorie) => {
    return new Promise((resolve) => {
        (async () => {
            return getIDObjetCategorie(idCategorie, objet.idObjet);
        })().then(async (resultat) => {
            await ProcedureAjoutObjet(idRecap, objet, resultat);
            resolve();
        }) 
    })
}

/**
 * Promise permettant de récupère l'identifiant unique de la liaison Objet / Catégorie
 * @param {*} idCat Identifiant de la catégorie
 * @param {*} idObj Identifiant de l'objet
 * @return Resolve quand l'identifiant est récupérer
 */
const getIDObjetCategorie = (idCat, idObj) => {
    return new Promise((resolve) => {
        let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
        connection.connect();
        connection.query("SELECT idObjetCategorie FROM `LiaisonCategorie` WHERE idCategorie = ? AND idObjet = ?", [idCat, idObj] , function (error, result) {
            if (error) throw error;
            resolve(result);
        });
        connection.end();
    })
}

/**
 * Promise inserant un objet lié à sa quantité et son récapitulatif
 * @param {*} idRecap Identifiant du récapitulatif
 * @param {*} obj Objet à insérer
 * @param {*} idObjCat Identifiant unique correpondant à la liaison Objet/Catégorie
 * @return Le resultat de l'insertion
 */
const ProcedureAjoutObjet = (idRecap, obj, idObjCat ) => {
    return new Promise((resolve) => {
        let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
        connection.connect();
        connection.query("INSERT INTO `LiaisonObjet`(`idRecapitulatif`, `idObjetCategorie`,`quantite`) VALUES (?,?,?)", [idRecap,idObjCat[0].idObjetCategorie, obj.quantite] , function (error, result) {
            if (error) throw error;
            resolve(result);
        });
        connection.end();
    })
}

/**
 * Suppression d'un recapitulatif
 * @param idRecap Identifiant du récapitulatif à supprimer
 * @return Message personnélisé en fonction de l'état de suppresion
 */
app.post('/SupprimerRecap', (req,res) => {
    const idRecap = req.body.idRecap;
    
    (async () => {
        return await SuppresionRecap(idRecap);
    })().then(async (resultat) => {
        if(resultat.affectedRows === 0){
            res.status(200).send({"erreur": "Recapitulatif inconnu"});
        }else{
            res.status(200).send({"message": "La suppresion à été effectuée"});
        }
    })
})

/**
 * Promise permettant la suppresion d'un récapitulatif en fonction de son ID
 * @param {} idRecap Identifiant du récapitulatif à supprimer
 * @returns Resolve contenant le résultat de l'insertion permettant de vérifier la suppresion ensuite.
 */
const SuppresionRecap = (idRecap) => {
    return new Promise((resolve) => {
        let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
        connection.connect();
    
        connection.query("DELETE FROM `Recapitulatif` WHERE idRecapitulatif = "+idRecap, function (error, result) {
            if (error) throw error;
            resolve(result);
        });
        connection.end();
    })
}

/**
 * Retourner l'ensemble d'un récapitulatif
 * @param idRecap Identifiant du recap a visualiser
 * @return Le recap ou bien une message d'erreur si le recapitulatif est inexistant
 */
app.get('/RecupererRecapitulatif/:idRecap', (req,res) => {
    const idRecap = req.params.idRecap;
    
    (async () => {
        return await RecuperationRecap(idRecap);
    })().then(async (resultat) => {
        console.log(resultat.length)
        
        if(resultat.length === 0){
            res.status(200).send({"erreur": "Recapitulatif inconnu"});
        }else{
            await RegroupeParCategorie(resultat).then( (json) => {
                console.log(json)
                res.status(200).send(json);
            })
        }
    })
})

/**
 * Promise permettant la récupération du récapitulatif
 * @param {*} idRecap Identifiant du récapitulatif à récupérer
 * @return Retourne le resultat du SELECT
 */
const RecuperationRecap = (idRecap) => {
    return new Promise((resolve) => {
        let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
        connection.connect();
    
        connection.query("SELECT DISTINCT Recapitulatif.idRecapitulatif, Recapitulatif.idClient, LiaisonObjet.quantite, LiaisonCategorie.idCategorie, LiaisonCategorie.idObjet, Objet.poids, Objet.libelle as libelleObjet, Categorie.idCategorie, Categorie.libelle as libelleCategorie, LiaisonObjet.idObjetCategorie , LiaisonObjet.hauteur, LiaisonObjet.largeur, LiaisonObjet.profondeur FROM `Recapitulatif`, `LiaisonObjet`,`LiaisonCategorie`,`Objet` , `Categorie` WHERE Recapitulatif.idRecapitulatif= LiaisonObjet.idRecapitulatif AND LiaisonObjet.idObjetCategorie = LiaisonCategorie.idObjetCategorie AND LiaisonCategorie.idObjet=Objet.idObjet AND LiaisonCategorie.idCategorie=Categorie.idCategorie AND Recapitulatif.idRecapitulatif = "+idRecap, function (error, result) {
            if (error) throw error;
            resolve(result);
        });
        connection.end();
    })
}


/**
 * Promise permettant de mettre en forme le retour
 * @param {*} resultat Json contenant l'ensemble d'un récapitulatif
 * @returns Json mis en forme
 */
const RegroupeParCategorie = (resultat) => {
    return new Promise(async (resolve) => {
        let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
        connection.connect();
        var Json = {
            idClient :resultat[0].idClient,
            listeCategorie : []

        }
        await parcoursObjet(Json, resultat )
        resolve(Json);

        connection.end();
    })
}

/**
 * Parcours la liste d'objet et les regroupe au sein de catégories 
 * @param {*} Json Json à trier
 * @param {*} resultat Json trié
 * @return JSOON trié
 */
const parcoursObjet =  (Json, resultat) => {
    return new Promise( (resolve) => {
        var flag = false
            for (var i = 0; i < resultat.length; i++) {
                var cat = resultat[i].idCategorie;
                if (Json.listeCategorie.length === 0){
                    Json.listeCategorie.push({
                        idCategorie : resultat[i].idCategorie, 
                        libelleCategorie : resultat[i].libelleCategorie,
                        listeObjet: [{
                            idObjet: resultat[i].idObjet,
                            libelleObjet : resultat[i].idObjet,
                            quantite : resultat[i].quantite,
                            largeur : resultat[i].largeur,
                            hauteur : resultat[i].hauteur,
                            profondeur : resultat[i].profondeur
                        }]
                    })
                } else {
                    for (var j = 0; j < Json.listeCategorie.length; j++) {
                        console.log("Test" + Json.listeCategorie[j].idCategorie + cat)
                        if(Json.listeCategorie[j] !== undefined && Json.listeCategorie[j].idCategorie === cat){
                            flag = true;
                            Json.listeCategorie[j].listeObjet.push({
                                idObjet: resultat[i].idObjet,
                                libelleObjet : resultat[i].idObjet,
                                quantite : resultat[i].quantite,
                                largeur : resultat[i].largeur,
                                hauteur : resultat[i].hauteur,
                                profondeur : resultat[i].profondeur
                        })
                        }
                    }
                    if (!flag) {
                        Json.listeCategorie.push({
                            idCategorie : resultat[i].idCategorie, 
                            libelleCategorie : resultat[i].libelleCategorie,
                            listeObjet: [{
                                idObjet: resultat[i].idObjet,
                                libelleObjet : resultat[i].idObjet,
                                quantite : resultat[i].quantite,
                                largeur : resultat[i].largeur,
                                hauteur : resultat[i].hauteur,
                                profondeur : resultat[i].profondeur
                            }]
                        })
                    }
                }
                if(i === resultat.length - 1 ) resolve(Json);
                flag = false;
            }
        })
}