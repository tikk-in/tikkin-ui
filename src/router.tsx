import LoginPage from "./pages/login/Login.tsx";
import MainPage from "./pages/main/MainPage.tsx";
import PrivateRoute from "./hooks/PrivateRoute.tsx";
import {createBrowserRouter, Navigate} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login"/>,
  },
  {
    path: "/login",
    element: <LoginPage isSignUp={false}/>,
  },
  {
    path: "/signup",
    element: <LoginPage isSignUp={true}/>,
  },
  {
    path: "/main",
    element: (
      <PrivateRoute>
        <MainPage/>
      </PrivateRoute>),
  },
]);

export default router;
