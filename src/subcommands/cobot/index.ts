import { ContextMenuCommandBuilder, SlashCommandBuilder } from "discord.js";
import { BaseSlashSubCommand } from "../../utils/BaseSlashSubCommand";

class CobotSubCommand extends BaseSlashSubCommand {
  constructor() {
    super("cobot", [], ["create", "stats", "ranking"]);
  }

  getCommandJSON() {
    return new SlashCommandBuilder()
      .setName("cobot")
      .setDescription("Cobot, Stream Poll Bot")
      .addSubcommand((subcommand) =>
        subcommand.setName("create").setDescription("Create a new poll")
      )
      .addSubcommand((subcommand) =>
        subcommand.setName("stats").setDescription("View the stats of the bot")
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("ranking")
          .setDescription("View the ranking of polls")
      )
      .toJSON();
  }
}

export default CobotSubCommand;
