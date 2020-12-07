const Discord = require('discord.js');
const config = require('./config.json');
const YAML = require('yaml');
const Database = require("@replit/database");

//
const database = new Database();

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready.');
});

// login to Discord with your app's token
client.login(config.loginToken);

client.on('message', message => {
	try {
		switch (message.type) {
			case 'GUILD_MEMBER_JOIN':
				handleMeJoinGuild(message);
				break;

		}
		const args = message.content.split(/\n(.+)/);
		const command = args[0].split(/ /);
		if (command[0] === config.prefix && command[1] != null) {
			console.log("Author:" + message.author.id);
			console.log("Guild:" + message.guild.id);
			const parameters = (args[1] != null) ? YAML.parse(args[1]) : {};
			console.log(parameters);
			switch (command[1]) {
				case 'help':
					sendFeaturesList(message);
					break;
				case 'ping':
					message.channel.send('pong');
					break;
				case 'new':
					schedule(message.channel, parameters.event);
					break;
				case 'sdelete':
					message.channel.send('The event ' + parameters.eventName + 'has been deleted');
					break;
			}
		} else {
			//console.log(message)
		}
	} catch (error) {
		console.log(error);
	}
});

async function handleMeJoinGuild(message) {
	//Sending greetings messages
	message.channel.send('Hello! It\'s a me, Schelly!');
	sendFeaturesList(message);

	//Getting and formatting relevant guild info
	const guildId = message.guild.id;
	const guildInfo = {
		id: guildId,
		events: {}
	};
	//Registering the guild info in the database
	await Database.set(guildId, guildInfo);
	console.log(await Database.get(guildId));
}

function sendFeaturesList(message) {
	const featuresEmbed = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Shelly Features List')
		.setAuthor('MICKEY THE GREAT', 'https://cdn.domestika.org/c_limit,dpr_auto,f_auto,q_auto,w_820/v1562001322/content-items/003/091/926/crowley_950-original.jpg?1562001322')
		.setDescription('The simplest yet powerful event scheduler and attendance tracker!')
		.addFields(
			{ name: 'ping', value: 'pong' },
			{ name: 'help', value: 'Show this features list' },
			{ name: '\u200B', value: '\u200B', inline: true },
			{ name: 'set-channel', value: 'Set the default channel where the events will be shown', inline: true }
		)
		.setImage('https://cdn.discordapp.com/app-icons/784141836977307668/e45ce513a9f903e4e3abb8a64cbfb9e1.png?size=128')
		.setThumbnail('https://cdn.discordapp.com/app-icons/784141836977307668/e45ce513a9f903e4e3abb8a64cbfb9e1.png?size=32')
		.setTimestamp()
		.setFooter('Paolo-san is EVIL', 'https://i.pinimg.com/originals/74/f8/70/74f870cf92c1452487969e1b2d483716.jpg');
	message.channel.send(featuresEmbed);
}

function schedule(channel, event) {
	try {
		channel.send('The event ' + event.name + ' has been created.');
	} catch (error) {
		console.log(error);
	}
}