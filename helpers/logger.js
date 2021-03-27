const moment = require('moment');
const chalk = require('chalk');
const status = {
  online: `${chalk.green('"online"')}`,
  idle: `${chalk.yellow('"idle"')}`,
  dnd: `${chalk.red('"dnd"')} (Do Not Disturb)`,
  streaming: `${chalk.magentaBright('"streaming"')}`,
  invisible: '"invisible"'
};

function logger (bg, title, text, timed = true) { console.log(`${timed ? `[${chalk.cyan(moment().format('H:mm:ss'))}]` : ''}${chalk[bg].bold(` ${title} `)} ${text}`) }

module.exports = {
  log (text, title = 'Log', bg = 'bgCyan', timed = false) { logger(bg, title, text, timed) },
  warn (text) { logger('bgYellow', 'Warning', text) },
  err (err, title = 'Bot') { logger('bgRed', `${title} Error`, `\n${(err && err.stack) || err}`) },
  fs (text, title) { logger('bgGreen', title, text) },
  cmd (msg) {
    if (typeof msg === 'object') {
      const cleanMsg = msg.cleanContent.replace(/\n/g, ' ')
      logger('bgYellow', 'Msg', `|> ${chalk.magenta.bold(msg.channel.guild ? msg.channel.guild.name : 'in PMs')}: ${cleanMsg}`)
    }
  },
  ready (client) {
      console.log(chalk.cyan([
        `\n/==================== Started at ${chalk.yellow(moment(client.startTime).format('HH:mm:ss'))} ====================/`,
        `| Login successful ${chalk.yellow(client.user.username)} is ready to play music`,
        `| ${chalk.white(`Your discord status is ${status[client.config.ting.status.toLowerCase()]}. Current stats:`)}`,
        `|   - ${chalk.yellow(client.guilds.cache.size)} servers (${chalk.yellow(client.users.cache.size)} users)`,
        `| Use ${chalk.yellow('Control + C')} to exit. Or ${chalk.yellow('Cmd + C')} for Mac.`,
        `/=============================================================/`
      ].join('\n')))
    }
}