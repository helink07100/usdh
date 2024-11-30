import { AbiCoder, dataSlice, id } from 'ethers';

import { UsdhSdkMethodMap } from '@/config/constant';

// 定义接口类型
interface AbiInput {
  name: string;
  type: string;
}

interface AbiItem {
  type: string;
  name?: string;
  inputs: AbiInput[];
}

interface Method {
  name: string;
  paramsType: string[];
  paramsName: string[];
  signature: string;
}

// 生成方法签名
function signature(method: string, paramsTypes: string[]): string {
  const signatureString = `${method}(${paramsTypes.join(',')})`;
  return dataSlice(id(signatureString), 0, 4);
}

// 编码数据
export function encodeData(method: string, paramsTypes: string[], paramsValues: any[]): string {
  if (paramsTypes.length !== paramsValues.length) {
    throw new Error('Wrong number of parameters');
  }

  const methodSignature = signature(method, paramsTypes);
  const encodedParams = new AbiCoder().encode(paramsTypes, paramsValues).substring(2);
  return methodSignature + encodedParams;
}

// 解码数据
export function decodeData(abi: AbiItem[], data: string) {
  const methodId = data.slice(0, 10); // 获取前 10 个字符作为方法 ID
  const method = parseAbi(abi).find((item) => item.signature === methodId);

  if (!method) {
    throw new Error('Function not found in ABI');
  }

  // 解码数据（去掉前 10 个字符）
  const decoded = new AbiCoder().decode(method.paramsType, `0x${data.slice(10)}`);

  const params: Record<string, any> = {}; // 存储参数
  const paramsDesc: string[] = []; // 参数描述
  const paramsArr: any[] = []; // 存储解码后的参数值

  decoded.forEach((item, index) => {
    let decodedParam = item;

    // 如果参数类型是 uint256，转换成字符串
    if (method.paramsType[index] === 'uint256') {
      decodedParam = item.toString();
    }

    // 将解码后的参数值存储到 params 对象中
    params[method.paramsName[index]] = decodedParam;

    // 将参数描述（类型和名称）添加到 paramsDesc 中
    paramsDesc.push(`${method.paramsType[index]} ${method.paramsName[index]}`);

    // 将解码后的参数值放入 paramsArr 中
    paramsArr.push(decodedParam);
  });

  return {
    method: method.name,
    methodDesc: `${method.name}(${paramsDesc.join(', ')})`,
    methodParam: `${method.name}(${paramsArr.join(',')})`,
    params,
    paramsArr,
    data,
  };
}

// 解析 ABI
function parseAbi(abi: AbiItem[]): Method[] {
  const methods: Method[] = [];
  abi.forEach((item) => {
    if (item.type === 'function') {
      const paramsType = item.inputs.map(({ type }) => type);
      const paramsName = item.inputs.map(({ name }) => name);
      const name = item.name || ''; // `name` 是可选的
      methods.push({
        name,
        paramsType,
        paramsName,
        signature: signature(name, paramsType),
      });
    }
  });
  return methods;
}

export function getMethodDescription(methodName: string): string {
  return UsdhSdkMethodMap[methodName] || '未知方法';
}
