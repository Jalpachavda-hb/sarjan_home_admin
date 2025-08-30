import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./pages/Privateroute";
import SignIn from "./pages/AuthPages/SignIn";
import Allfile from "./Allfile";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
    <ToastContainer
        position="top-right"
        autoClose={3000} // closes after 3s
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      
        
      />
    <Routes>
      
      {/* Public Route */}
      <Route path="/admin/login" element={<SignIn />} />

      {/* Protected Route */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute>
            <Allfile />
          </PrivateRoute>
        }
      />

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
    </>
  );
}

export default App;
