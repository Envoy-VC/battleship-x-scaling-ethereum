import * as nillion from '@nillion/nillion-client-js-browser/nillion_client_js_browser.js';

import { nillionConfig } from './config';

import { PaymentsConfig } from '~/types/nillion';

export const initializeNillionClient = (
  userkey: any,
  nodekey: any,
  websockets: string[],
  payments_config: PaymentsConfig
): nillion.NillionClient =>
  new nillion.NillionClient(userkey, nodekey, websockets, payments_config);

export const getNillionClient = async (userKey: string) => {
  await nillion.default();
  const nillionUserKey = nillion.UserKey.from_base58(userKey);
  // temporary fix for an issue where nodekey cannot be reused between calls
  const nodeKey = nillion.NodeKey.from_seed(
    `scaffold-eth-${Math.floor(Math.random() * 10000)}`
  );
  console.log(nillionConfig);

  const client = initializeNillionClient(
    nillionUserKey,
    nodeKey,
    nillionConfig.websockets as string[],
    nillionConfig.payments_config as PaymentsConfig
  );
  return {
    nillion,
    nillionClient: client,
  };
};
