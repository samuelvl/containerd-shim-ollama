import React from 'react';
import { Divider } from '@patternfly/react-core';
import ApplicationsPage from '~/shared/components/ApplicationsPage';
import { isMUITheme } from '~/shared/utilities/const';
import TitleWithIcon from '~/shared/components/design/TitleWithIcon';
import { ProjectObjectType } from '~/shared/components/design/utils';

type ChatProps = Omit<
  React.ComponentProps<typeof ApplicationsPage>,
  | 'title'
  | 'description'
  | 'loadError'
  | 'loaded'
  | 'provideChildrenPadding'
  | 'removeChildrenTopPadding'
  | 'headerContent'
>;

const Chat: React.FC<ChatProps> = ({ ...pageProps }) => (
  <ApplicationsPage
    {...pageProps}
    title={
      !isMUITheme() ? <TitleWithIcon title="Chat" objectType={ProjectObjectType.model} /> : 'Chat'
    }
    description={
      !isMUITheme() ? (
        'You can start a chat with a model by selecting it from the list. You can also create a new chat session by clicking on the "New Chat" button.'
      ) : (
        <Divider />
      )
    }
    loaded
    provideChildrenPadding
    removeChildrenTopPadding
  />
);

export default Chat;
