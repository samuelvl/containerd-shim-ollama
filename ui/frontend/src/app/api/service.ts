import { assembleModularArchBody, isModArchResponse, restCREATE } from '~/shared/api/apiUtils';
import { APIOptions } from '~/shared/api/types';
import { handleRestFailures } from '~/shared/api/errorUtils';
import { GenerateRequest, GenerateResponse } from '../concepts/chat/types';

export const generate =
  (hostPath: string, queryParams: Record<string, unknown> = {}) =>
  (opts: APIOptions, modelPath: string ,data: GenerateRequest): Promise<GenerateResponse> =>
    handleRestFailures(
      restCREATE(hostPath, `/generate/${modelPath}`, assembleModularArchBody(data), queryParams, opts),
    ).then((response) => {
      if (isModArchResponse<GenerateResponse>(response)) {
        return response.data;
      }
      throw new Error('Invalid response format');
    });
