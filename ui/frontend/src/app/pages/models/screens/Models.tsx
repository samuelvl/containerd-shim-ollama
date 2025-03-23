import React from 'react';
import { Divider } from '@patternfly/react-core';
import ApplicationsPage from '~/shared/components/ApplicationsPage';
import { isMUITheme } from '~/shared/utilities/const';
import TitleWithIcon from '~/shared/components/design/TitleWithIcon';
import { ProjectObjectType } from '~/shared/components/design/utils';

type ModelsProps = Omit<
  React.ComponentProps<typeof ApplicationsPage>,
  | 'title'
  | 'description'
  | 'loadError'
  | 'loaded'
  | 'provideChildrenPadding'
  | 'removeChildrenTopPadding'
  | 'headerContent'
>;

const Models: React.FC<ModelsProps> = ({ ...pageProps }) => (
  <ApplicationsPage
    {...pageProps}
    title={
      !isMUITheme() ? (
        <TitleWithIcon title="Model Catalog" objectType={ProjectObjectType.registeredModels} />
      ) : (
        'Model Catalog'
      )
    }
    description={
      !isMUITheme() ? (
        'Select a model from the list to deploy it in a cluster and start a new prompt session.'
      ) : (
        <Divider />
      )
    }
    loaded
    provideChildrenPadding
    removeChildrenTopPadding
  />
);

export default Models;
