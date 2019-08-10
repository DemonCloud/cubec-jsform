import struct from 'ax-struct-js';

const defaultJsFormOptions = {
  emulateJSON: true,
  method: "POST",
  events: {
    beforeSync: struct.cool()
  }
};

export default defaultJsFormOptions;
