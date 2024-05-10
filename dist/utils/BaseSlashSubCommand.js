"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSlashSubCommand = void 0;
const discord_js_1 = require("discord.js");
class BaseSlashSubCommand {
    constructor(name, groups, subcommands) {
        this._name = name;
        this._groups = groups;
        this._subcommands = subcommands;
        this._groupCommands = new discord_js_1.Collection();
    }
    get name() {
        return this._name;
    }
    get groups() {
        return this._groups;
    }
    get groupCommands() {
        return this._groupCommands;
    }
    get subcommands() {
        return this._subcommands;
    }
}
exports.BaseSlashSubCommand = BaseSlashSubCommand;
