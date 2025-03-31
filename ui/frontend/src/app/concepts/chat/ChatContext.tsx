import * as React from 'react';
import { BFF_API_VERSION } from '~/app/const';
import useQueryParamNamespaces from '~/shared/hooks/useQueryParamNamespaces';
import useChatAPIState, { ChatAPIState } from '~/app/hooks/useChatAPIState';
import { URL_PREFIX } from '~/shared/utilities/const';

export type ChatContextType = {
  apiState: ChatAPIState;
  refreshAPIState: () => void;
};

type ChatContextProviderProps = {
  children: React.ReactNode;
};

export const ChatContext = React.createContext<ChatContextType>({
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  apiState: { apiAvailable: false, api: null as unknown as ChatAPIState['api'] },
  refreshAPIState: () => undefined,
});

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children }) => {
  const hostPath = `${URL_PREFIX}/api/${BFF_API_VERSION}`;

  const queryParams = useQueryParamNamespaces();

  const [apiState, refreshAPIState] = useChatAPIState(hostPath, queryParams);

  return (
    <ChatContext.Provider
      value={React.useMemo(
        () => ({
          apiState,
          refreshAPIState,
        }),
        [apiState, refreshAPIState],
      )}
    >
      {children}
    </ChatContext.Provider>
  );
};
