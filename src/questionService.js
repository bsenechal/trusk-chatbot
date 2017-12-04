'use strict';

let displayService = require('./displayService.js');
let redisService = require('./redisService.js');
const {
  questions,
  confirmQuestion
} = require('../data/questions');

let questionNumber = 0;
let result = [];
const databaseKey = "questions";

/******************************************
 *    Service de gestion des questions    *
 ******************************************/

module.exports = {
  // Renvoie les promise de l'ensemble des questions à poser
  getAllQuestions: async function() {
    // Récupère le résultat de la saisie précédente depuis la BDD
    let previousResult = await redisService.getValue(databaseKey);
    let questionsArray = [];

    if (previousResult) {
      result = JSON.parse(previousResult);
    } else if (!previousResult && result.length > 0) { // Si l'utilisateur à entré "No" à la dernière question
      result = [];
    }

    questionNumber = getQuestionNumberFromResultArray(result);

    for (var i = questionNumber; i < questions.length; i++) {
      questionsArray.push(this.getQuestion(questions[i]));
    }
    return questionsArray;
  },

  // Pose la dernière question pour valider la saisie
  askConfirmQuestion: async function() {
    return displayService.printQuestion(confirmQuestion);
  },

  getQuestion: function(question) {
    return async function(value) {
      await askQuestion(question);
      questionNumber++;
    };
  },

  // Retourne l'ensemble des valeurs sauvegardées
  getSavedAnswers: function() {
    return redisService.getValue(databaseKey);
  },

  // Supprime l'ensemble des réponses
  clearAnswers: function() {
    return redisService.clearValue(databaseKey);
  }
}

// Pose une question
async function askQuestion(question) {
  // Affiche la question
  await displayService.printQuestion(question).then(answer => {
    result.push(answer);
    redisService.saveValue(databaseKey, JSON.stringify(result));
  });

  // Si il y a une question liée
  if (question.linkedQuestion) {
    // On a pas encore posé la question liée. On récupère le nombre de fois qu'il faut la poser
    if (question.linkedQuestion.number === -1) {
      question.linkedQuestion.number = eval("result[result.length - 1]." + questions[questionNumber].name);
    }

    // Si l'utilisateur a saisie une valeur supérieure à 0
    if (question.linkedQuestion.number > 0) {
      await askQuestion(question.linkedQuestion);
    }

    // On a déjà posé la question, on pose la question liée N fois
  } else if (question.number > 1) {
    // On décrémente le nombre restant de fois à poser la question
    question.number -= 1;
    await askQuestion(question);

    // On remet la variable dans son état initial si l'utilisateur souhaite saisir à nouveau des informations
  } else if (question.number === 1) {
    question.number = -1;
  }
}

// Calcul le numéro de question à poser en fonction des résultats précédents
function getQuestionNumberFromResultArray(previousResults) {
  let tempQuestion;

  // On détruit petit à petit le tableau afin de toujours avoir une question à poser et pas une sous question
  while (previousResults.length > 0) {
    tempQuestion = previousResults.pop();

    for (let i = questions.length - 1; i > 0; i--) {
      if (questions[i].name === Object.keys(tempQuestion)[0] && !questions[i].linkedQuestion) {
        previousResults.push(tempQuestion);
        return previousResults.length;
      }
    }
  }
  return previousResults.length;
}
