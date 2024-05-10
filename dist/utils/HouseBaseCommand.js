"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GuildsBaseCommand_1 = __importDefault(require("./GuildsBaseCommand"));
class HouseBaseCommand extends GuildsBaseCommand_1.default {
    async runHouseCheck(client, interaction, appArgs) {
        if (!(await this.runGuildCheck(client, interaction))) {
            return false;
        }
    }
}
exports.default = HouseBaseCommand;
