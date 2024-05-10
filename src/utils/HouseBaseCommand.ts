import { BaseInteraction, CacheType, Client } from 'discord.js';
import GuildsBaseCommand from './GuildsBaseCommand';

class HouseBaseCommand extends GuildsBaseCommand {
  async runHouseCheck(
    client: Client,
    interaction: BaseInteraction<CacheType>,
    appArgs: any
  ) {
    if (!(await this.runGuildCheck(client, interaction))) {
      return false;
    }
  }
}

export default HouseBaseCommand;
