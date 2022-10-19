const {StorageManager, Console, ExportManager, CommandManager, ChatResponder, Client, BotListeners} = Bot;
const {AuditLogEvent} = require('discord.js');
const modFunctions = require('./functions');
const modActions = require('./actions');
//Check if action has ran out of time
setInterval(function () {
    Client.guilds.cache.forEach((guild) => {
        var actions = StorageManager.get('activeMod', guild.id) ? StorageManager.get('activeMod', guild.id) : {};
        for (action in actions) {
            var start = actions[action]['date'];
            var length = actions[action]['length'];
            var type = actions[action]['action'];
            if (Date.now() >= start + length * 1000) {
                modActions.doUndoAction(type, actions[action]['userId'], actions[action]['username'], Client.user, 'Auto', null, guild);
                delete actions[action];
            }
        }
        StorageManager.set('activeMod', actions, guild.id);
    });
}, 60 * 1000);

//Log manual mod actions
BotListeners.on('guildMemberRemove', async function (/** @type {import('discord.js').GuildMember} */ member) {
    //Filter out normal leaves
    const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberKick,
    });
    const kickLog = fetchedLogs.entries.first();
    if (!kickLog) return;
    if (kickLog.createdAt < member.joinedAt) {
        return;
    }
    const {executor, target, reason} = kickLog;
    if (target.id != member.id) {
        Console.log(`${member.user.tag} left the guild, audit log fetch was inconclusive.`, member.guild.id);
        return;
    }
    if (executor.id == Client.user.id) return;
    //Log the kick
    modActions.modLog('Kick', member.user, executor, reason, member.guild, null, false);
});
BotListeners.on('guildBanAdd', async function (/** @type {import('discord.js').GuildBan} */ ban) {
    const fetchedLogs = await ban.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberBanAdd,
    });
    const banLog = fetchedLogs.entries.first();
    if (!banLog) return;
    const {executor, target, reason} = banLog;
    if (target.id != ban.user.id) {
        Console.log(`${ban.user.tag} was banned, audit log fetch was inconclusive.`, ban.guild.id);
        return;
    }
    if (executor.id == Client.user.id) return;
    //Log the ban
    modActions.modLog('Ban', ban.user, executor, reason, ban.guild, null, false);
});
BotListeners.on('guildBanRemove', async function (/** @type {import('discord.js').GuildBan} */ ban) {
    const fetchedLogs = await ban.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberBanRemove,
    });
    const banLog = fetchedLogs.entries.first();
    if (!banLog) return;
    const {executor, target, reason} = banLog;
    if (target.id != ban.user.id) {
        Console.log(`${ban.user.tag} was banned, audit log fetch was inconclusive.`, ban.guild.id);
        return;
    }
    if (executor.id == Client.user.id) return;
    //Log the ban
    modActions.doUndoAction('Ban', ban.user.id, ban.user.tag, executor, reason, null, ban.guild);
});
BotListeners.on('guildMemberUpdate', async function (/** @type {import('discord.js').GuildBan} */ action) {
    const fetchedLogs = await action.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberUpdate,
    });
    const actionLog = fetchedLogs.entries.first();
    if (!actionLog) return;
    const {executor, changes, reason, target} = actionLog;
    if (changes[0]['key'] != 'communication_disabled_until') return;
    if (executor.id == Client.user.id) return;
    //console.log('Old: ' + changes[0]['old']);
    //console.log('New: ' + changes[0]['new']);
    if (changes[0]['old']) {
        //Removed timeout
        modActions.doUndoAction('Mute', target.id, target.tag, executor, reason, null, action.guild);
    } else {
        //Added timeout
        var length = Math.round((Date.parse(changes[0]['new']) - Date.now()) / 1000);
        modActions.modLog('Mute', target, executor, reason, action.guild, null, false, length);
    }
});
