"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSubcommandExecutor_1 = __importDefault(require("../../utils/BaseSubcommandExecutor"));
const houseList = ['Smytherin', 'Rosslepuff', 'Trottindor', 'RavenCraig'];
class View extends BaseSubcommandExecutor_1.default {
    constructor(baseCommand, group) {
        super(baseCommand, group, 'houses');
    }
    async run(_client, interaction) {
        // reply with the list of houses
        interaction.reply({
            content: `The houses are: ${houseList.join(', ')}`,
            ephemeral: true,
        });
    }
}
exports.default = View;
