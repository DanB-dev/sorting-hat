"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = require("./BaseCommand");
class GuildsBaseCommand extends BaseCommand_1.BaseCommand {
    async runGuildCheck(_client, interaction) {
        const { guildId, guild } = interaction;
        if (!guildId || !guild) {
            if (interaction.isRepliable()) {
                await interaction.reply({
                    content: 'Please use this command in a guild.',
                    ephemeral: true,
                });
            }
            return false;
        }
        return true;
    }
}
exports.default = GuildsBaseCommand;
