import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import NewDeal from "./components/NewDeal/NewDeal";
import CardDetail from "./components/CardDetail/CardDetail";
import DokanCardDetails from "./components/DokanCardDetails/DokanCardDetails";
import NewDokan from "./components/NewDokan/NewDokan";
import Borrowed from "./components/Borrowed/Borrowed";
import NewDokan2 from "./components/NewDokan2/NewDokan2";
import DokanerSlip from "./components/DokanerSlip/DokanerSLip";
import SlipDetails from "./components/SlipDetails/SlipDetails";
import SlipTable from "./components/SlipTable/SLipTable";

require("dotenv").config();
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-deal" element={<NewDeal />} />
          <Route path="/card-detail/:id" element={<CardDetail />} />
          <Route path="/dokans" element={<NewDokan2 />} />
          <Route path="/dokan-details" element={<DokanCardDetails />} />
          <Route path="/new-dokan" element={<NewDokan />} />
          <Route path="/borrow" element={<Borrowed />} />
          <Route path="/new-dokan2" element={<NewDokan2 />} />
          <Route path="/slip" element={<DokanerSlip />} />
          <Route path="/slip-details/:shopName/:id" element={<SlipDetails />} />
          <Route path="/hishab-table" element={<SlipTable />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
