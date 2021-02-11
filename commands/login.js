module.exports = {
    name: 'login',
    description: "Logs the bot onto a server",
    async execute(botId,account,client,message,commandArgs,mineflayer,getChatOn,addBot,krashr,proxies){
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
            let curProxy = proxies.shift()
            let phost = curProxy.split(":")[0]
            let pport = curProxy.split(":")[1]
            const prtocol = 4

            let bot;
            let i = 0
            let keepTrying = true

            function makebot() {
                if (bot) return
                curProxy = proxies.shift()
                phost = curProxy.split(":")[0]
                pport = curProxy.split(":")[1]
                console.log("[+] Making bot...")
                i++
                console.log(`[-] Retrying with proxy (${curProxy}) attempt, ${i}`)
                bot = mineflayer.createBot(options)
               
                const welcome = () => {
                    keepTrying = false
                    clearInterval(interval)
                    console.log("[+] Success!")
                }
                bot.once('spawn', welcome)

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
                        addBot(bot)
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

                // Log errors and kick reasons:
                bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
                bot.on('error', err => console.log(err))
            
            }
            const options = {
                connect: async client => {
            
                    if (!keepTrying) return
                    try {
                        const info = await socks.createConnection({
                            proxy: {
                                // Proxy
                                host: phost,
                                port: parseInt(pport),
                                type: prtocol
                            },
                            command: 'connect',
                            destination: {
                                host: serverIp,
                                port: accessPort
                            },
                        });
            
                        client.setSocket(info.socket)
                        client.emit('connect')
                        console.log("[+] (Post Socket) Connecting")
                    } catch (err) {
                        bot = null
                        return
                    }
                },
                username: account.username,
                password: account.password,
                version: false,
                
            }
            
            console.log("Trying...")
            
            let interval = setInterval(() => {
                makebot()
            }, 200);
        } catch(e){
            console.trace(e)
            message.guild.channels.cache.find(ch => ch.name === commandChannel).send(`[ERROR] Try using the correct syntax: \`-login serverIp port\``)
        }
    }
}