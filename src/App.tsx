import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Table from './Components/Table/Table';
import React, { useState } from "react";

// Make sure setSearchQuery is typed as a function that takes a string.
const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // Define the state with a string type

  return (
    <div>
      <Navbar setSearchQuery={setSearchQuery} />
      <Table searchQuery={searchQuery} />
    </div>
  );
};

export default App;
