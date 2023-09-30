import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import BaseSection from './Components/Base'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Pages/HomePage";
import Login from "./Pages/LoginPage"
import SignUp from "./Pages/SignUpPage";
import About from "./Pages/AboutPage"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoutes from './Components/PrivateRoutes';
import ProfileInfo from './Pages/PrivatePages/ProfileInfo';
import UserProvider from './Context/userProvider';
import UserProviderR from './Context/userProviderR';
import HomeLoginPage from './Pages/PrivatePages/HomeLoginPage';
import RentPage from './Pages/PrivatePages/RentPage';
import ElectricityPage from './Pages/PrivatePages/ElectricityPage';
import TenantPage from './Pages/PrivatePages/TenantPage';
import TenantDetails from './Pages/PrivatePages/TenantDetails';
import DownloadPage from './Pages/PrivatePages/DownloadPage';

function App() {
  return (
    <UserProvider>
      <UserProviderR>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path='/user' element={<PrivateRoutes />} >
              <Route path="profile-info" element={<ProfileInfo />} />
              <Route path="home" element={<HomeLoginPage />} />
              <Route path="rent" element={<RentPage />} />
              <Route path="electricity" element={<ElectricityPage />} />
              <Route path="tenant" element={<TenantPage />} />
              <Route path="download/:back/:id/month/:month/year/:year/receipt" element={<DownloadPage />} />
              <Route path="tenant/details/:id" element={<TenantDetails />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProviderR>
    </UserProvider>
  );
}

export default App;
