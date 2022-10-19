//@ts-check
const {EmbedBuilder, PermissionsBitField, ChannelType} = require('discord.js');
/**
 * @typedef {"Uncategorized Commands"|"Misc"|"Botowner Commands"|"Moderation"|"Information"} CommandCategory
 *
 */

/**
 * @typedef CommandOptions
 * @property {string} description | Description of the command.
 * @property {CommandCategory} category | Category of the command.
 * @property {boolean} botowner | Whether to make this command only usable by botowners.
 * @property {boolean} mod | Whether to make this command only usable by moderators.
 * @property {boolean} admin | Whether to make this command only usable by user with admin permmission.
 */
/**
 * @typedef CommandExtras
 * @property {string} cmd The command that can triggers this callback.
 * @property {(message: import('discord.js').Message, String) => void} cb Callback to call once this command is triggered.
 *
 * @typedef {CommandExtras & CommandOptions} Command
 */
/**
 * Manages all the commands.
 */
class CommandManager {
    /**
     *
     * @param {import('discord.js').Client} Client Discord.JS client
     * @param {typeof Bot.StorageManager} StorageManager The storage manager for the bot.
     * @param {string[]} botowners Bot
     */
    constructor({on}, StorageManager, botowners, Console) {
        /**
         * Array of all the commands.
         * @type {Command[]}
         */
        this.commands = [];

        /**
         * Array of all botowners.
         * @type {ReadonlyArray<string>}
         */
        this.botowners = botowners;

        /**
         * Prefix of the bot.
         * @type {string}
         */
        this.prefix = '?';

        //Colours
        this.successColor = 0x239400;
        this.failColor = 0x910f00;
        this.neutralColor = 0x013370;

        /**
         * Adds a command to be usable.
         * @param {string} cmd The command that can trigger this callback.
         * @param {Partial<CommandOptions>} options Options of the command.
         * @property {string} description | Description of the command.
         * @property {CommandCategory} category | Category of the command.
         * @property {boolean} botowner | Whether to make this command only usable by botowners.
         * @property {boolean} mod | Whether to make this command only usable by moderators.
         * @property {boolean} admin | Whether to make this command only usable by user with admin permmission.
         * @property {(import('discord.js').Message, String) => void} cb Callback to call once the command is activated.
         */

        this.add = (cmd, options, cb) => {
            /** @type {Command} */
            const data = Object.assign(
                {
                    cb,
                    cmd: cmd.toLowerCase(),
                    category: 'Uncategorized Commands',
                    description: 'No description provided.',
                    botowner: false,
                    mod: false,
                    admin: false,
                },
                options
            );
            this.commands.push(data);
        };
        //Activate text commands.
        on('messageCreate', async (msg) => {
            //Filter out dms, other bots and no prefix...
            if (msg.channel.type === ChannelType.DM || !msg.content.startsWith(this.prefix) || msg.author.bot || msg.guild == null) return;
            const cmd = msg.content.split(' ')[0].slice(this.prefix.length).toLowerCase();
            for (const command of this.commands) {
                if (command.cmd.startsWith(cmd)) {
                    //Check if bot has the needed permissions
                    if (!checkBotPermissions(msg.channel, msg.guild, command.mod)) {
                        Console.error('Bot permission error in guild with id: ' + msg.guild.id);
                        return;
                    }
                    //Check mod status of user
                    if (command.mod) if (!checkModStatus(msg.member, msg.guild, StorageManager) && !checkAdminStatus(msg.member, msg.guild)) return;
                    //Check admin status of user
                    if (command.admin) if (!checkAdminStatus(msg.member, msg.guild)) return;
                    //Check botowner status of user
                    if (command.botowner) if (!this.botowners.includes(msg.author.id)) return;
                    //Run command call back
                    try {
                        var split = msg.content.split(' ');
                        var content = msg.content.replace(split[0], '').replace(' ', '');
                        command.cb(msg, content);
                    } catch {
                        async (error) => {
                            if ((error.name === 'DiscordAPIError' && !(error.path.endsWith('/messages') && error.code === 50013)) || error.name !== 'DiscordAPIError') {
                                //Error is not about sending messages.
                                Console.error(`Error while executing command "${command.cmd[0]}"`);
                                Console.error(error.stack);
                                try {
                                    await msg.channel.send({
                                        embeds: [new EmbedBuilder().setDescription('An error has occurred while running this command! It has been reported to the developer!').setColor(0xff0000)],
                                    });
                                } catch (_) {}
                            }
                            Console.log(error);
                        };
                    }
                }
            }
        });
        Console.log('Commandmanager is ready', null);
    }
}
function checkModStatus(member, guild, Storage) {
    var userRoles = member.roles.cache;
    var modRoles = Storage.get('modRoles', guild.id) ? Storage.get('modRoles', guild.id) : [];
    var found = false;
    userRoles.forEach((role) => {
        if (modRoles.includes(role.id)) found = true;
    });
    return found;
}

function checkAdminStatus(member, guild) {
    if (member.permissions.has(PermissionsBitField.Flags.Administrator, true)) return true;
    return false;
}

async function checkBotPermissions(channel, /** @type {import('discord.js').Guild} */ guild, mod) {
    var neededPermissions = [
        PermissionsBitField.Flags.ViewAuditLog,
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.SendMessagesInThreads,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.AddReactions,
    ];
    if (mod) {
        neededPermissions.concat([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.ModerateMembers]);
    }
    let me = await guild.members.fetch(guild.client.user.id);
    if (me.permissionsIn(channel).has(neededPermissions)) return true;
    return false;
}

module.exports = CommandManager;
