/* eslint-disable @typescript-eslint/consistent-type-assertions */
import React from 'react';
import useFetchState, {
  FetchState,
  FetchStateCallbackPromise,
} from '~/shared/utilities/useFetchState';
import { useDeepCompareMemoize } from '~/shared/utilities/useDeepCompareMemoize';
import { getListModels } from '~/app/api/k8s';
import { ModelCatalogSource } from './types';

type State = ModelCatalogSource[];

export const useModelCatalogSources = (queryParams: Record<string, unknown>): FetchState<State> => {
  const paramsMemo = useDeepCompareMemoize(queryParams);

  const listModelRegistries = React.useMemo(() => getListModels('', paramsMemo), [paramsMemo]);
  const callback = React.useCallback<FetchStateCallbackPromise<ModelCatalogSource[]>>(
    (opts) => listModelRegistries(opts),
    [listModelRegistries],
  );
  return useFetchState(callback, [], { initialPromisePurity: true });
};

export default useModelCatalogSources;
