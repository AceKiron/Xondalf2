import { Client, GatewayIntentBits, ActivityType } from "discord.js";

import CommandInterface from "./Interfaces/CommandInterface";

import Fs from "fs";
import Path from "path";
import Express from "express";
import Cors from "cors";

import "dotenv/config";

const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages ] });

const commandsFiles: Array<string> = Fs.readdirSync(Path.join(__dirname, "Commands"));
const commandsCount: number = commandsFiles.length;

let commandsLoaded: number = 0;

let commandsArray: Array<CommandInterface> = [];
commandsFiles.forEach(async (filename: string): Promise<void> => {
    await (await import("./Commands/" + filename)).default(client, commandsArray);
    console.log(`CommandLoader: ${filename}`);
    commandsLoaded++;

    if (commandsLoaded === commandsCount) {
        (await import("./Utils/ReloadSlashCommands")).default(commandsArray);
      
        client.on("ready", (): void => {
            client.user?.setPresence({
                activities: [{ name: `in ${client.guilds.cache.size} servers!`, type: ActivityType.Playing }],
                status: "online"
            });
          
            Fs.readdirSync(Path.join(__dirname, "Handlers")).forEach(async (filename: string): Promise<void> => {
                const handler = (await import("./Handlers/" + filename)).default;
              
                client.on(filename.split(".")[0], async (...args): Promise<void> => {
                    handler(client, commandsArray, ...args);
                });
                
                console.log(`HandlerLoader: ${filename}`);
            });

            console.log(`Logged in as ${client.user?.tag}!`);
        });

        client.login(process.env.DISCORD_TOKEN);
    }
});

const app: Express.Application = Express();

app.use(Cors({
    origin: (origin: any, callback: any) => {
        callback(null, true);
    }
}));

app.get("/", (req: Express.Request, res: Express.Response): void => {
    res.sendStatus(200);
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`Listening on port ${process.env.PORT || 8080}.`);
});