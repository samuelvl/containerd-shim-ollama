/* eslint-disable @typescript-eslint/consistent-type-assertions */
import React from 'react';
import useFetchState, { FetchState } from '~/shared/utilities/useFetchState';
import { ModelCatalogSource } from './types';
import { mockCatalogModel } from './mockCatalogModel';

type State = ModelCatalogSource[];

export const useModelCatalogSources = (): FetchState<State> => {
  const callback = React.useCallback(async () => {
    // Simulate a fetch call with a timeout
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
    // Return an empty array of ModelCatalogSource
    const modelCatalog = {
      source: 'ollama',
      models: [mockCatalogModel({})],
    } as unknown as ModelCatalogSource;
    return [modelCatalog];
  }, []);

  return useFetchState<State>(callback, []);
};

export default useModelCatalogSources;
