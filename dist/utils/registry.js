"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSubCommands = exports.registerCommands = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const discord_js_1 = require("discord.js");
/**
 * A function to register all the commands.
 * @category Utils
 * @public
 * @async
 * @name registerSubCommands
 * @function
 * @since 1.0.0
 * @version 1.0.0
 * @type {Function}
 * @param {ClientInt} client The client object.
 * @param {string} dir The directory where the commands are stored.
 * @returns {Promise<void>} A promise that resolves to void.
 * @example
 * ```ts
 * import { registerCommands } from './utils/registry';
 * import { ClientInt } from './utils/ClientInt';
 *
 * const client = new ClientInt();
 *
 * registerCommands(client, './commands');
 * ```
 */
const registerCommands = async (client, dir = '') => {
    const filePath = path.join(__dirname, dir);
    const files = await fs.promises.readdir(filePath);
    for (const file of files) {
        const stat = await fs.promises.lstat(path.join(filePath, file));
        if (stat.isDirectory())
            await (0, exports.registerCommands)(client, path.join(dir, file));
        if (file.endsWith('.js') || file.endsWith('.ts')) {
            const Command = await require(path.join(filePath, file)).default;
            if (Command === undefined) {
                console.log(`[REGISTRY]: '${file}' is not a command`);
                break;
            }
            const cmd = new Command();
            if (cmd.name === undefined) {
                console.log(`[REGISTRY]: '${file}' is not a command`);
                break;
            }
            console.log(`[REGISTRY]: Registering - ${cmd.name}`);
            client.commands.set(cmd.name, cmd);
            console.log(`[REGISTRY]: Registered - ${cmd.name}`);
        }
    }
};
exports.registerCommands = registerCommands;
/**
 * a function to register all subcommands
 * @category Utils
 * @public
 * @async
 * @function
 * @name registerSubCommands
 * @since 1.0.0
 * @version 1.0.0
 * @type {Function}
 * @param {ClientInt} client - The client to register the slash commands to.
 * @param {string} dir - The directory to search for slash commands.
 *
 * @returns {Promise<Collection<string, BaseSubCommandExecutor>>} A promise that resolves to a collection of all the registered slash commands.
 * @example
 * ```ts
 * import { registerSubCommands } from './utils/registerCommands';
 * import { ClientInt } from './utils/ClientInt';
 *
 * const client = new ClientInt();
 *
 * registerSubCommands(client, './subcommands');
 * ```
 */
const registerSubCommands = async (client, dir = '../subcommands') => {
    const filePath = path.join(__dirname, dir);
    const files = await fs.promises.readdir(filePath);
    for (const file of files) {
        const stat = await fs.promises.lstat(path.join(filePath, file));
        if (stat.isDirectory()) {
            const subcommandDirectoryFiles = await fs.promises.readdir(path.join(filePath, file));
            const indexFilePos = subcommandDirectoryFiles.indexOf('index.ts');
            subcommandDirectoryFiles.splice(indexFilePos, 1);
            try {
                let BaseSubcommand;
                try {
                    BaseSubcommand = await require(path.join(filePath, file, 'index.js'))
                        .default;
                }
                catch (error) {
                    BaseSubcommand = await require(path.join(filePath, file, 'index.ts'))
                        .default;
                }
                const subcommand = new BaseSubcommand();
                client.slashSubcommands.set(file, subcommand);
                for (const group of subcommand.groups) {
                    for (const command of group.subcommands) {
                        const SubCommandClass = await require(path.join(filePath, file, group.name, command)).default;
                        let subcommandGroupMap = subcommand.groupCommands.get(group.name);
                        if (subcommandGroupMap) {
                            subcommandGroupMap.set(command, new SubCommandClass(file, group.name, command));
                        }
                        else {
                            subcommandGroupMap = new discord_js_1.Collection();
                            subcommandGroupMap.set(command, new SubCommandClass(file, group.name, command));
                        }
                        console.log(`[REGISTRY]: Registering - ${file} > ${group.name} > ${command}`);
                        subcommand.groupCommands.set(group.name, subcommandGroupMap);
                        console.log(`[REGISTRY]: Registered - ${file} > ${group.name} > ${command}`);
                    }
                    const fileIndex = subcommandDirectoryFiles.indexOf(group.name);
                    subcommandDirectoryFiles.splice(fileIndex, 1);
                }
                for (const subcommandFile of subcommandDirectoryFiles) {
                    const Subcommand = await require(path.join(filePath, file, subcommandFile)).default;
                    const cmd = new Subcommand(file, null);
                    const subcommandInstance = await client.slashSubcommands.get(file);
                    console.log(`[REGISTRY]: Registering - ${file} > ${cmd.name}`);
                    subcommandInstance.groupCommands.set(cmd.name, cmd);
                    console.log(`[REGISTRY]: Registered - ${file} > ${cmd.name}`);
                }
                console.log('----------------------');
            }
            catch (error) {
                console.log(error);
            }
        }
    }
};
exports.registerSubCommands = registerSubCommands;
