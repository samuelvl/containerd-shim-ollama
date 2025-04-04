import { CatalogModel } from '~/app/concepts/modelCatalog/types';
import { ModelDetailsRouteParams } from './const';
import { encodeParams, getTagFromModel } from './utils';

export const modelUrl = (): string => `/ollama`;

export const modelDetailsUrl = (params: ModelDetailsRouteParams): string => {
  const { sourceName = '', repositoryName = '', modelName = '', tag = '' } = encodeParams(params);
  return `${modelUrl()}/${sourceName}/${repositoryName}/${modelName}/${tag}`;
};

export const modelDetailsUrlFromModel = (model: CatalogModel, source: string): string =>
  modelDetailsUrl({
    sourceName: source,
    repositoryName: model.repository,
    modelName: model.name,
    tag: getTagFromModel(model),
  });

export const registerCatalogModel = (params: ModelDetailsRouteParams): string =>
  `${modelDetailsUrl(params)}/register`;
