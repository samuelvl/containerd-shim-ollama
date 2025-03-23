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
        <TitleWithIcon title="ModelS" objectType={ProjectObjectType.registeredModels} />
      ) : (
        'Models'
      )
    }
    description={!isMUITheme() ? 'Select a model. Models ....' : <Divider />}
    loaded
    provideChildrenPadding
    removeChildrenTopPadding
  />
);

export default Models;
