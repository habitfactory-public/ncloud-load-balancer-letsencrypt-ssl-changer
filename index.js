const
	BASE_URL = 'https://api.ncloud.com',
	OAUTH_CONSUMER_KEY = process.env.OAUTH_CONSUMER_KEY,
	OAUTH_CONSUMER_SECRET = process.env.OAUTH_CONSUMER_SECRET,
	KEY_STORAGE_PATH = process.env.KEY_STORAGE_PATH,
	LOADBALANCER_INSTANCE_NUMBER = process.env.LOADBALANCER_INSTANCE_NUMBER;

const
	fs = require('fs'),
	path = require('path'),
	request = require('request'),
	nonce = require('nonce')(),
	{ URL } = require('url'),
	NcloudUrl = require('./libraries/ncloud-url'),
	OAuth = require('./libraries/oauth'),
	Command = require('./libraries/command');

const
	ncloudUrl = new NcloudUrl('GET', new URL('/loadbalancer/', BASE_URL)),
	oauth = new OAuth(OAUTH_CONSUMER_KEY, OAUTH_CONSUMER_SECRET),
	command = new Command(ncloudUrl, oauth);

const
	privkeyFilename = path.format({
		dir: KEY_STORAGE_PATH,
		base: 'privkey.pem'
	}),
	pubkeyFilename = path.format({
		dir: KEY_STORAGE_PATH,
		base: 'cert.pem'
	}),
	privkey = fs.readFileSync(privkeyFilename),
	pubkey = fs.readFileSync(pubkeyFilename);

command
	.addLoadBalancerSslCertificate({
		privkey: privkey,
		pubkey: pubkey
	})
	.then(response => {
		return command
			.changeLoadBalancerInstanceConfiguration(LOADBALANCER_INSTANCE_NUMBER)
			.then(response => {
				console.log('changed');
			});
	})
	.catch(error => {
		console.error(error.message);
	});
