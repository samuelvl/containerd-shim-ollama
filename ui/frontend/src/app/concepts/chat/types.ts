import { APIOptions } from '~/shared/api/types';

export type GenerateRequestOptions = {
  temperature?: number;
  [key: string]: unknown;
};

export type GenerateRequest = {
  model: string;
  prompt: string;
  suffix?: string;
  images?: string[];
  format?: 'json' | string;
  options?: GenerateRequestOptions;
  system?: string;
  template?: string;
  stream?: boolean;
  raw?: boolean;
  keep_alive?: string;
  context?: number[];
};

export type GenerateResponse = {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
};

export type GenerateAPI = (
  opts: APIOptions,
  data: GenerateRequest,
  onResponse?: (response: GenerateResponse) => void,
) => Promise<GenerateResponse>;

export type OllamaModelAPIs = {
  generate: GenerateAPI;
};
