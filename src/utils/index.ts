import { AbiCoder } from 'ethers';
import * as all from 'viem/chains';

export const tlc = (str: string | undefined): string | undefined => str?.toLowerCase?.();
export const trim = (str: string | undefined): string | undefined =>
  str?.replace(/(^\s*)|(\s*$)/g, '');
export const toLowerCaseEquals = (a: string | undefined, b: string | undefined): boolean => {
  if (!a && !b) {
    return false;
  }
  return tlc(a) === tlc(b);
};
export function decodeABI(value: string, types: string[]) {
  if (!value.startsWith('0x')) {
    value = `0x${value}`;
  }
  const result = new AbiCoder().decode(types, value);
  return result;
}
// const ADDRESS_PREFIX_REGEX = /^(41)/;
const ADDRESS_PREFIX = '41';
export async function decodeParams(types: any, output: any, ignoreMethodHash: boolean) {
  if (!output || typeof output === 'boolean') {
    ignoreMethodHash = output;
    output = types;
  }

  if (ignoreMethodHash && output.replace(/^0x/, '').length % 64 === 8)
    output = `0x${output.replace(/^0x/, '').substring(8)}`;

  const abiCoder = new AbiCoder();

  if (output.replace(/^0x/, '').length % 64)
    throw new Error('The encoded string is not valid. Its length must be a multiple of 64.');
  return abiCoder.decode(types, output).reduce((obj, arg, index) => {
    if (types[index] === 'address') arg = ADDRESS_PREFIX + arg.substr(2).toLowerCase();
    obj.push(arg);
    return obj;
  }, []);
}

export function toFormateDateTime(timestamp: number) {
  if (typeof timestamp === 'string') {
    timestamp = Number(timestamp);
  }
  const date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const sdate = `0${date.getDate()}`.slice(-2);
  const hour = `0${date.getHours()}`.slice(-2);
  const minute = `0${date.getMinutes()}`.slice(-2);
  const second = `0${date.getSeconds()}`.slice(-2);
  // 拼接
  const result = `${year}-${month}-${sdate} ${hour}:${minute}:${second}`;
  // 返回
  return result;
}

// 分钟转成天数
export function minutesToDays(minutes: number) {
  const days = minutes / (60 * 24);
  return days.toFixed(1); // 保留一位小数
}

/**
 * Gets the chain object for the given chain id.
 * @param chainId - Chain id of the target EVM chain.
 * @returns Viem's chain object.
 */
export function getChain(chainId: number): all.Chain {
  const { ...chains } = all;
  // eslint-disable-next-line no-restricted-syntax
  for (const chain of Object.values(chains)) {
    if (chain.id === chainId) {
      return chain;
    }
  }

  throw new Error(`Chain with id ${chainId} not found`);
}

/**
 * Formats a number to a specified number of decimal places.
 * @param num - The number to format.
 * @param decimalPlaces - The number of decimal places to round to (default is 2).
 * @returns A string representation of the formatted number.
 */
export function formatNumber(num: number | string, decimalPlaces = 2): string {
  if (typeof num === 'string') {
    num = parseFloat(num);
  }
  if (Number.isNaN(num)) {
    return 'Invalid number';
  }
  // Use toFixed to round the number and get the desired decimal places
  const roundedNum = num.toFixed(decimalPlaces);

  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = roundedNum.split('.');

  // Add commas to the integer part for better readability
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Combine the formatted integer part with the decimal part (if any)
  return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
}
/**
 * Extracts and formats the error message from an Ethers.js error object.
 * @param error - The error object thrown by Ethers.js.
 * @returns A formatted error message string.
 */
export function handleEthersError(error: any): string {
  if (typeof error === 'object' && error !== null) {
    // Check for Ethers v6 error format
    if (error.shortMessage) {
      return error.shortMessage;
    }
    // Check for Ethers v5 error format
    if (error.reason) {
      return error.reason;
    }
    // Check for a nested error object
    if (error.error && typeof error.error === 'object') {
      return handleEthersError(error.error);
    }
    // Check for a message property
    if (error.message) {
      return error.message;
    }
  }
  // If all else fails, return the error as a string
  return String(error);
}
