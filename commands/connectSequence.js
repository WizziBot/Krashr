module.exports = {
    name: 'connectSequence',
    description: "Executes hard coded connect sequence for a specific server",
    execute(message,commandArgs,bot){
        try{
            const server = commandArgs;
            if (server === 'minesuperior'){
                console.log('CONNECTING')
                message.guild.channels.cache.find(ch => ch.name === 'krashr').send('CONNECTING')
                bot.setQuickBarSlot(1)
                setTimeout(()=>{
                    bot.activateItem()
                    setTimeout(()=>{
                        bot.clickWindow(11,1,0)
                        setTimeout(()=>{
                            bot.clickWindow(13,1,0)
                            console.log('CONNECTED')
                            message.guild.channels.cache.find(ch => ch.name === 'krashr').send('CONNECTED')
                        },2000)
                    },2000)
                },2000)
            } else if (server === 'mccentral'){
                console.log('CONNECTING')
                message.guild.channels.cache.find(ch => ch.name === 'krashr').send('CONNECTING')
                bot.setQuickBarSlot(1)
                setTimeout(()=>{
                    bot.activateItem()
                    setTimeout(()=>{
                        bot.clickWindow(7,1,0)
                        console.log('CONNECTED')
                        message.guild.channels.cache.find(ch => ch.name === 'krashr').send('CONNECTED')
                    },2000)
                },2000)
            }
        } catch(e){
            console.trace(e)
            message.guild.channels.cache.find(ch => ch.name === 'krashr').send(`[UNKNOWN ERROR]`)
        }
    }
}