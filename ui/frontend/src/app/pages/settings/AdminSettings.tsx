import React from 'react';
import { Divider, EmptyState, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import ApplicationsPage from '~/shared/components/ApplicationsPage';
import { isMUITheme } from '~/shared/utilities/const';
import TitleWithIcon from '~/shared/components/design/TitleWithIcon';
import { ProjectObjectType } from '~/shared/components/design/utils';

const AdminSettings: React.FC = () => (
  <ApplicationsPage
    title={
      !isMUITheme() ? (
        <TitleWithIcon
          title="Admin Settings"
          objectType={ProjectObjectType.modelRegistrySettings}
        />
      ) : (
        'Admin Settings'
      )
    }
    loaded
    empty
    description={!isMUITheme() ? 'Manage settings about deployments.' : <Divider />}
    errorMessage="Unable to load model registries."
    emptyStatePage={
      <EmptyState
        headingLevel="h5"
        icon={PlusCircleIcon}
        titleText="No model registries"
        variant={EmptyStateVariant.lg}
        data-testid="mr-settings-empty-state"
      >
        <EmptyStateBody>TBD</EmptyStateBody>
      </EmptyState>
    }
    provideChildrenPadding
  />
);

export default AdminSettings;
