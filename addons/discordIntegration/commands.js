const {StorageManager, Console, ExportManager, CommandManager, ChatResponder, Client, BotListeners} = Bot;
const {ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');

/* Slash command menus */
BotListeners.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
});
