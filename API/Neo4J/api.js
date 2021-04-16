/**
 * Constante utile à l'api NEO4J
 */

const neo4j = require('neo4j-driver') 
const express = require('express')
const cors = require('cors');
const { default: result } = require('neo4j-driver/lib/result');
const driver = neo4j.driver('bolt://obiwan2.univ-brest.fr:7687') // pas d'authentification pour la base Neo4j sur Obiwan2
let app = express();
app.use(cors());

//Utilisation du middleware Json poour parser les requêtes entrantes  
app.use(express.json())

/**
 * Retourne un module 
 * @param id Identifiant du module concerné 
 * @return Json comprenant le module (id, idEnseignant, nom, description)
 */
app.get('/Module/:idModule', (req,res) => {
    const session = driver.session()
	const id = req.params.idModule;
    session
        .run('MATCH (n:grp5_MFDebut {id:'+id+'}) RETURN n as description')
        .then(result => {
            console.log(result.records[0]['_fields'][0])
            res.status(200).json(result.records)
            
        })
        .catch(error => {
            console.log(error)
            res.status(409).json({"erreur": "Module inexistant"})
        })
        .then(() => session.close())
	
})


/**
 * Retourne l(es) unité(s) liée(s) à l'id du module, en plus de leur lein et leurs chaines descriptives.
 * @param id Identifiant du module concerné 
 * @return  JSON contenant l(es) unité(s) liée(s) à un Module (Lien : url / Unite : id, idEnseignant, nom / Cd : Nom)
 */
app.get('/Unites/:idModule', (req,res) => {
    const session = driver.session()
    const id = req.params.idModule;

    session
        .run('match (unite:grp5_UP)-[:grp5_UTILISE]->(lien:grp5_LIEN), (unite:grp5_UP)-[:grp5_DECRIT]->(cd:grp5_CD) where (:grp5_MFDebut{id:'+id+'})-[:grp5_MF{id:'+id+'}]->(unite) OR ()-[:grp5_MF{id:'+id+'}]->(unite) return unite, collect( distinct lien) ,collect (distinct cd)')
        .then(result => {
            console.log(result['records'])
            res.status(200).json(result['records'])         
        })
        .catch(error => {
            console.log(error)
            res.status(200)
        })
        .then(() => session.close())
	
})

/**
 * Retourne une unité lié à son ID
 * @param id Identifiant de l'unité concerné
 * @return Retourne un JSON contenant l'unité lié à son ID (Lien : url / Unite : id, idEnseignant, nom / Cd : Nom)
 */
app.get('/Unite/:id', (req,res) => {
    const session = driver.session()
    const id = req.params.id;
    session
        .run('match (unite:grp5_UP)-[:grp5_UTILISE]->(lien:grp5_LIEN), (unite:grp5_UP)-[:grp5_DECRIT]->(cd:grp5_CD)   where ID(unite)='+id+' return unite,collect(distinct lien), collect( distinct cd)')
        .then(result => {
            console.log(result['records'])
            res.status(200).json(result['records'])
        })
        .catch(error => {
            console.log(error)
            res.status(200)
        })
        .then(() => session.close())
})

/**
 * Retourne les unités liées à une chaine descriptive 
 * @param chaine Chaine unique étant rélié à divers unités pédagogique
 * @return Retourne un JSON contenant l(es) unité(s) liée(s) à la chaine descriptive (Lien : url / Unite : id, idEnseignant, nom / Cd : Nom)
 */
app.get('/UniteChaineDescriptive/:chaine', (req,res) => {
    const session = driver.session()
    const sUnite = driver.session();
    const chaine = req.params.chaine;
    let up=[];
    let resUp=[]
    session.run('match (cd:grp5_CD{nom:"'+chaine+'"})<-[:grp5_DECRIT]-(n:grp5_UP) return n')
    .then(function (result){
        
        result.records.forEach(function(record){
            console.log(record)
            up.push(record['_fields'][0]['identity'].low)
        });
        console.log(up)
        return up
    })      
    .catch(function(err){
     console.log("inside catch = " + err);
    })
    .then ( async function () {

                async function chaineList() {
                    
                    for (unite of up) {
                        sessionCd = await driver.session()
                        let resUnite = await sUnite.run('match (unite:grp5_UP)-[:grp5_UTILISE]->(lien:grp5_LIEN), (unite:grp5_UP)-[:grp5_DECRIT]->(cd:grp5_CD)   where ID(unite)='+unite+' return unite,collect( distinct lien), collect(distinct cd)')
                        await resUp.push(resUnite.records[0]['_fields'])
                        await Promise.resolve()
                        await sessionCd.close()

                    }

                }

                chaineList().then(_ => {
                    console.log(resUp)
                    sUnite.close()
                    res.status(200).json(resUp)                        
                });

        
    })
    .then(() => session.close())

})

/**
 * Retourne toutes les unités pédagogique de l'application.
 * @return Retourne un JSON contenant l(es) unité(s) (Lien : url / Unite : id, idEnseignant, nom / Cd : Nom)
 */
app.get('/touteUnite', (req,res) => {
    const session = driver.session()

    session
        .run('match (unite:grp5_UP) return unite')
        .then(result => {
            console.log(result['records'])
            res.status(200).json(result['records'])
        })
        .catch(error => {
            console.log(error)
            res.status(200)
        })
        .then(() => session.close())
})

/**
 * Retourne toutes les chaines descriptive de l'application.
 * @return Retourne un JSON contenant la(es) chaine(s) (Chaine: nom)
 */
app.get('/touteChaine', (req,res) => {
    const session = driver.session()

    session
        .run('match (chaine:grp5_CD) return chaine')
        .then(result => {
            console.log(result['records'])
            res.status(200).json(result['records'])
        })
        .catch(error => {
            console.log(error)
            res.status(200)
        })
        .then(() => session.close())
})

/**
 * Retourne l(es) unité(s) liée(s) à un enseignant
 * @return Retourne un JSON contenant les nombre unité lié à un enseignant (nombre / idEnseignant) 
 */
app.get('/uniteParProf', (req,res) => {
    const session = driver.session()

    session
        .run('MATCH (n:grp5_UP) with count(n.identifiant) as number,n return  size(collect(number)), n.idEnseignant')
        .then(result => {
            console.log(result['records'])
            res.status(200).json(result['records'])
        })
        .catch(error => {
            console.log(error)
            res.status(200)
        })
        .then(() => session.close())
})

/**
 * Créer une unité en fonction des paramètres rentrés, la lie au module concerné. 
 * @param idModule id du module contenant l'unité pédagogique
 * @param nomModule nom du module contenant l'unité pédagogique
 * @param idEnseignant id de l'enseignant ayant crée l'unité pédagogique
 * @param descriptionModule description du module contenant l'unité pédagogique
 * @param nomUnite nom de l'unité a créer
 * @param urlUnite url(s) de la ressource liée(s) à l'unité 
 * @param chaineDesc chaine(s) liée(s) à l'unité
 * @return Retourne un JSON contenant l'ID de la nouvelle unité pédagogique créée (id, nom, idEnseignant)
 */
app.post('/creationUnite', (req,res) => {
    const session1 = driver.session()
    const session2 = driver.session()
    const s = driver.session();
    let sVerify = driver.session();
    const idMod = req.body.idModule;
    const nomMod = req.body.nomModule;
    const idEns = req.body.idEnseignant;
    const descMod = req.body.descriptionModule;
    const nom = req.body.nomUnite;
    const url = req.body.urlUnite;
    const chaineDesc = req.body.chaineDesc
    let nb
    let returnId
    let sessionCd
    console.log(req.body)
    s.run('MATCH (n: grp5_MFDebut{id:'+idMod+', nom:"'+nomMod+'", idEnseignant:'+idEns+'})-[r:grp5_MF{id:'+idMod+', nom:"'+nomMod+'"}]->(m:grp5_UP) RETURN count(r) as rel ')
    .then(function (result){
        result.records.forEach(function(record){
            nb = record['_fields'][0].low
        });
        return nb
    })      
    .catch(function(err){
     console.log("inside catch = " + err);
    })
    .then ( async function () {
        sVerify = driver.session();
        let exist = await sVerify.run('MATCH ()-[:grp5_MF{id : '+idMod+', idEnseignant:'+idEns+' }]->(n:grp5_UP { idEnseignant: '+idEns+', nom: "'+nom+'"}) return count(n) as u')
        sVerify.close()
        exist = exist.records[0]['_fields'][0].low
        sVerify = driver.session();
        let doublon = await sVerify.run('MATCH (n:grp5_UP { idEnseignant: '+idEns+', nom: "'+nom+'"}) return count(n) as u')
        doublon = doublon.records[0]['_fields'][0].low
        sVerify.close()
        if (exist == 0){
            if (doublon == 0){
                if (nb > 0) {
                    try {
                        returnId = await session1.run ('MERGE (newuni: grp5_UP{ idEnseignant:'+idEns+',nom:"'+nom+'"}) WITH newuni MATCH (unite:grp5_UP) WHERE NOT (unite)-[:grp5_MF{id:'+idMod+', idEnseignant:'+idEns+'}]->(:grp5_UP) AND ()-[:grp5_MF{id:'+idMod+', idEnseignant:'+idEns+'}]->(unite) MERGE (unite)-[module: grp5_MF{ description:"'+descMod+'",id:'+idMod+',idEnseignant:'+idEns+',nom:"'+nomMod+'"}]-> (newuni) RETURN ID(newuni) AS uni')
                        returnId = returnId['records'][0]['_fields'][0]
                        console.log(returnId)

                    } catch (error) {
                        console.log(error)
                        res.status(409).json({"erreur": error})
                    }

                    async function chaineList() {
                    
                        for (chaine of chaineDesc) {
                            sessionCd = await driver.session()
                            await sessionCd.run('MERGE (c:grp5_CD{nom:"'+chaine+'"}) WITH c MATCH (u:grp5_UP) WHERE ID(u) = '+returnId.low+' MERGE (u)-[:grp5_DECRIT]->(c)')
                            await Promise.resolve()
                            await sessionCd.close()

                        }
                    }
                    async function lienList() {
                    
                        for (lien of url) {
                            sessionCd = await driver.session()
                            await sessionCd.run('MERGE (lien: grp5_LIEN {url:"'+lien+'"}) with lien MATCH (u:grp5_UP) WHERE ID(u) = '+returnId.low+' MERGE (u)-[:grp5_UTILISE]->(lien)')
                            await Promise.resolve()
                            await sessionCd.close()

                        }
                    }

                    chaineList().then(_ => {
                        lienList().then(_ => {
                            console.log("fin")
                            res.status(200).json(returnId)                        
                        });
                    });


                } else {

                    try {
                    returnId = await session2.run ('MERGE (unite: grp5_MFDebut { description:"'+descMod+'",id:'+idMod+',idEnseignant:'+idEns+',nom:"'+nomMod+'"}) MERGE (newuni: grp5_UP {idEnseignant:'+idEns+',nom:"'+nom+'"}) WITH unite, newuni MERGE (unite)-[module:grp5_MF{ description:"'+descMod+'",id:'+idMod+',idEnseignant:'+idEns+',nom:"'+nomMod+'"}]->(newuni)  RETURN ID(newuni)  AS uni')
                    returnId = returnId['records'][0]['_fields'][0]
                    console.log(returnId)
        
                    } catch (error) {
                        console.log(error)
                        res.status(409).json({"erreur": error})
                    }
                    async function chaineList() {
                    
                        for (chaine of chaineDesc) {
                            sessionCd = await driver.session()
                            console.log('MATCH (u:grp5_UP), (c:grp5_CD) WHERE c.nom = "'+chaine+'" AND ID(u) = '+returnId.low+' MERGE (u)-[:grp5_DECRIT]->(c)')
                            await sessionCd.run('MERGE (c:grp5_CD{nom:"'+chaine+'"}) WITH c MATCH (u:grp5_UP) WHERE ID(u) = '+returnId.low+' MERGE (u)-[:grp5_DECRIT]->(c)')
                            await Promise.resolve()
                            await sessionCd.close()
                            console.log(chaine)
                        }
                    }
                    async function lienList() {
                    
                        for (lien of url) {
                            sessionCd = await driver.session()
                            await sessionCd.run('MERGE (lien: grp5_LIEN {url:"'+lien+'"}) WITH lien MATCH (u:grp5_UP) WHERE ID(u) = '+returnId.low+' MERGE (u)-[:grp5_UTILISE]->(lien)')
                            await Promise.resolve()
                            await sessionCd.close()
                        }
                    }
                    
                    chaineList().then(_ => {
                        lienList().then(_ => {
                            console.log("fin")
                            res.status(200).json(returnId)                        
                        });
                    });

                }
            }
            else
            {
                console.log("Node existante (doublon)")
                res.status(409).json({"erreur": "Node existante (doublon)"})
            }
        }
        else 
        {
            console.log("Node existante (boucle)")
            res.status(409).json({"erreur": "Node existante (boucle)"})
        }
    })
    .then ( () =>  s.close() )
    .then(() => session2.close())
    .then(() => session1.close())
})


/**
 * Créer une unité en fonction des paramètres rentrés, la lie au module concerné. 
 * @param idModule id du module contenant l'unité pédagogique
 * @param id id de l'unité à relié
 * @param nomModule nom du module contenant l'unité pédagogique
 * @param idEnseignant id de l'enseignant ayant crée l'unité pédagogique
 * @param descriptionModule description du module contenant l'unité pédagogique
 * @param nomUnite nom de l'unité à créer
 * @param urlUnite url(s) de la ressource lié(s) à l'unité 
 * @return Retourne un JSON contenant l'ID de la nouvelle unité pédagogique créée (id, nom, idEnseignant)
 */
app.post('/creationUniteId', (req,res) => {
    const session1 = driver.session()
    const session2 = driver.session()
    const s = driver.session();
    const sVerify = driver.session();
    const id = req.body.id;
    const idMod = req.body.idModule;
    const nomMod = req.body.nomModule;
    const idEns = req.body.idEnseignant;
    const descMod = req.body.descriptionModule;
    let nb
    

    s.run('MATCH (n: grp5_MFDebut{id:'+idMod+', nom:"'+nomMod+'", idEnseignant:'+idEns+'})-[r:grp5_MF{id:'+idMod+', nom:"'+nomMod+'"}]->(m:grp5_UP) RETURN count(r) as rel ')
    .then(function (result){
        result.records.forEach(function(record){
            nb = record['_fields'][0].low
        });
        console.log(nb);
        return nb
    })      
    .catch(function(err){
     console.log("inside catch = " + err);
    })
    .then ( async function () { 
        
        let exist = await sVerify.run('MATCH ()-[:grp5_MF{id : '+idMod+', idEnseignant:'+idEns+' }]->(n:grp5_UP) WHERE ID(n) ='+id+' return count(n) as u')
        console.log(exist)
        exist = exist.records[0]['_fields'][0].low
        if (exist == 0){
            if (nb > 0) {
                console.log('MATCH (unite:grp5_UP) WHERE ()-[:grp5_MF{ description:"'+descMod+'",id:'+idMod+',idEnseignant:'+idEns+',nom:"'+nomMod+'"}]->(unite) AND NOT (unite)-[:grp5_MF]->(:grp5_UP) with unite MATCH (n:grp5_UP) WHERE ID(n)='+id+' MERGE (unite)-[module: grp5_MF{ description:"'+descMod+'",id:'+idMod+',idEnseignant:'+idEns+',nom:"'+nomMod+'"}]->(n) return n, unite limit 1')
                await session1.run ('MATCH (unite:grp5_UP) WHERE ()-[:grp5_MF{ description:"'+descMod+'",id:'+idMod+',idEnseignant:'+idEns+',nom:"'+nomMod+'"}]->(unite) AND NOT (unite)-[:grp5_MF]->(:grp5_UP) with unite MATCH (n:grp5_UP) WHERE ID(n)='+id+' MERGE (unite)-[module: grp5_MF{ description:"'+descMod+'",id:'+idMod+',idEnseignant:'+idEns+',nom:"'+nomMod+'"}]->(n) return n, unite limit 1')
                .then(result => {
                   //console.log(result['records'][0]['_fields'][0])
                    res.status(200).json(result['records'][0]['_fields'][0])
                })
                .catch(error => {
                    console.log(error)
                    res.status(200).json({"erreur": "Node inconnue"})
                })
            } else {
                await session2.run ('MATCH (debut: grp5_MFDebut), (n:grp5_UP) WHERE ID(n) = '+id+' AND debut.id = '+idMod+' AND debut.nom = "'+nomMod+'" AND debut.description = "'+descMod+'" MERGE (debut)-[module:grp5_MF{ description:"'+descMod+'",id:'+idMod+',idEnseignant:'+idEns+',nom:"'+nomMod+'"}]->(n)  RETURN ID(n)  AS uni')

                .then(result => {
                    console.log(result['records'][0]['_fields'][0])
                    res.status(200).json(result['records'][0]['_fields'][0])
                })
                .catch(error => {
                    console.log(error)
                    res.status(200).json({"erreur": "Node inconnue"})
                }) 
            }
        }
        else 
        {
            console.log("Node existante")
            res.status(200).json({"erreur": "Node existante (doublon)"})
        }
    })
    .then ( () =>  s.close() )
    .then(() => session2.close())
    .then(() => session1.close())
})



/**
 * Modifie une unité en fonction de ses paramètres d'entrée
 * @param id identifiant de l'unité à modifier
 * @param nom nouveau (ou même) nom de l'unité
 * @param url(s) nouveau(s) (ou même(s)) lien lié de l'unité
 * @param idEnseignant nouveau (ou même) identifiant d'enseignant lié à l'enseignant 
 * @param chaineDesc nouvelle(s) (ou même(s)) chaine(s) liée(s) à l'unité
 * @return Retourne un JSON contenant 1 si le lien est déja le même ou 2 si il ne s'agit pas du même   
 */
app.post('/ModificationUnite', (req,res) => {
    const s = driver.session()
    const sDel = driver.session()
    const sRel = driver.session()
    const sLienDel = driver.session()
    const sVerify = driver.session()
    const id = req.body.id;
    const nom = req.body.nom;
    const url = req.body.url;
    const chaineDesc = req.body.chaineDesc
    const idEns = req.body.idEnseignant;
    let exist

    sVerify.run('MATCH (n:grp5_UP ) where ID(n)='+id+' return count(n) as rel')
    .then(exist = function (result){

        exist = result.records[0]['_fields'][0].low
        return exist 
    })
    .then( async function () {
        if(exist == 1){
            await sRel.run('MATCH (n:grp5_UP)-[rl:grp5_UTILISE]->(l:grp5_LIEN), (n:grp5_UP)-[rc:grp5_DECRIT]->(cd:grp5_CD) WHERE ID(n) ='+id+' DELETE rl, rc ')
            await s.run('MATCH (unite:grp5_UP) WHERE ID(unite) = '+id+' SET unite = {idEnseignant:'+idEns+',nom:"'+nom+'"} RETURN unite')
                        
            async function chaineList() {
                    
                for (chaine of chaineDesc) {
                    let sessionCd = await driver.session()
                    await sessionCd.run('MERGE (c:grp5_CD{nom:"'+chaine+'"}) WITH c MATCH (u:grp5_UP) WHERE ID(u) = '+id+' MERGE (u)-[:grp5_DECRIT]->(c)')
                    await Promise.resolve()
                    await sessionCd.close()
                }
            }
            async function lienList() {
            
                for (lien of url) {
                    sessionCd = await driver.session()
                    await sessionCd.run('MERGE (lien: grp5_LIEN {url:"'+lien+'"}) WITH lien MATCH (u:grp5_UP) WHERE ID(u) = '+id+' MERGE (u)-[:grp5_UTILISE]->(lien)')
                    await Promise.resolve()
                    await sessionCd.close()
                }
            }
            
            chaineList().then(_ => {
                lienList().then(_ =>  {         
                    sDel.run('MATCH (chaine:grp5_CD) WHERE size((chaine)--())=0 DELETE chaine')
                    .then(() => {
                        sDel.close()
                        sLienDel.run('MATCH (lien:grp5_LIEN) WHERE size((lien)--())=0 DELETE lien')
                        .then(() => {
                            sLienDel.close()
                            console.log("Message : Modification effectuée")
                            res.status(200).json({"Message":"Modification effectuée"})  
                        })
                    })            
                });
            });
        }  
        else if(exist == 0)
        {
            sDel.close()
            sLienDel.close()
            console.log("erreur : Unité inconnue")
            res.status(409).json({"erreur":"Unité inconnue"}) 
        } 
        else
        {
            sDel.close()
            sLienDel.close()
            console.log("erreur : Unité déjà existante")
            res.status(409).json({"erreur":"Unité déjà existante"}) 
        }
    })
    .catch(error => {
        console.log(error)
        res.status(200)
    })
    .then(() => s.close())
    .then(() => sRel.close())
    .then(() => sVerify.close())
})

/**
 * Supprime une unité lié à son id (en fonction de son module)
 * @param idUnite Identifiant de l'unité à supprimer
 * @param idCreateur Identifiant du créateur de l'unité à supprimer
 * @param idCourant Identifiant de l'utilisateur actuellement connecté souhaitant supprimé l'unité
 * @return un JSON retournant l'id de l'unité supprimée et [] si erreur
 */
app.post('/suppressionUnite', (req,res) => {
    const session = driver.session()
    const sTestLiaison = driver.session()
    const sCreate = driver.session()
    const sDel = driver.session()
    const sRelDuo = driver.session()
    const sRel = driver.session()
    const sCd = driver.session()
    const sUniteDel = driver.session()
    const sLienDel = driver.session()
    const sCdDel = driver.session()
    const id = req.body.idUnite;
    const idCourant = req.body.Courant;
    const idCreateur = req.body.idCreateur;
    var liaison

    console.log("courant = . "+idCourant)
    console.log("createur = . "+idCreateur)
    console.log("id = . "+id)
    session
        .run('MATCH (n)-[r:grp5_MF]->(m:grp5_UP) WHERE ID(m) = '+id+' RETURN count(r) as rel')
        .then(function (result){
            console.log(result.records[0]['_fields'][0].low)
            liaison = result.records[0]['_fields'][0].low
            return liaison
        }) 
        .then (
            async function () {
                console.log("Liaison : "+liaison)
                if (liaison == 1){
                    try {
                        await sDel.run('MATCH (unite)-[r:grp5_UTILISE]->(:grp5_LIEN) WHERE ID(unite)= '+id+' DELETE r')
                        await sCd.run('MATCH (unite)-[r:grp5_DECRIT]->(:grp5_CD) WHERE ID(unite)= '+id+' DELETE r')
                        await sRel.run('MATCH (n)-[r:grp5_MF]->(unite:grp5_UP) WHERE ID(unite) = '+id+' DELETE r')
                        await sLienDel.run('MATCH (lien:grp5_LIEN) WHERE size((lien)--())=0 DELETE lien')
                        await sCdDel.run('MATCH (chaine:grp5_CD) WHERE size((chaine)--())=0 DELETE chaine')
                        let result = await sUniteDel.run('MATCH (unite:grp5_UP) WHERE ID(unite) = '+id+' DELETE unite return ID(unite) as unite')
                        console.log(result.records[0]['_fields'][0])
                        res.status(200).json(result.records[0]['_fields'][0])
                    }
                    catch (error) {
                        console.log("error")
                        res.status(200).json({"erreur": error})
                    }
                }
                else if (liaison > 1)
                {
                    
                    if (idCourant !== idCreateur){
                        console.log("Non égal")
                            try {
                                
                                await sCreate.run('MATCH (bl)-[br:grp5_MF]->(unite)-[ar:grp5_MF]->(al:grp5_UP) WHERE br.idEnseignant = '+idCourant+' AND ar.idEnseignant = '+idCourant+' AND ID(unite)= '+id+' AND br.id = ar.id  MERGE (bl)-[:grp5_MF{description : ar.description, id: ar.id, idEnseignant: ar.idEnseignant, nom: ar.nom }]->(al) return al,bl')
                                await sRelDuo.run('MATCH (bl)-[br:grp5_MF]->(unite)-[ar:grp5_MF]->(al:grp5_UP) WHERE bl.idEnseignant= '+idCourant+' AND ID(unite) = '+id+'  AND br.id = ar.id DELETE ar, br')
                                let test = await sRel.run('MATCH (n)-[r:grp5_MF]->(unite:grp5_UP) WHERE r.idEnseignant= '+idCourant+' AND ID(unite) = '+id+' DELETE r')

                                let testLiaison = () => {
 
                                    return new Promise(async(resolve) => {
                                        let liaison = await sTestLiaison.run('MATCH (n)-[r:grp5_MF]->(m:grp5_UP) WHERE ID(m) = '+id+' RETURN count(r) as rel');
                                        liaison = liaison.records[0]['_fields'][0].low;
                                        resolve(liaison)
                                    })
                                }
                                testLiaison().then(async (nbLiaison) => {
                                    console.log("Liaison apres del : "+nbLiaison)
                                    if(nbLiaison == 0){
                                        await sDel.run('MATCH (unite)-[r:grp5_UTILISE]->(:grp5_LIEN) WHERE ID(unite)= '+id+' DELETE r')
                                        await sCd.run('MATCH (unite)-[r:grp5_DECRIT]->(:grp5_CD) WHERE ID(unite)= '+id+' DELETE r')
                                        await sLienDel.run('MATCH (lien:grp5_LIEN) WHERE size((lien)--())=0 DELETE lien')
                                        await sCdDel.run('MATCH (chaine:grp5_CD) WHERE size((chaine)--())=0 DELETE chaine')
                                        let result = await sUniteDel.run('MATCH (unite:grp5_UP) WHERE size((unite)--())=0 DELETE unite return ID(unite) as unite')
                                        console.log(result.records[0]['_fields'][0])
                                        res.status(200).json(result.records[0]['_fields'][0])
                                    }else{
                                        res.status(200).json({"Message": "Unité encore reliée"})
                                    }
                                });
                                
                            } catch (error) {
                                console.log(error)
                                res.status(200).json([])
                            }

                    } else {
                        try {

                            await sCreate.run('MATCH (bl)-[br:grp5_MF]->(unite)-[ar:grp5_MF]->(al) WHERE ID(unite)= '+id+' AND br.id = ar.id  MERGE (bl)-[:grp5_MF{description : ar.description, id: ar.id, idEnseignant: ar.idEnseignant, nom: ar.nom }]->(al) return al,bl')
                            await sDel.run('MATCH (unite)-[r:grp5_UTILISE]->(:grp5_LIEN) WHERE ID(unite)= '+id+' DELETE r')
                            await sCd.run('MATCH (unite)-[r:grp5_DECRIT]->(:grp5_CD) WHERE ID(unite)= '+id+' DELETE r')
                            await sRelDuo.run('MATCH (bl)-[br:grp5_MF]->(unite)-[ar:grp5_MF]->(al) WHERE ID(unite) = '+id+'  AND br.id = ar.id DELETE ar, br')
                            await sRel.run('MATCH (n)-[r:grp5_MF]->(unite:grp5_UP) WHERE ID(unite) = '+id+' DELETE r')
                            await sLienDel.run('MATCH (lien:grp5_LIEN) WHERE size((lien)--())=0 DELETE lien')
                            await sCdDel.run('MATCH (chaine:grp5_CD) WHERE size((chaine)--())=0 DELETE chaine')
                            let result = await sUniteDel.run('MATCH (unite:grp5_UP) WHERE size((unite)--())=0 DELETE unite return ID(unite) as unite')
                            console.log(result.records[0]['_fields'][0])
                            res.status(200).json(result.records[0]['_fields'][0])
                        } catch (error) {
                            console.log(error)
                            res.status(200).json([])
                        }
                    }
                } else {
                    res.status(200).json([])
                }
        })
        .catch(error => {
            console.log(error)
            res.status(200)
        })
        .then(() => session.close())
        .then(() => sCreate.close())
        .then(() => sDel.close())
        .then(() => sRel.close())
        .then(() => sLienDel.close())
        .then(() => sUniteDel.close())
        .then(() => sCd.close())
        .then(() => sCdDel.close())
        .then(( ) => sRelDuo.close())
        .then(( ) => sTestLiaison.close())
})

/**
 * Créer un module  
 * @param idModule Identifiant du module à créer
 * @param nomModule Nom du module à créer
 * @param idEnseignant Identifiant du module à créer
 * @param descriptionModule Description du module à créer
 * @return Retoune un JSON comprenant les informations du module créer (id, nom, idEnseignant, description)
 */
app.post('/creationModule', (req,res) => {
    const session = driver.session()
	const id = req.body.idModule;
    const nom = req.body.nomModule;
    const idEns = req.body.idEnseignant;
    const desc = req.body.descriptionModule;

    session
        .run('MERGE (module: grp5_MFDebut{ id:'+id+', nom: "'+nom+'", idEnseignant: '+idEns+', description: "'+desc+'"}) RETURN module AS module')
        .then(result => {
            result.records.forEach(record => {
            console.log(record.get('module'))
            console.log(record)
            res.status(200).json(record)
            })
        })
        .catch(error => {
            console.log(error)
            res.status(200)
        })
        .then(() => session.close())
})

/**
 * Modification d'un module en fonction de son ID
 * @param idModule Identifiant du module à modifier
 * @param nomModule Nouveau (ou même) nom du modèle
 * @param idEnseignant Nouveau (ou même) identifiant de l'enseignant
 * @param description Nouvelle (ou même) description
 * @return Retourne un JSON contenant les informations du module modifiées (id, nom, description, idEnseignant)
 */
app.post('/ModificationModule', (req,res) => {
    const session = driver.session()
    const id = req.body.idModule;
    const nom = req.body.nomModule;
    const idEns = req.body.idEnseignant;
    const desc = req.body.descriptionModule;
    const sVerify = driver.session()
    let exist
 

    sVerify
        .run('MATCH (n:grp5_MFDebut {id:'+id+'})-[r:grp5_MF]-() return count(r)')
        .then(function (result){


            exist = result.records[0]['_fields'][0].low
            return exist
        })
        .then (() => {
            if (exist == 0) {
                session
                .run('MATCH (n:grp5_MFDebut {id:'+id+'}) SET n = {id:'+id+', nom: "'+nom+'", idEnseignant: '+idEns+', description: "'+desc+'"} RETURN n')
                .then(result => {
                    console.log(result['records'])
                    res.status(200).json(result['records']) 
                })
                .catch(error => {
                    console.log(error)
                    res.status(200)
                })
                .then(() => session.close())

            }
            else if (exist > 0) 
            {
                session
                .run('MATCH ()-[r:grp5_MF {id:'+id+'}]->(), (n:grp5_MFDebut {id:'+id+'}) SET r = {id:'+id+', nom: "'+nom+'", idEnseignant: '+idEns+', description: "'+desc+'" }, n = {id:'+id+', nom: "'+nom+'", idEnseignant: '+idEns+', description: "'+desc+'"} RETURN n')
                .then(result => {
                    console.log(result['records'])
                    res.status(200).json(result['records']) 
                })
                .catch(error => {
                    console.log(error)
                    res.status(200)
                })
                .then(() => session.close())
            }else{
                console.log("Module inconnu")
                res.status(409).json({"erreur":"Module inconnu"})
            }
        })
})

/**
 * Suppresion du module en fonction de son id
 * @param idModule Identifiant du module à supprimer
 * @return Retourne un JSON contenant l'ensemble des liaisons supprimés (id, nom, description, idEnseignant)  
 */
app.post('/suppressionModule', (req,res) => {
    const session = driver.session()
    const id = req.body.idModule;
    const sUp = driver.session()
    const sModule = driver.session()
    const sDelRel=driver.session();
    const sLien = driver.session()
    const sChaine = driver.session()
    const sUpPerdue = driver.session()
    var idSupp
    
    session
        .run('MATCH (u:grp5_MFDebut {id:'+id+'}) RETURN u.idEnseignant')
        .then(function (result){
            idSupp = result.records
            return idSupp
        }) 
        .then( 
        async function () {
            if(idSupp.length !== 0){
                await sDelRel.run('MATCH ()-[r :grp5_MF {id:'+id+'}]->() WITH r, r.id AS id DELETE r RETURN count(id) as Liaison')
                await sUpPerdue.run('MATCH (n)-[y:grp5_UTILISE]-(:grp5_LIEN), (n)-[c:grp5_DECRIT]-(:grp5_CD) WHERE NOT ()-[:grp5_MF]->(n) AND NOT (n)-[:grp5_MF]->() delete c,y return c,y')
                await sUp.run('MATCH (unite:grp5_UP) WHERE size((unite)--())=0 DELETE unite')
                await sLien.run('MATCH (lien:grp5_LIEN) WHERE size((lien)--())=0 DELETE lien') 
                await sModule.run('MATCH (module:grp5_MFDebut {id:'+id+'}) WHERE size((module)--())=0 DELETE module')
                await sChaine.run('MATCH (chaine:grp5_CD) WHERE size((chaine)--())=0 DELETE chaine')
                console.log(idSupp)
                res.status(200).json(idSupp)
            }else {
                res.status(409).json({"erreur":"Module inconnu"}) 
            }
        })  
        .catch(error => {
            console.log(error)
            res.status(409).json({"erreur":"Module inconnu"}) 
        })
        .then(() => session.close())
        .then(() => sUp.close())
        .then(() => sModule.close())
        .then(() => sLien.close())
        .then(() => sUpPerdue.close())
})


/**
 * Port découte de l'API Neo4J
 */
app.listen(7142, () => {
    console.log('Serveur à lécoute')
  })

