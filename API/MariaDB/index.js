const express = require('express')
const cors = require('cors');
const mysql = require('mysql');

let app = express();
app.use(cors());

require('dotenv').config({path:"mdp.env"})

// Middleware
app.use(express.json())

app.listen(7140, () => {
  console.log('Serveur à lécoute')
})


// Affiche les utilisateurs --> Test valide
app.get('/utilisateurs', (req,res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});

	connection.connect((err) => {
		if (err) throw err;

		connection.query("SELECT `idUtilisateur`, `Nom`, `Prenom`, `Login`, `Etablissement`, `Mdp`, `Admin` FROM `Utilisateur`", function (error, results, fields) {
			if (error) throw error;
			res.status(200).json(results)
		});

		connection.end();
	});
})


// Affiche le login d'un utilisateur, nécessite son id --> Test valide
app.post('/utilisateur/id', (req,res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
	const idUtilisateur = parseInt(req.body.idUtilisateur);

	connection.connect((err) => {
		if (err) throw err;

		connection.query("SELECT `Nom`, `Prenom` FROM `Utilisateur` WHERE `idUtilisateur` = " + idUtilisateur, function (error, results, fields) {
			if (error) throw error;
			
			if(results.length == 0) {
				res.status(409).json({"erreur" : "ERREUR : L'id " + idUtilisateur + " n'existe pas dans la base"});
			} else {
				res.status(200).json(results)
			}
		});

		connection.end();
	});
})


// Affiche l'id d'un utilisateur, nécessite son login --> Test valide
app.post('/utilisateur/login', (req,res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
	const Login = req.body.Login;

	connection.connect((err) => {
		if (err) throw err;

		connection.query("SELECT `idUtilisateur` FROM `Utilisateur` WHERE `Login` = \"" + Login + "\"", function (error, results, fields) {
			if (error) throw error;

			if(results.length == 0) {
				res.status(409).json({"erreur" : "ERREUR : Le login " + Login + " n'existe pas dans la base"});
			} else {
				res.status(200).json(results)
			}
		});

		connection.end();
	});
})


// Affiche les droits d'un utilisateur via son "id" (idUtilisateur) --> Test valide
app.post('/droits', (req,res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
	const idUtilisateur = parseInt(req.body.idUtilisateur);
	
	connection.connect((err) => {
		if (err) throw err;

		connection.query("SELECT `Admin` FROM `Utilisateur` WHERE `idUtilisateur` = " + idUtilisateur, function (error, results, fields) {
			if (error) throw error;
			res.status(200).json(results)
		});

		connection.end();
	});
})


// Affiche les enseignants --> Test valide
app.get('/enseignants', (req,res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});

	connection.connect((err) => {
		if (err) throw err;

		connection.query("SELECT `idUtilisateur`, `Nom`, `Prenom`, `Login`, `Etablissement`, `Mdp`, `Admin` FROM `Utilisateur` WHERE `Admin` = 0", function (error, results, fields) {
			if (error) throw error;
			res.status(200).json(results)
		});

		connection.end();
	});
})


// Affiche les informations d'admins --> Test valide
app.get('/admins', (req,res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});

	connection.connect((err) => {
		if (err) throw err;

		connection.query("SELECT `idUtilisateur`, `Nom`, `Prenom`, `Login`, `Etablissement`, `Mdp`, `Admin` FROM `Utilisateur` WHERE `Admin` = 1", function (error, results, fields) {
			if (error) throw error;
			res.status(200).json(results)
		});

		connection.end();
	});
})


// Affiche le nombre d'admins dans la bdd --> Test valide
app.get('/admins/nb', (req,res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});

	connection.connect((err) => {
		if (err) throw err;

		connection.query("SELECT `idUtilisateur` FROM `Utilisateur` WHERE `Admin` = 1", function (error, results, fields) {
			if (error) throw error;
			res.status(200).json(results.length)
		});

		connection.end();
	});
})


// Affiche le nombre d'enseignants dans la bdd --> Test valide
app.get('/enseignants/nb', (req,res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});

	connection.connect((err) => {
		if (err) throw err;

		connection.query("SELECT `idUtilisateur` FROM `Utilisateur` WHERE `Admin` = 0", function (error, results, fields) {
			if (error) throw error;
			res.status(200).json(results.length)
		});

		connection.end();
	});
	
})


// Login, nécessite un "login" et "pass" pour tester la connexion avec la base --> Test valide
app.post('/login', (req, res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});

	const login = req.body.login
	const pass = req.body.pass

	connection.connect();
	connection.query("Select `idUtilisateur`, `Nom`, `Prenom`, `Login`, `Etablissement`, `Mdp`, `Admin` from Utilisateur Where login = ? and mdp = ?", [login, pass], (err, result) => { 
		if(err) {	
	        res.send({err: err})  		
		}	

		if(Object.keys(result).length !== 0) {	
			console.log();	
		    res.send({id: result[0].idUtilisateur}); 		
		} else {	
	     	res.send({id: -1})		
		}	
	})
	connection.end();     
})


// Affiche tous les niveaux contenu dans la bdd --> Test valide
app.get('/listeNiveaux', (req, res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});

	connection.connect();
	connection.query("SELECT `idNiveau`, `Niveau` FROM `NiveauxFormation` WHERE 1", (err, result) => { 
        res.status(200).json(result);
	})
    connection.end();
})


// Liste les informations d'un module via son "idModule" --> Test valide
app.post('/getModule/id', (req,res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
	var idModule = parseInt(req.body.idModule);

	connection.connect((err) => {
		if (err) throw err;

		connection.query("SELECT ModuleFormation.idModule, ModuleFormation.nom, NiveauxFormation.niveau FROM ModuleFormation INNER JOIN LiaisonModule ON LiaisonModule.idModule = ModuleFormation.idModule INNER JOIN Utilisateur ON Utilisateur.idUtilisateur = LiaisonModule.idUtilisateur INNER JOIN LiaisonNiveaux ON LiaisonNiveaux.idModule = ModuleFormation.idModule INNER JOIN NiveauxFormation ON NiveauxFormation.idNiveau = LiaisonNiveaux.idNiveau WHERE ModuleFormation.idModule = " + idModule, function (error, resultsModule) {
			if (error) throw error;

			var json = {
				idModule: "",
				nom: "",
				niveaux: []
			};

			if (resultsModule.length == 0) {
				res.status(200).json(json);
			} else {
				resultsModule.forEach(element => {
					json.niveaux.push(element.niveau);
				})
				json.idModule = resultsModule[0].idModule;
				json.nom = resultsModule[0].nom;

				console.log(json);
				res.status(200).json(json);
				connection.end();
			}
		});			
	})
});


// Liste les informations de modules d'un enseignant via son "idUtilisateur" (idUtilisateur) --> Test valide
app.post('/modulesEnseignant', (req,res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
	var idUtilisateur = parseInt(req.body.idUtilisateur);

	connection.connect((err) => {
		if (err) throw err;

		connection.query("SELECT ModuleFormation.idModule, ModuleFormation.nom, NiveauxFormation.niveau FROM ModuleFormation INNER JOIN LiaisonModule ON LiaisonModule.idModule = ModuleFormation.idModule INNER JOIN Utilisateur ON Utilisateur.idUtilisateur = LiaisonModule.idUtilisateur INNER JOIN LiaisonNiveaux ON LiaisonNiveaux.idModule = ModuleFormation.idModule INNER JOIN NiveauxFormation ON NiveauxFormation.idNiveau = LiaisonNiveaux.idNiveau WHERE Utilisateur.idUtilisateur = "+ idUtilisateur, function (error, resultsModule) {
			if (error) throw error;

			var json = {
				Modules : []
			}

			if (resultsModule.length == 0) {
				res.status(200).json(json);
			} else {
				var idModuleActuel = 0;
				var dejaPresent = false;
				resultsModule.forEach(element => {
					if(json.Modules.length != 0){
						for (i=0; i < json.Modules.length; i++) {
							if (json.Modules[i].idModule === element.idModule) {
								dejaPresent = true;
								idModuleActuel = i;
							}	
						}
					}

					if(dejaPresent) {
						json.Modules[idModuleActuel].niveaux.push(element.niveau);
						dejaPresent = false;
					} else {
						var data = {
							idModule: element.idModule,
							nom: element.nom,
							niveaux: [element.niveau]
						};
						json.Modules.push(data);
					}

					if(element.idModule != idModuleActuel) {
						idModuleActuel = element.idModule;
					}
				});

				console.log(json);
				res.status(200).json(json);
				connection.end();
			}
		});
	})
})


// Liste les informations de modules d'un enseignant via son "idUtilisateur" (idUtilisateur) --> Test valide
app.get('/modules', (req,res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});

	connection.connect((err) => {
		if (err) throw err;

		connection.query("SELECT Utilisateur.Nom AS nomUtilisateur, Utilisateur.Prenom AS prenomUtilisateur, ModuleFormation.idModule, ModuleFormation.nom, NiveauxFormation.niveau FROM ModuleFormation INNER JOIN LiaisonModule ON LiaisonModule.idModule = ModuleFormation.idModule INNER JOIN Utilisateur ON Utilisateur.idUtilisateur = LiaisonModule.idUtilisateur INNER JOIN LiaisonNiveaux ON LiaisonNiveaux.idModule = ModuleFormation.idModule INNER JOIN NiveauxFormation ON NiveauxFormation.idNiveau = LiaisonNiveaux.idNiveau", function (error, resultsModule) {
			if (error) throw error;

			var json = {
				Modules : []
			}

			if (resultsModule.length == 0) {
				res.status(200).json(json);
			} else {
				var idModuleActuel = 0;
				var dejaPresent = false;
				resultsModule.forEach(element => {
					if(json.Modules.length != 0){
						for (i=0; i < json.Modules.length; i++) {
							if (json.Modules[i].idModule === element.idModule) {
								dejaPresent = true;
								idModuleActuel = i;
							}	
						}
					}

					if(dejaPresent) {
						json.Modules[idModuleActuel].niveaux.push(element.niveau);
						dejaPresent = false;
					} else {
						var data = {
							nomUtilisateur: element.nomUtilisateur,
							prenomUtilisateur: element.prenomUtilisateur,
							idModule: element.idModule,
							nom: element.nom,
							niveaux: [element.niveau]
						};
						json.Modules.push(data);
					}

					if(element.idModule != idModuleActuel) {
						idModuleActuel = element.idModule;
					}
				});

				console.log(json);
				res.status(200).json(json);
				connection.end();
			}
		});
	})
})


//////////////////////////////////
// 		CRUD pour Modules		//
//////////////////////////////////

// Ajout d'un module, nécessite "idUtilisateur","nomModule","lstIdNiveaux" --> Test valide
app.post('/ajtModule', (req, res) => {
    var idUtilisateur = req.body.idUtilisateur;
	var nomModule = req.body.nomModule;
	var lstIdNiveaux = req.body.lstIdNiveaux;

	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});

	connection.connect();
	connection.query("SELECT LiaisonModule.idUtilisateur,LiaisonModule.idModule, Utilisateur.idUtilisateur, ModuleFormation.Nom FROM LiaisonModule INNER JOIN ModuleFormation ON LiaisonModule.idModule = ModuleFormation.idModule INNER JOIN Utilisateur ON LiaisonModule.idUtilisateur = Utilisateur.idUtilisateur WHERE Utilisateur.idUtilisateur = ?", [idUtilisateur], (err, result) => { 
		var nonExistant = true;
		result.forEach(element => {
			if(element.Nom == nomModule) {
				nonExistant = false;
			}
		});
		
		if(nonExistant) {
			(async () => {
				return await ajtModule(nomModule);
			})().then(async () => {
				await insertLiaisonModuleUtilisateur(nomModule, idUtilisateur);

				for (var i = 0; i < lstIdNiveaux.length; i++) {
					await insertLiaisonModuleNiveaux(nomModule, lstIdNiveaux[i]);
				}
	
				let connectionSelect = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
				connectionSelect.connect();
				connectionSelect.query("SELECT `idModule` FROM `ModuleFormation` WHERE `Nom` = ?", [nomModule], (err, resultSelect) => {
					res.status(200).send("{ \"message\" : \""+ resultSelect[0].idModule +"\"} ");
					console.log("Fin de traitement ajt module" + resultSelect[0].idModule);
				});
				
				connectionSelect.end();
			})
		} else {
			res.status(409).json({"erreur" : "ERREUR : L'enseignant à déjà un module " + nomModule + " dans sa base"});
		}
	})
})


function deleteNiveaux(idModule) {
	let connectionDelete = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
	
	connectionDelete.connect();
	connectionDelete.query("DELETE FROM `LiaisonNiveaux` WHERE `idModule` = ?", [idModule], (err, result) => { 
		if(err) {	
			res.send({err: err})  		
		}

		console.log("Delete");
	});
	connectionDelete.end();
}

// Modifie le module, nécessite idModule, nomModule, liste des niveaux --> Test valide
app.post('/modifModule', (req, res) => {
	console.log("Requete reçu = ");
	console.log(req.body);
	const idModule = req.body.idModule;
	const nom = req.body.nomModule;
	const lstIdNiveaux = req.body.lstIdNiveaux;

	let connectionExist = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
	connectionExist.connect();
	connectionExist.query("SELECT * FROM `ModuleFormation` WHERE `Nom` = ?", [nom], (err, resultExist) => { 
		if(err) {	
	        res.status(409).json({"erreur" : "err"})  		
		}

		if(resultExist.length == 0 || resultExist[0].idModule == idModule) {
			let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
			connection.connect();
			connection.query("UPDATE ModuleFormation SET Nom = ? WHERE idModule = ?", [nom,idModule], (err, result) => { 
				if(err) {	
				res.status(409).json({"erreur" : "err"})  		
				}

				if(result.affectedRows > 0) {
					deleteNiveaux(idModule);
					
					(async () => {
						return new Promise(async (resolve) => {
							for (var i = 0; i < lstIdNiveaux.length; i++) {
								console.log("Ajout de lien " + idModule + " pour niveau = " + lstIdNiveaux[i]);
								await ajtNiveau(idModule, lstIdNiveaux[i]);
								if(i === lstIdNiveaux.length - 1) resolve();
							}
						})
						
					})().then(() => {
						console.log("Fin de traitement modif module" + idModule);
						res.status(200).json({"idModule" : idModule});
					})
					
				} else {
					res.status(409).json({"erreur" : "ERREUR : l'id " + idModule + " n'existe pas dans la base"});
				}
			});
			connection.end();
		} else {
			res.status(409).json({"erreur" : "ERREUR : Le module " + nom + " existe déjà dans la base"});
		}
	})
	connectionExist.end();
})


// Supprimer module, nécessite idModule / nomModule --> Test valide
app.post('/supprModule', (req, res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
	const idModule = req.body.idModule;

	connection.connect();
	connection.query("DELETE FROM `ModuleFormation` WHERE `idModule` = ?", [idModule], (err, result) => { 
		if(err) {	
	        res.send({err: err})  		
		}
        
		if(result.affectedRows > 0) {
			res.status(200).send({message: idModule});
		} else {
			res.status(409).send({message: "erreur : l'id " + idModule + " n'existe pas dans la base"});
		}
		
	connection.end();
	});
})



//////////////////////////////////
// 	   CRUD pour utilisateurs   //
//////////////////////////////////

// Ajout d'un utilisateur, nécessite "Nom","Prenom","Login","Mdp","Etablissement" --> Test valide
app.post('/ajtUtilisateur', (req, res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});

	const Nom = req.body.Nom;
	const Prenom = req.body.Prenom;
	const Login = req.body.Login;
	const Mdp = req.body.Mdp;
	const Etablissement = req.body.Etablissement;
	const Admin = req.body.Admin;
	var ajtPossible = 0;

	connection.connect();
	connection.query("Select `idUtilisateur`, `Nom`, `Prenom`, `Login`, `Etablissement`, `Mdp`, `Admin` from Utilisateur Where login = ? ", [Login], (err, result) => { 
		if(err) {	
	        res.send({err: err})  		
		}

		ajtPossible = result.length;

		if(Nom !== "" && Prenom !== "" && Login !== "" && Mdp !== "" && Etablissement !== "" && Admin !== "") {
			if (ajtPossible === 0) {
				insertUtilisateur(req, res);
			} else {
				res.status(409).send("{ \"erreur\" : \"Login déjà existant : "+ Login +"\"} ");
				connection.end();
			}   
		} else {
			res.status(409).send("{ \"erreur\" : \"Valeur manquante dans un champ\"} ");
			connection.end();
		}
	})
})


// Modifie le module, nécessite idUtilisateur, nom, prenom, Etablissement, Login, Mdp --> Test valide
app.post('/modifUtilisateur', (req, res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
	
	const idUtilisateur = req.body.idUtilisateur;
	const Nom = req.body.Nom;
	const Prenom = req.body.Prenom;
	const Login = req.body.Login;
	const Etablissement = req.body.Etablissement;
	const Mdp = req.body.Mdp;

	connection.connect();
	connection.query("UPDATE Utilisateur SET Nom = ?, Prenom = ?, Login = ?, Etablissement = ?, Mdp = ? WHERE idUtilisateur = ?", [Nom,Prenom,Login,Etablissement,Mdp,idUtilisateur], (err, result) => { 
		if(err) {	
	        res.send({err: err})  		
		}
        
		if(result.affectedRows > 0) {
			res.status(200).send({message: "Modification effectué."});
		} else {
			res.status(409).send({message: "erreur : l'id " + idModule + " n'existe pas dans la base"});
		}
		
		connection.end();
	});
})


// Supprimer utilisateur, nécessite "idUtilisateur" --> Test valide
app.post('/supprUtilisateur', (req, res) => {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
	const idUtilisateur = req.body.idUtilisateur;
	
	connection.connect();
	connection.query("Select `idUtilisateur` from Utilisateur Where idUtilisateur = " + idUtilisateur, (err, resultSelect) => {
		if(resultSelect.length != 0) {
			// Récupère tout les modules de l'utilisateur
			let connectionSelect = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
			connectionSelect.connect();
			connectionSelect.query("SELECT `idModule`, `idUtilisateur` FROM `LiaisonModule` WHERE `idUtilisateur` = " + idUtilisateur, (err, resultModule) => {
				let connectionDeleteModule = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
				connectionDeleteModule.connect();
				resultModule.forEach(function(module) {
					connectionDeleteModule.query("DELETE FROM `ModuleFormation` WHERE `idModule` = "+ module.idModule, (err, result) => { 
						if(err) {	
							console.log(err); 		
						}
					});
				})
				connectionDeleteModule.end();
			})
			connectionSelect.end();

			let connectionDeleteUtil = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
			connectionDeleteUtil.connect();
			connectionDeleteUtil.query("DELETE FROM `Utilisateur` WHERE `idUtilisateur` = " + idUtilisateur, (err, result) => { 
				if(err) {	
					console.log(err);
				}
				
				res.status(200).send({message: "L'utilisateur : " + idUtilisateur + " à bien été supprimé."});
			})
			connectionDeleteUtil.end();
			
		} else {
			res.status(409).send({erreur : "erreur : l'id " + idUtilisateur + " n'existe pas dans la base"});
		}
	})
	connection.end();
});



//////////////////////////////////////////////////
// 		Fonctions pour CRUD utilisateurs		//
//////////////////////////////////////////////////

function selectUtilByLogin(Login, res) {
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
	connection.query("Select `idUtilisateur`, `Nom`, `Prenom`, `Login`, `Etablissement`, `Mdp`, `Admin` from Utilisateur Where login = ?", [Login], (err, resultSel) => {
		if(err) {	
			res.send({err: err})  		
		}

		res.status(200).send({message: resultSel[0].idUtilisateur});
		connection.end();
	})
}


function insertUtilisateur(req, res){
	let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
	
	const Nom = req.body.Nom;
	const Prenom = req.body.Prenom;
	const Login = req.body.Login;
	const Mdp = req.body.Mdp;
	const Etablissement = req.body.Etablissement;
	const Admin = req.body.Admin;
	console.log(req.body);

	connection.connect();
	connection.query("INSERT INTO `Utilisateur`(`Nom`, `Prenom`, `Login`, `Etablissement`, `Mdp`, `Admin`) VALUES (?,?,?,?,?,?)", [Nom,Prenom,Login,Etablissement,Mdp,Admin], (err, resultInsert) => { 
		if(err) {	
			res.send({err: err})  		
		}
		console.log(resultInsert.affectedRows === 1 ? "Ajout effectué : " + Login : "Erreur d'ajout");
		if(resultInsert.affectedRows === 0) {
			res.status(409).send("{ \"erreur\" : \"Probleme mySQL\"} ");
			connection.end();
		} else {
			selectUtilByLogin(Login,res);
		}
	})
}


//////////////////////////////////////////
// 		Fonctions pour CRUD modules		//
//////////////////////////////////////////

const insertLiaisonModuleUtilisateur = (nomModule, idUtilisateur) => {
	return new Promise((resolve) => {
		let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
		connection.connect();
		connection.query("SELECT `idModule` FROM `ModuleFormation` WHERE `Nom` = ?", [nomModule], (err, resultSelect) => {
			console.log("RESULTSELECT : " + JSON.stringify(resultSelect));
			if (resultSelect.length == 1) {
				connection.query("INSERT INTO `LiaisonModule`(`idUtilisateur`, `idModule`) VALUES (?,?)", [idUtilisateur,resultSelect[0].idModule], (err, result) => { 
					if(err) {	
						console.log(err);
					}
				})
				connection.end();
				resolve();
			} else {
				connection.end();
				console.log("erreur : insert liaison module");
			}
		})
	})
}

const insertLiaisonModuleNiveaux = (nomModule, idNiveau) => {
	return new Promise((resolve) => {
		let connection = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
		connection.connect();
		connection.query("SELECT `idModule` FROM `ModuleFormation` WHERE `Nom` = ?", [nomModule], (err, resultSelect) => {
			if (resultSelect.length == 1) {
				connection.query("INSERT INTO `LiaisonNiveaux`(`idModule`, `idNiveau`) VALUES (?,?)", [resultSelect[0].idModule,idNiveau], (err, result) => { 
					if(err) {	
						console.log(err);
					}
				})
				connection.end();
				resolve();
			} else {
				connection.end();
				console.log("erreur : insert liaison niveaux");
			}
		})
	})
}



// Ajoute le lien niveau
const ajtNiveau = (idModule, idNiveau) => {
	return new Promise((resolve) => {
		let connectionInsert = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
		connectionInsert.connect();
		connectionInsert.query("INSERT INTO `LiaisonNiveaux`(`idModule`, `idNiveau`) VALUES (?,?)", [idModule,idNiveau], (err, result) => { 
			if(err) {	
				console.log(err);
			}
			console.log(result);
			resolve(result);
		})
		connectionInsert.end();
	})
}


const ajtModule = (nomModule) => {
	return new Promise((resolve) => {
		let connectionInsert = mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE});
		connectionInsert.connect();
		connectionInsert.query("INSERT INTO `ModuleFormation` (`Nom`) VALUES (?)", [nomModule], (err, resultInsert) => {
			if(err) {	
				console.log(err);
			}
			console.log(resultInsert);
			resolve(resultInsert);
		})
		connectionInsert.end();
	})
}
