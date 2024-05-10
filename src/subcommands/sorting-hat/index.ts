import { SlashCommandBuilder } from 'discord.js';
import { BaseSlashSubCommand } from '../../utils/BaseSlashSubCommand';

class HouseSubCommand extends BaseSlashSubCommand {
  constructor() {
    super('sorting-hat', [], ['join', 'leave', 'houses']);
  }

  getCommandJSON() {
    return new SlashCommandBuilder()
      .setName('sorting-hat')
      .setDescription('Hatwarts, the magical school of bizadry')
      .addSubcommand((subcommand) =>
        subcommand
          .setName('join')
          .setDescription('Join a house in Hatwarts!')
          .addStringOption((option) =>
            option
              .setName('house')
              .setDescription('The house you want to join')
              .setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('leave')
          .setDescription('Leave your house in Hatwarts!')
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('houses')
          .setDescription('View the houses in Hatwarts!')
      )
      .toJSON();
  }
}

export default HouseSubCommand;
