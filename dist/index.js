"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv/config");
require("reflect-metadata");
const ClientInt_1 = require("./utils/ClientInt");
const registry_1 = require("./utils/registry");
const Helpers_1 = require("./utils/Helpers");
// Get environment variables
const { CLIENT_ID, GUILD_ID, BOT_TOKEN } = process.env;
// Create a new Discord client instance
const client = new ClientInt_1.ClientInt({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMembers,
    ],
    partials: [discord_js_1.Partials.GuildMember],
});
// Create a new REST API instance and set the token
const rest = new discord_js_1.REST({ version: '10' }).setToken(BOT_TOKEN); // **** Means this won't complain about possible undefined.
// Log when the client is ready
client.once('ready', () => { var _a; return console.log(`${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag} logged in`); });
// Handle incoming interactions
client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const cmd = await client.commands.get(interaction.commandName);
        const subcommandName = interaction.options.getSubcommand(false);
        if (subcommandName) {
            (0, Helpers_1.handleSubcommand)(client, interaction, subcommandName);
        }
        else if (cmd) {
            cmd.run(client, interaction);
        }
        else {
            await interaction.reply({
                content: 'This command is not registered yet!',
                ephemeral: true,
            });
            console.log('No command found');
        }
    }
    else if (interaction.isButton()) {
        (0, Helpers_1.handleButtonInteraction)(client, interaction);
    }
});
// Main function
const main = async () => {
    try {
        // Check if environment variables are set
        if (!CLIENT_ID || !GUILD_ID || !BOT_TOKEN)
            throw new Error('Incomplete .env config!');
        // Register commands and subcommands
        // await registerCommands(client, '../handlers');
        await (0, registry_1.registerSubCommands)(client);
        // Get command and subcommand JSON
        const commandsJSON = client.commands
            .filter((cmd) => typeof cmd.getCommandJSON === 'function')
            .map((cmd) => cmd.getCommandJSON());
        const subCommandsJSON = client.slashSubcommands.map((cmd) => cmd.getCommandJSON());
        // Register commands and subcommands with Discord API
        await rest.put(discord_js_1.Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: [...commandsJSON, ...subCommandsJSON],
        });
        // Log in to Discord
        await client.login(BOT_TOKEN);
    }
    catch (error) {
        console.error(error);
    }
};
// Call main function
main().catch(console.error);
