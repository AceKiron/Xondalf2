import { Client, Interaction, ActivityType } from "discord.js";

import CommandInterface from "../Interfaces/CommandInterface";

export default async (client: Client, commandsArray: Array<CommandInterface>, interaction: Interaction): Promise<void> => {
    client.user?.setPresence({
        activities: [{ name: `in ${client.guilds.cache.size} servers!`, type: ActivityType.Playing }],
        status: "online"
    });
}