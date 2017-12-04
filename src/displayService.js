'use strict';

let inquirer = require('inquirer');

/******************************************
 *   Service d'affichage dans la console  *
 ******************************************/

module.exports = {
  // Affiche une question et renvoie une promise
  printQuestion: function(question) {
    return inquirer.prompt(question);
  },

  // Affiche du texte
  printText: function(text) {
    return console.info(text);
  }
};
