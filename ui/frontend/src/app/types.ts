import { AlertVariant } from '@patternfly/react-core';

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

export enum StatusModel {
  NOT_DEPLOYED = 'NOT_DEPLOYED',
  DEPLOYED = 'DEPLOYED',
  ERROR = 'ERROR',
}

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
