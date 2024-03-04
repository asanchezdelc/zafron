const vm = require('vm');

const decode = (fx, payload) => {
      // We are going to use NodeJS vm module to run the decoder function
    // the decoder function should return the decoded payload
    // the decoder function should be a string
    // the decoder function should return a JSON object
    // the decoder function should be in the following format
  const script = new vm.Script(`${fx} output = decode(data);`);
  const ctx = vm.createContext({ data: payload, output: '' });
  try {
    const decodedPayload = script.runInContext(ctx);
    return decodedPayload;
  } catch (error) {
    throw error;
  }
  
}

module.exports = decode;