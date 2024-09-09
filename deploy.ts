import base64url from 'base64url';
import qs from 'qs';
import {
  Address,
  beginCell,
  storeStateInit,
  contractAddress,
  toNano,
} from '@ton/core';
import { Counter } from './sources/counter.tact';

// Forming an init package
let owner = Address.parse('UQACDMZts2mLnGD_YP4ihXUcTnddLur268dntVLRFyWHLCna');
let init = await Counter.init(owner);
let testnet = true;

// Contract address
let address = contractAddress(0, init);

// Amount of TONs to attach to a deploy message
let deployAmount = toNano('0.5');

// Create string representation of an init package
let initStr = base64url(
  beginCell().store(storeStateInit(init)).endCell().toBoc({ idx: false })
);

// Create a deploy link
console.log(
  `ton://transfer/` +
    address.toString({ testOnly: testnet }) +
    '?' +
    qs.stringify({
      text: 'Deploy',
      amount: deployAmount.toString(10),
      init: initStr,
    })
);
