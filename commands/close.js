const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { adminRoleId, closedTagId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Zamknij ticket w tym wątku.'),
    
    async execute(interaction, client) {
        await interaction.deferReply();

        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (!member.roles.cache.has(adminRoleId)) {
            return interaction.editReply({ content: 'Nie masz uprawnień do zamykania ticketów.' });
        }

        const channel = interaction.channel;
        if (!channel.isThread()) {
            return interaction.editReply({ content: 'Ta komenda może być użyta tylko we wątku ticketa.' });
        }

        if (channel.archived) {
            try {
                await channel.setArchived(false);
            } catch (error) {
                return interaction.editReply({ content: 'Nie udało się odarchiwizować wątku.' });
            }
        }

        const ticketInfo = Array.from(client.tickets.values()).find(t => t.threadId === channel.id);
        if (!ticketInfo) {
            return interaction.editReply({ content: 'Nie znaleziono tego ticketa w bazie danych.' });
        }

        try {
            await channel.setAppliedTags([closedTagId]);
        } catch (error) {
            return interaction.editReply({ content: 'Nie udało się ustawić tagu zamkniętego.' });
        }

        await channel.setLocked(true);

        await channel.setArchived(true);
        client.tickets.delete(ticketInfo.userId);
        
        const user = await client.users.fetch(ticketInfo.userId);
        if (user) {
            const embed = new EmbedBuilder()
                .setTitle('Ticket Zamknięty')
                .setDescription(`Twój ticket został zamknięty. Jeśli masz dodatkowe pytania, stwórz nowy ticket.`)
                .setColor('Red');
            
            await user.send({ embeds: [embed] });
        }

        return interaction.editReply({ content: `Ticket został zamknięty przez \`\`${interaction.user.tag}\`\`` });

    }
};
