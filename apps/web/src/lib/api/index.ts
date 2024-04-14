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
