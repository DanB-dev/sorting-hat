"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const houseList = ['Smytherin', 'Rosslepuff', 'Trottindor', 'RavenCraig'];
const BaseSubcommandExecutor_1 = __importDefault(require("../../utils/BaseSubcommandExecutor"));
class Join extends BaseSubcommandExecutor_1.default {
    constructor(baseCommand, group) {
        super(baseCommand, group, 'join');
    }
    async run(_client, interaction) {
        const member = interaction.member;
        const house = interaction.options.getString('house', true);
        // check if there is a role with the house name
        const role = member.guild.roles.cache.find((role) => role.name.toLowerCase() === house.toLowerCase());
        if (!role) {
            await interaction.reply({
                content: `There is no house with the name ${house}`,
                ephemeral: true,
            });
            return;
        }
        // check if the house is in the list of houses
        if (!houseList.includes(house)) {
            await interaction.reply({
                content: `There is no house with the name ${house}`,
                ephemeral: true,
            });
            return;
        }
        // check if the member already has a house role
        const houseRole = member.roles.cache.find((role) => role.name === house);
        if (houseRole) {
            await interaction.reply({
                content: `You are already in a house: ${houseRole.name}`,
                ephemeral: true,
            });
            return;
        }
        // add the house role
        await member.roles.add(role);
        await interaction.reply({
            content: `You have been added to the house: ${house}`,
            ephemeral: true,
        });
    }
}
exports.default = Join;
