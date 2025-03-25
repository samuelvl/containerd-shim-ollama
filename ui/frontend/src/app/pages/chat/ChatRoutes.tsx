import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Chat from './screens/Chat';

const ChatRoutes: React.FC = () => (
  <Routes>
    <Route path={'/:models?/*'} element={<Chat empty={false} />}>
      <Route index element={<Chat empty={false} />} />
      <Route path="*" element={<Navigate to="." />} />
    </Route>
  </Routes>
);

export default ChatRoutes;
