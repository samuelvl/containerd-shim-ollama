import * as React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import AdminSettings from './AdminSettings';

const AdminSettingRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<AdminSettings />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AdminSettingRoutes;
