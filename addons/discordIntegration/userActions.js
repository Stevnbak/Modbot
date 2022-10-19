const {StorageManager, Console, ExportManager, CommandManager, ChatResponder, Client, BotListeners} = Bot;
const {ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');
const modActions = require('../moderation/actions');

/* User context menus */
BotListeners.on('interactionCreate', async (interaction) => {
    if (!interaction.isUserContextMenuCommand()) return;

    if (interaction.commandName === 'Kick') {
        const targetMember = interaction.targetMember;
        // Create the modal
        const modal = new ModalBuilder().setCustomId('kickModal-' + targetMember.user.id).setTitle('Kick ' + targetMember.user.tag);
        const reasonInput = new TextInputBuilder().setCustomId('reasonInput').setLabel('Kick Reason').setStyle(TextInputStyle.Paragraph);
        const ActionRow = new ActionRowBuilder().addComponents(reasonInput);
        modal.addComponents(ActionRow);
        //show modal
        await interaction.showModal(modal);
    }

    if (interaction.commandName === 'Ban') {
        const targetMember = interaction.targetMember;
        // Create the modal
        const modal = new ModalBuilder().setCustomId('banModal-' + targetMember.user.id).setTitle('Ban ' + targetMember.user.tag);
        const reasonInput = new TextInputBuilder().setCustomId('reasonInput').setLabel('Ban Reason').setStyle(TextInputStyle.Paragraph);
        const ActionRow = new ActionRowBuilder().addComponents(reasonInput);
        modal.addComponents(ActionRow);
        //show modal
        await interaction.showModal(modal);
    }

    if (interaction.commandName === 'Warn') {
        const targetMember = interaction.targetMember;
        // Create the modal
        const modal = new ModalBuilder().setCustomId('warnModal-' + targetMember.user.id).setTitle('Warn ' + targetMember.user.tag);
        const reasonInput = new TextInputBuilder().setCustomId('reasonInput').setLabel('Warn Reason').setStyle(TextInputStyle.Paragraph).setRequired(true);
        const ActionRow = new ActionRowBuilder().addComponents(reasonInput);
        modal.addComponents(ActionRow);
        //show modal
        await interaction.showModal(modal);
    }
});

//Modal response...
BotListeners.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId.includes('kickModal')) {
        const targetMemberId = interaction.customId.replace('kickModal-', '');
        const targetMember = await interaction.guild.members.fetch(targetMemberId);
        const reason = interaction.fields.getTextInputValue('reasonInput');
        modActions.modLog('Kick', targetMember.user, interaction.user, reason, interaction.guild);
        await interaction.reply({
            content: 'Kicked ' + targetMember.user.tag,
            ephemeral: true,
        });
    }

    if (interaction.customId.includes('banModal')) {
        const targetMemberId = interaction.customId.replace('banModal-', '');
        const targetMember = await interaction.guild.members.fetch(targetMemberId);
        const reason = interaction.fields.getTextInputValue('reasonInput');
        modActions.modLog('Ban', targetMember.user, interaction.user, reason, interaction.guild);
        await interaction.reply({
            content: 'Banned ' + targetMember.user.tag,
            ephemeral: true,
        });
    }

    if (interaction.customId.includes('warnModal')) {
        const targetMemberId = interaction.customId.replace('warnModal-', '');
        const targetMember = await interaction.guild.members.fetch(targetMemberId);
        const reason = interaction.fields.getTextInputValue('reasonInput');
        modActions.modLog('Warn', targetMember.user, interaction.user, reason, interaction.guild);
        await interaction.reply({
            content: 'Warned ' + targetMember.user.tag,
            ephemeral: true,
        });
    }
});
