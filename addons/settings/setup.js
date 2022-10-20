const {StorageManager, Console, ExportManager, CommandManager, ChatResponder, Client, BotListeners} = Bot;
//Set general log channel
function setGeneralLog(channelId, guild) {
    if (channelId) {
        StorageManager.set('logChannel', channelId, guild.id);
    } else {
        StorageManager.unset('logChannel', guild.id);
    }
}
//Set mod log channel
function setModLog(channelId, guild) {
    if (channelId) {
        StorageManager.set('modLogChannel', channelId, guild.id);
    } else {
        StorageManager.unset('modLogChannel', guild.id);
    }
}

module.exports = {
    setGeneralLog,
    setModLog,
};
