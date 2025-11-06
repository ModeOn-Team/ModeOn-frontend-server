import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CartPage from "./pages/CartPage";
import Success from "./pages/Success";
import Fail from "./pages/Fail";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/cart" element={<CartPage />} /> 
        <Route path="/success" element={<Success />} />
        <Route path="/fail" element={<Fail />} />
      </Routes>
    </Router>
  );
}

export default App;
