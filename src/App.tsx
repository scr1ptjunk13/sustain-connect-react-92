
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import SplashScreen from "./pages/SplashScreen";
import UserSelectionScreen from "./pages/UserSelectionScreen";
import RegistrationScreen from "./pages/RegistrationScreen";
import LoginScreen from "./pages/LoginScreen";
import PasswordRecoveryScreen from "./pages/PasswordRecoveryScreen";
import NotFound from "./pages/NotFound";
import SecurityCompliance from "./pages/SecurityCompliance";

// Donor Module Screens
import DonorDashboard from "./pages/donor/DonorDashboard";
import CreateDonation from "./pages/donor/CreateDonation";
import LocationPickupDetails from "./pages/donor/LocationPickupDetails";
import DonationReviewSubmit from "./pages/donor/DonationReviewSubmit";
import DonationStatus from "./pages/donor/DonationStatus";
import DonationHistory from "./pages/donor/DonationHistory";
import ImpactDashboard from "./pages/donor/ImpactDashboard";
import DonorProfile from "./pages/donor/DonorProfile";

// NGO Module Screens
import NgoDashboard from "./pages/ngo/NgoDashboard";
import AvailableDonations from "./pages/ngo/AvailableDonations";
import DonationDetails from "./pages/ngo/DonationDetails";
import PickupAssignment from "./pages/ngo/PickupAssignment";
import ActivePickups from "./pages/ngo/ActivePickups";
import DistributionManagement from "./pages/ngo/DistributionManagement";
import AnalyticsReporting from "./pages/ngo/AnalyticsReporting";
import NgoProfile from "./pages/ngo/NgoProfile";

// Delivery Module Screens
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import AvailableDeliveries from "./pages/delivery/AvailableDeliveries";
import DeliveryDetails from "./pages/delivery/DeliveryDetails";
import NavigationScreen from "./pages/delivery/NavigationScreen";
import PickupConfirmation from "./pages/delivery/PickupConfirmation";
import InTransit from "./pages/delivery/InTransit";
import DeliveryConfirmation from "./pages/delivery/DeliveryConfirmation";
import DeliveryHistory from "./pages/delivery/DeliveryHistory";
import ActiveDeliveries from "./pages/delivery/ActiveDeliveries";
import DeliveryProfile from "./pages/delivery/DeliveryProfile";

// Admin Module Screens
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagementPage from "./pages/admin/UserManagementPage";
import SystemMonitoringPage from "./pages/admin/SystemMonitoringPage";
import BackupRecoveryPage from "./pages/admin/BackupRecoveryPage";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/select-role" element={<UserSelectionScreen />} />
            <Route path="/register" element={<RegistrationScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/recover-password" element={<PasswordRecoveryScreen />} />
            <Route path="/security" element={<SecurityCompliance />} />
            
            {/* Donor Module Routes */}
            <Route path="/donor/dashboard" element={<DonorDashboard />} />
            <Route path="/donor/create-donation" element={<CreateDonation />} />
            <Route path="/donor/location-pickup" element={<LocationPickupDetails />} />
            <Route path="/donor/review-submit" element={<DonationReviewSubmit />} />
            <Route path="/donor/donation-status/:id" element={<DonationStatus />} />
            <Route path="/donor/donation-history" element={<DonationHistory />} />
            <Route path="/donor/impact" element={<ImpactDashboard />} />
            <Route path="/donor/profile" element={<DonorProfile />} />
            
            {/* NGO Module Routes */}
            <Route path="/ngo/dashboard" element={<NgoDashboard />} />
            <Route path="/ngo/available-donations" element={<AvailableDonations />} />
            <Route path="/ngo/donation-details/:id" element={<DonationDetails />} />
            <Route path="/ngo/pickup-assignment/:id" element={<PickupAssignment />} />
            <Route path="/ngo/active-pickups" element={<ActivePickups />} />
            <Route path="/ngo/distribution" element={<DistributionManagement />} />
            <Route path="/ngo/analytics" element={<AnalyticsReporting />} />
            <Route path="/ngo/profile" element={<NgoProfile />} />
            
            {/* Delivery Module Routes */}
            <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
            <Route path="/delivery/available" element={<AvailableDeliveries />} />
            <Route path="/delivery/active" element={<ActiveDeliveries />} />
            <Route path="/delivery/details/:id" element={<DeliveryDetails />} />
            <Route path="/delivery/navigation/:id" element={<NavigationScreen />} />
            <Route path="/delivery/pickup-confirmation/:id" element={<PickupConfirmation />} />
            <Route path="/delivery/in-transit/:id" element={<InTransit />} />
            <Route path="/delivery/delivery-confirmation/:id" element={<DeliveryConfirmation />} />
            <Route path="/delivery/history" element={<DeliveryHistory />} />
            <Route path="/delivery/profile" element={<DeliveryProfile />} />
            
            {/* Admin Module Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/monitoring" element={<SystemMonitoringPage />} />
            <Route path="/admin/backup" element={<BackupRecoveryPage />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
