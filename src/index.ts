import discord from "discord.js";
import "dotenv/config";
import fs from "fs";
import * as load from "./resources/load";

const client = new discord.Client();
const commands = new Map();

// commmand loading
const files = fs.readdirSync(__dirname + "/commands/").filter(file => file.endsWith(".ts"));
for (const file of files) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
}

client.on("message", async (message: discord.Message): Promise<void> => {
    console.log(`${message.author.username}#${message.author.discriminator}: ${message.content}`);
    if (!message.guild) return;
    if (message.author.bot) return;

    const mutedRole = message.guild!.roles.cache.filter(r => r.name == "Muted").first();

    if (mutedRole) {
        if (message.member!.roles.cache.has(mutedRole!.id)) {
            try {
                await message.delete();
            } catch (e) {
                console.log(e);
            }
        }
    }

    if (!message.content.startsWith(process.env.prefix!)) return;
    
    const commandName = message.content.split(" ")[0].slice(1);
    const args = message.content.split(" ").slice(1);
    try {
        const getCommand = (commandName: string): object | unknown | undefined => {
            let command: object | undefined | unknown;
            command = commands.get(commandName);
            if (command) return command;
        };
        const command = commands.get(commandName); // || commands.for(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        command.exec(message, args);
    } catch (err) {
        console.error(err);
    }
});

client.on("ready", () => {
    console.log(`${client.user!.username} has started`);
    console.table(commands);
    client.user!.setActivity("with Typescript", {type: "PLAYING"})
        .catch(err => console.log(err));
});

client.login(process.env.token!);
