"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const BaseSlashSubCommand_1 = require("../../utils/BaseSlashSubCommand");
class HouseSubCommand extends BaseSlashSubCommand_1.BaseSlashSubCommand {
    constructor() {
        super('sorting-hat', [], ['join', 'leave', 'houses']);
    }
    getCommandJSON() {
        return new discord_js_1.SlashCommandBuilder()
            .setName('sorting-hat')
            .setDescription('Hatwarts, the magical school of bizadry')
            .addSubcommand((subcommand) => subcommand
            .setName('join')
            .setDescription('Join a house in Hatwarts!')
            .addStringOption((option) => option
            .setName('house')
            .setDescription('The house you want to join')
            .setRequired(true)))
            .addSubcommand((subcommand) => subcommand
            .setName('leave')
            .setDescription('Leave your house in Hatwarts!'))
            .addSubcommand((subcommand) => subcommand
            .setName('houses')
            .setDescription('View the houses in Hatwarts!'))
            .toJSON();
    }
}
exports.default = HouseSubCommand;
