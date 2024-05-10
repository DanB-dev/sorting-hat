import {
  ButtonInteraction,
  CacheType,
  ChatInputCommandInteraction,
  GuildMember,
} from 'discord.js';

import { ClientInt } from './ClientInt';

export const isDefined = <T>(value: T | null | undefined): value is T => {
  return typeof value !== 'undefined' && value !== null;
};

export async function handleSubcommand(
  client: ClientInt,
  interaction: ChatInputCommandInteraction<CacheType>,
  subcommandName: string | null
) {
  const subcommandGroup = interaction.options.getSubcommandGroup(false);
  const subcommandInstance = client.slashSubcommands.get(
    interaction.commandName
  );

  if (subcommandGroup) {
    const subcommand = subcommandInstance?.groupCommands
      .get(subcommandGroup)
      ?.get(subcommandName);
    if (subcommand) {
      await subcommand.run(client, interaction);
    } else {
      await interaction.reply({
        content: 'This subcommand is not registered yet!',
        ephemeral: true,
      });
      console.log('No subcommand found');
    }
  } else {
    if (!subcommandInstance) {
      await interaction.reply({
        content: 'This command is not registered yet!',
        ephemeral: true,
      });
      console.log('No command instance found');
      return;
    }

    const subcommand = subcommandInstance.groupCommands.get(subcommandName);
    if (subcommand) {
      await subcommand.run(client, interaction);
    } else {
      await interaction.reply({
        content: 'This subcommand is not registered yet!',
        ephemeral: true,
      });
      console.log('No subcommand found');
    }
  }
}

export function handleButtonInteraction(
  client: ClientInt,
  interaction: ButtonInteraction<CacheType>
) {
  client.commands.get(interaction.customId).run(client, interaction);
}
