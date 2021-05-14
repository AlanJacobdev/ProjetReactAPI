/**
 * Dépendances
 */
const express = require('express');
const app = express();
const path = require('path')

/**
 * Port d'écoute du serveur
 */ 
const port = process.env.PORT || 7141;

/**
 * Chemin verts l'index de l'application
 */
const dirname = '/var/www/html/master/m1obiwan_012/ProjetReact';

app.use(express.static(path.join(__dirname, 'build')));


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

/**
 * @description Mise en route du serveur
 * @param port le port d'écoute du serveur
 */
app.listen(port, () => {
    console.log("Serveur à l'écoute sur le port " + port);
});