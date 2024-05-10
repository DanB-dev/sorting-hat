"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommand = void 0;
/**
 * A base class for all commands.
 * @class BaseCommand
 * @abstract
 * @param {string} name The name of the command.
 *
 * @property {string} name The name of the command.
 *
 * @example
 * ```ts
 * import { BaseCommand } from './utils/BaseCommand';
 *
 * class PingCommand extends BaseCommand {
 *  constructor() {
 *   super('ping');
 * }
 *
 *```
 * @get {string} name The name of the command.
 */
class BaseCommand {
    constructor(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
}
exports.BaseCommand = BaseCommand;
