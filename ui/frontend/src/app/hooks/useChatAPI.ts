import * as React from 'react';
import { ChatContext } from '~/app/concepts/chat/ChatContext';
import { ChatAPIState } from './useChatAPIState';

type UseChatAPI = ChatAPIState & {
  refreshAllAPI: () => void;
};

export const useChatAPI = (): UseChatAPI => {
  const { apiState, refreshAPIState: refreshAllAPI } = React.useContext(ChatContext);

  return {
    refreshAllAPI,
    ...apiState,
  };
};
