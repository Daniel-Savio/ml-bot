// In your main file where you call changePermissions
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

    // Initial member fetch when bot starts up
    const guild = client.guilds.cache.get(guildId);
    await guild?.members.fetch();

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

// This event will trigger whenever a new member joins
client.on('guildMemberAdd', async (member: GuildMember) => {
    console.log(`Novo membro entrou: ${member.user.tag}`);

    // Call changePermissions immediately for the specific new member
    // This is more efficient than checking all members
    changePermissions(client, guildId, member.user.username);
});

client.login(process.env.DISCORD_BOT_ID);