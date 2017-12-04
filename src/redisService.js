'use strict';

let redis = require('redis');
let bluebird = require('bluebird');
const host = '127.0.0.1';
const port = 6379;
let redisClient;
/******************************************
 *        Service d'accès à la BDD        *
 ******************************************/

bluebird.promisifyAll(redis.RedisClient.prototype);

module.exports = {
  // Ouvre un connexion à la BDD
  openConnection: function() {
    redisClient = redis.createClient({
      host: host,
      port: port
    });
  },

  // Sauvegarde un objet en base
  saveValue: function(key, value) {
    redisClient.set(key, value, function(error, result) {
      if (error) throw error;
    });
  },

  // Récupère un objet en base
  getValue: async function(key) {
    return redisClient.getAsync(key);
  },

  // Supprime un objet en base
  clearValue: function(key) {
    redisClient.del(key, function(error, result) {
      if (error) throw error;
    });
  },

  // Ferme la connection
  closeConnection: function(key) {
    redisClient.quit(function(error, result) {
      if (error) throw error;
    });
  }
}
