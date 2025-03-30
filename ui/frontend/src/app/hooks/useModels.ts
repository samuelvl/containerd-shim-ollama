import * as React from 'react';
import useFetchState, {
  FetchState,
  FetchStateCallbackPromise,
} from '~/shared/utilities/useFetchState';
import { getListModels } from '~/app/api/k8s';
import { useDeepCompareMemoize } from '~/shared/utilities/useDeepCompareMemoize';
import { ModelCatalogSource } from '../concepts/modelCatalog/types';

const useModels = (queryParams: Record<string, unknown>): FetchState<ModelCatalogSource[]> => {
  const paramsMemo = useDeepCompareMemoize(queryParams);

  const listModels = React.useMemo(() => getListModels('', paramsMemo), [paramsMemo]);
  const callback = React.useCallback<FetchStateCallbackPromise<ModelCatalogSource[]>>(
    (opts) => listModels(opts),
    [listModels],
  );
  return useFetchState(callback, [], { initialPromisePurity: true });
};

export default useModels;
