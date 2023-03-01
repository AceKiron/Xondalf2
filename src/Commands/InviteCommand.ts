import { ChatInputCommandInteraction, Client, TextChannel } from "discord.js";

import CommandInterface from "../Interfaces/CommandInterface";

export default async (client: Client, commandsArray: Array<CommandInterface>): Promise<void> => {
    commandsArray.push({
        name: "invite",
        description: "Replies with an invite of this bot.",
        executor: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {
            const channel: TextChannel = interaction.channel as TextChannel;

            await interaction.reply({
                ephemeral: true,
                content: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=0&scope=bot`
            });
        }
    });
}