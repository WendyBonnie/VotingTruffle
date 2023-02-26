const Voting = artifacts.require("voting");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

contract("voting", (accounts) => {
  let VotingInstance;
  const owner = accounts[0];
  const proposal = "frites";
  const WorkflowStatus = {
    RegisteringVoters: new BN("0"),
    ProposalsRegistrationStarted: new BN("1"),
    ProposalsRegistrationEnded: new BN("2"),
    VotingSessionStarted: new BN("3"),
    VotingSessionEnded: new BN("4"),
    VotesTallied: new BN("5"),
  };
  // describe
  describe("add a voter", () => {
    beforeEach(async function () {
      VotingInstance = await Voting.deployed();
    });

    it("... should add a voter", async () => {
      await VotingInstance.addVoter(owner, { from: owner });
      await VotingInstance.addVoter(accounts[1], { from: owner });
      let voterObjet = await VotingInstance.getVoter(accounts[1], {
        from: owner,
      });
      console.log("voter", voterObjet);
      expect(voterObjet.isRegistered).to.be.true;

      await expectRevert(
        VotingInstance.addVoter(accounts[1], {
          from: owner,
        }),
        "Already registered"
      );
    });

    it("... should return a voter", async () => {
      await VotingInstance.getVoter(accounts[1], { from: owner });
    });

    it("...should check if the session is open", async () => {
      const currentStatus = await VotingInstance.workflowStatus();
      expect(currentStatus).to.be.bignumber.equal(
        WorkflowStatus.RegisteringVoters
      );
    });

    describe("registered a proposal", () => {
      beforeEach(async function () {
        VotingInstance = await Voting.deployed();
      });

      it("... should check if add proposal is open", async () => {
        await expectRevert(
          VotingInstance.addProposal(proposal, { from: owner }),
          "Proposals are not allowed yet"
        );
      });

      it("should revert if voters registration is not open", async () => {
        await VotingInstance.startProposalsRegistering({ from: owner });
        await expectRevert(
          VotingInstance.addVoter(accounts[3], { from: owner }),
          "Voters registration is not open yet"
        );
      });

      it("... should add the proposal frites", async () => {
        await VotingInstance.addProposal(proposal, { from: owner });
      });

      it("should revert when attempting to start voting session before proposals registration has ended", async () => {
        await VotingInstance.endProposalsRegistering({ from: owner });
        const initialStatus = await VotingInstance.workflowStatus();
        expect(initialStatus).to.be.bignumber.equal(
          WorkflowStatus.ProposalsRegistrationEnded
        );
      });
    });

    describe("is Voting", () => {
      beforeEach(async function () {
        VotingInstance = await Voting.deployed();
      });

      it("should open the voting session", async () => {
        await VotingInstance.startVotingSession({ from: owner });
        const initialStatus = await VotingInstance.workflowStatus();
        expect(initialStatus).to.be.bignumber.equal(
          WorkflowStatus.VotingSessionStarted
        );
      });

      it("should vote for the first proposal", async () => {
        await VotingInstance.setVote(1, { from: accounts[1] });
        let voterObjet = await VotingInstance.getVoter(accounts[1], {
          from: owner,
        });

        expect(voterObjet.hasVoted).to.be.true;
        await expectRevert(
          VotingInstance.setVote(1, { from: accounts[1] }),
          "You have already voted"
        );
      });
      it("should increase the vote for a proposal ", async () => {
        const proposalId = 1;

        let proposal = await VotingInstance.getOneProposal(proposalId, {
          from: accounts[1],
        });
        expect(proposal.voteCount).to.be.equal("1");
      });

      it("should end the voting session", async () => {
        await VotingInstance.endVotingSession({ from: owner });
        const initialStatus = await VotingInstance.workflowStatus();
        expect(initialStatus).to.be.bignumber.equal(
          WorkflowStatus.VotingSessionEnded
        );
      });

      it("should start show the winner and tally vote", async () => {
        await VotingInstance.tallyVotes({ from: owner });
        const initialStatus = await VotingInstance.workflowStatus();
        expect(initialStatus).to.be.bignumber.equal(
          WorkflowStatus.VotesTallied
        );
        let proposal = await VotingInstance.getOneProposal(1, {
          from: accounts[1],
        });
        console.log("winner", proposal);
        let winner = await VotingInstance.winningProposalID();
        console.log("w", winner);
        assert.equal(winner, 1, "Winning proposal ID should be 1");
      });
    });
  });
});
