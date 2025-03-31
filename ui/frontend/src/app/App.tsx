import * as React from 'react';
import '@patternfly/patternfly/patternfly.min.css';
import '@patternfly/patternfly/patternfly-addons.css';
import '@patternfly/patternfly/patternfly-charts.css';
import '@patternfly/chatbot/dist/css/main.css';
import '~/shared/style/MUI-theme.scss';
import './app.css';
import {
  Alert,
  Bullseye,
  Button,
  Page,
  PageSection,
  PageSidebar,
  Spinner,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import ToastNotifications from '~/shared/components/ToastNotifications';
import { useSettings } from '~/shared/hooks/useSettings';
import { isMUITheme, Theme, AUTH_HEADER, MOCK_AUTH, isStandalone } from '~/shared/utilities/const';
import { logout } from '~/shared/utilities/appUtils';
import { NamespaceSelectorContext } from '~/shared/context/NamespaceSelectorContext';
import NavSidebar from './NavSidebar';
import AppRoutes from './AppRoutes';
import { AppContext } from './AppContext';
import NavBar from './NavBar';
import { ChatContextProvider } from './concepts/chat/ChatContext';

const App: React.FC = () => {
  const {
    configSettings,
    userSettings,
    loaded: configLoaded,
    loadError: configError,
  } = useSettings();

  const { namespacesLoaded, namespacesLoadError, initializationError } =
    React.useContext(NamespaceSelectorContext);

  const username = userSettings?.userId;

  React.useEffect(() => {
    // Apply the theme based on the value of STYLE_THEME
    if (isMUITheme()) {
      document.documentElement.classList.add(Theme.MUI);
    } else {
      document.documentElement.classList.remove(Theme.MUI);
    }
  }, []);

  React.useEffect(() => {
    if (MOCK_AUTH && username) {
      localStorage.setItem(AUTH_HEADER, username);
    } else {
      localStorage.removeItem(AUTH_HEADER);
    }
  }, [username]);

  const contextValue = React.useMemo(
    () =>
      configSettings && userSettings
        ? {
            config: configSettings!,
            user: userSettings!,
          }
        : null,
    [configSettings, userSettings],
  );

  const error = configError || namespacesLoadError || initializationError;

  const sidebar = <PageSidebar isSidebarOpen={false} />;

  // We lack the critical data to startup the app
  if (error) {
    // There was an error fetching critical data
    return (
      <Page sidebar={sidebar}>
        <PageSection>
          <Stack hasGutter>
            <StackItem>
              <Alert variant="danger" isInline title="General loading error">
                <p>
                  {configError?.message ||
                    namespacesLoadError?.message ||
                    initializationError?.message ||
                    'Unknown error occurred during startup'}
                </p>
                <p>Logging out and logging back in may solve the issue</p>
              </Alert>
            </StackItem>
            <StackItem>
              <Button
                variant="secondary"
                onClick={() => logout().then(() => window.location.reload())}
              >
                Logout
              </Button>
            </StackItem>
          </Stack>
        </PageSection>
      </Page>
    );
  }

  // Waiting on the API to finish
  const loading =
    !configLoaded || !userSettings || !configSettings || !contextValue || !namespacesLoaded;

  return loading ? (
    <Bullseye>
      <Spinner />
    </Bullseye>
  ) : (
    <AppContext.Provider value={contextValue}>
      <ChatContextProvider>
        <Page
          mainContainerId="primary-app-container"
          masthead={
            isStandalone() ? (
              <NavBar
                username={username}
                onLogout={() => {
                  logout().then(() => window.location.reload());
                }}
              />
            ) : (
              ''
            )
          }
          isManagedSidebar={isStandalone()}
          sidebar={isStandalone() ? <NavSidebar /> : sidebar}
        >
          <AppRoutes />
          <ToastNotifications />
        </Page>
      </ChatContextProvider>
    </AppContext.Provider>
  );
};

export default App;
