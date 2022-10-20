const {StorageManager, Console, ExportManager, CommandManager, ChatResponder, Client, BotListeners} = Bot;
const {EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType, ApplicationCommandType} = require('discord.js');
const scale = 200;
var msgPerMinute = {};
//{channelId:{active: true, max: 120, min: 15}}
BotListeners.on('messageCreate', async (message) => {
    settings = StorageManager.get('slowmode', message.guild.id) ? StorageManager.get('slowmode', message.guild.id) : {};
    if (settings[message.channel.id]) {
        if (settings[message.channel.id]['active']) {
            if (!msgPerMinute[message.channel.id]) msgPerMinute[message.channel.id] = {};
            msgPerMinute[message.channel.id]['guild'] = message.guild.id;
            msgPerMinute[message.channel.id]['min'] = settings[message.channel.id]['min'];
            msgPerMinute[message.channel.id]['max'] = settings[message.channel.id]['max'];
            if (!msgPerMinute[message.channel.id]['amount']) msgPerMinute[message.channel.id]['amount'] = 0;
            msgPerMinute[message.channel.id]['amount'] += 1;
            await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
            msgPerMinute[message.channel.id]['amount'] -= 1;
        }
    }
});

setInterval(async () => {
    for (channel in msgPerMinute) {
        var amount = msgPerMinute[channel]['amount'];
        if (!amount) {
            delete msgPerMinute[channel];
        } else {
            updateSlowmode(channel);
        }
    }
}, 5 * 1000);

async function updateSlowmode(channel) {
    var amount = msgPerMinute[channel]['amount'];
    var factor = (amount - 1) / scale;
    var min = msgPerMinute[channel]['min'];
    var max = msgPerMinute[channel]['max'];
    var seconds = min + (max - min) * factor;
    var slowmode = Math.round(seconds / 5) * 5;
    //Console.log(slowmode);
    //Change slowmode for the channel
    /** @type {import('discord.js').Guild} */ var guild = await Client.guilds.fetch(msgPerMinute[channel]['guild']).catch(() => {});
    /** @type {import('discord.js').TextChannel} */ var channel = await guild.channels.fetch(channel).catch(() => {});
    await channel.setRateLimitPerUser(slowmode, 'Auto').catch(() => {});
}

//Setting command
CommandManager.add(
    'slowmode',
    {
        description: 'Change settings related to the auto slowmode',
        category: 'Misc',
        options: [
            {
                name: 'set',
                description: 'Setting to change',
                type: ApplicationCommandOptionType.SubcommandGroup,
                options: [
                    {
                        name: 'enabled',
                        description: 'Enable or disable auto slowmode for this channel',
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [{name: 'enabled', description: 'New enabled value', required: true, type: ApplicationCommandOptionType.Boolean}],
                    },
                    {
                        name: 'minimum',
                        description: 'Minimum slowmode for this channel',
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [{name: 'value', description: 'New minimum slowmode in seconds', required: true, type: ApplicationCommandOptionType.Number}],
                    },
                    {
                        name: 'maximum',
                        description: 'Maximum slowmode for this channel',
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [{name: 'value', description: 'New maximum slowmode in seconds', required: true, type: ApplicationCommandOptionType.Number}],
                    },
                ],
            },
            {
                name: 'status',
                description: 'Get the current auto slowmode status for this channel',
                type: ApplicationCommandOptionType.Subcommand,
            },
        ],
        type: ApplicationCommandType.ChatInput,
        permissions: PermissionsBitField.Flags.ManageChannels,
    },
    async (/** @type {import('discord.js').ChatInputCommandInteraction} */ interaction) => {
        var currentSettings = StorageManager.get('slowmode', interaction.guild.id) ? StorageManager.get('slowmode', interaction.guild.id) : {};
        var subCommand = interaction.options.getSubcommand();
        if (subCommand == 'enabled') {
            var newValue = interaction.options.getBoolean('enabled');
            if (!currentSettings[interaction.channelId]) currentSettings[interaction.channelId] = {active: true, min: 15, max: 120};
            else currentSettings[interaction.channelId]['active'] = newValue;
            interaction.reply({embeds: [new EmbedBuilder().setTitle('Slowmode').setDescription(`Auto slowmode for this channel is now ${newValue ? 'enabled' : 'disabled'}`)], ephemeral: true});
        } else if (subCommand == 'minimum') {
            var newValue = interaction.options.getNumber('value');
            if (!currentSettings[interaction.channelId]) currentSettings[interaction.channelId] = {active: true, min: 15, max: 120};
            else currentSettings[interaction.channelId]['min'] = newValue;
            interaction.reply({embeds: [new EmbedBuilder().setTitle('Slowmode').setDescription(`Minimum slowmode for this channel is now ${newValue} seconds`)], ephemeral: true});
        } else if (subCommand == 'maximum') {
            var newValue = interaction.options.getNumber('value');
            if (!currentSettings[interaction.channelId]) currentSettings[interaction.channelId] = {active: true, min: 15, max: 120};
            else currentSettings[interaction.channelId]['max'] = newValue;
            interaction.reply({embeds: [new EmbedBuilder().setTitle('Slowmode').setDescription(`Maximum slowmode for this channel is now ${newValue} seconds`)], ephemeral: true});
        } else if (subCommand == 'status') {
            var currentSettings = StorageManager.get('slowmode', interaction.guild.id) ? StorageManager.get('slowmode', interaction.guild.id) : {};
            var currentChannelSettings = currentSettings[interaction.channelId] ? currentSettings[interaction.channelId] : {active: true, min: 15, max: 120};
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Slowmode')
                        .setDescription(
                            `Auto slowmode for this channel is ${currentChannelSettings['active'] ? 'enabled' : 'disabled'}\nMinimum slowmode is ${currentChannelSettings['min']} seconds\nMaximum slowmode is ${currentChannelSettings['max']} seconds`
                        ),
                ],
                ephemeral: true,
            });
            return;
        }
        //Save change
        StorageManager.set('slowmode', currentSettings, interaction.guild.id);
        //Update loaded settings
        settings = StorageManager.get('slowmode', interaction.guild.id) ? StorageManager.get('slowmode', interaction.guild.id) : {};
        if (settings[interaction.channelId]) {
            if (!msgPerMinute[interaction.channelId]) msgPerMinute[interaction.channelId] = {};
            msgPerMinute[interaction.channelId]['guild'] = interaction.guild.id;
            msgPerMinute[interaction.channelId]['min'] = settings[interaction.channelId]['min'];
            msgPerMinute[interaction.channelId]['max'] = settings[interaction.channelId]['max'];
            if (!msgPerMinute[interaction.channelId]['amount']) msgPerMinute[interaction.channelId]['amount'] = 1;
            updateSlowmode(interaction.channelId);
            if (!settings[interaction.channelId]['active']) {
                delete msgPerMinute[interaction.channelId];
            }
        }
    }
);
