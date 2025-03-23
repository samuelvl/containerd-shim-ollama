import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import '~/shared/style/MUI-theme.scss';
import Models from './screens/Models';

const ModelRoutes: React.FC = () => (
  <Routes>
    <Route path={'/:models?/*'} element={<Models empty={false} />}>
      <Route index element={<Models empty={false} />} />
      <Route path="*" element={<Navigate to="." />} />
    </Route>
  </Routes>
);

export default ModelRoutes;
