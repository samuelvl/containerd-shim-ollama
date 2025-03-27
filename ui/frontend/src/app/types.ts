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

export type ModelCustomProperties = Record<string, unknown>;

export type ModelBase = {
  id: string;
  name: string;
  externalID?: string;
  description?: string;
  createTimeSinceEpoch: string;
  lastUpdateTimeSinceEpoch: string;
  customProperties: ModelCustomProperties;
  image?: string;
  tags?: string[];
};

export type OllamaModel = ModelBase & {
  author?: string;
  owner?: string;
  deployed: boolean;
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
