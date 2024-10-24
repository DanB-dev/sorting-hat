import { BaseInteraction, Client, InteractionType } from "discord.js";
import GuildsBaseCommand from "./GuildsBaseCommand"; // Assuming you have a base for guild checks

/**
 * Base command for context menu interactions.
 * @class
 * @extends GuildsBaseCommand
 */
class ContextMenuBaseCommand extends GuildsBaseCommand {
  public _name: string;

  constructor(name: string) {
    super(name); // Call to the parent class to handle any necessary guild checks
    this._name = name;
  }
}

export default ContextMenuBaseCommand;
