const core = require("@actions/core");

class Inputs {
  constructor() {
    this._milestoneTitle = core.getInput("milestone-title", { required: true });
  }

  get milestoneTitle() {
    return this._milestoneTitle;
  }
}

module.exports = {
  Inputs,
};
