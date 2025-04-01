import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import NotFound from '~/shared/components/notFound/NotFound';
import ModelRegistrySettingsRoutes from './pages/settings/AdminSettingRoutes';

import useUser from './hooks/useUser';
import ChatRoutes from './pages/chat/ChatRoutes';
import ModelCatalogRoutes from './pages/models/ModelCatalogRoutes';

export const isNavDataGroup = (navItem: NavDataItem): navItem is NavDataGroup =>
  'children' in navItem;

type NavDataCommon = {
  label: string;
};

export type NavDataHref = NavDataCommon & {
  path: string;
};

export type NavDataGroup = NavDataCommon & {
  children: NavDataHref[];
};

type NavDataItem = NavDataHref | NavDataGroup;

export const useAdminSettings = (): NavDataItem[] => {
  const { clusterAdmin } = useUser();

  if (!clusterAdmin) {
    return [];
  }

  return [
    {
      label: 'Settings',
      children: [{ label: 'Admin Page', path: '/admin-settings' }],
    },
  ];
};

export const useNavData = (): NavDataItem[] => [
  {
    label: 'Models',
    path: '/models',
  },
  // {
  //   label: 'Chat',
  //   path: '/chat',
  // },
  ...useAdminSettings(),
];

const AppRoutes: React.FC = () => {
  const { clusterAdmin } = useUser();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/ollama" replace />} />
      <Route path="/ollama/*" element={<ModelCatalogRoutes />} />
      {/* <Route path="/chat/*" element={<ChatRoutes />} /> */}
      <Route path="*" element={<NotFound />} />
      {/* TODO: [Conditional render] Follow up add testing and conditional rendering when in standalone mode*/}
      {clusterAdmin && <Route path="/admin-settings/*" element={<ModelRegistrySettingsRoutes />} />}
    </Routes>
  );
};

export default AppRoutes;
