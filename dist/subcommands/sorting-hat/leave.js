"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSubcommandExecutor_1 = __importDefault(require("../../utils/BaseSubcommandExecutor"));
class Leave extends BaseSubcommandExecutor_1.default {
    constructor(baseCommand, group) {
        super(baseCommand, group, 'leave');
    }
    async run(_client, interaction) {
        const member = interaction.member;
        // check if the member has a house role
        const houseRole = member.roles.cache.find((role) => ['Smytherin', 'Rosslepuff', 'Trottindor', 'RavenCraig'].includes(role.name));
        if (!houseRole) {
            await interaction.reply({
                content: 'You are not in a house.',
                ephemeral: true,
            });
            return;
        }
        // remove the house role
        await member.roles.remove(houseRole);
        await interaction.reply({
            content: `You have left the house: ${houseRole.name}`,
            ephemeral: true,
        });
    }
}
exports.default = Leave;
