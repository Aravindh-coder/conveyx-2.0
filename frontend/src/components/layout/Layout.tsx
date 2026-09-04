import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';
import { VoiceAssistant } from '../common/VoiceAssistant';
import { AiCopilotWidget } from '../common/AiCopilotWidget';

export const Layout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-tech-grid">
          <Outlet />
        </main>
      </div>

      {/* Global AI Audio Voice Assistant */}
      <VoiceAssistant />

      {/* Global AI Copilot Industrial Chatbot */}
      <AiCopilotWidget />
    </div>
  );
};
