const
	nonce = require('nonce')();
	NcloudUrl = require('./ncloud-url'),
	crypto = require('crypto');

module.exports = class OAuth {
	constructor(consumer_key, consumer_secret) {
		this.options = {
			oauth_consumer_key: consumer_key,
			oauth_consumer_secret: consumer_secret,
			oauth_signature_method: 'HMAC-SHA1',
			oauth_version: '1.0'
		};
	}

	getSignedUrl(ncloudUrl) {
		if(!(ncloudUrl instanceof NcloudUrl)) {
			throw new Error('ncloudUrl is not instance of NcloudUrl.');
		}

		ncloudUrl.setParam({
			oauth_consumer_key: this.options.oauth_consumer_key,
			oauth_nonce: this.getNonce(),
			oauth_timestamp: this.getOAuthTimestamp(),
			oauth_signature_method: this.options.oauth_signature_method,
			oauth_version: this.options.oauth_version
		});

		let baseString = this.getBaseString(ncloudUrl),
			authSignature = this.getOAuthSignature(baseString);

		ncloudUrl.setParam('oauth_signature', authSignature);

		return ncloudUrl.getUrl();
	}

	getNonce() {
		return nonce(15);
	}

	getOAuthTimestamp() {
		return Math.floor(Date.now() / 1000);
	}

	getBaseString(ncloudUrl) {
		return `${ncloudUrl.method}&${encodeURIComponent(ncloudUrl.url.toString())}&${encodeURIComponent(((params) => {
			params.sort();
			return params.toString();
		})(ncloudUrl.params))}`;
	}

	getOAuthSignature(baseString) {
		return crypto.createHmac('sha1', this.options.oauth_consumer_secret).update(baseString).digest('base64');
	}
};
