import axios from 'axios';
import { env } from '~/env';

import { StoreBoardParams, StoreBoardResponse } from '~/types/api';
import { StoreSecretParams, StoreSecretResponse } from '~/types/api';
import { UpdateSecretParams, UpdateSecretResponse } from '~/types/api';
import { ComputeParams, ComputeResponse } from '~/types/api';
import { RetrieveSecretsParams, RetrieveSecretsResponse } from '~/types/api';
import { GetBoardParams, GetBoardResponse } from '~/types/api';

const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});

export const storeBoard = async (params: StoreBoardParams) => {
  const { data } = await api.post<StoreBoardResponse>('/store-board', params);
  return data;
};

export const storeSecret = async (params: StoreSecretParams) => {
  const { data } = await api.post<StoreSecretResponse>('/store-secret', params);
  return data;
};

export const updateSecret = async (params: UpdateSecretParams) => {
  const { data } = await api.post<UpdateSecretResponse>(
    '/update-secret',
    params
  );
  return data;
};

export const compute = async (params: ComputeParams) => {
  const { data } = await api.post<ComputeResponse>('/compute', params);
  return data;
};

export const retrieveSecrets = async (params: RetrieveSecretsParams) => {
  const { data } = await api.post<RetrieveSecretsResponse>(
    '/retrieve-secrets',
    params
  );
  return data;
};

export const getBoard = async (params: GetBoardParams) => {
  const { data } = await api.post<GetBoardResponse>('/get-board', params);
  return data;
};

const admin_key =
  'vpsTLYPsxykyXnYioP8QtaEdA9FzHxVwEFvRxYdH2xxNqzfkpJGDK6teRJUqCTaAtz4Af9bZkLKe5miE66J17QT';

const user1_key =
  '5jekUCRpAw5S244ArVv8dxXXgf6Z3vWyP7dLB7Ao4P1KWHVJRT97EaQH2MFGghqAcQ1vCFN8roH3ShaEH357NP7G';

const user2_key =
  '5WxyEf344Hf8Cbo7NKJrKZQmZKFfat8H1QsRopmgQzk1621xHv3iBiactZPaFURgEbnYP1EJJkuAAGzYtsuhEzdp';

const main = async () => {
  const board = {
    carrier: [134, 135, 136, 137, 138],
    cruiser: [145, 155, 165],
    destroyer: [188, 189],
    battleship: [112, 122, 132, 142],
    submarine: [156, 157, 158],
  };
  const store_board_response = await storeBoard({
    user_key: user1_key,
    ...board,
  });
  console.log('Board Stored: ', store_board_response);

  const store_secret_response = await storeSecret({
    user_key: admin_key,
    name: 'moves',
    value: [],
  });
  console.log('Secret Stored: ', store_secret_response);

  //   const update_secret_response = await updateSecret({
  //     user_key: admin_key,
  //     store_id: store_secret_response.store_id,
  //     name: 'secret1',
  //     value: 43,
  //   });
  //   console.log(update_secret_response);

  //   const compute_response = await compute({
  //     user_key: admin_key,
  //     name: 'secret1',
  //     value: 43,
  //   });
  //   console.log(compute_response);

  //   const retrieve_secrets_response = await retrieveSecrets({
  //     user_key: admin_key,
  //     store_id: 1,
  //     secret_name: 'secret1',
  //     type: 'number',
  //   });
  //   console.log(retrieve_secrets_response);

  //   const get_board_response = await getBoard({
  //     user_key: admin_key,
  //     store_id: 1,
  //   });
  //   console.log(get_board_response);
};
