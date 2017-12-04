'use strict';

/******************************************
 *           Fichier de questions         *
 ******************************************/

// Il est possible de rajouter autant de questions que souhaitez en ajoutant des objets
// Pour les questions dont le résultat dépend de celle d'avant,
// il faut imbriquer les questions en utilisant la propriété "linkedQuestion"
const questions = [{
    type: "input",
    name: "name",
    message: "Quel est votre nom ?",
    validate: function(value) {
      var valid = value.length > 0;
      return valid || 'Une réponse est requise';
    }
  },
  {
    type: "input",
    name: "companyName",
    message: "Quel est le nom de votre société ?",
    validate: function(value) {
      var valid = value.length > 0;
      return valid || 'Une réponse est requise';
    }
  },
  {
    type: "input",
    name: "employeNumber",
    message: "Combien comporte t-elle d'employés ?",
    validate: function(value) {
      var valid = !isNaN(parseInt(value));
      return valid || 'Veuillez entrer un nombre';
    },
    filter: Number,
    linkedQuestion: {
      number: -1,
      type: "input",
      name: "employeName",
      message: "Quel est le nom de l'employé ?",
      validate: function(value) {
        var valid = value.length > 0;
        return valid || 'Une réponse est requise';
      }
    }
  },
  {
    type: "input",
    name: "truckNumber",
    message: "Combien avez-vous de camions ?",
    validate: function(value) {
      var valid = !isNaN(parseInt(value));
      return valid || 'Veuillez entrer un nombre';
    },
    filter: Number,
    linkedQuestion: {
      number: -1,
      type: "input",
      name: "truckVolume",
      message: "Quel est le volume du camion ?",
      validate: function(value) {
        var valid = !isNaN(parseInt(value));
        return valid || 'Veuillez entrer un nombre';
      },
      filter: Number,
    }
  },
  {
    type: "input",
    name: "truckType",
    message: "Quel est le type des camions ?",
    validate: function(value) {
      var valid = value.length > 0;
      return valid || 'Une réponse est requise';
    }
  }
];

const confirmQuestion = {
  "type": "confirm",
  "name": "confirm",
  "message": "Ces informations sont-elles correctes ?"
};

module.exports = {
  questions,
  confirmQuestion
}
