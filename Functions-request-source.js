const { repo, target, amount } = args;

result = {};

// Convert JSON object to a string using JSON.stringify()
// Then encode it to bytes using the helper Functions.encodeString
return Functions.encodeString(JSON.stringify(result));
