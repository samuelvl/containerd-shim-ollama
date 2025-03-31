import * as React from 'react';
import { BFF_API_VERSION } from '~/app/const';
import useQueryParamNamespaces from '~/shared/hooks/useQueryParamNamespaces';
import useOllamaAPIState, { OllamaAPIState } from '~/app/hooks/useOllamaAPIState';
import { URL_PREFIX } from '~/shared/utilities/const';

export type OllamaContextType = {
  apiState: OllamaAPIState;
  refreshAPIState: () => void;
};

type OllamaContextProviderProps = {
  children: React.ReactNode;
  modelRegistryName: string;
};

export const OllamaContext = React.createContext<OllamaContextType>({
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  apiState: { apiAvailable: false, api: null as unknown as OllamaAPIState['api'] },
  refreshAPIState: () => undefined,
});

export const OllamaContextProvider: React.FC<OllamaContextProviderProps> = ({
  children,
  modelRegistryName,
}) => {
  const hostPath = modelRegistryName ? `${URL_PREFIX}/api/${BFF_API_VERSION}/models` : null;

  const queryParams = useQueryParamNamespaces();

  const [apiState, refreshAPIState] = useOllamaAPIState(hostPath, queryParams);

  return (
    <OllamaContext.Provider
      value={React.useMemo(
        () => ({
          apiState,
          refreshAPIState,
        }),
        [apiState, refreshAPIState],
      )}
    >
      {children}
    </OllamaContext.Provider>
  );
};
