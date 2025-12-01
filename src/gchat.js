const axios = require('axios');

async function postMessage(webhookUrl, message) {
	await axios.post(webhookUrl, { text: message });
}

module.exports = { postMessage };
