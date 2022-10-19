const {StorageManager, Console, ExportManager, CommandManager, ChatResponder, Client, BotListeners} = Bot;
const {EmbedBuilder, AuditLogEvent} = require('discord.js');
//Log message edit
BotListeners.on('messageUpdate', async (/** @type {import('discord.js').Message} */ oldMessage) => {
    var newMessage = await oldMessage.channel.messages.fetch(oldMessage.id);
    var msgEmbed = new EmbedBuilder()
        .setAuthor({name: `${oldMessage.author.tag}`, iconURL: oldMessage.author.avatarURL()})
        .setDescription(
            `Message by ${oldMessage.member} edited in ${oldMessage.channel}
[Message link](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id})`
        )
        .setFooter({text: `User id: ${oldMessage.author.id}`})
        .setTimestamp()
        .addFields([
            {name: 'Old content', value: oldMessage.content},
            {name: 'New content', value: newMessage.content},
        ]);
    var channel = await getChannel(oldMessage.guild);
    if (channel) channel.send({embeds: [msgEmbed]}).catch(Console.error);
});
//Log message delete
BotListeners.on('messageDelete', async (message) => {
    //Deleted by someone else?
    const fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MessageDelete,
    });
    const alog = fetchedLogs.entries.first();
    var deleter;
    if (alog) {
        var {executor, target, createdTimestamp} = alog;
        if (message.author.id == target.id && Math.round(createdTimestamp / (60 * 1000)) == Math.round(Date.now() / (60 * 1000))) deleter = executor;
    }
    //Send log message
    var msgEmbed = new EmbedBuilder()
        .setAuthor({name: `${message.author.tag}`, iconURL: message.author.avatarURL()})
        .setDescription(
            `Message by ${message.member} deleted from ${message.channel}
[Message link](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`
        )
        .setFooter({text: `User id: ${message.author.id}`})
        .setTimestamp()
        .addFields([{name: 'Content', value: message.content}]);
    if (deleter) msgEmbed.addFields([{name: 'Deleted by', value: `${deleter}`}]);
    var channel = await getChannel(message.guild);
    if (channel) channel.send({embeds: [msgEmbed]}).catch(Console.error);
});
//Log member join
BotListeners.on('guildMemberAdd', async (member) => {
    //Send log message
    var msgEmbed = new EmbedBuilder()
        .setAuthor({name: `Member joined`, iconURL: member.user.avatarURL()})
        .setThumbnail(member.user.avatarURL())
        .setDescription(`${member} | ${member.user.tag}`)
        .setFooter({text: `User id: ${member.id}`})
        .setTimestamp();
    var channel = await getChannel(member.guild);
    if (channel) channel.send({embeds: [msgEmbed]}).catch(Console.error);
});
//Log member leave
BotListeners.on('guildMemberRemove', async (member) => {
    //Send log message
    var msgEmbed = new EmbedBuilder()
        .setAuthor({name: `Member left`, iconURL: member.user.avatarURL()})
        .setThumbnail(member.user.avatarURL())
        .setDescription(`${member} | ${member.user.tag}`)
        .setFooter({text: `User id: ${member.id}`})
        .setTimestamp();
    var channel = await getChannel(member.guild);
    if (channel) channel.send({embeds: [msgEmbed]}).catch(Console.error);
});
//Log name change
BotListeners.on('guildMemberUpdate', async (member) => {
    const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberUpdate,
    });
    const actionLog = fetchedLogs.entries.first();
    if (!actionLog) return;
    const {executor, changes, reason, target} = actionLog;
    if (changes[0]['key'] != 'nick') return;
    if (target.id != member.id) return;
    //Send log message
    var msgEmbed = new EmbedBuilder()
        .setAuthor({name: `${member.user.tag} | Nickname changed`, iconURL: member.user.avatarURL()})
        .setThumbnail(member.user.avatarURL())
        .setFields([
            {name: 'Old nickname', value: ' ' + changes[0]['old'], inline: true},
            {name: 'New nickname', value: ' ' + changes[0]['new'], inline: true},
            {name: 'Changed by', value: `${executor} `, inline: true},
        ])
        .setFooter({text: `User id: ${member.id}`})
        .setTimestamp();
    var channel = await getChannel(member.guild);
    if (channel) channel.send({embeds: [msgEmbed]}).catch(Console.error);
});

async function getChannel(guild) {
    var channelId = StorageManager.get('logChannel', guild.id);
    if (!channelId) return;
    let channel = await guild.channels.fetch(channelId);
    return channel;
}
