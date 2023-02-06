const {StorageManager, Console, ExportManager, CommandManager, ChatResponder, Client, BotListeners} = Bot;
const {EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType, ApplicationCommandType, ChannelType} = require('discord.js');
const functions = require('./setup');

CommandManager.add(
    'channel',
    {
        description: 'Set the general or moderation log channel',
        category: 'Settings',
        permissions: PermissionsBitField.Flags.Administrator,
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'set',
                description: 'Channel to change',
                type: ApplicationCommandOptionType.SubcommandGroup,
                options: [
                    {
                        name: 'general-log',
                        description: 'General log channel',
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [{name: 'channel', description: 'new channel', type: ApplicationCommandOptionType.Channel, channelTypes: [ChannelType.GuildText]}],
                    },
                    {
                        name: 'mod-log',
                        description: 'Mod log channel',
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [{name: 'channel', description: 'new channel', type: ApplicationCommandOptionType.Channel, channelTypes: [ChannelType.GuildText]}],
                    },
                ],
            },
        ],
    },
    async (/** @type {import('discord.js').ChatInputCommandInteraction} */ interaction) => {
        var subCommand = interaction.options.getSubcommand();
        if (subCommand == 'mod-log') {
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
        } else if (subCommand == 'general-log') {
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
    }
);
