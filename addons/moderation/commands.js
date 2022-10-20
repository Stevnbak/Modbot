const {StorageManager, Console, ExportManager, CommandManager, ChatResponder, Client, BotListeners} = Bot;
const {EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField} = require('discord.js');
const modFunctions = require('./functions');
const modActions = require('./actions');
//Kick
CommandManager.add(
    'kick',
    {
        description: 'Kick member',
        category: 'Moderation',
        options: [
            {name: 'user', description: 'User to look up', required: true, type: ApplicationCommandOptionType.User},
            {name: 'reason', description: 'Reason behind the kick', autocomplete: true, type: ApplicationCommandOptionType.String},
        ],
        permissions: PermissionsBitField.Flags.KickMembers,
        type: ApplicationCommandType.ChatInput,
    },
    (/** @type {import('discord.js').ChatInputCommandInteraction} */ interaction) => {
        let modUser = interaction.member;
        interaction.guild.members
            .fetch(interaction.options.get('user').value)
            .then((actionUser) => {
                let reason = '';
                if (interaction.options.get('reason') == null) reason = 'None';
                else reason = interaction.options.get('reason').value;
                modActions.modLog('Kick', actionUser.user, modUser.user, reason, interaction.guild, interaction);
            })
            .catch(() => {
                interaction.reply({embeds: [new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`User with id: '${interaction.options.get('user').value}' could not be found`)]});
            });
    }
);
//Ban
CommandManager.add(
    'ban',
    {
        description: 'Ban member',
        category: 'Moderation',
        options: [
            {name: 'user', description: 'User to look up', required: true, type: ApplicationCommandOptionType.User},
            {name: 'reason', description: 'Reason behind the ban', autocomplete: true, type: ApplicationCommandOptionType.String},
            {name: 'length', description: 'Length of the ban', type: ApplicationCommandOptionType.String},
        ],
        permissions: PermissionsBitField.Flags.BanMembers,
        type: ApplicationCommandType.ChatInput,
    },
    (/** @type {import('discord.js').ChatInputCommandInteraction} */ interaction) => {
        let modUser = interaction.member;
        interaction.guild.members
            .fetch(interaction.options.get('user').value)
            .then((actionUser) => {
                let reason = '';
                if (interaction.options.get('reason') == null) reason = 'None';
                else reason = interaction.options.get('reason').value;
                let length = -1;
                if (interaction.options.get('length') != null) length = modFunctions.getLength(interaction.options.get('length').value);
                modActions.modLog('Ban', actionUser.user, modUser.user, reason, interaction.guild, interaction, true, length);
            })
            .catch(() => {
                interaction.reply({embeds: [new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`User with id: '${interaction.options.get('user').value}' could not be found`)]});
            });
    }
);
//Mute/Timeout
CommandManager.add(
    'mute',
    {
        description: 'Mute member',
        category: 'Moderation',
        options: [
            {name: 'user', description: 'User to look up', required: true, type: ApplicationCommandOptionType.User},
            {name: 'length', description: 'Length of the mute', required: true, type: ApplicationCommandOptionType.String},
            {name: 'reason', description: 'Reason behind the mute', autocomplete: true, type: ApplicationCommandOptionType.String},
        ],
        permissions: PermissionsBitField.Flags.ModerateMembers,
        type: ApplicationCommandType.ChatInput,
    },
    (/** @type {import('discord.js').ChatInputCommandInteraction} */ interaction) => {
        let modUser = interaction.member;
        interaction.guild.members
            .fetch(interaction.options.get('user').value)
            .then((actionUser) => {
                let reason = '';
                if (interaction.options.get('reason') == null) reason = 'None';
                else reason = interaction.options.get('reason').value;
                let length = modFunctions.getLength(interaction.options.get('length').value);
                modActions.modLog('Mute', actionUser.user, modUser.user, reason, interaction.guild, interaction, true, length);
            })
            .catch(() => {
                interaction.reply({embeds: [new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`User with id: '${interaction.options.get('user').value}' could not be found`)], ephemeral: true});
            });
    }
);
//Warn
CommandManager.add(
    'warn',
    {
        description: 'Warn member',
        category: 'Moderation',
        options: [
            {name: 'user', description: 'User to look up', required: true, type: ApplicationCommandOptionType.User},
            {name: 'reason', description: 'Reason behind the warn', autocomplete: true, type: ApplicationCommandOptionType.String},
        ],
        permissions: PermissionsBitField.Flags.ModerateMembers,
        type: ApplicationCommandType.ChatInput,
    },
    (/** @type {import('discord.js').ChatInputCommandInteraction} */ interaction) => {
        let modUser = interaction.member;
        interaction.guild.members
            .fetch(interaction.options.get('user').value)
            .then((actionUser) => {
                let reason = '';
                if (interaction.options.get('reason') == null) reason = 'None';
                else reason = interaction.options.get('reason').value;
                modActions.modLog('Warn', actionUser.user, modUser.user, reason, interaction.guild, interaction);
            })
            .catch(() => {
                interaction.reply({embeds: [new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`User with id: '${interaction.options.get('user').value}' could not be found`)]});
            });
    }
);
//Unban
CommandManager.add(
    'unban',
    {
        description: 'Unban member',
        category: 'Moderation',
        options: [
            {name: 'user-id', description: 'User to look up', required: true, type: ApplicationCommandOptionType.String},
            {name: 'reason', description: 'Reason behind the unban', autocomplete: true, type: ApplicationCommandOptionType.String},
        ],
        permissions: PermissionsBitField.Flags.BanMembers,
        type: ApplicationCommandType.ChatInput,
    },
    (/** @type {import('discord.js').ChatInputCommandInteraction} */ interaction) => {
        let modUser = interaction.member;
        let userId = interaction.options.get('user-id').value;
        let reason = '';
        if (interaction.options.get('reason') == null) reason = 'None';
        else reason = interaction.options.get('reason').value;
        interaction.guild.bans
            .fetch(userId)
            .then((ban) => {
                modActions.doUndoAction('Ban', ban.user.id, ban.user.tag, modUser.user, reason, interaction, interaction.guild);
            })
            .catch(() => {
                interaction.reply({embeds: [new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`No ban for user with id: '${interaction.options.get('user').value}' could be found`)], ephemeral: true});
            });
    }
);
//Unmute
CommandManager.add(
    'unmute',
    {
        description: 'Unmute member',
        category: 'Moderation',
        options: [
            {name: 'user', description: 'User to look up', required: true, type: ApplicationCommandOptionType.User},
            {name: 'reason', description: 'Reason behind the unmute', autocomplete: true, type: ApplicationCommandOptionType.String},
        ],
        permissions: PermissionsBitField.Flags.ModerateMembers,
        type: ApplicationCommandType.ChatInput,
    },
    (/** @type {import('discord.js').ChatInputCommandInteraction} */ interaction) => {
        let modUser = interaction.member;
        interaction.guild.members
            .fetch(interaction.options.get('user').value)
            .then((actionUser) => {
                let reason = '';
                if (interaction.options.get('reason') == null) reason = 'None';
                else reason = interaction.options.get('reason').value;
                modActions.doUndoAction('Mute', actionUser.id, actionUser.user.tag, modUser.user, reason, interaction, interaction.guild);
            })
            .catch(() => {
                interaction.reply({embeds: [new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`User with id: '${interaction.options.get('user').value}' could not be found`)], ephemeral: true});
            });
    }
);
//Duration
CommandManager.add(
    'duration',
    {
        description: 'Change duration of a mute or ban',
        category: 'Moderation',
        options: [
            {name: 'case-id', description: 'Case Id of moderation action', required: true, type: ApplicationCommandOptionType.Number},
            {name: 'length', description: 'New length of the mute or ban', required: true, type: ApplicationCommandOptionType.String},
        ],
        permissions: PermissionsBitField.Flags.ModerateMembers,
        type: ApplicationCommandType.ChatInput,
    },
    async (/** @type {import('discord.js').ChatInputCommandInteraction} */ interaction) => {
        var caseId = interaction.options.getNumber('case-id');
        var newLength = modFunctions.getLength(interaction.options.get('length').value);
        var activeActions = StorageManager.get('activeMod', interaction.guild.id);
        var action = activeActions[caseId.toString()];
        var user;
        if (!action) return;
        if (action['action'] == 'Mute') {
            await interaction.guild.members
                .fetch(action['userId'])
                .then((member) => {
                    user = member;
                    member.edit({communicationDisabledUntil: new Date(action['date'] + newLength * 1000)}, 'Duration change');
                })
                .catch(console.error);
            activeActions[caseId]['length'] = newLength;
        } else {
            await interaction.guild.members
                .fetch(action['userId'])
                .then((member) => {
                    user = member;
                })
                .catch(console.error);
            activeActions[caseId]['length'] = newLength;
        }
        StorageManager.set('activeMod', activeActions, interaction.guild.id);
        //Mod log
        if (!StorageManager.get('modLogChannel', interaction.guild.id)) var channelId = interaction.channel.id;
        else var channelId = StorageManager.get('modLogChannel', interaction.guild.id);
        let channel = await interaction.guild.channels.fetch(channelId);
        interaction.reply({embeds: [new EmbedBuilder().setColor(CommandManager.neutralColor).setDescription(`Duration for case ${caseId}, ${action['action']} of ${action['username']}, changed to ${modFunctions.lengthToString(newLength)}`)]});
        var logEmbed = new EmbedBuilder()
            .setColor(CommandManager.successColor)
            .setTitle(`Duration for case ${caseId} changed to ${modFunctions.lengthToString(newLength)}`)
            .setFields([
                {
                    name: 'User',
                    value: `${user.user}`,
                    inline: true,
                },
                {
                    name: 'Moderator',
                    value: `${interaction.author}`,
                    inline: true,
                },
            ])
            .setTimestamp(new Date());
        //Dm user
        var dmEmbed = new EmbedBuilder()
            .setColor(CommandManager.failColor)
            .setTitle(`The duration of your ${action['action']} in ${interaction.guild.name} was changed to ${modFunctions.lengthToString(newLength)}`)
            .setTimestamp(new Date());
        await user.user
            .send({embeds: [dmEmbed]})
            .then(() => {
                logEmbed.addFields([{name: 'DM Status', value: 'Successful', inline: true}]);
            })
            .catch(() => {
                logEmbed.addFields([{name: 'DM Status', value: 'Failed', inline: true}]);
            });
        //Rest of log
        channel.send({embeds: [logEmbed]});
        //Console log
        Console.log(`Duration for case ${caseId}, ${action['action']} of ${action['username']}, changed to ${modFunctions.lengthToString(newLength)}`);
    }
);
//Modlog
CommandManager.add(
    'modlogs',
    {
        description: 'Show modlogs for member',
        category: 'Moderation',
        options: [{name: 'user', description: 'User to look up', required: true, type: ApplicationCommandOptionType.User}],
        permissions: PermissionsBitField.Flags.ModerateMembers,
        type: ApplicationCommandType.ChatInput,
    },
    async (/** @type {import('discord.js').ChatInputCommandInteraction} */ interaction) => {
        var modlogs = StorageManager.get('modLog', interaction.guild.id) ? StorageManager.get('modLog', interaction.guild.id) : {};
        var userId = interaction.options.get('user').value;
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
            interaction.reply({embeds: [msgEmbed]});
            Console.log(`Couldn't find modlogs for ${userId}`, interaction.guild.id);
        }
    }
);
//Active moderations
CommandManager.add(
    'moderations',
    {description: 'Show all active moderations', category: 'Moderation', permissions: PermissionsBitField.Flags.ModerateMembers, type: ApplicationCommandType.ChatInput},
    (/** @type {import('discord.js').ChatInputCommandInteraction} */ interaction) => {
        var active = StorageManager.get('activeMod', interaction.guild.id) ? StorageManager.get('activeMod', interaction.guild.id) : {};
        var msgEmbed = new EmbedBuilder()
            .setColor(CommandManager.successColor)
            .setAuthor({name: `Active moderations`})
            .setFooter({text: `Amount of active moderations: ${Object.keys(active).length}`});
        for (moderation in active) {
            var current = active[moderation];
            msgEmbed.addFields([{name: `Case ${moderation} | ${current['username']}`, value: `${current['action']} | Ends <t:${Math.round((current['date'] + current['length'] * 1000) / 1000)}:R>`}]);
        }
        interaction.reply({embeds: [msgEmbed]});
    }
);
//Who is command
CommandManager.add(
    'whois',
    {
        description: 'Show user information about user',
        category: 'Moderation',
        options: [{name: 'user', description: 'User to look up', required: true, type: ApplicationCommandOptionType.User}],
        permissions: PermissionsBitField.Flags.ModerateMembers,
        type: ApplicationCommandType.ChatInput,
    },
    (/** @type {import('discord.js').ChatInputCommandInteraction} */ interaction) => {
        var memberId = interaction.options.get('user').value;
        interaction.guild.members
            .fetch(memberId)
            .then((/** @type {import('discord.js').GuildMember} */ member) => {
                var roles = [];
                member.roles.cache.forEach((role) => {
                    if (role.name != '@everyone') roles.push(role);
                });
                var roleString = `${roles.join(' ')} `;
                if (roles.length == 0) roleString = 'None';
                var msgEmbed = new EmbedBuilder()
                    .setColor(CommandManager.neutralColor)
                    .setThumbnail(member.user.avatarURL())
                    .setAuthor({name: `${member.user.tag}`, iconURL: member.user.avatarURL()})
                    .setDescription(`${member}`)
                    .setFooter({text: `User id: ${member.id}`})
                    .setTimestamp()
                    .addFields([
                        {name: 'Joined', value: `<t:${Math.round(member.joinedTimestamp / 1000)}> `, inline: true},
                        {name: 'Registered', value: `<t:${Math.round(member.user.createdTimestamp / 1000)}> `, inline: true},
                        {name: 'Roles', value: roleString},
                    ]);
                interaction.reply({embeds: [msgEmbed]});
                Console.log(`Showed user information for ${member.user.tag}`, interaction.guild.id);
            })
            .catch(() => {
                var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`Couldn't find user with id ${memberId}`);
                interaction.reply({embeds: [msgEmbed]});
                Console.log(`Couldn't find user with id: "${memberId}"`, interaction.guild.id);
            });
    }
);
//Mod statistics
CommandManager.add(
    'modstats',
    {
        description: 'Show modlogs for member',
        category: 'Moderation',
        options: [{name: 'moderator', description: 'Moderator to look up stats for', type: ApplicationCommandOptionType.User}],
        permissions: PermissionsBitField.Flags.ModerateMembers,
        type: ApplicationCommandType.ChatInput,
    },
    (/** @type {import('discord.js').ChatInputCommandInteraction} */ interaction) => {
        var modlogs = StorageManager.get('modLog', interaction.guild.id) ? StorageManager.get('modLog', interaction.guild.id) : {};
        if (interaction.options.get('moderator') != null) var userId = interaction.options.get('moderator').value;
        else var userId = interaction.user.id;

        var currentActions = [];
        for (log in modlogs) {
            var userlogs = modlogs[log];
            for (userlog in userlogs) {
                if (userlogs[userlog]['moderator'] == userId) currentActions.push(userlogs[userlog]);
            }
        }
        if (currentActions.length != 0) {
            var mutes = 0,
                warns = 0,
                kicks = 0,
                bans = 0,
                recent = 0;
            for (action in currentActions) {
                var type = currentActions[action]['action'];
                var date = currentActions[action]['date'];
                if (type == 'Mute') mutes += 1;
                else if (type == 'Warn') warns += 1;
                else if (type == 'Kick') kicks += 1;
                else if (type == 'Ban') bans += 1;
                if (date >= Date.now() - 7 * 24 * 60 * 60 * 1000) recent += 1;
            }
            var msgEmbed = new EmbedBuilder()
                .setColor(CommandManager.neutralColor)
                .setDescription(`Modstats for <@${userId}>`)
                .setFields([
                    {name: 'Total mutes', value: '' + mutes, inline: true},
                    {name: 'Total bans', value: '' + bans, inline: true},
                    {name: 'Total kicks', value: '' + kicks, inline: true},
                    {name: 'Total warns', value: '' + warns, inline: true},
                    {name: 'Actions in the last week', value: '' + recent, inline: true},
                ]);
            interaction.reply({embeds: [msgEmbed], ephemeral: true});
            Console.log(`Showed modstats for user with id: ${userId}`, interaction.guild.id);
        } else {
            var msgEmbed = new EmbedBuilder().setColor(CommandManager.failColor).setDescription(`No modlogs found for <@${userId}>`);
            interaction.reply({embeds: [msgEmbed], ephemeral: true});
            Console.log(`No mod actions made by user with id: ${userId}`, interaction.guild.id);
        }
    }
);
