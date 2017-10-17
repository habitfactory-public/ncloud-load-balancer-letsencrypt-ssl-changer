const
	NcloudUrl = require('./ncloud-url'),
	OAuth = require('./oauth'),
	request = require('request-promise-native'),
	generateCertificateName = () => {
		let d = new Date();
		return `cert-${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`;
	};

module.exports = class Command {
	constructor(ncloudUrl, oauth) {
		if(!(ncloudUrl instanceof NcloudUrl)) {
			throw new Error('ncloud is not instanceof NcloudUrl.');
		}

		if(!(oauth instanceof OAuth)) {
			throw new Error('oauth is not instanceof OAuth.');
		}

		this.ncloudUrl = ncloudUrl;
		this.oauth = oauth;
		this.certificateName = generateCertificateName();
	}

	addLoadBalancerSslCertificate(keys) {
		this.ncloudUrl.setParam({
			action: 'addLoadBalancerSslCertificate',
			responseFormatType: 'json',
			certificateName: this.certificateName,
			privateKey: keys.privekey,
			publicKeyCertificate: keys.pubkey
		});

		return request(this.oauth.getSignedUrl(this.ncloudUrl));
	}

	changeLoadBalancerInstanceConfiguration(loadbalancerInstanceNumber) {
		this.ncloudUrl.initParam().setParam({
			action: 'changeLoadBalancerInstanceConfiguration',
			responseFormatType: 'json',
			loadBalancerInstanceNo: loadbalancerInstanceNumber,
			'loadBalancerRuleList.1.certificateName': this.certificateName
		});

		return request(this.oauth.getSignedUrl(this.ncloudUrl));
	}
};
