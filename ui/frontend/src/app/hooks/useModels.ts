import * as React from 'react';
import useFetchState, {
  FetchState,
  FetchStateCallbackPromise,
} from '~/shared/utilities/useFetchState';
import { getListModels } from '~/app/api/k8s';
import { useDeepCompareMemoize } from '~/shared/utilities/useDeepCompareMemoize';
import { OllamaModel } from '~/app/types';

const useModels = (queryParams: Record<string, unknown>): FetchState<OllamaModel[]> => {
  const paramsMemo = useDeepCompareMemoize(queryParams);

  const listModels = React.useMemo(() => getListModels('', paramsMemo), [paramsMemo]);
  const callback = React.useCallback<FetchStateCallbackPromise<OllamaModel[]>>(
    (opts) => listModels(opts),
    [listModels],
  );
  return useFetchState(callback, [], { initialPromisePurity: true });
};

export default useModels;
