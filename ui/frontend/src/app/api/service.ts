import { GenerateRequest, GenerateResponse } from '~/app/types';
import { assembleModularArchBody, isModArchResponse, restCREATE } from '~/shared/api/apiUtils';
import { APIOptions } from '~/shared/api/types';
import { handleRestFailures } from '~/shared/api/errorUtils';

export const generate =
  (hostPath: string, queryParams: Record<string, unknown> = {}) =>
  (opts: APIOptions, data: GenerateRequest): Promise<GenerateResponse> =>
    handleRestFailures(
      restCREATE(hostPath, `api/generate`, assembleModularArchBody(data), queryParams, opts),
    ).then((response) => {
      if (isModArchResponse<GenerateResponse>(response)) {
        return response.data;
      }
      throw new Error('Invalid response format');
    });
