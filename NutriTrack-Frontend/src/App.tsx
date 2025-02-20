import './App.css'
import { Route, Routes } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import {Navbar} from "./Components/Sections";
import {HomePage, HistoricalViewPage,SignInSide, TrackPage} from "./Pages"
import DailyDashboardPage from './Pages/DailyDashboardPage';
import MealsConsumedPage from './Pages/MealConsumedPage';
import CreateCustomFoodPage from './Pages/CreateCustomFoodPage';
function App() {

  return (
    <>
      <Box minH={"100vh"} className="bg-primary w-full overflow-hidden">
			<Navbar />
			<Routes>
				<Route path='/' element={<HomePage />} />
        <Route path='/sign-in' element={<SignInSide />} />
        {/* <Route path='/sign-up' element={<SignUp />} /> */}
        <Route path='/historical' element={<HistoricalViewPage />} />
        <Route path='/dailydashboard' element={<DailyDashboardPage />} />
        <Route path='/track' element={< TrackPage/>} />
        <Route path='/mealsConsumed' element={< MealsConsumedPage/>} />
        <Route path='/customFood' element={<CreateCustomFoodPage />} />
			</Routes>
		</Box>
    </>
    
  )
}

export default App
