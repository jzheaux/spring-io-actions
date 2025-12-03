const core = require("@actions/core");

class Inputs {
  constructor() {
    this._currentVersion = core.getInput("current-version", { required: true });
  }

  get currentVersion() {
    return this._currentVersion;
  }
}

module.exports = {
  Inputs,
};
