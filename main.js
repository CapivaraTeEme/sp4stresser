const mineflayer = require("mineflayer");
const readline = require("readline");
const chalk = require("chalk");
const RPC = require("discord-rpc");

const clientId = "1281421890831792160"; // es falso este id lmao
RPC.register(clientId);
const rpc = new RPC.Client({ transport: "ipc" });

rpc.on("ready", () => {
  rpc.setActivity({
    details: "MinecraftStresser",
    state: "Using SP4 Joiner",
    startTimestamp: new Date(),
    buttons: [{ label: "Want too?", url: "https://proyectsp4.onrender.com" }],
    instance: false
  });
});
rpc.login({ clientId }).catch(() => {});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ascii = [
  "  _  ____  _  _  ____  _                               ",
  " | ||  _ \\| || |/ ___|| |_ _ __ ___  ___ ___  ___ _ __ ",
  "/ __) |_) | || |\\___ \\| __| '__/ _ \\/ __/ __|/ _ \\ '__|",
  "\\__ \\  __/|__   _|__) | |_| | |  __/\\__ \\__ \\  __/ |   ",
  "(   /_|      |_||____/ \\__|_|  \\___||___/___/\\___|_|   ",
  " |_|                                                   "
];

function gradientPrint(textArray) {
  const colors = [chalk.yellow, chalk.blue];
  textArray.forEach((line, i) => {
    const colorFn = colors[i % colors.length];
    if (typeof colorFn === "function") {
      console.log(colorFn(line));
    } else {
      console.log(line);
    }
  });
}


function getTime() {
  return chalk.yellow(`[${new Date().toLocaleTimeString()}:sp4]`);
}

async function ask(question) {
  return new Promise((resolve) => {
    rl.question(chalk.cyan(question), (answer) => resolve(answer));
  });
}

async function main() {
  console.clear();
  gradientPrint(ascii);

  const host = await ask("server > ");
  const port = await ask("port > ");
  const botNameBase = await ask("bots names (like sp4_)> ");
  const botCount = Math.min(Number(await ask("bot count > ")), 3);
  const sayWhat = (await ask("spam message (like: hi, hello, bonjour)> "))
    .split(",")
    .map((m) => m.trim());
  const command = await ask("first command (like /register password)> ");

  const bots = [];

  for (let i = 1; i <= botCount; i++) {
    const botName = `${botNameBase}${i}`;

    function spawnBot() {
      const bot = mineflayer.createBot({
        host,
        port: parseInt(port),
        username: botName,
      });

      bot.on("spawn", () => {
        console.log(`${getTime()} ${chalk.magenta(`the bot ${botName} joined`)}`);
        setTimeout(() => {
          bot.chat(command);
          console.log(`${getTime()} ${chalk.magenta(`the bot ${botName} do the command (${command})`)}`);
        }, 500);

        sayWhat.forEach((msg, idx) => {
          setTimeout(() => {
            bot.chat(msg);
            console.log(`${getTime()} ${chalk.magenta(`the bot ${botName} sayed (${msg})`)}`);
          }, (idx + 1) * 1500);
        });
      });

      bot.on("kicked", () => {
        console.log(`${getTime()} ${chalk.magenta(`the bot ${botName} got kicked, reattempting`)}`);
        setTimeout(spawnBot, 1000);
      });

      bot.on("end", () => {
        console.log(`${getTime()} ${chalk.magenta(`the bot (${botName}) rejoining...`)}`);
        setTimeout(spawnBot, 1000);
      });

      bots.push(bot);
    }

    spawnBot();
  }

  setTimeout(async () => {
    console.log(`${getTime()} ${chalk.magenta(`the joiner ended.`)}`);
    const again = await ask("Want to do again? [Y or N] > ");
    if (again.toLowerCase() === "y") {
      await main();
    } else {
      rl.close();
      process.exit(0);
    }
  }, 10000);
}

main();
