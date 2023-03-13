import { ChatInputCommandInteraction, Client, EmbedBuilder, TextChannel } from "discord.js";

import Axios from "axios";

import CommandInterface from "../Interfaces/CommandInterface";

import { MediaInterface, EntryInterface } from "../Utils/axolotlapi";

let sfwEmbeds: Array<EmbedBuilder> = [];
let nsfwEmbeds: Array<EmbedBuilder> = [];

let lastUpdated: number = 0;

async function updatePartial(nsfw: boolean): Promise<void> {
    let newEmbeds: Array<EmbedBuilder> = [];
  
    let payload = "?count=50&minImages=1&flair=Just Showing Off 😍" + (nsfw ? "&nsfw=1" : "");
    
    const posts = (await Axios.get("https://axolotlapi.kirondevcoder.repl.co/reddit" + payload)).data.data;

    console.log((nsfw ? "NSFW " : "") + `posts loaded (length=${posts.length})`);

    for (let i = 0; i < posts.length; i++) {
        const post: EntryInterface = posts[i];

        const images: Array<string> = post.media.filter((m: MediaInterface) => m.kind === "image").map((m: MediaInterface) => m.url);

        for (let j = 0; j < images.length; j++) {
            newEmbeds.push(new EmbedBuilder()
                .setTitle(post.title)
                .setAuthor({ name: `u/${post.author}`, url: `https://reddit.com/u/${post.author}` })
                .setURL(post.link)
                .setTimestamp(post.created_utc * 1000)
                .setImage(images[j])
                .setColor("#ff00ff")
                .setDescription("Score: " + post.score)
            );
        }
    }

    if (nsfw) nsfwEmbeds = newEmbeds;
    else sfwEmbeds = newEmbeds;
}

function isAllowedToUpdate(): boolean {
    return Date.now() > lastUpdated + 60 * 30 * 1000; // Update once every 30 minutes at most
}

async function update(): Promise<void> {
    if (!isAllowedToUpdate()) return;
    lastUpdated = Date.now();

    await updatePartial(false);
    await updatePartial(true);

    console.log("Updated images");
}

export default async (client: Client, commandsArray: Array<CommandInterface>): Promise<void> => {
    await update();

    commandsArray.push({
        name: "image",
        description: "Sends you a cute axolotl picture from Reddit.",
        executor: async (interaction: ChatInputCommandInteraction<"cached">, client: Client): Promise<void> => {
            const channel: TextChannel = interaction.channel as TextChannel;

            let embed: EmbedBuilder;
            if (channel.nsfw) embed = nsfwEmbeds[Math.floor(Math.random() * nsfwEmbeds.length)];
            else embed = sfwEmbeds[Math.floor(Math.random() * sfwEmbeds.length)];

            if (!embed) await interaction.reply("No images available at this moment, sorry!");
            else await interaction.reply({ embeds: [ embed ]});

            update();
        }
    });
}