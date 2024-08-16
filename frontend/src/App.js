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
import FinalPage from "./components/FinalPage/FinalPage";
import FarmerSlip from "./components/FarmerSlip/FarmerSlip";
import FarmerSlipDetails from "./components/CardDetail/FarmerSlipDetails";
import FarmerSlipDetailsPaidUnpaid from "./components/FarmerSlip/FarmerSlipDetailsPaidUnpaid";
import AllFarmerSlip from "./components/AllFarmerSlip/AllFarmerSlip";
import OwnDebtTable from "./components/OwnDebtTable/OwnDebtTable";

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
      const status = localStorage.getItem("isUserLoggedIn");
      setIsUserLoggedIn(!!status);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const PrivateRoute = ({ element, ...rest }) => {
    return isUserLoggedIn ? element : <Navigate to="/login" replace />;
  };
  const PublicRoute = ({ element }) => {
    return !isUserLoggedIn ? element : <Navigate to="/" replace />;
  };

  return (
    <Router>
      <div className="App">
        {isUserLoggedIn && <Navbar setIsUserLoggedIn={setIsUserLoggedIn} />}

        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute
                element={<Login setIsUserLoggedIn={setIsUserLoggedIn} />}
              />
            }
          />
          <Route
            path="/signup-new-member"
            element={<PrivateRoute element={<Signup />} />}
          />
          <Route path="/" element={<PrivateRoute element={<CardDetail />} />} />
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
            path="/slip/farmer"
            element={<PrivateRoute element={<FarmerSlip />} />}
          />
          <Route
            path="/slip/farmer/details/:id"
            element={<PrivateRoute element={<FarmerSlipDetailsPaidUnpaid />} />}
          />
          
          <Route
            path="/slip/farmer/all-deals"
            element={<PrivateRoute element={<AllFarmerSlip />} />}
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
          
          <Route
            path="/nijer-dhar"
            element={<PrivateRoute element={<OwnDebtTable />} />}
          />
          <Route
            path="/final-hishab"
            element={<PrivateRoute element={<FinalPage />} />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
