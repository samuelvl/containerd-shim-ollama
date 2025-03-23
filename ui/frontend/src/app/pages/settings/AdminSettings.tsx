import React from 'react';
import { Divider } from '@patternfly/react-core';
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
    description={!isMUITheme() ? 'Manage settings about ollama models.' : <Divider />}
    errorMessage="Unable to load settings"
  />
);

export default AdminSettings;
