import { BodyResolve, IController } from "../metadata";

export function routeMeta(key: string): string {
  return `@metadata::${key}`;
}

export function resolveDefaultBodyParser(): BodyResolve {
  const pwd = process.env.PWD;
  let config: any;
  try {
    const defaultConfig = require(`${pwd}/app/config/config.default.js`);
    config = (defaultConfig && defaultConfig["@router-metadata"]) || {};
  } catch (error) {
    config = {};
  }
  const result: BodyResolve = {
    getQuery: defaultGetQueryFac,
    getPost: defaultGetPostFac,
    toJson: defaultToJsonFac
  };
  if (config.getQuery) {
    const queryKey = config.getQuery;
    result.getQuery = (instance: IController) => {
      // @ts-ignore
      return () => instance.ctx[queryKey]();
    };
  }
  if (config.getPost) {
    const postKey = config.getPost;
    result.getPost = (instance: IController) => {
      // @ts-ignore
      return () => instance.ctx[postKey]();
    };
  }
  if (config.toJson) {
    const toJsonKey = config.toJson;
    result.toJson = (instance: IController) => {
      // @ts-ignore
      return (code, msg, data) => instance.ctx[toJsonKey](code, msg, data);
    };
  }
  return result;
}

function defaultGetQueryFac(instance: IController) {
  return () => instance.ctx.query;
}

function defaultGetPostFac(instance: IController) {
  return () => (<any>instance.ctx.request).body;
}

function defaultToJsonFac<T>(instance: IController) {
  // @ts-ignore
  return <T>(code: any, msg: any, data: T) => instance.ctx.body = {
    code,
    msg,
    data
  };
}
