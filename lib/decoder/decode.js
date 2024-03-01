const vm = require('vm');

const decode = (fx, payload) => {
  console.log(fx);
  console.log(payload);
  const script = new vm.Script(`${fx} output = decode(data);`);
  const ctx = vm.createContext({ data: payload, output: '' });
  try {
    const decodedPayload = script.runInContext(ctx);
    console.log(decodedPayload);
    return decodedPayload;
  } catch (error) {
    throw error;
  }
  
}

module.exports = decode;