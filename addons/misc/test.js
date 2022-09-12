//@ts-check
module.exports = {};
const { CommandManager, StorageManager, ExportManager, Console, ChatResponder } = Bot;
const createMessage = ExportManager.import('utils.createMessage');

CommandManager.add('commandTest', { hide: true }, (msg) => {
    msg.channel.send({ embeds: [createMessage.regularMessage('It works!')] });
    Console.log('Tested command', msg.guild.id);
});

CommandManager.add('errorTest', { hide: true }, (msg) => {
    msg.channel.send({ embeds: [createMessage.errorMessage('ERROR!')] });
    Console.log('Tested command', msg.guild.id);
});

ChatResponder.add('chatTest', { hide: true }, (msg) => {
    msg.channel.send({ embeds: [createMessage.regularMessage('It works!')] });
    Console.log('Tested chat responder', msg.guild.id);
});
