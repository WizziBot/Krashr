module.exports = {
    name: 'coordinates',
    description: "Shows bot's coordinates",
    execute(message,bot){
        try{
            let pos = bot.entity.position;
            let coordinates = []
            Object.values(pos).forEach(coord => {coordinates.push(Math.round(coord))})
            const embed = {
                color: 0x00ff00,
                title: `[CURRENT COORDINATES]:`,
                description:`\`${coordinates}\``,
                author: {
                    name: message.author.username,
                    icon_url: message.author.avatarURL(),
                },
                timestamp: new Date(),
                footer: {
                    text: message.guild.name,
                    icon_url: message.guild.iconURL(),
                },
            };
            message.guild.channels.cache.find(ch => ch.name === 'krashr').send({embed: embed})
        } catch(e){
            console.trace(e)
            message.guild.channels.cache.find(ch => ch.name === 'krashr').send(`[UNKNOWN ERROR]`)
        }
    }
}