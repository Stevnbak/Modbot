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
//Mod role
function addModRole(roleId, guild) {
    var modRoles = StorageManager.get('modRoles', guild.id) ? StorageManager.get('modRoles', guild.id) : [];
    if (!modRoles.includes(roleId)) {
        modRoles.push(roleId);
        StorageManager.set('modRoles', modRoles, guild.id);
        return true;
    }
    return false;
}
function removeModRole(roleId, guild) {
    var modRoles = StorageManager.get('modRoles', guild.id);
    console.log(modRoles);
    if (modRoles.includes(roleId)) {
        modRoles.splice(modRoles.indexOf(roleId), 1);
        console.log(modRoles);
        StorageManager.set('modRoles', modRoles, guild.id);
        return true;
    }
    return false;
}

module.exports = {
    setGeneralLog,
    setModLog,
    addModRole,
    removeModRole,
};
