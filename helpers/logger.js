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
        `\n/==================== Started at ${chalk.yellow(moment(client.startTime).format('H:mm:ss'))} ====================/`,
        `| Logged in as ${chalk.yellow(client.user.username)}.`,
        `| ${chalk.white(`Your discord status is ${status[client.config.ting.status.toLowerCase()]}. Current stats:`)}`,
        `|   - ${chalk.yellow(client.guild.cache.size)} servers (${chalk.yellow(Object.keys(client.channelGuildMap).length)} channels) (${chalk.yellow(client.users.size)} users)`,
        `| ${chalk.white('Logging was successful. Waiting for orders...')}`,
        `| Use ${chalk.yellow('Control + C')} to exit. Or ${chalk.yellow('Cmd + C')} for Mac.`,
        `/=============================================================/`
      ].join('\n')))
    }
}