import * as React from 'react';
import { BFF_API_VERSION } from '~/app/const';
import useQueryParamNamespaces from '~/shared/hooks/useQueryParamNamespaces';
import useOllamaAPIState, { OllamaAPIState } from '~/app/hooks/useOllamaAPIState';
import { URL_PREFIX } from '~/shared/utilities/const';

export type ModelRegistryContextType = {
  apiState: OllamaAPIState;
  refreshAPIState: () => void;
};

type ModelRegistryContextProviderProps = {
  children: React.ReactNode;
  modelRegistryName: string;
};

export const ModelRegistryContext = React.createContext<ModelRegistryContextType>({
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  apiState: { apiAvailable: false, api: null as unknown as OllamaAPIState['api'] },
  refreshAPIState: () => undefined,
});

export const ModelRegistryContextProvider: React.FC<ModelRegistryContextProviderProps> = ({
  children,
  modelRegistryName,
}) => {
  const hostPath = modelRegistryName ? `${URL_PREFIX}/api/${BFF_API_VERSION}/models` : null;

  const queryParams = useQueryParamNamespaces();

  const [apiState, refreshAPIState] = useOllamaAPIState(hostPath, queryParams);

  return (
    <ModelRegistryContext.Provider
      value={React.useMemo(
        () => ({
          apiState,
          refreshAPIState,
        }),
        [apiState, refreshAPIState],
      )}
    >
      {children}
    </ModelRegistryContext.Provider>
  );
};
