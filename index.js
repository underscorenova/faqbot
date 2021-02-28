import config from "./config";
import Discord from "discord.js";

const { TOKEN } = config;
const PREFIX = ".";
let submissionChannel;

const client = new Discord.Client();
client.once("ready", () => {
  console.log("ready");
  client.user.setActivity(
    ".submit lw-faq Prevent error code bird by placing rifts at the start"
  );
});

client.login(TOKEN);

const submit = async (message, input) => {
  if (input.length < 2)
    return message.reply(
      "You did not supply arguments correctly.\n `.submit lw-faq Error code bird...`"
    );

  if (!submissionChannel)
    return message.reply("Submissions channel was not set");

  const faq = input.shift();
  const commandArgs = input.join(" ");
  message.reply("Adding submission.");
  const embed = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setAuthor(message.author.username, message.author.avatarURL())
    .setDescription(commandArgs)
    .setThumbnail(message.author.avatarURL())
    .addField("FAQ-channel", faq, true)
    .addField("User", `<@${message.author.id}>`, true)
    .setTimestamp();
  const channel = client.channels.cache.get(submissionChannel);
  channel.send(embed);
};

const setSubmissions = async (message, input) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    return;
  }
  let cmd = input[0];
  if (cmd.length !== 21 || !cmd.startsWith("<#") || !cmd.endsWith(">")) {
    return message.reply("Incorrect channel");
  }
  cmd = cmd.substr(2, cmd.length - 3);
  submissionChannel = cmd;
  return message.reply("Set submissions channel");
};

client.on("message", async (message) => {
  if (message.content.startsWith(PREFIX)) {
    let input = message.content.slice(PREFIX.length).trim().split(" ");
    const command = input.shift();
    if (command === "setsubmissions") {
      setSubmissions(message, input);
    } else if (message.channel.type === "dm" && command === "submit") {
      submit(message, input);
    }
  }
});
