import {
  ActionRowBuilder,
  CacheType,
  ChatInputCommandInteraction,
  GuildMember,
} from 'discord.js';

import { ClientInt } from '../../utils/ClientInt';
import BaseSubCommandExecutor from '../../utils/BaseSubcommandExecutor';
import { Group } from '../../utils/BaseSlashSubCommand';

const houseList = ['Smytherin', 'Rosslepuff', 'Trottindor', 'RavenCraig'];

class View extends BaseSubCommandExecutor {
  constructor(baseCommand: string, group: Group) {
    super(baseCommand, group, 'houses');
  }

  async run(
    _client: ClientInt,
    interaction: ChatInputCommandInteraction<CacheType>
  ) {
    // reply with the list of houses
    interaction.reply({
      content: `The houses are: ${houseList.join(', ')}`,
      ephemeral: true,
    });
  }
}

export default View;
