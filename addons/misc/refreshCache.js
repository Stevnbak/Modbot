const {StorageManager, Console, ExportManager, CommandManager, ChatResponder, Client, BotListeners} = Bot;
refresh();
setInterval(function () {
    refresh();
}, 5 * 60 * 1000);
function refresh() {
    Client.guilds.cache.forEach((guild) => {
        guild.members.fetch();
    });
}
