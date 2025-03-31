import React from 'react';
import { APIState } from '~/shared/api/types';
import { OllamaModelAPIs } from '~/app/concepts/chat/types';
import { generate } from '~/app/api/service';
import useAPIState from '~/shared/api/useAPIState';

export type ChatAPIState = APIState<OllamaModelAPIs>;

const useChatAPIState = (
  hostPath: string | null,
  queryParameters?: Record<string, unknown>,
): [apiState: ChatAPIState, refreshAPIState: () => void] => {
  const createAPI = React.useCallback(
    (path: string) => ({
      generate: generate(path, queryParameters),
    }),
    [queryParameters],
  );

  return useAPIState(hostPath, createAPI);
};

export default useChatAPIState;
