import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import React, { ChangeEvent, useState } from "react";
import   "./Navbar.css"

interface NavbarProps {
  setSearchQuery: (query: string) => void;
}

const NavbarComponent: React.FC<NavbarProps> = ({ setSearchQuery }) => {
  const [input, setInput] = useState<string>("");
  let debounceTimer: NodeJS.Timeout;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setSearchQuery(value); 
    }, 300);
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: "#16a085", color: "white" }}>
      <Container>
        <Navbar.Brand href="#">BookFinder</Navbar.Brand>
        <Form className="d-flex mx-auto w-50">
          <Form.Control
            type="search"
            placeholder="Search Here"
            className="me-2"
            aria-label="Search"
            value={input}
            onChange={handleSearchChange}
          />
        </Form>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
