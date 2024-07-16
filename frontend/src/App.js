import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import NewDeal from "./components/NewDeal/NewDeal";
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

  return (
    <Router>
      <div className="App">
        {isUserLoggedIn && <Navbar setIsUserLoggedIn={setIsUserLoggedIn} />}

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/new-deal" element={<NewDeal />} />
          <Route path="/card-detail/:id" element={<CardDetail />} />
          <Route path="/dokans" element={<NewDokan2 />} />
          <Route path="/dokan-details" element={<DokanCardDetails />} />
          <Route path="/borrow" element={<Borrowed />} />
          <Route path="/slip" element={<DokanerSlip />} />
          <Route path="/slip-details/:shopName/:id" element={<SlipDetails />} />
          <Route path="/hishab-table" element={<SlipTable />} />
          <Route path="/todays-hishab" element={<DailyTransaction />} />
          <Route
            path="/"
            element={<Login setIsUserLoggedIn={setIsUserLoggedIn} />}
          />
          <Route path="/signup-new-member" element={<Signup />} />
          <Route path="/dhar-details/:id" element={<DharDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
