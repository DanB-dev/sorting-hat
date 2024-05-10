"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientInt = void 0;
const discord_js_1 = require("discord.js");
class ClientInt extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.commands = new discord_js_1.Collection();
        this.slashSubcommands = new discord_js_1.Collection();
    }
}
exports.ClientInt = ClientInt;
