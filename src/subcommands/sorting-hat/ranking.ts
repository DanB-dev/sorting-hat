import { CacheType, ChatInputCommandInteraction } from 'discord.js';

import { ClientInt } from '../../utils/ClientInt';
import BaseSubCommandExecutor from '../../utils/BaseSubcommandExecutor';
import { Group } from '../../utils/BaseSlashSubCommand';

class Ranking extends BaseSubCommandExecutor {
  constructor(baseCommand: string, group: Group) {
    super(baseCommand, group, 'ranking');
  }

  async run(
    _client: ClientInt,
    interaction: ChatInputCommandInteraction<CacheType>
  ) {
    // Find the number of members in each house

    // Create an array of objects with the house name and the number of members

    const houseList = [
      '1216014611028115472',
      '1216014648252432434',
      '1216014899520737352',
      '1216014857149612102',
    ];

    const houseCount: { roleName: string; membersCount: number }[] = [];

    houseList.forEach(async (house) => {
      const role = await interaction.guild?.roles.fetch(house);
      if (!role) {
        return;
      }

      const membersCount = role.members.size;
      const roleName = role.name;
      houseCount.push({ roleName, membersCount });
    });

    // Sort the houses based on the number of members

    houseCount.sort((a, b) => b.membersCount - a.membersCount);

    //Add a nice Embed to display the ranking of houses

    const embed = {
      title: 'Ranking of Houses by Members Count',
      description: houseCount
        .map((house, index) => `${index + 1}. ${house.roleName}`)
        .join('\n'),
    };

    interaction.reply({ embeds: [embed], ephemeral: false });
  }
}
