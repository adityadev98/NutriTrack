import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.tsx'

import { Provider } from "@/Components/ui/provider"
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Provider>
				<App />
			</Provider>
		</BrowserRouter>
	</React.StrictMode>
);