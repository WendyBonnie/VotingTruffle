
# votingTest

# Overview:
This Truffle test suite tests a Voting smart contract. It covers various scenarios like adding voters, adding proposals, starting and ending voting sessions, voting, and tallying the votes. The tests use the Chai assertion library for making assertions.

# Installation:

# Clone the project from the repository.
Install Truffle using npm install truffle -g.
Install the dependencies using npm install.


# Open the terminal in the project directory.
Run a local blockchain using truffle develop or ganache-cli.
Migrate the contract to the local blockchain using truffle migrate.
Run the test suite using truffle test.
Test Cases:

# Add a voter:
This test case checks if a voter can be added to the contract, and if the added voter is registered in the contract.

# Return a voter:
This test case checks if a voter can be returned from the contract.

# Open the proposals:
This test case checks if the proposals registration is closed initially, and if the proposals registration can be started.

# Registered a proposal:
This test case checks if a proposal can be added to the contract, if voters registration is not open, and if a voting session can be started only after proposals registration has ended.

# Is Voting:
This test case checks if a voting session can be started, if a voter can vote, if a proposal's vote count can be increased, and if the voting session can be ended.

# Tally the vote:
This test case checks if the votes can be tallied, and if the winning proposal's ID can be returned.

# Author:
Wendy Montagnon




