require('dotenv').config(); // init dotenv

const Client = require('./src/Client');
const DiscordAPI = require('./src/DiscordAPI');

DiscordAPI.init();
Client.start();
