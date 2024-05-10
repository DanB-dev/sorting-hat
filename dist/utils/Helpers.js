"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleButtonInteraction = exports.handleSubcommand = exports.isDefined = void 0;
const isDefined = (value) => {
    return typeof value !== 'undefined' && value !== null;
};
exports.isDefined = isDefined;
async function handleSubcommand(client, interaction, subcommandName) {
    var _a;
    const subcommandGroup = interaction.options.getSubcommandGroup(false);
    const subcommandInstance = client.slashSubcommands.get(interaction.commandName);
    if (subcommandGroup) {
        const subcommand = (_a = subcommandInstance === null || subcommandInstance === void 0 ? void 0 : subcommandInstance.groupCommands.get(subcommandGroup)) === null || _a === void 0 ? void 0 : _a.get(subcommandName);
        if (subcommand) {
            await subcommand.run(client, interaction);
        }
        else {
            await interaction.reply({
                content: 'This subcommand is not registered yet!',
                ephemeral: true,
            });
            console.log('No subcommand found');
        }
    }
    else {
        if (!subcommandInstance) {
            await interaction.reply({
                content: 'This command is not registered yet!',
                ephemeral: true,
            });
            console.log('No command instance found');
            return;
        }
        const subcommand = subcommandInstance.groupCommands.get(subcommandName);
        if (subcommand) {
            await subcommand.run(client, interaction);
        }
        else {
            await interaction.reply({
                content: 'This subcommand is not registered yet!',
                ephemeral: true,
            });
            console.log('No subcommand found');
        }
    }
}
exports.handleSubcommand = handleSubcommand;
function handleButtonInteraction(client, interaction) {
    client.commands.get(interaction.customId).run(client, interaction);
}
exports.handleButtonInteraction = handleButtonInteraction;
