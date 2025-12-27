import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TEST_CAMERA from "./components/camera/TestCamera.jsx";
import PrivacyPolicy from "./pages/privacy_policy/PrivacyPolicy.jsx";
import DataDeletion from "./pages/data_deletion/DataDeletion.jsx";
import Terms from "./pages/terms/Terms.jsx";

const routes = createBrowserRouter([
    { path: "/", element: <TEST_CAMERA /> },
    { path: "/privacy-policy", element: <PrivacyPolicy /> },
    { path: "/terms", element: <Terms /> },
    { path: "/data-deletion", element: <DataDeletion /> },
]);
export default function App() {
    return (
        <RouterProvider router={routes} />
    );
}

