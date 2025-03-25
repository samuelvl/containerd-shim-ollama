import * as React from 'react';
import { Divider, PageSection } from '@patternfly/react-core';
import ApplicationsPage from '~/shared/components/ApplicationsPage';
import TitleWithIcon from '~/shared/components/design/TitleWithIcon';
import { ProjectObjectType } from '~/shared/components/design/utils';
import EmptyModelCatalogState from '~/app/pages/models/EmptyModelCatalogState';
import { ModelCatalogContext } from '~/app/concepts/modelCatalog/context/ModelCatalogContext';
import { ModelCatalogCards } from '~/app/pages/models/components/ModelCatalogCards';
import { isMUITheme } from '~/shared/utilities/const';

const ModelCatalog: React.FC = () => {
  const { modelCatalogSources } = React.useContext(ModelCatalogContext);

  return (
    <ApplicationsPage
      title={
        !isMUITheme() ? (
          <TitleWithIcon title="Available models" objectType={ProjectObjectType.modelCatalog} />
        ) : (
          'Available models'
        )
      }
      description={!isMUITheme() ? 'Discover and manage models from various sources.' : <Divider />}
      empty={modelCatalogSources.data.length === 0}
      emptyStatePage={
        <EmptyModelCatalogState
          testid="empty-model-catalog-state"
          title="No model sources available"
          description="Model sources not found. Please check your configuration."
        />
      }
      headerContent={null}
      loaded={modelCatalogSources.loaded}
      loadError={modelCatalogSources.error}
      errorMessage="Unable to load model catalog"
      provideChildrenPadding
    >
      <PageSection isFilled>
        <ModelCatalogCards sources={modelCatalogSources.data} />
      </PageSection>
    </ApplicationsPage>
  );
};

export default ModelCatalog;
