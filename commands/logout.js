module.exports = {
    name: 'logout',
    description: "Loggs out the user",
    execute(message,bot){
        try{
            bot.quit()
            bot = null;
            const embed = {
                color: 0xff0000,
                title: `[LOGGED OUT]:`,
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
            console.log('MINECRAFT : [LOGGED OUT]')
        } catch(e){
            console.trace(e)
            message.guild.channels.cache.find(ch => ch.name === 'krashr').send(`[UNKNOWN ERROR]`)
        }
    }
}