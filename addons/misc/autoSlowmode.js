const {StorageManager, Console, ExportManager, CommandManager, ChatResponder, Client, BotListeners} = Bot;
const {MessageEmbed} = require('discord.js');
const scale = 200;
var msgPerMinute = {};
//{channelId:{active: true, max: 300, min: 15}}
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
            var factor = (amount - 1) / scale;
            var min = msgPerMinute[channel]['min'];
            var max = msgPerMinute[channel]['max'];
            var seconds = min + (max - min) * factor;
            var slowmode = Math.round(seconds / 10) * 10;
            //Console.log(slowmode);
            //Change slowmode for the channel
            /** @type {import('discord.js').Guild} */ var guild = await Client.guilds.fetch(msgPerMinute[channel]['guild']).catch(() => {});
            /** @type {import('discord.js').TextChannel} */ var channel = await guild.channels.fetch(channel).catch(() => {});
            await channel.setRateLimitPerUser(slowmode, 'Auto').catch(() => {});
        }
    }
}, 5 * 1000);

//Setting commands
CommandManager.add('slowmode', {description: 'Change settings related to the auto slowmode', category: 'Misc'}, (message, content) => {
    message.delete().catch(() => {});
    var currentSettings = StorageManager.get('slowmode', message.guild.id) ? StorageManager.get('slowmode', message.guild.id) : {};
    var params = content.split(' ');
    if (content == '') {
        if (!currentSettings[message.channel.id]) currentSettings[message.channel.id] = {active: true, min: 15, max: 120};
        else currentSettings[message.channel.id]['active'] = !currentSettings[message.channel.id]['active'];
    }
    if (params[0] == 'min') {
        if (!isNaN(parseInt(params[1]))) {
            if (!currentSettings[message.channel.id]) currentSettings[message.channel.id] = {active: true, min: 15, max: 120};
            else currentSettings[message.channel.id]['min'] = parseInt(params[1]);
        }
    } else if (params[0] == 'max') {
        if (!isNaN(parseInt(params[1]))) {
            if (!currentSettings[message.channel.id]) currentSettings[message.channel.id] = {active: true, min: 15, max: 120};
            else currentSettings[message.channel.id]['max'] = parseInt(params[1]);
        }
    }
    StorageManager.set('slowmode', currentSettings, message.guild.id);
});
