const {StorageManager, Console, ExportManager, CommandManager, ChatResponder, Client, BotListeners} = Bot;
const {EmbedBuilder} = require('discord.js');
const modFunctions = require('./functions');

//Exports
module.exports = {
    modLog,
    doUndoAction,
};
//Log function
async function modLog(type, /** @type {Discord.User} */ user, /** @type {Discord.User} */ moderator, reason, guild, tempChannel, doAction = true, length = -1) {
    let typeMsg = type == 'Mute' ? 'muted in' : type == 'Kick' ? 'kicked from' : type == 'Ban' ? 'banned from' : type == 'Warn' ? 'warned in' : 'Error';
    if (!reason) reason = 'None';
    //Save action
    var caseId = StorageManager.get('currentModCount', guild.id) ? StorageManager.get('currentModCount', guild.id) + 1 : 1;
    StorageManager.set('currentModCount', caseId, guild.id);
    saveAction(type, user.id, user.tag, moderator.id, reason, caseId, guild.id, length);
    //Console log
    var logMessage = `${user.tag} was ${typeMsg} ${guild.name} by ${moderator.tag} with the reason "${reason}"`;
    if (length != -1) logMessage += ` for ${length}`;
    Console.log(logMessage, guild.id);
    //Channel stuff
    if (tempChannel) tempChannel.reply({embeds: [new EmbedBuilder().setColor(CommandManager.neutralColor).setDescription(`${type} of ${user.tag} successful`)], ephemeral: true});
    var channelId = StorageManager.get('modLogChannel', guild.id);
    if (!channelId) {
        Console.log(`No log channel set, and temp channel is null`, guild.id);
        return;
    }
    let channel = guild.channels.cache.get(channelId);
    //Log
    var logEmbed = new EmbedBuilder()
        .setColor(CommandManager.successColor)
        .setAuthor({name: `Case ${caseId} | ${type} | ${user.tag}`, iconURL: user.avatarURL()})
        .setFields([
            {
                name: 'User',
                value: `${user}`,
                inline: true,
            },
            {
                name: 'Moderator',
                value: `${moderator}`,
                inline: true,
            },
        ])
        .setTimestamp(new Date())
        .setFooter({text: `User ID: ${user.id}`});

    if (length != -1)
        logEmbed.addFields([
            {
                name: 'Length',
                value: `${modFunctions.lengthToString(length)}`,
                inline: true,
            },
        ]);
    //Dm user
    var dmEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setTitle(`You have been ${typeMsg} ${guild.name}`).setTimestamp(new Date());
    if (length != -1)
        dmEmbed.addFields([
            {
                name: 'Length',
                value: `${modFunctions.lengthToString(length)}`,
                inline: true,
            },
            {
                name: 'Reason',
                value: `${reason}`,
                inline: true,
            },
        ]);
    else dmEmbed.addFields([{name: 'Reason', value: `${reason}`, inline: false}]);
    await user
        .send({embeds: [dmEmbed]})
        .then(() => {
            logEmbed.addFields([{name: 'DM Status', value: 'Succesful', inline: true}]);
        })
        .catch(() => {
            logEmbed.addFields([{name: 'DM Status', value: 'Failed', inline: true}]);
        });
    //Rest of log
    logEmbed.addFields([{name: 'Reason', value: `${reason}`, inline: true}]);
    //Do the action
    if (doAction) {
        var guildUser = await guild.members.fetch(user.id);
        doNormalAction(type, guildUser, reason, length);
    }
    //Send log
    channel.send({embeds: [logEmbed]});
}
//Save mod action
function saveAction(action, userId, username, moderatorId, reason, caseId, guildId, length) {
    //Active
    if (length != -1) {
        var activeActions = StorageManager.get('activeMod', guildId) ? StorageManager.get('activeMod', guildId) : {};
        activeActions[caseId] = {};
        activeActions[caseId]['date'] = Date.now();
        activeActions[caseId]['action'] = action;
        activeActions[caseId]['length'] = length;
        activeActions[caseId]['userId'] = userId;
        activeActions[caseId]['username'] = username;
        StorageManager.set('activeMod', activeActions, guildId);
    }
    //log
    var modLog = StorageManager.get('modLog', guildId) ? StorageManager.get('modLog', guildId) : {};
    if (!modLog[userId]) modLog[userId] = {};
    modLog[userId][caseId] = {};
    modLog[userId][caseId]['date'] = Date.now();
    modLog[userId][caseId]['action'] = action;
    modLog[userId][caseId]['length'] = length;
    modLog[userId][caseId]['username'] = username;
    modLog[userId][caseId]['moderator'] = moderatorId;
    modLog[userId][caseId]['reason'] = reason;
    StorageManager.set('modLog', modLog, guildId);
}
//Do normal Action
function doNormalAction(action, user, reason, length) {
    if (action == 'Ban') user.ban({days: 1, reason: `${reason}`});
    if (action == 'Mute') user.timeout(length * 1000, `${reason}`);
    if (action == 'Kick') user.kick(reason);
}
//Do undo Action
async function doUndoAction(type, userId, username, moderator, reason, tempChannel, guild) {
    //Do the action
    if (moderator.id == Client.user.id || tempChannel) {
        if (type == 'Ban') guild.bans.remove(userId, reason);
        if (type == 'Mute') {
            guild.members
                .fetch(userId)
                .then((member) => {
                    member.edit({communicationDisabledUntil: null}, reason);
                })
                .catch(Console.error);
        }
    }
    //Remove from active moderations
    var actions = StorageManager.get('activeMod', guild.id) ? StorageManager.get('activeMod', guild.id) : {};
    for (action in actions) {
        if (actions[action]['userId'] == userId && actions[action]['action'] == type) {
            delete actions[action];
        }
    }
    StorageManager.set('activeMod', actions, guild.id);
    //other
    let typeMsg = type == 'Mute' ? 'unmuted in' : type == 'Ban' ? 'unbanned from' : 'Error';
    //Console log
    var logMessage = `${username} was ${typeMsg} ${guild.name} by ${moderator.username} with the reason "${reason}"`;
    Console.log(logMessage, guild.id);
    //Channel stuff
    if (tempChannel) tempChannel.reply({embeds: [new EmbedBuilder().setColor(CommandManager.neutralColor).setDescription(`${typeMsg} of ${username} successful`)], ephemeral: true});
    var channelId = StorageManager.get('modLogChannel', guild.id);
    if (!channelId) {
        Console.log(`No log channel set, and temp channel is null`, guild.id);
        return;
    }
    let channel = guild.channels.cache.get(channelId);
    //Log
    var logEmbed = new EmbedBuilder()
        .setColor(CommandManager.successColor)
        .setAuthor({name: `Un${type.toLowerCase()} | ${username}`})
        .setFields([
            {
                name: 'User',
                value: `<@${userId}>`,
                inline: true,
            },
            {
                name: 'Moderator',
                value: `${moderator}`,
                inline: true,
            },
            {
                name: 'Reason',
                value: `${reason}`,
                inline: true,
            },
        ])
        .setTimestamp(new Date())
        .setFooter({text: `User ID: ${userId}`});

    channel.send({embeds: [logEmbed]});
}
