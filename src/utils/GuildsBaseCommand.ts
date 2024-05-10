import { BaseInteraction, CacheType, Client } from 'discord.js';
import { BaseCommand } from './BaseCommand';

class GuildsBaseCommand extends BaseCommand {
  async runGuildCheck(
    _client: Client,
    interaction: BaseInteraction<CacheType>
  ) {
    const { guildId, guild } = interaction;
    if (!guildId || !guild) {
      if (interaction.isRepliable()) {
        await interaction.reply({
          content: 'Please use this command in a guild.',
          ephemeral: true,
        });
      }
      return false;
    }
    return true;
  }
}

export default GuildsBaseCommand;
