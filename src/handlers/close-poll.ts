import {
  MessageContextMenuCommandInteraction,
  CacheType,
  GuildMember,
} from "discord.js";
import { ClientInt } from "../utils/ClientInt";
import ContextMenuBaseCommand from "../utils/ContextMenuBaseCommand";

class CobotClose extends ContextMenuBaseCommand {
  constructor() {
    super("close-poll");
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
        content: "You do not have the required role to close a poll.",
        ephemeral: true,
      });
      return;
    }

    if (!targetMessage) {
      await interaction.reply({
        content: "The selected message does not exist.",
        ephemeral: true,
      });
      return;
    }

    if (!targetMessage.poll) {
      // Assuming you check if this is a poll message
      await interaction.reply({
        content: "The selected message is not a poll.",
        ephemeral: true,
      });
      return;
    }

    // Delete the poll message
    await targetMessage.delete();
    if (interaction.channel?.isSendable()) {
      await interaction.channel?.send({
        content: "The poll has been closed, no more votes can be cast.",
      });

      await interaction.reply({
        content: "The poll has been closed successfully.",
        ephemeral: true,
      });
    }
  }
}

export default CobotClose;
