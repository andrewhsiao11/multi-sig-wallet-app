import { Navbar, Home, Footer, Transactions } from "./components";

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Home />
      </div>
      <Transactions />
      <Footer />
    </div>
  );
};

export default App;
