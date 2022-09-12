//@ts-check
const fs = require('fs');
const Path = require('path');

class StorageManager {
    constructor(Client, Console) {
        var path = Path.join(__dirname, 'database/');

        const Guilds = Client.guilds.cache;
        Guilds.forEach((guild) => {
            if (!fs.existsSync(`${path}${guild.id}.json`)) {
                fs.writeFile(`${path}${guild.id}.json`, '{}', () => {});
            }
        });
        Console.log('Storagemanager is ready', null);

        //Server data:
        /**
         * Store data into storage.
         * @param {string} name Name of the thing to be saved.
         * @param {*} value Value of the config.
         * @param {string} serverId Id of the server to save to
         */
        this.set = (name, value, serverId) => {
            let values = JSON.parse(fs.readFileSync(`${path}${serverId}.json`, {encoding: 'utf8'}));
            values[name] = value;
            fs.writeFileSync(`${path}${serverId}.json`, JSON.stringify(values, null, 2));
            //Console.log(`Set the ${name} value to ${value}`, serverId);
        };

        /**
         * Remove data from storage.
         * @param {string} name Name of the file to be removed.
         * @param {string} serverId Id of the server to save to
         */
        this.unset = (name, serverId) => {
            let values = JSON.parse(fs.readFileSync(`${path}${serverId}.json`, {encoding: 'utf8'}));
            delete values[name];
            fs.writeFileSync(`${path}${serverId}.json`, JSON.stringify(values, null, 2));
            //Console.log(`Unset the ${name} value`, serverId);
        };

        /**
         * Retrieve a value from storage.
         * @param {string} name Name of the file to be retrieved.
         * @param {string} serverId Id of the server to save to
         */
        this.get = (name, serverId) => {
            let values = JSON.parse(fs.readFileSync(`${path}${serverId}.json`, {encoding: 'utf8'}));
            //Console.log(`Retrieved the ${name} value, which is ${values[name]}`, serverId);
            return values[name];
        };

        //Global data:
        /**
         * Store data into storage.
         * @param {string} name Name of the thing to be saved.
         * @param {*} value Value of the config.
         */
        this.globalSet = (name, value) => {
            let values = JSON.parse(fs.readFileSync(`${path}global.json`, {encoding: 'utf8'}));
            values[name] = value;
            fs.writeFileSync(`${path}global.json`, JSON.stringify(values, null, 2));
            //Console.log(`Set the ${name} value to ${value}`, null);
        };

        /**
         * Remove data from storage.
         * @param {string} name Name of the file to be removed.
         */
        this.globalUnset = (name) => {
            let values = JSON.parse(fs.readFileSync(`${path}global.json`, {encoding: 'utf8'}));
            delete values[name];
            fs.writeFileSync(`${path}global.json`, JSON.stringify(values, null, 2));
            //Console.log(`Unset the ${name} value`, null);
        };

        /**
         * Retrieve a value from storage.
         * @param {string} name Name of the file to be retrieved.
         */
        this.globalGet = (name) => {
            let values = JSON.parse(fs.readFileSync(`${path}global.json`, {encoding: 'utf8'}));
            //Console.log(`Retrieved the ${name} value, which is ${values[name]}`, null);
            return values[name];
        };
    }
}

module.exports = StorageManager;
