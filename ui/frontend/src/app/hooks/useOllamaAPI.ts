import * as React from 'react';
import { ModelRegistryContext } from '~/app/context/ModelRegistryContext';
import { OllamaAPIState } from './useOllamaAPIState';

type UseOllamaAPI = OllamaAPIState & {
  refreshAllAPI: () => void;
};

export const useOllamaAPI = (): UseOllamaAPI => {
  const { apiState, refreshAPIState: refreshAllAPI } = React.useContext(ModelRegistryContext);

  return {
    refreshAllAPI,
    ...apiState,
  };
};
