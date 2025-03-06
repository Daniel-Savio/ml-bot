/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { SerializedCostumer } from "../types/serialized_costumer_type";
import { GuildMember } from "discord.js";

async function changePermissions(client?: any, guildId?: string) {
  const guild = client.guilds.cache.get(guildId);
  await guild?.members.fetch(); // Isso carrega todos os membros no cache
  const discordMembers = guild?.members.cache;

  if (!process.env.API_URL) {
    throw new Error("API_URL is not defined in the .env");
  }
  try {


    const response = await axios.get(process.env.API_URL);
    const members = response.data;
    members.forEach((member: SerializedCostumer) => {

      discordMembers?.forEach((discordMember: GuildMember) => {
        //console.table(discordMember.user);
        //console.table(member);
        const revokedRole = discordMember.guild.roles.cache.find(role => role.name === 'revogado');
        const approvedRole = discordMember.guild.roles.cache.find(role => role.name === 'aprovado');

        if (!revokedRole) {
          throw new Error("Cargo não 'revogado' encontrado");
        }
        if (!approvedRole) {
          throw new Error("Cargo não 'aprovado' encontrado");
        }

        if (member.nickname === discordMember.user.username) {
          if (member.status == false) {
            discordMember.roles.remove(approvedRole);
            discordMember.roles.add(revokedRole);
            console.log(`Usuário: ${discordMember.user.username} revogado`);
          }
          if (member.status == true) {
            discordMember.roles.remove(revokedRole);
            discordMember.roles.add(approvedRole);
            console.log(`Usuário: ${discordMember.user.username} aprovado`);
          }
        }
      });
    });
  } catch (err: any) {
    console.log("Unable to reach the API or the DataBase", err.message);
  }
}

export default changePermissions;
