const {StorageManager, Console, ExportManager, CommandManager, ChatResponder, Client, BotListeners} = Bot;
const {EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ApplicationCommandType, PermissionsBitField} = require('discord.js');
const modActions = require('./actions');
const modFunctions = require('./functions');

/* User context menus */
CommandManager.add(
    'Kick', 
    {
        category: 'Moderation Action', 
        description: 'Kick a user from the server', 
        type: ApplicationCommandType.User, permissions: PermissionsBitField.Flags.KickMembers
    }, 
    async (interaction) => {
    const targetMember = interaction.targetMember;
    // Create the modal
    const modal = new ModalBuilder().setCustomId('kickModal-' + targetMember.user.id).setTitle('Kick ' + targetMember.user.tag);
    const reasonInput = new TextInputBuilder().setCustomId('reasonInput').setLabel('Kick Reason').setStyle(TextInputStyle.Paragraph);
    const ActionRow = new ActionRowBuilder().addComponents(reasonInput);
    modal.addComponents(ActionRow);
    //show modal
    await interaction.showModal(modal);
});
CommandManager.add(
    'Ban', {
        category: 'Moderation Action', 
        description: 'Ban a user from the server', 
        type: ApplicationCommandType.User, permissions: PermissionsBitField.Flags.BanMembers
    }, 
    async (interaction) => {
    const targetMember = interaction.targetMember;
    // Create the modal
    const modal = new ModalBuilder().setCustomId('banModal-' + targetMember.user.id).setTitle('Ban ' + targetMember.user.tag);
    const reasonInput = new TextInputBuilder().setCustomId('reasonInput').setLabel('Ban Reason').setStyle(TextInputStyle.Paragraph);
    const ActionRow = new ActionRowBuilder().addComponents(reasonInput);
    modal.addComponents(ActionRow);
    //show modal
    await interaction.showModal(modal);
});
CommandManager.add(
    'Warn', 
    {
        category: 'Moderation Action', 
        description: 'Give a formal warning to a user', 
        type: ApplicationCommandType.User, 
        permissions: PermissionsBitField.Flags.ModerateMembers
    }, 
    async (interaction) => {
    const targetMember = interaction.targetMember;
    // Create the modal
    const modal = new ModalBuilder().setCustomId('warnModal-' + targetMember.user.id).setTitle('Warn ' + targetMember.user.tag);
    const reasonInput = new TextInputBuilder().setCustomId('reasonInput').setLabel('Warn Reason').setStyle(TextInputStyle.Paragraph).setRequired(true);
    const ActionRow = new ActionRowBuilder().addComponents(reasonInput);
    modal.addComponents(ActionRow);
    //show modal
    await interaction.showModal(modal);
});
CommandManager.add(
    'User Info',
    {
        category: 'Moderation Info', 
        description: 'Get information about user', 
        type: ApplicationCommandType.User, 
        permissions: PermissionsBitField.Flags.ModerateMembers | PermissionsBitField.Flags.KickMembers | PermissionsBitField.Flags.BanMembers
    },
    async (interaction) => {
        const member = interaction.targetMember;
        var roles = [];
        member.roles.cache.forEach((role) => {
            if (role.name != '@everyone') roles.push(role);
        });
        var roleString = `${roles.join(' ')} `;
        if (roles.length == 0) roleString = 'None';
        //Infraction count:
        var modlogs = StorageManager.get('modLog', interaction.guild.id) ? StorageManager.get('modLog', interaction.guild.id) : {};
        var currentLogs = modlogs[member.id] ? modlogs[member.id] : {};
        //Embed:
        var msgEmbed = new EmbedBuilder()
            .setColor(CommandManager.neutralColor)
            .setThumbnail(member.user.avatarURL())
            .setAuthor({name: `${member.user.tag}`, iconURL: member.user.avatarURL()})
            .setDescription(`${member}`)
            .setFooter({text: `User id: ${member.id}`})
            .setTimestamp()
            .addFields([
                {name: 'Joined', value: `<t:${Math.round(member.joinedTimestamp / 1000)}> `, inline: true},
                {name: '\u200b', value: '\u200b', inline: true},
                {name: 'Registered', value: `<t:${Math.round(member.user.createdTimestamp / 1000)}> `, inline: true},
                {name: 'Roles', value: roleString, inline: true},
                {name: '\u200b', value: '\u200b', inline: true},
                {name: 'Infractions', value: Object.keys(currentLogs).length + ` `, inline: true},
            ]);
        interaction.reply({embeds: [msgEmbed], ephemeral: true});
        Console.log(`Showed user information for ${member.user.tag}`, interaction.guild.id);
    }
);
CommandManager.add(
    'Mod logs',
    {
        category: 'Moderation Info', 
        description: 'Show moderation logs for a user', 
        type: ApplicationCommandType.User, 
        permissions: PermissionsBitField.Flags.ModerateMembers | PermissionsBitField.Flags.KickMembers | PermissionsBitField.Flags.BanMembers
    },
    async (/** @type {import('discord.js').ChatInputCommandInteraction} */ interaction) => {
        var modlogs = StorageManager.get('modLog', interaction.guild.id) ? StorageManager.get('modLog', interaction.guild.id) : {};
        var userId = interaction.targetMember.id;
        var currentLogs = modlogs[userId];
        if (currentLogs) {
            var msgEmbed = new EmbedBuilder()
                .setColor(CommandManager.successColor)
                .setAuthor({name: `Modlogs for ${currentLogs[Object.keys(currentLogs)[0]]['username']}`})
                .setFooter({text: `Total logs: ${Object.keys(currentLogs).length}`});
            let start = 0;
            if (Object.keys(currentLogs).length > 25) {
                start = Object.keys(currentLogs).length - 25;
            }
            for (let moderation = start; moderation < Object.keys(currentLogs).length; moderation++) {
                var current = currentLogs[Object.keys(currentLogs)[moderation]];
                var length = '';
                if (current['length'] != -1) {
                    length = `
Length: ${modFunctions.lengthToString(current['length'])}`;
                }
                msgEmbed.addFields([
                    {
                        name: `Case ${moderation}`,
                        value:
                            `Type: ${current['action']}
Moderator: <@${current['moderator']}>
Reason: ${current['reason']}${length}
Date: <t:${Math.round(current['date'] / 1000)}>` + ' ',
                    },
                ]);
            }
            await interaction.reply({embeds: [msgEmbed], ephemeral: true});
            if (Object.keys(currentLogs).length > 25) {
                interaction.followUp({embeds: [new EmbedBuilder().setTitle('Too many moderations, skipping the first ' + (start - 1) + ' logs.').setColor(CommandManager.failColor)], ephemeral: true});
            }
            Console.log(`Showed modlogs for ${current['username']}`, interaction.guild.id);
        } else {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`No modlogs found for <@${userId}>`);
            interaction.reply({embeds: [msgEmbed], ephemeral: true});
            Console.log(`Couldn't find modlogs for ${userId}`, interaction.guild.id);
        }
    }
);

//Modal response...
BotListeners.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId.includes('kickModal')) {
        const targetMemberId = interaction.customId.replace('kickModal-', '');
        const targetMember = await interaction.guild.members.fetch(targetMemberId);
        const reason = interaction.fields.getTextInputValue('reasonInput');
        modActions.modLog('Kick', targetMember.user, interaction.user, reason, interaction.guild, interaction);
    }

    if (interaction.customId.includes('banModal')) {
        const targetMemberId = interaction.customId.replace('banModal-', '');
        const targetMember = await interaction.guild.members.fetch(targetMemberId);
        const reason = interaction.fields.getTextInputValue('reasonInput');
        modActions.modLog('Ban', targetMember.user, interaction.user, reason, interaction.guild, interaction);
    }

    if (interaction.customId.includes('warnModal')) {
        const targetMemberId = interaction.customId.replace('warnModal-', '');
        const targetMember = await interaction.guild.members.fetch(targetMemberId);
        const reason = interaction.fields.getTextInputValue('reasonInput');
        modActions.modLog('Warn', targetMember.user, interaction.user, reason, interaction.guild, interaction);
    }
});
