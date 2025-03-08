/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { SerializedCostumer } from "../types/serialized_costumer_type";
import { Client, GuildMember } from "discord.js";

async function changePermissions(client: Client, guildId: string, specificUsername?: string) {
  const guild = client.guilds.cache.get(guildId);

  // Force refresh the members cache
  await guild?.members.fetch();
  const discordMembers = guild?.members.cache;

  if (!process.env.API_URL) {
    throw new Error("API_URL is not defined in the .env");
  }

  try {
    const response = await axios.get(process.env.API_URL);
    const members = response.data;

    // Filter API members if a specific username is provided
    const membersToProcess = specificUsername
      ? members.filter((m: SerializedCostumer) => m.nickname === specificUsername)
      : members;

    // Get roles once outside the loop
    const revokedRole = guild?.roles.cache.find(role => role.name === 'revogado');
    const approvedRole = guild?.roles.cache.find(role => role.name === 'aprovado');

    if (!revokedRole) {
      throw new Error("Cargo 'revogado' não encontrado");
    }
    if (!approvedRole) {
      throw new Error("Cargo 'aprovado' não encontrado");
    }

    // Process each member from API
    for (const member of membersToProcess) {
      // Find matching Discord member
      const matchingDiscordMember = discordMembers?.find(
        (dm: GuildMember) => dm.user.username === member.nickname
      );

      if (matchingDiscordMember) {
        if (member.status === false) {
          await matchingDiscordMember.roles.remove(approvedRole);
          await matchingDiscordMember.roles.add(revokedRole);
          console.log(`Usuário: ${matchingDiscordMember.user.username} revogado`);
        } else if (member.status === true) {
          await matchingDiscordMember.roles.remove(revokedRole);
          await matchingDiscordMember.roles.add(approvedRole);
          console.log(`Usuário: ${matchingDiscordMember.user.username} aprovado`);
        }
      } else {
        console.log(`Discord member not found for nickname: ${member.nickname}`);
      }
    }
  } catch (err: any) {
    console.log("Unable to reach the API or the DataBase", err.message);
  }
}

export default changePermissions;