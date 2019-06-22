const mongoose = require('mongoose');

const CharacterModel = require('../database/CharacterModel');
const Character = require('../model/Character');

class CharacterFactory {
    constructor() {
        this.charactersById = {};
        this.charactersByName = {};
    }

    async getOrCreate(client, username) {
        let character = this.getCharacterByUsername(username);
        if (character) {
            return character;
        }
        character = await this.loadCharacter(client, {username: username});
        if (character) {
            return character;
        }
        return await this.createCharacter(client, username);
    }

    async loadCharacter(client, filter) {
        let model = await CharacterModel.find(filter);
        if (!model || model.length == 0) {
            return null;
        }

        if (this.charactersById[model.id]) {
            this.charactersById[model.id].client = client;
            this.charactersByName[model.name].client = client;
            return this.charactersById[model.id];
        }

        console.log('loaded character %s (%s)', model.name, model.id);

        return await this.initCharacter(client, model);
    }

    async createCharacter(client, username) {
        let model = await CharacterModel.create(username);

        console.log('created character, username %s, id %s', username, model.id);

        return await this.initCharacter(client, model);
    }

    async initCharacter(client, model) {
        let character = new Character(client);
        character.init(model);

        this.charactersById[character.id] = character;
        if (character.name) {
            this.charactersByName[character.name.toLowerCase()] = character;
        }

        let loadFriend = async id => {
            let friend = this.getCharacterById(id);
            if (friend) {
                return friend;
            }
            return await this.loadCharacter(null, {id: id});
        };

        await Promise.all(model.friends.map(loadFriend));
        await Promise.all(model.friendRequests.map(loadFriend));

        return character;
    }

    getCharacterByUsername(username) {
        return Object.values(this.charactersById).filter(char => char.username == username)[0];
    }

    getCharacterById(id) {
        let character = this.charactersById[id];
        if (character) {
            return character;
        }
    }

    async getCharacterByName(name) {
        let character = this.charactersByName[name.toLowerCase()];
        if (character) {
            return character;
        }
        return this.loadCharacter(null, {name: {$regex: new RegExp(`^${name}$`, "i")}});
    }

    async getCharacterFromPacket(recv) {
        if (recv.getProperty("cha1")) {
            return await this.getCharacterById(recv.getProperty("cha1"));
        } else if (recv.getProperty("cha2")) {
            return await this.getCharacterByName(recv.getProperty("cha2"));
        }
        return null;
    }

    updateCharacterName(character) {
        this.charactersByName[character.name.toLowerCase()] = character;
    }

}

module.exports = new CharacterFactory();