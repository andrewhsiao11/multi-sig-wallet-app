import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar, Home, Footer, Profile, About } from "./components";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <div className="gradient-bg-nav">
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/*" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
