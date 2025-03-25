import * as React from 'react';
import { Outlet } from 'react-router';
import { ModelCatalogContextProvider } from '~/app/concepts/modelCatalog/context/ModelCatalogContext';

const ModelCatalogCoreLoader: React.FC = () => (
  <ModelCatalogContextProvider>
    <Outlet />
  </ModelCatalogContextProvider>
);

export default ModelCatalogCoreLoader;
