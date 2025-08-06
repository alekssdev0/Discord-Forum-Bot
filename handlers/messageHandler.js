const { EmbedBuilder, ChannelType } = require('discord.js');
const { forumChannelId, adminRoleId, guildId, openTagId, blacklistroleid } = require('../config.json');

module.exports = async (client, message) => {
    if (message.author.bot) return;

    if (message.channel.type === ChannelType.DM) {
        let ticketInfo = client.tickets.get(message.author.id);

        if (!ticketInfo) {
            const guild = client.guilds.cache.get(guildId);
            if (!guild) return console.error('Bot nie jest na serwerze z kanałem forum.');

            const forumChannel = guild.channels.cache.get(forumChannelId);
            if (!forumChannel || forumChannel.type !== ChannelType.GuildForum) return console.error('Nie znaleziono kanału forum.');

            const ticketName = `ticket-${message.author.username}`;

            const thread = await forumChannel.threads.create({
                name: ticketName,
                message: {
                    content: `Ticket utworzony przez ${message.author.tag}`,
                },
                autoArchiveDuration: 1440,
                appliedTags: [openTagId],
            });

            client.tickets.set(message.author.id, { threadId: thread.id, userId: message.author.id });

            const embed = new EmbedBuilder()
                .setTitle('Ticket Utworzony')
                .setDescription('Twój ticket został utworzony. Poczekaj, aż administracja się z Tobą skontaktuje.')
                .setColor('Green');

            message.author.send({ embeds: [embed] });
        }

        await message.react('📨');

        ticketInfo = client.tickets.get(message.author.id);
        const guild = client.guilds.cache.get(guildId);
        if (!guild) return console.error('Bot nie jest na serwerze z kanałem forum.');

        const thread = guild.channels.cache.get(ticketInfo.threadId);
        if (!thread) return console.error('Nie znaleziono wątku ticketa.');

        thread.send(`**${message.author.tag}:** ${message.content}`);
    } else {
        if (!message.channel.isThread()) return;

        const ticketInfo = Array.from(client.tickets.values()).find(t => t.threadId === message.channel.id);
        if (!ticketInfo) return;

        const member = await message.guild.members.fetch(message.author.id);

        if (member.roles.cache.has(adminRoleId)) {
            await message.react('📨');

            if (!message.content.startsWith('.')) {
                const user = await client.users.fetch(ticketInfo.userId);

                if (!user) return console.error('Nie znaleziono użytkownika.');

                user.send(`**${member.displayName}:** ${message.content}`);
            }
        }
    }
};

module.exports = async (client, message) => {
    if (message.author.bot) return;

    if (message.channel.type === ChannelType.DM) {
        if (client.blacklistedUsers.has(message.author.id)) {
            const embed = new EmbedBuilder()
                .setTitle('Odmowa Dostępu')
                .setDescription('Nie możesz utworzyć ticketu, ponieważ jesteś na blacklist.')
                .setColor('Red');
            return message.author.send({ embeds: [embed] });
        }

        let ticketInfo = client.tickets.get(message.author.id);

        if (!ticketInfo) {
            const guild = client.guilds.cache.get(guildId);
            if (!guild) return console.error('Bot nie jest na serwerze z kanałem forum.');

            const forumChannel = guild.channels.cache.get(forumChannelId);
            if (!forumChannel || forumChannel.type !== ChannelType.GuildForum) return console.error('Nie znaleziono kanału forum.');

            const ticketName = `ticket-${message.author.username}`;

            const thread = await forumChannel.threads.create({
                name: ticketName,
                message: {
                    content: `Ticket utworzony przez ${message.author.tag}`,
                },
                autoArchiveDuration: 1440,
                appliedTags: [openTagId],
            });

            client.tickets.set(message.author.id, { threadId: thread.id, userId: message.author.id });

            const embed = new EmbedBuilder()
                .setTitle('Ticket Utworzony')
                .setDescription('Twój ticket został utworzony. Poczekaj, aż administracja się z Tobą skontaktuje.')
                .setColor('Green');

            message.author.send({ embeds: [embed] });
        }

        ticketInfo = client.tickets.get(message.author.id);
        const guild = client.guilds.cache.get(guildId);
        if (!guild) return console.error('Bot nie jest na serwerze z kanałem forum.');

        const thread = guild.channels.cache.get(ticketInfo.threadId);
        if (!thread) return console.error('Nie znaleziono wątku ticketa.');

        thread.send(`**${message.author.tag}:** ${message.content}`);
    } else {
        if (!message.channel.isThread()) return;

        const ticketInfo = Array.from(client.tickets.values()).find(t => t.threadId === message.channel.id);
        if (!ticketInfo) return;

        const member = await message.guild.members.fetch(message.author.id);
        if (!member.roles.cache.has(adminRoleId)) return;

        if (message.content.startsWith('.')) return;

        const user = await client.users.fetch(ticketInfo.userId);

        if (!user) return console.error('Nie znaleziono użytkownika.');

        user.send(`**${member.displayName}:** ${message.content}`);
    }
};