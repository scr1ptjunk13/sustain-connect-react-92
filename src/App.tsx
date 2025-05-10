
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import UserSelectionScreen from "./pages/UserSelectionScreen";
import RegistrationScreen from "./pages/RegistrationScreen";
import LoginScreen from "./pages/LoginScreen";
import PasswordRecoveryScreen from "./pages/PasswordRecoveryScreen";
import NotFound from "./pages/NotFound";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
