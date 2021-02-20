"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processList = void 0;

var _utils = require("./utils");

var _context = require("./context");

var _transform = require("./transform");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const OUTPUT_TYPES = {
  address: true,
  bool: true,
  string: true,
  bytes: true,
  int: true,
  'bytes32[]': true,
  'int[]': true,
  'address[]': true
};

const process = (ctx, config) => {
  if (!config) {
    return;
  }

  const {
    type,
    value,
    title,
    transform = []
  } = config;

  if (config.scaleDown && config.scale) {
    
    let _scale;

    try {
      _scale = (0, _utils.resolveValue)(ctx, config.scale);
    } catch (err) {
      ctx.recordError(`output value is not valid: ${config.scale}`);
    }

    if (typeof _scale !== 'undefined') {
      config.scale = _scale;
    }

    if (config.unit) {
      transform.unshift({
        type: "stringToSpacedSuffixedString",
        suffix: config.unit
      });
    }

    transform.unshift({
      type: "intToScaledDownIntString",
      scale: config.scale
    });
  }

  if (config.scale && !config.scaleDown) {
    if (config.unit) {
      transform.unshift({
        type: "stringToSpacedSuffixedString",
        suffix: config.unit
      });
    }

    transform.unshift({
      type: "intToScaledIntString",
      scale: config.scale
    });
  }

  if (!type || !value || !title) {
    ctx.recordError(`output type, value and title must be specified`);
  } else {
    if (!OUTPUT_TYPES[type]) {
      ctx.recordError(`output type is not valid: ${type}`);
    }

    let result;

    try {
      result = (0, _utils.resolveValue)(ctx, value);
    } catch (err) {
      ctx.recordError(`output value is not valid: ${value}`);
    }

    let resultTransformed;

    if (typeof result !== 'undefined') {
      resultTransformed = (0, _transform.transformValue)(ctx, result, transform);
    }

    ctx.outputs().set(ctx.id, _objectSpread({}, config, {
      result,
      resultTransformed
    }));
  }
};

const processList = async (parentCtx, outputs) => {
  return Promise.all((outputs || []).map(async (outputConfig, ouputIndex) => {
    const ctx = (0, _context.createChildContextFrom)(parentCtx, `output[${ouputIndex}]`);
    return process(ctx, outputConfig);
  }));
};

exports.processList = processList;