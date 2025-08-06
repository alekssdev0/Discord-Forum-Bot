const { SlashCommandBuilder } = require('@discordjs/builders');
const { blacklistroleid } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unblacklist')
        .setDescription('Usuń użytkownika z blacklisty.')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('ID użytkownika do odblacklistowania')
                .setRequired(true)),

    async execute(interaction, client) {
        const member = await interaction.guild.members.fetch(interaction.user.id);
        
        if (!member.roles.cache.has(blacklistroleid)) {
            return interaction.reply({ content: 'Nie masz uprawnień do użycia tej komendy.', ephemeral: true });
        }

        const userId = interaction.options.getString('userid');
        client.blacklistedUsers.delete(userId);

        client.emit('blacklistUpdate');

        return interaction.reply({ content: `Użytkownik o ID \`${userId}\` został usunięty z blacklisty.` });
    }
};
