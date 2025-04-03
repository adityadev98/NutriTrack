import './App.css'
import { Route, Routes } from "react-router-dom";
import {
  HomePage,
  Features, 
  Pricing, 
  FAQ, 
  Testimonials, 
  AboutUs,
  ContactUs,
  TermsAndConditions,
  Login,
  ResetPassword,
  OtpVerification,
  ProfileSetup, 
  Dashboard, 
  TrackPage, 
  MealsConsumedPage, 
  CreateCustomFoodPage,
  TrackCustomFoodPage, 
  BookCoach,
  DailyDashboardPage, 
  HistoricalViewPage,
  AdminDashboard,
  NotFound,
  CoachDashboard,
  RecipePage,
} from "./Pages"

import { ProtectedRoute, AdminRoute, PublicRoute, CoachRoute } from "./Routes"

function App() {

  return (
    <>
      <div>
			<Routes>
        {/* Public Routes */}
				<Route path='/' element={<HomePage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/features' element={<Features />} />
        <Route path='/pricing' element={<Pricing />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/testimonials' element={<Testimonials />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/terms' element={<TermsAndConditions />} />

        {/* Public Routes (Blocked for Logged-In Users) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} /> 
        </Route>

         {/* Protected Routes for Logged-in Users */}
         <Route element={<ProtectedRoute />}>
            {/* ✅ OTP Verification Page (Accessible to unverified users) */}
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/mealsConsumed" element={<MealsConsumedPage />} />
            <Route path="/customFood" element={<CreateCustomFoodPage />} />
            <Route path="/trackCustomFood" element={<TrackCustomFoodPage />} />
            <Route path="/book-coach" element={<BookCoach />} />
            <Route path="/dailydashboard" element={<DailyDashboardPage />} />
            <Route path='/historical' element={<HistoricalViewPage />} />
            <Route path='/recipe' element={<RecipePage />} />
          </Route>

        {/* Admin-only Routes */}
        <Route element={<AdminRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        {/* ✅ Coach-only Routes */}
        <Route element={<CoachRoute />}>
            <Route path="/coach-dashboard" element={<CoachDashboard />} />
        </Route>

          {/* 404 Page Route */}
          <Route path="*" element={<NotFound />} />
			</Routes>
		</div>
    </>
    
  )
}

export default App
