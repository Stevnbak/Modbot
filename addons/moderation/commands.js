const {StorageManager, Console, ExportManager, CommandManager, ChatResponder, Client, BotListeners} = Bot;
const {EmbedBuilder} = require('discord.js');
const modFunctions = require('./functions');
const modActions = require('./actions');
//Kick
CommandManager.add('kick', {description: 'Kick member', category: 'Moderation', mod: true}, (/** @type {import('discord.js').Message} */ message, content) => {
    if (content == '') {
        var msgEmbed = new EmbedBuilder()
            .setColor(CommandManager.neutralColor)
            .setTitle(`Kick member`)
            .setDescription('Use the command `' + CommandManager.prefix + 'kick [userId] [reason]` to kick a member');
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`Showed kick command info`, message.guild.id);
        return;
    }
    let modUser = message.member;
    let params = content.split(' ');
    message.guild.members
        .fetch(params[0])
        .then((actionUser) => {
            let reason = content.replace(params[0] + ' ', '');
            message.delete().catch(() => {});
            modActions.modLog('Kick', actionUser.user, modUser.user, reason, message.guild, message.channel);
        })
        .catch(() => {
            message.channel.send({embeds: [new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`User with id: '${params[0]}' could not be found`)]});
        });
});
//Ban
CommandManager.add('ban', {description: 'Ban member', category: 'Moderation', mod: true}, (/** @type {import('discord.js').Message} */ message, content) => {
    if (content == '') {
        var msgEmbed = new EmbedBuilder()
            .setColor(CommandManager.neutralColor)
            .setTitle(`Ban member`)
            .setDescription('Use the command `' + CommandManager.prefix + 'ban [userId] [length?] [reason]` to ban a member');
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`Showed ban command info`, message.guild.id);
        return;
    }
    let modUser = message.member;
    let params = content.split(' ');
    message.guild.members
        .fetch(params[0])
        .then((actionUser) => {
            let length = modFunctions.getLength(params[1]);
            let reason = '';
            if (length != -1) reason = content.replace(params[0] + ' ' + params[1] + ' ', '');
            else reason = content.replace(params[0] + ' ', '');
            message.delete().catch(() => {});
            modActions.modLog('Ban', actionUser.user, modUser.user, reason, message.guild, message.channel, true, length);
        })
        .catch(() => {
            message.channel.send({embeds: [new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`User with id: '${params[0]}' could not be found`)]});
        });
});
//Mute/Timeout
CommandManager.add('mute', {description: 'Mute member', category: 'Moderation', mod: true}, (/** @type {import('discord.js').Message} */ message, content) => {
    if (content == '') {
        var msgEmbed = new EmbedBuilder()
            .setColor(CommandManager.neutralColor)
            .setTitle(`Mute member`)
            .setDescription('Use the command `' + CommandManager.prefix + 'mute [userId] [length?] [reason]` to timeout a member for the specified amount of time \n If no length has been set, the timeout will default to 1 hour');
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`Showed mute command info`, message.guild.id);
        return;
    }
    let modUser = message.member;
    let params = content.split(' ');
    message.guild.members
        .fetch(params[0])
        .then((actionUser) => {
            let length = modFunctions.getLength(params[1]);
            let reason = '';
            if (length != -1) reason = content.replace(params[0] + ' ' + params[1] + ' ', '');
            else reason = content.replace(params[0] + ' ', '');
            if (length == -1) length = 3600;
            message.delete().catch(() => {});
            modActions.modLog('Mute', actionUser.user, modUser.user, reason, message.guild, message.channel, true, length);
        })
        .catch(() => {
            message.channel.send({embeds: [new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`User with id: '${params[0]}' could not be found`)]});
        });
});
//Warn
CommandManager.add('warn', {description: 'Warn member', category: 'Moderation', mod: true}, (/** @type {import('discord.js').Message} */ message, content) => {
    if (content == '') {
        var msgEmbed = new EmbedBuilder()
            .setColor(CommandManager.neutralColor)
            .setTitle(`Warn member`)
            .setDescription('Use the command `' + CommandManager.prefix + 'warn [userId] [reason]` to warn a member');
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`Showed warn command info`, message.guild.id);
        return;
    }
    let modUser = message.member;
    let params = content.split(' ');
    message.guild.members
        .fetch(params[0])
        .then((actionUser) => {
            let reason = content.replace(params[0] + ' ', '');
            message.delete().catch(() => {});
            modActions.modLog('Warn', actionUser.user, modUser.user, reason, message.guild, message.channel);
        })
        .catch(() => {
            message.channel.send({embeds: [new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`User with id: '${params[0]}' could not be found`)]});
        });
});
//Unban
CommandManager.add('unban', {description: 'Unban member', category: 'Moderation', mod: true}, (/** @type {import('discord.js').Message} */ message, content) => {
    if (content == '') {
        var msgEmbed = new EmbedBuilder()
            .setColor(CommandManager.neutralColor)
            .setTitle(`Unban member`)
            .setDescription('Use the command `' + CommandManager.prefix + 'unban [userId] [reason]` to remove a ban on a user');
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`Showed unban command info`, message.guild.id);
        return;
    }
    let modUser = message.member;
    let params = content.split(' ');
    let userId = params[0];
    let reason = content.replace(params[0] + ' ', '');
    message.delete().catch(() => {});
    message.guild.bans
        .fetch(userId)
        .then((ban) => {
            modActions.doUndoAction('Ban', ban.user.id, ban.user.tag, modUser.user, reason, message.channel, message.guild);
        })
        .catch(() => {
            message.channel.send({embeds: [new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`No ban for user with id: '${params[0]}' could be found`)]});
        });
});
//Unmute
CommandManager.add('unmute', {description: 'Unmute member', category: 'Moderation', mod: true}, (/** @type {import('discord.js').Message} */ message, content) => {
    if (content == '') {
        var msgEmbed = new EmbedBuilder()
            .setColor(CommandManager.neutralColor)
            .setTitle(`Unmute member`)
            .setDescription('Use the command `' + CommandManager.prefix + 'unmute [userId] [reason]` to remove a timeout on a user');
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`Showed unmute command info`, message.guild.id);
        return;
    }
    let modUser = message.member;
    let params = content.split(' ');
    message.guild.members
        .fetch(params[0])
        .then((actionUser) => {
            let reason = content.replace(params[0], '');
            if (!reason) reason = 'null';
            message.delete().catch(() => {});
            modActions.doUndoAction('Mute', actionUser.id, actionUser.user.tag, modUser.user, reason, message.channel, message.guild);
        })
        .catch(() => {
            message.channel.send({embeds: [new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`User with id: '${params[0]}' could not be found`)]});
        });
});
//Duration
CommandManager.add('duration', {description: 'Change duration of a mute or ban', category: 'Moderation', mod: true}, async (/** @type {import('discord.js').Message} */ message, content) => {
    if (content == '') {
        var msgEmbed = new EmbedBuilder()
            .setColor(CommandManager.neutralColor)
            .setTitle(`Change duration`)
            .setDescription('Use the command `' + CommandManager.prefix + 'duration [caseId] [new length]` to change the length of a timeout or a ban');
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`Showed duration command info`, message.guild.id);
        return;
    }
    let params = content.split(' ');
    var caseId = params[0];
    var newLength = modFunctions.getLength(params[1]);
    var activeActions = StorageManager.get('activeMod', message.guild.id);
    var action = activeActions[caseId];
    var user;
    message.delete().catch(() => {});
    if (!action) return;
    if (action['action'] == 'Mute') {
        await message.guild.members
            .fetch(action['userId'])
            .then((member) => {
                user = member;
                member.edit({communicationDisabledUntil: new Date(action['date'] + newLength * 1000)}, 'Duration change');
            })
            .catch(console.error);
        activeActions[caseId]['length'] = newLength;
    } else {
        await message.guild.members
            .fetch(action['userId'])
            .then((member) => {
                user = member;
            })
            .catch(console.error);
        activeActions[caseId]['length'] = newLength;
    }
    StorageManager.set('activeMod', activeActions, message.guild.id);
    //Mod log
    if (!StorageManager.get('modLogChannel', message.guild.id)) var channelId = message.channel.id;
    else var channelId = StorageManager.get('modLogChannel', message.guild.id);
    let channel = message.guild.channels.cache.get(channelId);
    message.channel.send({embeds: [new EmbedBuilder().setColor(CommandManager.neutralColor).setDescription(`Duration for case ${caseId}, ${action['action']} of ${action['username']}, changed to ${modFunctions.lengthToString(newLength)}`)]});
    var logEmbed = new EmbedBuilder()
        .setColor(CommandManager.successColor)
        .setTitle(`Duration for case ${caseId} changed to ${modFunctions.lengthToString(newLength)}`)
        .setFields([
            {
                name: 'User',
                value: `${user.user}`,
                inline: true,
            },
            {
                name: 'Moderator',
                value: `${message.author}`,
                inline: true,
            },
        ])
        .setTimestamp(new Date());
    //Dm user
    var dmEmbed = new EmbedBuilder()
        .setColor(CommandManager.failColor)
        .setTitle(`The duration of your ${action['action']} in ${message.guild.name} was changed to ${modFunctions.lengthToString(newLength)}`)
        .setTimestamp(new Date());
    await user.user
        .send({embeds: [dmEmbed]})
        .then(() => {
            logEmbed.addField('DM Status', 'Succesful', true);
        })
        .catch(() => {
            logEmbed.addField('DM Status', 'Failed', true);
        });
    //Rest of log
    channel.send({embeds: [logEmbed]});
    //Console log
    Console.log(`Duration for case ${caseId}, ${action['action']} of ${action['username']}, changed to ${modFunctions.lengthToString(newLength)}`);
});
//Modlog
CommandManager.add('modlogs', {description: 'Show modlogs for member', category: 'Moderation', mod: true}, (/** @type {import('discord.js').Message} */ message, content) => {
    var modlogs = StorageManager.get('modLog', message.guild.id) ? StorageManager.get('modLog', message.guild.id) : {};
    var userId = content;
    var currentLogs = modlogs[userId];
    if (currentLogs) {
        var msgEmbed = new EmbedBuilder()
            .setColor(CommandManager.successColor)
            .setAuthor({name: `Modlogs for ${currentLogs[Object.keys(currentLogs)[0]]['username']}`})
            .setFooter({text: `Total logs: ${Object.keys(currentLogs).length}`});
        for (moderation in currentLogs) {
            var current = currentLogs[moderation];
            var length = '';
            if (current['length'] != -1) {
                length = `
Length: ${modFunctions.lengthToString(current['length'])}`;
            }
            msgEmbed.addField(
                `Case ${moderation}`,
                `Type: ${current['action']}
Moderator: <@${current['moderator']}>
Reason: ${current['reason']}${length}
Date: <t:${Math.round(current['date'] / 1000)}>`
            );
        }
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`Showed modlogs for ${current['username']}`, message.guild.id);
    } else {
        var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`No modlogs found for <@${userId}>`);
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`Couldn't find modlogs for ${userId}`, message.guild.id);
    }
    message.delete().catch(() => {});
});
//Active moderations
CommandManager.add('moderations', {description: 'Show all active moderations', category: 'Moderation', mod: true}, (/** @type {import('discord.js').Message} */ message, content) => {
    var active = StorageManager.get('activeMod', message.guild.id) ? StorageManager.get('activeMod', message.guild.id) : {};
    var msgEmbed = new EmbedBuilder()
        .setColor(CommandManager.successColor)
        .setAuthor({name: `Active moderations`})
        .setFooter({text: `Amount of active moderations: ${Object.keys(active).length}`});
    for (moderation in active) {
        var current = active[moderation];
        msgEmbed.addField(`Case ${moderation} | ${current['username']}`, `${current['action']} | Ends <t:${Math.round((current['date'] + current['length'] * 1000) / 1000)}:R>`);
    }
    message.channel.send({embeds: [msgEmbed]});
    message.delete().catch(() => {});
});
//Who is command
CommandManager.add('whois', {description: 'Show user information about user', category: 'Moderation', mod: true}, (/** @type {import('discord.js').Message} */ message, content) => {
    var userId = content;
    if (content == '') userId = message.author.id;
    message.guild.members
        .fetch(userId)
        .then((member) => {
            var roles = [];
            member.roles.cache.forEach((role) => {
                if (role.name != '@everyone') roles.push(role);
            });
            var roleString = `${roles.join(' ')} `;
            if (roles.length == 0) roleString = 'None';
            var msgEmbed = new EmbedBuilder()
                .setColor(CommandManager.neutralColor)
                .setThumbnail(member.user.avatarURL())
                .setAuthor({name: `${member.user.tag}`, iconURL: member.user.avatarURL()})
                .setDescription(`${member}`)
                .setFooter({text: `User id: ${member.id}`})
                .setTimestamp()
                .addFields([
                    {name: 'Joined', value: `<t:${Math.round(member.joinedTimestamp / 1000)}> `, inline: true},
                    {name: 'Registered', value: `<t:${Math.round(member.user.createdTimestamp / 1000)}> `, inline: true},
                    {name: 'Roles', value: roleString},
                ]);
            message.channel.send({embeds: [msgEmbed]});
            Console.log(`Showed user information for ${member.user.tag}`, message.guild.id);
        })
        .catch(() => {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`Couldn't find user with id ${userId}`);
            message.channel.send({embeds: [msgEmbed]});
            Console.log(`Couldn't find user with id: "${userId}"`, message.guild.id);
        });
    message.delete().catch(() => {});
});
//Mod statistics
CommandManager.add('modstats', {description: 'Show modlogs for member', category: 'Moderation', mod: true}, (/** @type {import('discord.js').Message} */ message) => {
    var modlogs = StorageManager.get('modLog', message.guild.id) ? StorageManager.get('modLog', message.guild.id) : {};
    var userId = content;
    if (content == '') userId = message.author.id;
    var currentActions = [];
    for (log in modlogs) {
        var userlogs = modlogs[log];
        for (userlog in userlogs) {
            if (userlogs[userlog]['moderator'] == userId) currentActions.push(userlogs[userlog]);
        }
    }
    message.delete().catch(() => {});
    if (currentActions.length != 0) {
        var mutes = 0,
            warns = 0,
            kicks = 0,
            bans = 0,
            recent = 0;
        for (action in currentActions) {
            var type = currentActions[action]['action'];
            var date = currentActions[action]['date'];
            if (type == 'Mute') mutes += 1;
            else if (type == 'Warn') warns += 1;
            else if (type == 'Kick') kicks += 1;
            else if (type == 'Ban') bans += 1;
            if (date >= Date.now() - 7 * 24 * 60 * 60 * 1000) recent += 1;
        }
        var msgEmbed = new EmbedBuilder()
            .setColor(CommandManager.neutralColor)
            .setDescription(`Modstats for <@${userId}>`)
            .setFields([
                {name: 'Total mutes', value: '' + mutes, inline: true},
                {name: 'Total bans', value: '' + bans, inline: true},
                {name: 'Total kicks', value: '' + kicks, inline: true},
                {name: 'Total warns', value: '' + warns, inline: true},
                {name: 'Actions in the last week', value: '' + recent, inline: true},
            ]);
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`Showed modstats for user with id: ${userId}`, message.guild.id);
    } else {
        var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`No modlogs found for <@${userId}>`);
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`No mod actions made by user with id: ${userId}`, message.guild.id);
    }
});
