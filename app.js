//Node modules required:
const Discord = require('discord.js'); //Requiring modules.
const fs = require('fs'); //Requiring native module.
const path = require('path'); //Requiring native module.

//Managers required:
const SM = require('./StorageManager');
const EM = require('./ExportManager');
const LM = require('./ListenerManager');
const CM = require('./CommandManager');
const CR = require('./ChatResponder');
const C = require('./Console');

//Config file.
const CONFIG = require('./config.json');

//Getting the bot token.
const TOKEN = CONFIG.TOKEN;

//Creating the client.
const Client = new Discord.Client({
    disabledEvents: ['TYPING_START', 'TYPING_STOP', 'CHANNEL_PINS_UPDATE', 'USER_SETTINGS_UPDATE'],
    intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_BANS',
        'GUILD_EMOJIS_AND_STICKERS',
        'GUILD_INTEGRATIONS',
        'GUILD_WEBHOOKS',
        'GUILD_INVITES',
        'GUILD_VOICE_STATES',
        'GUILD_PRESENCES',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_MESSAGE_TYPING',
        'DIRECT_MESSAGES',
        'DIRECT_MESSAGE_REACTIONS',
        'DIRECT_MESSAGE_TYPING',
    ],
});

const Console = new C(Client);
Console.log('Console is ready', null);
Client.on('ready', () => {
    const ExportManager = new EM();
    ExportManager.export('config', CONFIG);
    const BotListeners = new LM(Client);
    const StorageManager = new SM(Client, Console);
    const CommandManager = new CM(BotListeners, StorageManager, CONFIG.BOTOWNERS, Console);
    const ChatResponder = new CR(BotListeners, StorageManager, Console);
    global.Bot = {
        Client,
        BotListeners,
        StorageManager,
        CommandManager,
        ChatResponder,
        ExportManager,
        Console,
    };

    require('./BackupManager');

    //Requiring modules.
    for (let addon of fs.readdirSync(path.join(__dirname, 'addons'))) {
        require(path.join(__dirname, 'addons', addon, 'addon'));
    }
    Console.log('Loaded all addons', null);

    Console.log('Bot is up and running', null);
});
//Logging in.
Client.login(TOKEN);
