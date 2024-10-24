import { ClientInt } from "../../utils/ClientInt";
import BaseSubCommandExecutor from "../../utils/BaseSubcommandExecutor";
import { Group } from "../../utils/BaseSlashSubCommand";
import {
  CacheType,
  MessageContextMenuCommandInteraction,
  GuildMember,
} from "discord.js";

class CobotClose extends BaseSubCommandExecutor {
  constructor(baseCommand: string, group: Group) {
    super(baseCommand, group, "close");
  }

  async run(
    _client: ClientInt,
    interaction: MessageContextMenuCommandInteraction<CacheType>
  ) {
    const { member, targetMessage } = interaction;
    const hasRole = (member as GuildMember).roles.cache.some(
      (role) =>
        role.name.toLowerCase().includes("moderator") ||
        role.name.toLowerCase().includes("admin")
    );

    if (!hasRole) {
      await interaction.reply({
        content: "You do not have the required role to close a poll",
        ephemeral: true,
      });
      return;
    }

    if (!targetMessage) {
      await interaction.reply({
        content: "The selected message does not exist",
        ephemeral: true,
      });
      return;
    }

    // Assuming the poll is stored as part of the message content or metadata
    if (!targetMessage.poll) {
      await interaction.reply({
        content: "The selected message is not a poll",
        ephemeral: true,
      });
      return;
    }

    // Delete the poll message
    await targetMessage.delete();

    // Inform the channel that the poll has been closed
    await interaction.channel?.send({
      content: "The poll has been closed, no more votes can be cast",
    });

    await interaction.reply({
      content:
        "The poll has been closed, no more votes can be cast, no winners will be declared",
      ephemeral: true,
    });
  }
}

export default CobotClose;
