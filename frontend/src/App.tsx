import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TelemetryProvider } from './context/TelemetryContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
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
import { IncidentsPage } from './pages/IncidentsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { EventsPage } from './pages/EventsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { DevicesPage } from './pages/DevicesPage';
import { SosPage } from './pages/SosPage';
import { CompanyPage } from './pages/CompanyPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';
import { JudgeDemoPage } from './pages/DemoBenchPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <TelemetryProvider>
            <Routes>
            {/* Unified Landing Page with embedded login & demo access */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Authenticated Dashboard Shell Layout */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/live-monitoring" element={<LiveMonitoringPage />} />
              
              {/* Conveyors Routes */}
              <Route path="/conveyor" element={<ConveyorListPage />} />
              <Route path="/conveyors" element={<ConveyorListPage />} />
              <Route path="/conveyor/:id" element={<ConveyorDetailPage />} />
              <Route path="/conveyors/:id" element={<ConveyorDetailPage />} />
              <Route path="/conveyors/:id/live" element={<LiveMonitoringPage />} />
              <Route path="/conveyors/:id/health" element={<PredictionPage />} />
              <Route path="/conveyors/:id/sensors" element={<SensorsHubPage />} />
              <Route path="/conveyors/:id/vision" element={<VisionPage />} />
              <Route path="/conveyors/:id/alerts" element={<AlertsPage />} />
              <Route path="/conveyors/:id/events" element={<EventsPage />} />
              <Route path="/conveyors/:id/maintenance" element={<MaintenancePage />} />

              {/* Sensors & Prediction */}
              <Route path="/sensors" element={<SensorsHubPage />} />
              <Route path="/sensors/vibration" element={<SensorVibrationPage />} />
              <Route path="/sensors/current" element={<SensorCurrentPage />} />
              <Route path="/sensors/alignment" element={<SensorAlignmentPage />} />
              <Route path="/prediction" element={<PredictionPage />} />
              <Route path="/vision" element={<VisionPage />} />

              {/* Operations, Incidents, Reports */}
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/reports" element={<ReportsPage />} />

              {/* Devices, SOS, Company, Settings, Profile */}
              <Route path="/digital-twin" element={<DigitalTwinPage />} />
              <Route path="/devices" element={<DevicesPage />} />
              <Route path="/device-health" element={<DevicesPage />} />
              <Route path="/sos" element={<SosPage />} />
              <Route path="/company" element={<CompanyPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/demo" element={<JudgeDemoPage />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TelemetryProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
  );
};
