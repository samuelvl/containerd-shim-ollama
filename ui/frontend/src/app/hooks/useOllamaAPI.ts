import * as React from 'react';
import { OllamaContext } from '~/app/context/OllamaContext';
import { OllamaAPIState } from './useOllamaAPIState';

type UseOllamaAPI = OllamaAPIState & {
  refreshAllAPI: () => void;
};

export const useOllamaAPI = (): UseOllamaAPI => {
  const { apiState, refreshAPIState: refreshAllAPI } = React.useContext(OllamaContext);

  return {
    refreshAllAPI,
    ...apiState,
  };
};
