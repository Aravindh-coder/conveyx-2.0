import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TelemetryProvider } from './context/TelemetryContext';
import { Layout } from './components/layout/Layout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { ConveyorListPage } from './pages/ConveyorListPage';
import { ConveyorDetailPage } from './pages/ConveyorDetailPage';
import { SensorsHubPage } from './pages/SensorsHubPage';
import { SensorVibrationPage } from './pages/SensorVibrationPage';
import { SensorCurrentPage } from './pages/SensorCurrentPage';
import { SensorAlignmentPage } from './pages/SensorAlignmentPage';
import { PredictionPage } from './pages/PredictionPage';
import { VisionPage } from './pages/VisionPage';
import { AlertsPage } from './pages/AlertsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { EventsPage } from './pages/EventsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { DevicesPage } from './pages/DevicesPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';
import { SihJudgeDemoPage } from './pages/SihJudgeDemoPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TelemetryProvider>
          <Routes>
            {/* Public Landing & Login */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated Dashboard Shell Layout */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/live-monitoring" element={<LiveMonitoringPage />} />
              <Route path="/conveyor" element={<ConveyorListPage />} />
              <Route path="/conveyor/:id" element={<ConveyorDetailPage />} />
              <Route path="/sensors" element={<SensorsHubPage />} />
              <Route path="/sensors/vibration" element={<SensorVibrationPage />} />
              <Route path="/sensors/current" element={<SensorCurrentPage />} />
              <Route path="/sensors/alignment" element={<SensorAlignmentPage />} />
              <Route path="/prediction" element={<PredictionPage />} />
              <Route path="/vision" element={<VisionPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/digital-twin" element={<DigitalTwinPage />} />
              <Route path="/devices" element={<DevicesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/demo" element={<SihJudgeDemoPage />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </TelemetryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
