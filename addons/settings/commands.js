const {StorageManager, Console, ExportManager, CommandManager, ChatResponder, Client, BotListeners} = Bot;
const {EmbedBuilder} = require('discord.js');
const functions = require('./setup');

CommandManager.add('modlogChannel', {description: 'Change the channel for the mod logs', category: 'Settings', admin: true}, async (message, content) => {
    message.delete().catch(() => {});
    if (content == '') {
        //Remove mod log channel
        functions.setModLog(null, message.guild);
        var msgEmbed = new EmbedBuilder().setColor(CommandManager.successColor).setTitle(`Mod log channel has been removed`);
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`Removed mod log channel`, message.guild.id);
        return;
    }
    var channelId = content.replace('<#', '').replace('>', '');
    var channel = await message.guild.channels.fetch(channelId).catch(() => {
        var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setTitle(`No channel found`);
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`Failed to set mod log channel`, message.guild.id);
    });
    if (!channel) return;
    functions.setModLog(channel.id, message.guild);
    var msgEmbed = new EmbedBuilder().setColor(CommandManager.successColor).setTitle(`The mod log channel has been set to`).setDescription(`${channel}`);
    message.channel.send({embeds: [msgEmbed]});
    Console.log(`Set mod log channel to #${channel.name}`, message.guild.id);
});

CommandManager.add('logChannel', {description: 'Change the channel for the general logs', category: 'Settings', admin: true}, async (message, content) => {
    message.delete().catch(() => {});
    if (content == '') {
        //Remove general log channel
        functions.setModLog(null, message.guild);
        var msgEmbed = new EmbedBuilder().setColor(CommandManager.successColor).setDescription(`Mod log channel has been removed`);
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`Removed general log channel`, message.guild.id);
        return;
    }
    var channelId = content.replace('<#', '').replace('>', '');
    var channel = await message.guild.channels.fetch(channelId).catch(() => {
        var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`No channel found`);
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`Failed to set general log channel`, message.guild.id);
    });
    if (!channel) return;
    functions.setGeneralLog(channel.id, message.guild);
    var msgEmbed = new EmbedBuilder().setColor(CommandManager.successColor).setDescription(`The general log channel has been set to ${channel}`);
    message.channel.send({embeds: [msgEmbed]});
    Console.log(`Set general log channel to #${channel.name}`, message.guild.id);
});

CommandManager.add('modRole', {description: 'Add or remove a role as moderator', category: 'Settings', admin: true}, async (/** @type {import('discord.js').Message} */ message, content) => {
    message.delete().catch(() => {});
    var params = content.split(' ');
    if (params[0] == 'add') {
        var roleId = params[1].replace('<@&', '').replace('>', '');
        var role = await message.guild.roles.fetch(roleId);
        if (!role) {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`Couldn't find role`);
            message.channel.send({embeds: [msgEmbed]});
            Console.log(`Couldn't find role: ${roleId}`, message.guild.id);
            return;
        }
        var result = functions.addModRole(roleId, message.guild);
        if (result) {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.successColor).setDescription(`${role} has been added as a moderator role`);
            message.channel.send({embeds: [msgEmbed]});
            Console.log(`${role.name} has been added as a moderator role`, message.guild.id);
        } else {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`${role} is already a moderator role`);
            message.channel.send({embeds: [msgEmbed]});
            Console.log(`${role.name} is already a moderator role`, message.guild.id);
        }
    } else if (params[0] == 'remove') {
        var roleId = params[1].replace('<@&', '').replace('>', '');
        var role = await message.guild.roles.fetch(roleId);
        if (!role) {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`Couldn't find role`);
            message.channel.send({embeds: [msgEmbed]});
            Console.log(`Couldn't find role: ${roleId}`, message.guild.id);
            return;
        }
        var result = functions.removeModRole(roleId, message.guild);
        if (result) {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.successColor).setDescription(`${role} has been removed from the moderator roles`);
            message.channel.send({embeds: [msgEmbed]});
            Console.log(`${role.name} has been removed from the moderator roles`, message.guild.id);
        } else {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`${role} is not a moderator role`);
            message.channel.send({embeds: [msgEmbed]});
            Console.log(`${role.name} is not a moderator role`, message.guild.id);
        }
    } else if (params[0] == 'clear') {
        StorageManager.unset('modRoles', message.guild.id);
        var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setTitle(`Moderator roles has been cleared`);
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`Cleared moderator roles`, message.guild.id);
    } else if (params[0] == 'list') {
        var modRoles = StorageManager.get('modRoles', message.guild.id) ? StorageManager.get('modRoles', message.guild.id) : [];
        var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setTitle(`Moderator roles`);
        if (modRoles.length == 0) {
            msgEmbed.setDescription('None');
        } else {
            msgEmbed.setDescription(`<@&${modRoles.join('> <@&')}>`);
        }
        message.channel.send({embeds: [msgEmbed]});
        Console.log(`Showed list of moderator roles`, message.guild.id);
    }
});
