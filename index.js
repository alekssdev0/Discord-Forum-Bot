const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel, Partials.Message]
});

client.commands = new Collection();
client.tickets = new Map();
client.blacklistedUsers = new Set();

const blacklistFilePath = path.join(__dirname, 'blacklist.json');

function loadBlacklist() {
    if (fs.existsSync(blacklistFilePath)) {
        const data = fs.readFileSync(blacklistFilePath, 'utf8');
        const parsed = JSON.parse(data);
        parsed.forEach(id => client.blacklistedUsers.add(id));
        console.log('Blacklista załadowana:', client.blacklistedUsers);
    }
}

function saveBlacklist() {
    const data = JSON.stringify([...client.blacklistedUsers]);
    fs.writeFileSync(blacklistFilePath, data, 'utf8');
    console.log('Blacklista zapisana do pliku.');
}

loadBlacklist();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log(`Zalogowano jako ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Wystąpił błąd podczas wykonywania tej komendy!', ephemeral: true });
    }
});

const messageHandler = require('./handlers/messageHandler');
client.on('messageCreate', message => {
    messageHandler(client, message);
});

client.on('beforeExit', saveBlacklist);
client.on('blacklistUpdate', saveBlacklist);

client.login(token);
