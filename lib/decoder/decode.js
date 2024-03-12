const vm = require('vm');

const decode = (fx, payload) => {
  // the decoder function should return the decoded payload
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