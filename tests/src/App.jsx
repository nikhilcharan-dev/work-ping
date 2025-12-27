import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TEST_CAMERA from "./components/camera/TestCamera.jsx";
import PrivacyPolicy from "./pages/privacy_policy/PrivacyPolicy.jsx";

const routes = createBrowserRouter([
    { path: "/", element: <TEST_CAMERA /> },
    { path: "/privacy-policy", element: <PrivacyPolicy /> },
])

export default function App() {
    return (
        <RouterProvider router={routes} />
    );
}

