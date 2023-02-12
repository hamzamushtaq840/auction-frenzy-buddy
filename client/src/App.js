import './App.css';
import { Route, Routes } from 'react-router-dom';
import Auth from './Components/Auth/Auth';
import Layout from './Components/Layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VerifyEmail from './Components/Auth/VerifyEmail';
import AdminDashboard from './Components/Dashboard/AdminDashboard';
import UserDashboard from './Components/Dashboard/UserDashboard';
import RequireAuth from './Components/Layout/RequireAuth';
import AdminNavbar from './Components/Navbar/AdminNavbar'
import UserNavbar from './Components/Navbar/UserNavbar'
import Missing from './Components/Layout/Missing';
import Unauthorized from './Components/Layout/Unauthorized';
import Sell from './Components/Sell/Sell';
import Sellitem from './Components/Sell/Sellitem';
import Selledit from './Components/Sell/Selledit';
import BidDetails from './Components/Dashboard/BidDetails';
import Profile from './Components/Profile/Profile';
import Notification from './Components/Notifications/Notifications';


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />} >

          {/* Public routes */}
          <Route path="/" element={<Auth />} />
          <Route path="/emailVerification/:id" element={<VerifyEmail />} />

          <Route element={<RequireAuth allowedRoles={'admin'} />}>
            <Route path="AdminDashboard" element={<AdminNavbar><AdminDashboard /></AdminNavbar>} />
          </Route>

          <Route element={<RequireAuth allowedRoles={'user'} />}>
            <Route path="UserDashboard" element={<UserNavbar><UserDashboard /></UserNavbar>} />
            <Route path="Sell" element={<UserNavbar><Sell /></UserNavbar>} />
            <Route path="Sellitem" element={<UserNavbar><Sellitem /></UserNavbar>} />
            <Route path="Selledit" element={<UserNavbar><Selledit /></UserNavbar>} />
            <Route path="BidDetails" element={<UserNavbar><BidDetails /></UserNavbar>} />
            <Route path="Profile" element={<UserNavbar><Profile /></UserNavbar>} />
            <Route path="Notification" element={<UserNavbar><Notification /></UserNavbar>} />
          </Route>

        </Route>

        <Route path="*" element={<Missing />} />
        <Route path="Unauthorized" element={<Unauthorized />} />

      </Routes>
      <ToastContainer autoClose={2000} />


    </>
  );
}

export default App;
