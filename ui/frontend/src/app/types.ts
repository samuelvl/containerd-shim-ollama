import { AlertVariant } from '@patternfly/react-core';
import { APIOptions } from '~/shared/api/types';

export type DeployedModel = {
  name: string;
  displayName: string;
  description: string;
  serverAddress?: string;
};

export type ModularArchBody<T> = {
  data: T;
  metadata?: Record<string, unknown>;
};

export type ModularArchParams = {
  size: number;
  pageSize: number;
  nextPageToken: string;
};

export type ModelRegistryCustomProperties = Record<string, unknown>;
export type ModelRegistryStringCustomProperties = Record<string, unknown>;

export type ModelBase = {
  id: string;
  name: string;
  externalID?: string;
  description?: string;
  createTimeSinceEpoch: string;
  lastUpdateTimeSinceEpoch: string;
  customProperties: ModelRegistryCustomProperties;
  image?: string;
  tags?: string[];
};

export type OllamaModel = ModelBase & {
  author?: string;
  owner?: string;
  status: StatusModel;
};

export enum StatusModel {
  NOT_DEPLOYED = 'NOT_DEPLOYED',
  DEPLOYED = 'DEPLOYED',
  ERROR = 'ERROR',
}

export type PatchModel = (
  opts: APIOptions,
  data: Partial<OllamaModel>,
  registeredModelId: string,
) => Promise<OllamaModel>;

export type GetModel = (opts: APIOptions, registeredModelId: string) => Promise<OllamaModel>;

export type GenerateRequestOptions = {
  temperature?: number;
  [key: string]: unknown;
};

export type GenerateRequest = {
  model: string;
  prompt: string;
  suffix?: string;
  images?: string[];
  format?: 'json' | string;
  options?: GenerateRequestOptions;
  system?: string;
  template?: string;
  stream?: boolean;
  raw?: boolean;
  keep_alive?: string;
  context?: number[];
};

export type GenerateResponse = {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
};

export type GenerateAPI = (
  opts: APIOptions,
  data: GenerateRequest,
  onResponse?: (response: GenerateResponse) => void,
) => Promise<GenerateResponse>;

export type OllamaModelAPIs = {
  generate: GenerateAPI;
};

export type Notification = {
  id?: number;
  status: AlertVariant;
  title: string;
  message?: React.ReactNode;
  hidden?: boolean;
  read?: boolean;
  timestamp: Date;
};

export enum NotificationActionTypes {
  ADD_NOTIFICATION = 'add_notification',
  DELETE_NOTIFICATION = 'delete_notification',
}

export type NotificationAction =
  | {
      type: NotificationActionTypes.ADD_NOTIFICATION;
      payload: Notification;
    }
  | {
      type: NotificationActionTypes.DELETE_NOTIFICATION;
      payload: { id: Notification['id'] };
    };
