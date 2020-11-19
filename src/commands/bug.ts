import { Message } from "discord.js";
import { commandName } from "../resources/helper";

module.exports = {
    name: commandName(__filename),
    description: "Sends the issues page of the repository",
    usage: "-bug",
    exec: (message: Message): Promise<Message> => {
        return message.channel.send("Have a bug? Visit the issues page of the repo here\nhttps://github.com/narutopig/chatlab-bot/issues");
    }
};