const {StorageManager, Console, ExportManager, CommandManager, ChatResponder, Client, BotListeners} = Bot;
const {REST, Routes, ApplicationCommandType, ApplicationCommandPermissionType} = require('discord.js');
const config = ExportManager.import('config');

const commands = [
    {
        name: 'Kick',
        type: ApplicationCommandType.User,
    },
    {
        name: 'Ban',
        type: ApplicationCommandType.User,
    },
    {
        name: 'Warn',
        type: ApplicationCommandType.User,
    },
    {
        name: 'Report',
        type: ApplicationCommandType.Message,
    },
];
const rest = new REST({version: '10'}).setToken(config.TESTTOKEN);
(async () => {
    try {
        await rest.put(Routes.applicationCommands(config.CLIENT_ID), {body: commands});
        Console.Log('Reloaded application commands.');
    } catch (error) {
        Console.Error(error);
    }
})();
