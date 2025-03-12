import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.tsx'

import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
			<BrowserRouter>
				<ChakraProvider>
					<UserProvider>
						<App />
					</UserProvider>
				</ChakraProvider>
			</BrowserRouter>
		</GoogleOAuthProvider>
	</React.StrictMode>
);