import './App.css'
import { Route, Routes } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import HomePage from "./Pages/HomePage";
import Navbar from "./Components/Sections/Navbar";
import HistoricalViewPage from './Pages/HistoricalViewPage';

function App() {

  return (
    <>
      <Box minH={"100vh"}>
			<Navbar />
			<Routes>
				<Route path='/' element={<HomePage />} />
        <Route path='/historical' element={<HistoricalViewPage />} />
			</Routes>
		</Box>
    </>
    
  )
}

export default App
