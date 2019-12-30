const cool = function(e){ return e; };

const defaultJsFormOptions = {
  emulateJSON: true,
  method: "POST",
  events: {
    beforeSubmit: cool
  }
};

export default defaultJsFormOptions;
