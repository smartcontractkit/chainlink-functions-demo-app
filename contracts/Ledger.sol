// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import {Functions, FunctionsClient} from "./dev/functions/FunctionsClient.sol";

import "./Donation.sol";

/// @title Record of which donations are yet to be claimed
/// @notice The contract stores donations that have ETH attached to them and allows users to make new donations as well as to claim these donations.
/// @dev This contract utilizes Chainlink Functions and serves as a demo application
contract Ledger is Initializable, UUPSUpgradeable, OwnableUpgradeable, FunctionsClient {
  using Functions for Functions.Request;

  address[] internal unclaimedDonations;
  mapping(address => Donation) internal donationMap;
  mapping(bytes32 => address) internal runningClaims;
  string internal calculationLogic;
  string internal checkLogic;

  event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);
  event Claimed(uint amount, address by);

  constructor(address oracle) FunctionsClient(oracle) {}

  /// @notice Allows for constructor arguments and for these to be passed on when upgrading
  /// @param _oracle Address where the Chainlink Functions oracle lives
  /// @param _calculationLogic JavaScript that can calculate the amount of ETH owed for a pledge
  /// @param _checkLogic JavaScript that verifies the senders identity with GitHub and returns the repositories to pay out for
  function initialize(address _oracle, string calldata _calculationLogic, string calldata _checkLogic) public initializer {
    setOracle(_oracle);
    calculationLogic = _calculationLogic;
    checkLogic = _checkLogic;
    __Ownable_init();
  }

  /// @notice Pledges the attached amount of ETH to given `_repository`
  function donate(string calldata _repository) external payable {
    Donation donation = new Donation{value: msg.value}(_repository, address(this));
    donationMap[address(donation)] = donation;
    unclaimedDonations.push(address(donation));
  }

  /// @notice Calculates the amount of ETH to donate
  function multiplyMetricWithEther(
    string calldata _repository,
    string calldata _metric,
    string calldata _target,
    string calldata _amount,
    uint64 subscriptionId
  ) external returns (bytes32) {
    Functions.Request memory req;
    req.initializeRequest(Functions.Location.Inline, Functions.CodeLanguage.JavaScript, calculationLogic);
    string[] memory args = new string[](4);
    args[0] = _repository;
    args[1] = _metric;
    args[2] = _target;
    args[3] = _amount;
    req.addArgs(args);

    bytes32 assignedReqID = sendRequest(req, subscriptionId, 300000);

    return assignedReqID;
  }

  /// @notice Can be called by maintainers to claim donations made to their repositories
  function claim(string calldata _gist, uint64 subscriptionId) public {
    Functions.Request memory req;
    req.initializeRequest(Functions.Location.Inline, Functions.CodeLanguage.JavaScript, checkLogic);

    string[] memory args = new string[](2);
    args[0] = _gist;
    args[1] = Strings.toHexString(uint256(uint160(msg.sender)), 20);

    req.addArgs(args);
    bytes32 assignedReqID = sendRequest(req, subscriptionId, 300000);
    runningClaims[assignedReqID] = msg.sender;
  }

  /// @notice Finalizes the claim process after Chainlink Functions has finished the authentication
  function finalizeClaim(address payable _maintainer, string memory _login) internal {
    uint _total = 0;
    uint _number = 0;

    for (uint i = 0; i < unclaimedDonations.length;) {
      Donation _current = donationMap[unclaimedDonations[i]];
      uint _balance = unclaimedDonations[i].balance;

      if (_balance > 0 && containsWord(_login, _current.repository())) {
        _total += _balance;
        _number++;
        _current.payout(_maintainer);
        delete donationMap[unclaimedDonations[i]];
      }
      unchecked { i++; }
    }

    address[] memory _unclaimedDonations = new address[](unclaimedDonations.length - _number);
    uint j = 0;

    for (uint i = 0; i < unclaimedDonations.length;) {
      if (unclaimedDonations[i].balance > 0) {
        _unclaimedDonations[j] = unclaimedDonations[i];
        unchecked { j++; }
      }
      unchecked{ i++; }
    }
    unclaimedDonations = _unclaimedDonations;

    emit Claimed(_total, _maintainer);
  }

  /// @notice Helper function to see if repository is by maintainer
  /// @dev pulled from https://github.com/HermesAteneo/solidity-repeated-word-in-string/blob/main/RepeatedWords.sol#L46
  function containsWord (string memory what, string memory where) internal pure returns (bool found){
    bytes memory whatBytes = bytes (what);
    bytes memory whereBytes = bytes (where);

    if(whereBytes.length < whatBytes.length){ return false; }

    found = false;
    for (uint i = 0; i <= whereBytes.length - whatBytes.length; i++) {
      bool flag = true;
      for (uint j = 0; j < whatBytes.length; j++)
        if (whereBytes [i + j] != whatBytes [j]) {
          flag = false;
          break;
        }
      if (flag) {
        found = true;
        break;
      }
    }

    return found;
  }

  /// @notice Callback that is invoked once the DON has resolved the request or hit an error
  ///
  /// @param requestId The request ID, returned by sendRequest()
  /// @param response Aggregated response from the user code
  /// @param err Aggregated error from the user code or from the execution pipeline
  /// Either response or error parameter will be set, but never both
  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    emit OCRResponse(requestId, response, err);

    if (response.length > 0 && runningClaims[requestId] != address(0)) {
      string memory login = string(response);
      finalizeClaim(payable(runningClaims[requestId]), login);
    }
  }

  /// @notice Allows the Functions oracle address to be updated
  ///
  /// @param oracle New oracle address
  function updateOracleAddress(address oracle) public onlyOwner {
    setOracle(oracle);
  }

  /// @notice View to see which donations are still open
  function getDonations() public view returns (address[] memory) {
    return unclaimedDonations;
  }

  /// @notice The current version of the contract, useful for development purposes
  function getVersion() public pure returns (uint8) {
    return 3;
  }

  function _authorizeUpgrade(address) internal override onlyOwner {}
}
