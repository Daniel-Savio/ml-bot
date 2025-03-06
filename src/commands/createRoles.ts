/* eslint-disable @typescript-eslint/no-explicit-any */


export async function createRoles(client?: any, guildId?: string) {
    const guild = client.guilds.cache.get(guildId);
    const rolesToCreate = ['aprovado', 'revogado'];
    for (const roleName of rolesToCreate) {
        const roleExists = guild.roles.cache.some((role: { name: string; }) => role.name === roleName);
        if (!roleExists) {
            await guild.roles.create({
                name: roleName,
                reason: `Cargo ${roleName} criado automaticamente pelo bot.`
            });
            console.log(`Cargo "${roleName}" criado.`);
        } else {
            console.log(`Cargo "${roleName}" já existe.`);
        }
    }
}