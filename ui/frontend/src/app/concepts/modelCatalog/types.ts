import { APIOptions } from '~/shared/api/types';

export type BaseModel = {
  catalog?: string;
  repository?: string;
  name?: string;
};

export enum ArtifactsProtocol {
  OCI = 'oci',
}

export type CatalogArtifacts = {
  protocol?: ArtifactsProtocol;
  createTimeSinceEpoch?: number;
  tags?: string[];
  uri?: string;
};

export type CatalogModel = {
  repository: string;
  name: string;
  provider?: string;
  description?: string;
  longDescription?: string;
  logo?: string;
  readme?: string;
  language?: string[];
  license?: string;
  licenseLink?: string;
  maturity?: string;
  libraryName?: string;
  baseModel?: BaseModel[];
  labels?: string[];
  tasks?: string[];
  createTimeSinceEpoch?: number;
  lastUpdateTimeSinceEpoch?: number;
  artifacts?: CatalogArtifacts[];
  status: CatalogModelDeploymentStatus;
};

export enum CatalogModelDeploymentStatus {
  DEPLOYED = 'deployed',
  UNDEPLOYED = 'undeployed',
  PENDING = 'pending',
  ERROR = 'error',
}

export type ModelCatalogSource = {
  source: string;
  models: CatalogModel[];
};

export type PatchModel = (
  opts: APIOptions,
  data: Partial<CatalogModel>,
  registeredModelId: string,
) => Promise<CatalogModel>;

export type GetModel = (opts: APIOptions, registeredModelId: string) => Promise<ModelCatalogSource>;
