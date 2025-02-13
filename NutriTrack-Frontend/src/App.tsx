import './App.css'
import { Route, Routes } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import HomePage from "./Pages/HomePage";
import Navbar from "./Components/Sections/Navbar";
import HistoricalViewPage from './Pages/HistoricalViewPage';
import SignInSide from './Pages/SignInSide';
//import SignUp from './Pages/SignUp'; 

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
			</Routes>
		</Box>
    </>
    
  )
}

export default App
