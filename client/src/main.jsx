import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import store from './redux/store';
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ReduxProvider store={store} >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ReduxProvider>
);
