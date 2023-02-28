import { REST, Routes } from "discord.js";

import CommandInterface from "../Interfaces/CommandInterface";

export default (commandsArray: Array<CommandInterface>): void => {
    new REST({ version: "10" })
        .setToken(process.env.DISCORD_TOKEN as string)
        .put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string),
            {
                body: commandsArray.map(command => Object({
                    name: command.name,
                    description: command.description
                }))
            }
        )
    .then((): void => {
        console.log("Success reloading application (/) commands.");
    })
    .catch(console.error);
}