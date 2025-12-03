const axios = require("axios");

class Announce {
  constructor(webhookUrl, slug) {
    this.webhookUrl = webhookUrl;
    this.slug = slug;
  }

  async announceRelease(version) {
    const message = `${this.slug}-announcing \`${version}\` is available now`;
    await _postMessage(this.webhookUrl, message);
  }

  async planRelease(version, date) {
    const message = `${this.slug}-planning \`${version}\` on ${date}`;
    await _postMessage(this.webhookUrl, message);
  }
}

async function _postMessage(webhookUrl, message) {
  await axios.post(webhookUrl, { text: message });
}

module.exports = { Announce };
