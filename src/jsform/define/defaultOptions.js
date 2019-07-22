import cubec from 'cubec';

const struct = cubec.struct;

const defaultJsFormOptions = {
  emulateJSON: true,
  method: "POST",
  events: {
    beforeSync: struct.cool()
  }
};

export default defaultJsFormOptions;
