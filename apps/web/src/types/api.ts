export type WithUserKey = {
  user_key: string;
};

export type StoreBoardParams = {
  carrier: number[];
  battleship: number[];
  cruiser: number[];
  submarine: number[];
  destroyer: number[];
} & WithUserKey;

export type StoreSecretParams = {
  name: string;
  value: number | number[] | string;
} & WithUserKey;

export type UpdateSecretParams = {
  store_id: number;
} & StoreSecretParams;

export type RetrieveSecretsParams = {
  store_id: string;
  secret_name: string;
  type: string;
} & WithUserKey;

export type ComputeParams = {
  position: number;
} & StoreSecretParams;

export type GetBoardParams = {
  store_id: string;
};

export type StoreBoardResponse = {
  store_id: string;
};

export type StoreSecretResponse = {
  store_id: string;
};

export type UpdateSecretResponse = {
  store_id: string;
};

export type RetrieveSecretsResponse = {
  result: number | number[] | string;
};

export type ComputeResponse = {
  result: number;
};

export type GetBoardResponse = {
  carrier: number[];
  battleship: number[];
  cruiser: number[];
  submarine: number[];
  destroyer: number[];
};
