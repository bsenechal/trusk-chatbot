'use strict';

let displayService = require('./displayService.js');
let redisService = require('./redisService.js');
let questionService = require('./questionService.js');
let bluebird = require('bluebird');

/*******************************************
 *  Point d'entrée pour lancer le chatbot  *
 *******************************************/
function runChatbot() {
  redisService.openConnection();

  bluebird.resolve(questionService.getAllQuestions())
    .mapSeries(function(asyncMethodPassed) {
      return asyncMethodPassed();
    }).then(function(results) {

      // Récupération des données pour l'affichage
      questionService.getSavedAnswers().then(function(results) {
        displayService.printText(JSON.stringify(JSON.parse(results), null, 2));

        // On demande à l'utilisateur si le résultat est correct
        questionService.askConfirmQuestion().then(answer => {

          // Dans tous les cas, on vide le résultat
          questionService.clearAnswers();
          if (!answer.confirm) {
            runChatbot();
          } else {
            displayService.printText('Merci pour votre inscription :)');
            redisService.closeConnection();
          }
        })
      });
    });
}

runChatbot();
