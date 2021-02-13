const mineflayer = require('mineflayer')
const socks = require('socks').SocksClient

let bot;
let i = 0
let keepTrying = true

const server = "mccentral.org:25566"
const proxy = "213.147.107.58:57818"


const shost = server.split(":")[0]
const sport = server.split(":")[1]
const phost = proxy.split(":")[0]
const pport = proxy.split(":")[1]
const prtocol = 4

function makebot() {
    if (bot) return
    console.log("[+] Making bot...")
    i++
    console.log("[-] Retrying with proxy attempt", i)
    bot = mineflayer.createBot(options)
    const welcome = () => {
        keepTrying = false
        console.log("[+] Success!")
        bot.chat('hi! ' + "It took, " + i + " attempts to connect!")
    }

    bot.once('spawn', welcome)

    // Log errors and kick reasons:
    bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
    bot.on('error', err => console.log(err))


    bot.once('spawn', function () {
        console.log('SPAWNED')
    })
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
                    host: shost,
                    port: parseInt(sport)
                },
            });

            client.setSocket(info.socket)
            client.emit('connect')
            console.log("[+] (Post Socket) Connecting")
        } catch (err) {
            // Handle errors
            console.log(err)
            bot = null
            return
            // client.setSocket()
        }
    },
    username:"funglonghin2004@gmail.com",
    password:"Longhin127!",
    version: false
}



console.log("Trying...")

setInterval(() => {
    makebot()
}, 2000);