import * as path from "path";
import * as fs from "fs";
import { ClientInt } from "./ClientInt";
import { Collection } from "discord.js";

/**
 * A function to register all the commands.
 * @category Utils
 * @public
 * @async
 * @name registerSubCommands
 * @function
 * @since 1.0.0
 * @version 1.0.0
 * @type {Function}
 * @param {ClientInt} client The client object.
 * @param {string} dir The directory where the commands are stored.
 * @returns {Promise<void>} A promise that resolves to void.
 * @example
 * ```ts
 * import { registerCommands } from './utils/registry';
 * import { ClientInt } from './utils/ClientInt';
 *
 * const client = new ClientInt();
 *
 * registerCommands(client, './commands');
 * ```
 */
export const registerCommands: Function = async (
  client: ClientInt,
  dir = ""
): Promise<void> => {
  const filePath = path.join(__dirname, dir);
  const files = await fs.promises.readdir(filePath);

  console.log(`[REGISTRY]: Scanning directory: ${filePath}`);
  for (const file of files) {
    const stat = await fs.promises.lstat(path.join(filePath, file));
    if (stat.isDirectory())
      await registerCommands(client, path.join(dir, file));
    if (file.endsWith(".js") || file.endsWith(".ts")) {
      const Command = await require(path.join(filePath, file)).default;
      if (Command === undefined) {
        console.log(`[REGISTRY]: '${file}' is not a command`);
        break;
      }
      const cmd = new Command();
      if (cmd.name === undefined) {
        console.log(`[REGISTRY]: '${file}' is not a command`);
        break;
      }
      console.log(`[REGISTRY]: Registering - ${cmd.name}`);
      client.commands.set(cmd.name, cmd);
      console.log(`[REGISTRY]: Registered - ${cmd.name}`);
    }
  }
  console.log("[REGISTRY]: Command registration complete.");
  console.log("----------------------");
};

/**
 * a function to register all subcommands
 * @category Utils
 * @public
 * @async
 * @function
 * @name registerSubCommands
 * @since 1.0.0
 * @version 1.0.0
 * @type {Function}
 * @param {ClientInt} client - The client to register the slash commands to.
 * @param {string} dir - The directory to search for slash commands.
 *
 * @returns {Promise<Collection<string, BaseSubCommandExecutor>>} A promise that resolves to a collection of all the registered slash commands.
 * @example
 * ```ts
 * import { registerSubCommands } from './utils/registerCommands';
 * import { ClientInt } from './utils/ClientInt';
 *
 * const client = new ClientInt();
 *
 * registerSubCommands(client, './subcommands');
 * ```
 */
export const registerSubCommands: Function = async (
  client: ClientInt,
  dir = "../subcommands"
): Promise<void> => {
  const filePath = path.join(__dirname, dir);
  console.log(`[REGISTRY]: Scanning directory: ${filePath}`);

  let files: string[];
  try {
    files = await fs.promises.readdir(filePath);
  } catch (error) {
    console.error(`[REGISTRY]: Failed to read directory: ${filePath}`, error);
    return;
  }

  for (const file of files) {
    const currentPath = path.join(filePath, file);
    let stat;

    try {
      stat = await fs.promises.lstat(currentPath);
    } catch (error) {
      console.error(
        `[REGISTRY]: Failed to get stats for file: ${currentPath}`,
        error
      );
      continue;
    }

    if (stat.isDirectory()) {
      console.log(
        `[REGISTRY]: Processing subcommand directory: ${currentPath}`
      );

      let subcommandDirectoryFiles: string[];
      try {
        subcommandDirectoryFiles = await fs.promises.readdir(currentPath);
      } catch (error) {
        console.error(
          `[REGISTRY]: Failed to read subcommand directory: ${currentPath}`,
          error
        );
        continue;
      }

      const indexFilePos = subcommandDirectoryFiles.indexOf("index.ts");
      if (indexFilePos === -1) {
        const indexFilePosJs = subcommandDirectoryFiles.indexOf("index.js");
        if (indexFilePosJs === -1) {
          console.warn(
            `[REGISTRY]: No index file found in directory: ${currentPath} :(`
          );
          continue;
        }
      }
      try {
        let BaseSubcommand;
        try {
          BaseSubcommand = await require(path.join(currentPath, "index.js"))
            .default;
        } catch (errorJs) {
          try {
            BaseSubcommand = await require(path.join(currentPath, "index.ts"))
              .default;
          } catch (errorTs) {
            console.error(
              `[REGISTRY]: Failed to load base subcommand from ${currentPath}`,
              { errorJs, errorTs }
            );
            continue;
          }
        }

        const subcommand = new BaseSubcommand();
        client.slashSubcommands.set(file, subcommand);
        console.log(`[REGISTRY]: Registered base subcommand: ${file}`);

        // Register subcommands within groups
        for (const group of subcommand.groups) {
          // For each subcommand group, register the commands within it
          for (const command of group.subcommands) {
            let SubCommandClass;
            const commandPath = path.join(filePath, file, group.name, command);

            try {
              // Attempt to require the command file
              SubCommandClass = await require(commandPath).default;
            } catch (error: unknown) {
              // Specify the type of error as unknown
              // Check if the error has the expected properties
              if (isErrorWithCode(error)) {
                if (error.code === "MODULE_NOT_FOUND") {
                  console.warn(
                    `[REGISTRY]: Failed to load subcommand: ${group.name} > ${command} - Probably does not exist.`
                  );
                  continue; // Skip to the next command
                }
              }
              console.error(
                `[REGISTRY]: Error loading subcommand: ${group.name} > ${command}`,
                error
              );
              continue; // Skip to the next command
            }

            // Only proceed to register if the command class is found
            if (SubCommandClass) {
              const fullCommandName = `${group.name} ${command}`;
              console.log(
                `[REGISTRY]: Registering full subcommand - ${file} > ${fullCommandName}`
              );

              subcommand.groupCommands.set(
                fullCommandName,
                new SubCommandClass(file, group.name, command)
              );
              console.log(
                `[REGISTRY]: Registered - ${file} > ${fullCommandName}`
              );
            }
          }
        }

        // Register remaining subcommands that are not part of groups
        for (const subcommandFile of subcommandDirectoryFiles) {
          let Subcommand;
          try {
            Subcommand = await require(path.join(currentPath, subcommandFile))
              .default;
          } catch (error) {
            console.error(
              `[REGISTRY]: Failed to load subcommand: ${subcommandFile} - Probably does not exist.`
            );
            continue;
          }

          const cmd = new Subcommand(file, null);
          const subcommandInstance = client.slashSubcommands.get(file);
          if (subcommandInstance) {
            console.log(
              `[REGISTRY]: Registering loose subcommand - ${file} > ${cmd.name}`
            );
            subcommandInstance.groupCommands.set(cmd.name, cmd);
            console.log(
              `[REGISTRY]: Registered loose subcommand - ${file} > ${cmd.name}`
            );
          }
        }
        console.log("----------------------");
      } catch (error) {
        console.error(
          `[REGISTRY]: Error while registering subcommands for ${file}`,
          error
        );
      }
    } else {
      console.warn(`[REGISTRY]: Skipping non-directory file: ${file}`);
    }
  }
  console.log("[REGISTRY]: Subcommand registration complete.");
};

// Type guard to check if error has a code property
function isErrorWithCode(
  error: unknown
): error is { code?: string; message?: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}
