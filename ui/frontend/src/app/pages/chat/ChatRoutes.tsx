import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ChatContextProvider } from '~/app/concepts/chat/ChatContext';
import Chat from './screens/Chat';

const ChatRoutes: React.FC = () => (
  <ChatContextProvider>
    <Routes>
      <Route path={'/:models?/*'} element={<Chat empty={false} />}>
        <Route index element={<Chat empty={false} />} />
        <Route path="*" element={<Navigate to="." />} />
      </Route>
    </Routes>
  </ChatContextProvider>
);

export default ChatRoutes;
