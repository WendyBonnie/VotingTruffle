const Voting = artifacts.require("voting");

module.exports = async (deployer) => {
  await deployer.deploy(Voting, 7, { value: 1000000000 });
  let instance = await Voting.deployed();
};
