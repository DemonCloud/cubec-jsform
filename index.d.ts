// Fuck . Fuck suck TypeScript! Fuck you TypeScript!
// Fuck . Fuck suck TypeScript! Fuck you TypeScript!
// Fuck . Fuck suck TypeScript! Fuck you TypeScript!
type CubecJsFromOptions = {
  [x: string]: any;
  id: string;
  name: string;
  plugins: any[];
  render?: string|any;
}

type CubecJsFromPluginOptions = {
  [x: string]: any;
  type: string;
  description: string;
  render: Function;
  init?: Function;
}

type FuckTypeScript = Function;

// Fuck . Fuck suck TypeScript! Fuck you TypeScript!
declare class CubecJsForm {
  constructor(root: HTMLElement|any, options: CubecJsFromOptions);

  static registerPlugin(options: CubecJsFromPluginOptions) : any;

  getData: FuckTypeScript;
  setData: FuckTypeScript;
  validate: FuckTypeScript;
  scrollTo: FuckTypeScript;
  reset: FuckTypeScript;
  clearStore: FuckTypeScript;
  updatePlugin: FuckTypeScript;
  getPlugin: FuckTypeScript;
  submit: FuckTypeScript;
  destroy: FuckTypeScript;
  beforeSubmit: FuckTypeScript;
}

export default CubecJsForm;
