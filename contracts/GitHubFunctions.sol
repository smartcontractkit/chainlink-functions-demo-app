// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

contract GitHubFunctions is FunctionsClient {
  using FunctionsRequest for FunctionsRequest.Request;

  event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);

  string public calculationLogic;
  bytes32 public latestRequestId;
  bytes public latestResponse;
  bytes public latestError;
  bytes32 public donId;

  constructor(address oracle, bytes32 _donId, string memory _calculationLogic) FunctionsClient(oracle) {
    donId = _donId;
    calculationLogic = _calculationLogic;
  }

  function multiplyMetricWithEther(
    string[] calldata args,
    uint64 subscriptionId,
    uint32 gasLimit
  ) public returns (bytes32) {
    FunctionsRequest.Request memory req;
    req.initializeRequest(FunctionsRequest.Location.Inline, FunctionsRequest.CodeLanguage.JavaScript, calculationLogic);
    req.setArgs(args);

    bytes32 assignedReqID = _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donId);
    latestRequestId = assignedReqID;
    return assignedReqID;
  }

  /**
   * @notice Callback that is invoked once the DON has resolved the request or hit an error
   *
   * @param requestId The request ID, returned by sendRequest()
   * @param response Aggregated response from the user code
   * @param err Aggregated error from the user code or from the execution pipeline
   * Either response or error parameter will be set, but never both
   */
  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    latestResponse = response;
    latestError = err;
    emit OCRResponse(requestId, response, err);
  }
}
