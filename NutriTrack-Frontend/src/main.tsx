import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.tsx'

import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<ChakraProvider>
				<UserProvider>
					<App />
				</UserProvider>
			</ChakraProvider>
		</BrowserRouter>
	</React.StrictMode>
);