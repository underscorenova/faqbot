import config from './config';
import Discord from 'discord.js';

const { TOKEN } = config;
const PREFIX = '.';
const submissionChannel = '815627264460849152';
const colors = [
    'red',
    'green',
    'blue',
    'orange',
    'black',
    'white',
    'cyan',
    'lime',
    'pink',
    'yellow',
    'lightred',
    'gold',
    'salmon',
    'darkblue'
];

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const client = new Discord.Client();
client.once('ready', () => {
    console.log('ready');
    client.user.setActivity('.submit lw-faq Prevent error code bird by placing rifts at the start');
});

client.login(TOKEN);

const submit = async (message, input) => {
    if (input.length < 2)
        return message.reply(
            'You did not supply arguments correctly.\n `.submit lw-faq Error code bird...`'
        );

    if (!submissionChannel) return message.reply('Submissions channel was not set');

    const faq = input.shift();
    const commandArgs = input.join(' ');
    message.reply('Adding submission.');
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(commandArgs)
        .setThumbnail(message.author.avatarURL())
        .addField('FAQ-channel', faq, true)
        .addField('User', `<@${message.author.id}>`, true)
        .setTimestamp();
    const channel = client.channels.cache.get(submissionChannel);
    channel.send(embed);
};

const setSubmissions = async (message, input) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        return;
    }
    let cmd = input[0];
    if (cmd.length !== 21 || !cmd.startsWith('<#') || !cmd.endsWith('>')) {
        return message.reply('Incorrect channel');
    }
    cmd = cmd.substr(2, cmd.length - 3);
    submissionChannel = cmd;
    return message.reply('Set submissions channel');
};

const color = async (message, input) => {
    if (!message.guild) return;
    if (!input) {
        return message.reply(
            `You did not input a color, use these colors: \n\`\`\`${colors.join(
                ', '
            )}\`\`\`\n Use .color <color_name> to set your color`
        );
    }
    input = input[0];
    if (colors.includes(input)) {
        const memberRoles = message.member.roles.cache;
        const roles = message.guild.roles.cache;
        const oldRole = memberRoles.filter((mr) => colors.includes(mr.name));
        if (oldRole.size > 0) {
            message.member.roles.remove(oldRole);
        }
        await sleep(250);
        const newRole = roles.find((r) => r.name === input);
        message.member.roles.add(newRole);
        message.reply(`Added color ${input}`);
    } else {
        return message.reply(
            `You did not input a valid color, use these colors: \n\`\`\`${colors.join(
                ', '
            )}\`\`\`\n Use .color <color_name> to set your color`
        );
    }
};

const printColors = async (message, input) => {
    if (!message.guild) return;
    message.channel.send(
        `Role colors available:\n\`\`\`${colors.join(
            ', '
        )}\`\`\`\n Use .color <color_name> to set your color`
    );
};

const uncolor = async (message, input) => {
    if (!message.guild) return;
    const memberRoles = message.member.roles.cache;
    const oldRole = memberRoles.filter((mr) => colors.includes(mr.name));
    if (oldRole.size > 0) {
        message.member.roles.remove(oldRole);
    }
	message.reply('Removed the color');
};

client.on('message', async (message) => {
    if (message.content.startsWith(PREFIX)) {
        let input = message.content.slice(PREFIX.length).trim().split(' ');
        const command = input.shift();
        if (command === 'setsubmissions') {
            setSubmissions(message, input);
        } else if (message.channel.type === 'dm' && command === 'submit') {
            submit(message, input);
        } else if (command === 'colors') {
            printColors(message, input);
        } else if (command === 'color') {
            color(message, input);
        } else if (command === 'uncolor') {
            uncolor(message, input);
        }
    }
});

const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('ok');
});
server.listen(3000);
