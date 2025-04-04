import React from 'react';
import { FetchStateObject } from '~/shared/types';
import { useMakeFetchObject } from '~/shared/utilities/useMakeFetchObject';
import { ModelCatalogSource } from '~/app/concepts/modelCatalog/types';
import useModelCatalogSources from '~/app/concepts/modelCatalog/useModelCatalogSources';
import useQueryParamNamespaces from '~/shared/hooks/useQueryParamNamespaces';

export type ModelCatalogContextType = {
  modelCatalogSources: FetchStateObject<ModelCatalogSource[]>;
};

type ModelCatalogContextProviderProps = {
  children: React.ReactNode;
};

export const ModelCatalogContext = React.createContext<ModelCatalogContextType>({
  modelCatalogSources: {
    data: [],
    loaded: false,
    refresh: () => undefined,
  },
});

export const ModelCatalogContextProvider: React.FC<ModelCatalogContextProviderProps> = ({
  children,
}) => {
  const queryParams = useQueryParamNamespaces();
  const modelCatalogSources = useMakeFetchObject(useModelCatalogSources(queryParams));

  const contextValue = React.useMemo(
    () => ({
      modelCatalogSources,
    }),
    [modelCatalogSources],
  );

  return (
    <ModelCatalogContext.Provider value={contextValue}>{children}</ModelCatalogContext.Provider>
  );
};
