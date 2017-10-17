const
	_ = require('underscore'),
	{ URL, URLSearchParams } = require('url');

module.exports = class NcloudUrl {
	constructor(method = 'POST', url = new URL('/')) {
		if(!(url instanceof URL)) {
			throw new Error('url is not instanceof URL.');
		}

		this.method = method;
		this.url = url;
		this.params = new URLSearchParams();
	}

	setParam(key, value) {
		if(_.isObject(key)) {
			_.each(key, (value, key) => {
				this.params.set(key, value);
			});
		} else if(_.isString(key)) {
			this.params.set(key, value);
		}

		return this;
	}

	initParam() {
		this.params = new URLSearchParams();

		return this;
	}

	getUrl() {
		return `${this.url.toString()}?${this.params.toString()}`
	}
};
