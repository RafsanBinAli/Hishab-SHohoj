import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar/Navbar";
import NewDeal from "./components/Farmer/Farmer";
import CardDetail from "./components/CardDetail/CardDetail";
import DokanCardDetails from "./components/DokanCardDetails/DokanCardDetails";
import Borrowed from "./components/Borrowed/Borrowed";
import NewDokan2 from "./components/NewDokan2/NewDokan2";
import DokanerSlip from "./components/DokanerSlip/DokanerSLip";
import SlipDetails from "./components/SlipDetails/SlipDetails";
import SlipTable from "./components/SlipTable/SLipTable";
import DailyTransaction from "./components/DailyTransaction/DailyTransaction";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import DharDetails from "./components/DharDetails/DharDetails";
import Farmer from "./components/Farmer/Farmer";

require("dotenv").config();

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    localStorage.getItem("isUserLoggedIn") === "true"
  );

  const handleLogout = () => {
    setIsUserLoggedIn(false);
    localStorage.removeItem("isUserLoggedIn");
    localStorage.removeItem("userAuthToken");
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsUserLoggedIn(localStorage.getItem("isUserLoggedIn") === "true");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const PrivateRoute = ({ element, ...rest }) => {
    return isUserLoggedIn ? element : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="App">
        {isUserLoggedIn && <Navbar setIsUserLoggedIn={setIsUserLoggedIn} />}

        <Routes>
          <Route
            path="/"
            element={<Login setIsUserLoggedIn={setIsUserLoggedIn} />}
          />
          <Route
            path="/login"
            element={<Login setIsUserLoggedIn={setIsUserLoggedIn} />}
          />
          <Route
            path="/signup-new-member"
            element={<PrivateRoute element={<Signup />} />}
          />
          <Route path="/home" element={<PrivateRoute element={<CardDetail />} />} />
          <Route
            path="/farmers"
            element={<PrivateRoute element={<Farmer />} />}
          />
          <Route
            path="/card-detail/:id"
            element={<PrivateRoute element={<CardDetail />} />}
          />
          <Route
            path="/dokans"
            element={<PrivateRoute element={<NewDokan2 />} />}
          />
          <Route
            path="/dokan-details"
            element={<PrivateRoute element={<DokanCardDetails />} />}
          />
          <Route
            path="/borrow"
            element={<PrivateRoute element={<Borrowed />} />}
          />
          <Route
            path="/slip"
            element={<PrivateRoute element={<DokanerSlip />} />}
          />
          <Route
            path="/slip-details/:shopName/:id"
            element={<PrivateRoute element={<SlipDetails />} />}
          />
          <Route
            path="/hishab-table"
            element={<PrivateRoute element={<SlipTable />} />}
          />
          <Route
            path="/todays-hishab"
            element={<PrivateRoute element={<DailyTransaction />} />}
          />
          <Route
            path="/dhar-details/:id"
            element={<PrivateRoute element={<DharDetails />} />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
