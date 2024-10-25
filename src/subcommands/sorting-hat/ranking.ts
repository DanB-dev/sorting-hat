import {
  CacheType,
  ChatInputCommandInteraction,
  Embed,
  EmbedBuilder,
} from "discord.js";

import { ClientInt } from "../../utils/ClientInt";
import BaseSubCommandExecutor from "../../utils/BaseSubcommandExecutor";
import { Group } from "../../utils/BaseSlashSubCommand";

class Ranking extends BaseSubCommandExecutor {
  constructor(baseCommand: string, group: Group) {
    super(baseCommand, group, "ranking");
  }

  async run(
    _client: ClientInt,
    interaction: ChatInputCommandInteraction<CacheType>
  ) {
    // Find the number of members in each house

    // Create an array of objects with the house name and the number of members
    interaction.deferReply({ ephemeral: false });
    const houseList = [
      "1216014611028115472",
      "1216014648252432434",
      "1216014899520737352",
      "1216014857149612102",
    ];

    let houseCount: { roleName: string; membersCount: number }[] = [];

    // Iterate through each role ID in houseList
    for (const house of houseList) {
      const role = await interaction.guild?.roles.fetch(house);

      if (!role) {
        console.error(`Role with ID ${house} not found`);
        continue; // Use continue instead of return to move to the next house
      }

      // Get all members with the specified role
      const membersWithRole = await interaction.guild?.members.fetch();

      const membersCount = membersWithRole?.filter((member) =>
        member.roles.cache.has(role.id)
      ).size;
      // Get the count of members
      const roleName = role.name;

      houseCount.push({ roleName, membersCount: membersCount || 0 });
      console.log(`House: ${roleName}, Members: ${membersCount}`);
    }

    // Sort the houses based on the number of members
    houseCount.sort((a, b) => b.membersCount - a.membersCount);

    console.log(houseCount);

    //Add a nice Embed to display the ranking of houses

    const embed = {
      title: "Ranking of Houses by Members Count",
      color: 0x00ff00,
      fields: houseCount.map((house, index) => ({
        name: `${index + 1}. ${house.roleName}`,
        value: `Members: ${house.membersCount}`,
      })),
      timestamp: new Date().toISOString(),
    } as Embed;

    console.log(embed);

    interaction.editReply({
      embeds: [embed],
    });
  }
}

export default Ranking;
