import { ClientInt } from "../../utils/ClientInt";
import BaseSubCommandExecutor from "../../utils/BaseSubcommandExecutor";
import { Group } from "../../utils/BaseSlashSubCommand";
import {
  CacheType,
  ChatInputCommandInteraction,
  GuildMember,
  PollLayoutType,
} from "discord.js";

class CobotCreate extends BaseSubCommandExecutor {
  constructor(baseCommand: string, group: Group) {
    super(baseCommand, group, "create");
  }

  async run(
    _client: ClientInt,
    interaction: ChatInputCommandInteraction<CacheType>
  ) {
    const { member } = interaction;
    const hasRole = (member as GuildMember).roles.cache.some(
      (role) =>
        role.name.toLowerCase().includes("moderator") ||
        role.name.toLowerCase().includes("admin")
    );

    if (!hasRole) {
      await interaction.reply({
        content: "You do not have the required role to create a poll",
        ephemeral: true,
      });
      return;
    }

    if (interaction.channel?.isSendable()) {
      await interaction.channel
        ?.send({
          poll: {
            question: {
              text: "What time will the boiks go live?",
            },
            answers: [
              {
                text: "12:00",
              },
              {
                text: "13:00",
              },
              {
                text: "14:00",
              },
            ],
            duration: 12,
            allowMultiselect: false,
            layoutType: PollLayoutType.Default,
          },
        })
        .catch((error) => {
          console.error("Error creating poll", error);
          interaction.reply({
            content: "Error creating poll",
            ephemeral: true,
          });
        })
        .then(() => {
          return interaction.reply({
            content: "Poll created",
            ephemeral: true,
          });
        });
    }
  }
}

export default CobotCreate;
