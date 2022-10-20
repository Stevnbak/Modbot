const {StorageManager, Console, ExportManager, CommandManager, ChatResponder, Client, BotListeners} = Bot;
const {EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType, ApplicationCommandType, ChannelType} = require('discord.js');
const functions = require('./setup');

CommandManager.add(
    'modlogChannel',
    {
        description: 'Change the channel for the mod logs',
        category: 'Settings',
        options: [{name: 'channel', description: 'New general log channel', auto: true, type: ApplicationCommandOptionType.Channel}],
        permissions: PermissionsBitField.Flags.Administrator,
        type: ApplicationCommandType.ChatInput,
    },
    async (/** @type {import('discord.js').ChatInputCommandInteraction} */ interaction) => {
        const channel = interaction.options.getChannel('channel');
        if (channel == null) {
            //Remove mod log channel
            functions.setModLog(null, interaction.guild);
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.successColor).setTitle(`Mod log channel has been removed`);
            await interaction.reply({embeds: [msgEmbed], ephemeral: true});
            Console.log(`Removed mod log channel`, interaction.guild.id);
            return;
        }
        //Check if channel exists and is a text channel
        if (channel.type != ChannelType.GuildText) {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.errorColor).setDescription(`The channel must be a text channel`);
            await interaction.reply({embeds: [msgEmbed], ephemeral: true});
            return;
        }
        //Update log channel
        functions.setModLog(channel.id, interaction.guild);
        var msgEmbed = new EmbedBuilder().setColor(CommandManager.successColor).setTitle(`The mod log channel has been set to`).setDescription(`${channel}`);
        await interaction.reply({embeds: [msgEmbed], ephemeral: true});
        Console.log(`Set mod log channel to #${channel.name}`, interaction.guild.id);
    }
);

CommandManager.add(
    'logChannel',
    {
        description: 'Change the channel for the general logs',
        category: 'Settings',
        options: [{name: 'channel', description: 'New general log channel', auto: true, type: ApplicationCommandOptionType.Channel}],
        permissions: PermissionsBitField.Flags.Administrator,
        type: ApplicationCommandType.ChatInput,
    },
    async (/** @type {import('discord.js').ChatInputCommandInteraction} */ interaction) => {
        const channel = interaction.options.getChannel('channel');
        if (channel == null) {
            //Remove general log channel
            functions.setGeneralLog(null, interaction.guild);
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.successColor).setDescription(`The general log channel has been removed`);
            await interaction.reply({embeds: [msgEmbed], ephemeral: true});
            Console.log(`Removed general log channel`, interaction.guild.id);
            return;
        }
        //Check if channel exists and is a text channel
        if (channel.type != ChannelType.GuildText) {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.errorColor).setDescription(`The channel must be a text channel`);
            await interaction.reply({embeds: [msgEmbed], ephemeral: true});
            return;
        }
        //Update log channel
        functions.setGeneralLog(channel.id, interaction.guild);
        var msgEmbed = new EmbedBuilder().setColor(CommandManager.successColor).setDescription(`The general log channel has been set to ${channel}`);
        await interaction.reply({embeds: [msgEmbed], ephemeral: true});
        Console.log(`Set general log channel to #${channel.name}`, interaction.guild.id);
    }
);
/*
CommandManager.add('modRole', {description: 'Add or remove a role as moderator', category: 'Settings', admin: true}, async (/** @type {import('discord.js').interaction} / interaction, content) => {
    interaction.delete().catch(() => {});
    var params = content.split(' ');
    if (params[0] == 'add') {
        var roleId = params[1].replace('<@&', '').replace('>', '');
        var role = await interaction.guild.roles.fetch(roleId);
        if (!role) {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`Couldn't find role`);
            interaction.reply({embeds: [msgEmbed]});
            Console.log(`Couldn't find role: ${roleId}`, interaction.guild.id);
            return;
        }
        var result = functions.addModRole(roleId, interaction.guild);
        if (result) {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.successColor).setDescription(`${role} has been added as a moderator role`);
            interaction.reply({embeds: [msgEmbed]});
            Console.log(`${role.name} has been added as a moderator role`, interaction.guild.id);
        } else {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`${role} is already a moderator role`);
            interaction.reply({embeds: [msgEmbed]});
            Console.log(`${role.name} is already a moderator role`, interaction.guild.id);
        }
    } else if (params[0] == 'remove') {
        var roleId = params[1].replace('<@&', '').replace('>', '');
        var role = await interaction.guild.roles.fetch(roleId);
        if (!role) {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`Couldn't find role`);
            interaction.reply({embeds: [msgEmbed]});
            Console.log(`Couldn't find role: ${roleId}`, interaction.guild.id);
            return;
        }
        var result = functions.removeModRole(roleId, interaction.guild);
        if (result) {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.successColor).setDescription(`${role} has been removed from the moderator roles`);
            interaction.reply({embeds: [msgEmbed]});
            Console.log(`${role.name} has been removed from the moderator roles`, interaction.guild.id);
        } else {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`${role} is not a moderator role`);
            interaction.reply({embeds: [msgEmbed]});
            Console.log(`${role.name} is not a moderator role`, interaction.guild.id);
        }
    } else if (params[0] == 'clear') {
        StorageManager.unset('modRoles', interaction.guild.id);
        var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setTitle(`Moderator roles has been cleared`);
        interaction.reply({embeds: [msgEmbed]});
        Console.log(`Cleared moderator roles`, interaction.guild.id);
    } else if (params[0] == 'list') {
        var modRoles = StorageManager.get('modRoles', interaction.guild.id) ? StorageManager.get('modRoles', interaction.guild.id) : [];
        var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setTitle(`Moderator roles`);
        if (modRoles.length == 0) {
            msgEmbed.setDescription('None');
        } else {
            msgEmbed.setDescription(`<@&${modRoles.join('> <@&')}>`);
        }
        interaction.reply({embeds: [msgEmbed]});
        Console.log(`Showed list of moderator roles`, interaction.guild.id);
    }
});
*/
