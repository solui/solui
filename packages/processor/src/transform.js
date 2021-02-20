"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformValue = void 0;

var _utils = require("@solui/utils");

const intToDecimal = (value, scale = 0) => {
  const d = (0, _utils.deriveDecimalVal)(value, {
    scale
  });

  if (!d) {
    throw new Error('invalid value');
  }

  return d;
};

const transformValue = (ctx, value, transform = []) => {
  if (!_utils._.get(transform, 'length')) {
    return undefined;
  }

  transform.forEach(t => {
    try {
      switch (t.type) {
        case 'toMappedString':
          {
            value = `${t.options[`${value}`]}`;
            break;
          }

        case 'stringToSpacedSuffixedString':
          {
            value = `${value} ${t.suffix}`;
            break;
          }

        case 'intToScaledIntString':
          {
            value = intToDecimal(value, parseInt(t.scale, 10)).toString();
            break;
          }
          
        case 'intToScaledDownIntString':
          {
            value = intToDecimal(value, -1 * parseInt(t.scale, 10)).toString();
            break;
          }

        case 'intToHexString':
          {
            value = intToDecimal(value).toHex();
            break;
          }

        case 'intToBinaryString':
          {
            value = intToDecimal(value).toBinary();
            break;
          }

        case 'intToDateString':
          {
            const d = intToDecimal(value);
            value = (0, _utils.prettyDate)(d.mul(1000).toNumber(), t.format || 'MMM d, yyyy');
            break;
          }

        default:
          throw new Error(`invalid transform: ${t.type}`);
      }
    } catch (err) {
      ctx.recordError(`transform failed (${t.type}): ${err.message}`);
    }
  });
  return value;
};

exports.transformValue = transformValue;