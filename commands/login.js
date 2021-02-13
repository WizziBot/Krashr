module.exports = {
    name: 'login',
    description: "Logs the bot onto a server",
    async execute(botId,account,client,message,commandArgs,mineflayer,getChatOn,addBot,resetVariables,krashr,proxy){
        try{
            const { pathfinder } = require('mineflayer-pathfinder');
            const autoeat = require("mineflayer-auto-eat");
            const commandChannel = krashr.commandChannel
            const alertsChannel = krashr.alertsChannel
            const socks = require('socks').SocksClient
            const ProxyAgent = require('proxy-agent')
            let phost = proxy.split(':')[0]
            let pport = parseInt(proxy.split(':')[1])
            //MINECRAFT BOT
            const splitArgs = commandArgs.split(' ');
            const serverIp = splitArgs.shift();
            let accessPort = parseInt(splitArgs.join(' '))
            
            let bot;
            let keepTrying = true;
            let i = 0;
            if (!accessPort){
                accessPort = 25565
            }
            function makebot() {
                if (bot) return
                console.log("[+] Making bot...")
                i++
                console.log("[-] Retrying with proxy attempt", i)
                bot = mineflayer.createBot(options)
                bot.once('login', () => {
                    keepTrying = false
                    addBot(bot)
                    console.log(`[ID:${botId}] MINECRAFT : [LOGGED IN]`)
                    const embed = {
                        color: 0x0089eb,
                        title: `[ID:${botId}] [${bot.username}] [LOGGED IN] --> [${serverIp}]:[${accessPort}]`,
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
                            startAt:15,
                        }
                        let pos = bot.entity.position;
                        let coordinates = []
                        Object.values(pos).forEach(coord => {coordinates.push(Math.round(coord))})
                        const embed = {
                            color: 0x8800f9,
                            title: `[ID:${botId}] [${bot.username}] [SPAWNED AT COORDINATES]:`,
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
                        message.guild.channels.cache.find(ch => ch.name === alertsChannel).send({embed: embed})
                        resetVariables()
                    } catch{
                        message.guild.channels.cache.find(ch => ch.name === commandChannel).send('Error while loading spawn event')
                    }

                })
                bot.loadPlugin(pathfinder);
                bot.loadPlugin(autoeat)
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
                    console.log(err)
                })
            }

            const options = {
                connect: async client => {
                    if (!keepTrying) return
                    try {
                        console.log('CREATING CONN')
                        socks.createConnection({
                            proxy: {
                                // Proxy
                                host: phost,
                                port: parseInt(pport),
                                type: 4
                            },
                            command: 'connect',
                            destination: {
                                host: serverIp,
                                port: parseInt(accessPort)
                            },
                        },(err,info)=>{
                            if(err){
                                console.log(err)
                                bot = null
                                return
                            }
                            client.setSocket(info.socket)
                            client.emit('connect')
                            console.log("[+] (Post Socket) Connecting")
                        });
                    } catch (err) {
                        // Handle errors
                        console.log(err)
                        bot = null
                        return
                        // client.setSocket()
                    }
                },
                agent: new ProxyAgent({ protocol: 'socks4:', host: phost, port: pport }),
                username: account.username,
                password: account.parssword,
                version: false
            }

            console.log("Trying...")

            setInterval(() => {
                makebot()
            }, 1000);
        } catch(e){
            console.trace(e)
            message.guild.channels.cache.find(ch => ch.name === commandChannel).send(`[ERROR] Try using the correct syntax: \`-login serverIp port\``)
        }
    }
}