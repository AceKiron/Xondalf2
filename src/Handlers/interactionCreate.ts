import { Client, Interaction } from "discord.js";

import CommandInterface from "../Interfaces/CommandInterface";

export default async (client: Client, commandsArray: Array<CommandInterface>, interaction: Interaction): Promise<void> => {
    if (!interaction.isChatInputCommand()) return;

    let command = commandsArray.find(command => command.name === interaction.commandName);
    if (!command) return;

    command.executor(interaction, client);
}