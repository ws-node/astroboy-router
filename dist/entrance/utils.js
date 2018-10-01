"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function routeMeta(key) {
    return `@metadata::${key}`;
}
exports.routeMeta = routeMeta;
function resolveDefaultBodyParser() {
    const pwd = process.env.PWD;
    let config;
    try {
        const defaultConfig = require(`${pwd}/app/config/config.default.js`);
        config = (defaultConfig && defaultConfig["@router-metadata"]) || {};
    }
    catch (error) {
        config = {};
    }
    const result = {
        getQuery: defaultGetQueryFac,
        getPost: defaultGetPostFac,
        toJson: defaultToJsonFac
    };
    if (config.getQuery) {
        const queryKey = config.getQuery;
        result.getQuery = (instance) => {
            // @ts-ignore
            return () => instance.ctx[queryKey]();
        };
    }
    if (config.getPost) {
        const postKey = config.getPost;
        result.getPost = (instance) => {
            // @ts-ignore
            return () => instance.ctx[postKey]();
        };
    }
    if (config.toJson) {
        const toJsonKey = config.toJson;
        result.toJson = (instance) => {
            // @ts-ignore
            return (code, msg, data) => instance.ctx[toJsonKey](code, msg, data);
        };
    }
    return result;
}
exports.resolveDefaultBodyParser = resolveDefaultBodyParser;
function defaultGetQueryFac(instance) {
    return () => instance.ctx.query;
}
;
function defaultGetPostFac(instance) {
    return () => instance.ctx.request.body;
}
;
function defaultToJsonFac(instance) {
    // @ts-ignore
    return (code, msg, data) => instance.ctx.body = {
        code,
        msg,
        data
    };
}
//# sourceMappingURL=utils.js.map