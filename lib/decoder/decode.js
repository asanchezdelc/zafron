const vm = require('vm');

const decode = (fx, payload) => {
  // the decoder function should return the decoded payload
  const script = new vm.Script(`${fx} output = decode(fPort, buffer, decoded);`);
  const ctx = vm.createContext({ 
    data: payload,
    fPort: payload.fPort,
    buffer: payload.buffer,
    decoded: payload.json || {},
    output: '', 
    Buffer: Buffer 
  });
  try {
    const decodedPayload = script.runInContext(ctx);
    return decodedPayload;
  } catch (error) {
    throw error;
  }
  
}

module.exports = decode;