import './App.css'
import { Route, Routes } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import {Navbar} from "./Components/Sections";
import {HomePage, HistoricalViewPage,SignInSide} from "./Pages"
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
