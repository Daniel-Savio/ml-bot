import { Client, GatewayIntentBits, GuildMember } from "discord.js";
import changePermissions from "./commands/changePermissions";
import dotenv from 'dotenv';
import { createRoles } from "./commands/createRoles";

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers

    ]
});
const guildId = process.env.SERVER_ID;
if (!guildId) throw (new Error("ID do servidor não definido"));


client.on("ready", async () => {
    console.log("bot is ready");
    await createRoles(client, guildId);

    setInterval(() => {
        changePermissions(client, guildId);
    }, 40000);

});

client.on("messageCreate", async (message) => {
    if (message.content === "!ping") {
        message.reply({
            content: "pong"
        });
    }
});

client.on('guildMemberAdd', async (member: GuildMember) => {
    console.log(`Novo membro entrou: ${member.user.tag}`);
    changePermissions(client, guildId);

});

client.login(process.env.DISCORD_BOT_ID);
