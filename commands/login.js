module.exports = {
    name: 'login',
    description: "Logs the bot onto a server",
    async execute(botId,account,client,message,commandArgs,mineflayer,getChatOn,addBot,krashr){
        try{
            const { pathfinder } = require('mineflayer-pathfinder');
            const autoeat = require("mineflayer-auto-eat");
            const commandChannel = krashr.commandChannel
            const alertsChannel = krashr.alertsChannel
            //MINECRAFT BOT
            const splitArgs = commandArgs.split(' ');
            const serverIp = splitArgs.shift();
            let accessPort = splitArgs.join(' ');
            if (!accessPort){
                accessPort = 25565
            }
            
            let bot = mineflayer.createBot({
                host: serverIp,
                port: accessPort,
                username: account.username,
                password: account.password,
                version: false,
            });
            bot.loadPlugin(pathfinder);
            bot.loadPlugin(autoeat)
            bot.once('login', () => {
                console.log(`[ID:${botId}] MINECRAFT : [LOGGED IN]`)
                const embed = {
                    color: 0x0089eb,
                    title: `[ID:${botId}] [${account.username}] [LOGGED IN] --> [${serverIp}]:[${accessPort}]`,
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
                message.guild.channels.cache.find(ch => ch.name === commandChannel).send({embed: embed})
            })
            bot.on('spawn', () => {
                try{
                    bot.autoEat.options = {
                        priority: "foodPoints",
                        startAt: 20,
                        bannedFood: [],
                    }
                    let pos = bot.entity.position;
                    let coordinates = []
                    Object.values(pos).forEach(coord => {coordinates.push(Math.round(coord))})
                    const embed = {
                        color: 0x8800f9,
                        title: `[ID:${botId}] [SPAWNED AT COORDINATES]:`,
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
                    message.guild.channels.cache.find(ch => ch.name === commandChannel).send({embed: embed})
                } catch{
                    message.guild.channels.cache.find(ch => ch.name === commandChannel).send('Error while loading spawn event')
                }

            })
            bot.on("autoeat_started", () => {
                console.log("Auto Eat started.")
            })
            bot.on("autoeat_stopped", () => {
                console.log("Auto Eat stopped.")
            })
            bot.on("health", () => {
                if (bot.food === 20) bot.autoEat.disable()
                // Disable the plugin if the bot is at 20 food points
                else bot.autoEat.enable() // Else enable the plugin again
            })
            bot.on('chat', function (username, message) {
                let chatOn = getChatOn(botId)
                if (chatOn === false) return
                client.guilds.cache.forEach(guild => {
                    guild.channels.cache.find(ch => ch.name === 'krashr-chat-logger').send(`**[ ${username} ]** : ${message}`)
                })
            })
            // Log errors and kick reasons:
            bot.on('kicked', (reason, loggedIn) => {
                const embed = {
                    color: 0xff0000,
                    title: `[ID:${botId}] [KICKED] REASON:`,
                    description: reason,
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
                message.guild.channels.cache.find(ch => ch.name === alertsChannel).send({embed: embed})
                console.log(reason, loggedIn)
            })
            bot.on('error', (err) => {
                const embed = {
                    color: 0xff0000,
                    title: `[ID:${botId}] [ERROR: COULD NOT LOG IN]`,
                    description: err,
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
                message.guild.channels.cache.find(ch => ch.name === alertsChannel).send({embed: embed})
                console.log(err)
            })
            addBot(bot)
        } catch(e){
            console.trace(e)
            message.guild.channels.cache.find(ch => ch.name === commandChannel).send(`[ERROR] Try using the correct syntax: \`-login serverIp port\``)
        }
    }
}