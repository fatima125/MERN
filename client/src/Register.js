import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import './style.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/register", { username, password,role});
      alert("Registration successful");
      navigate('/');
    } catch (error) {
      console.error("Error registering:", error);
      alert("Registration failed");
    }
  };
  return (
    <Container className="register-container">
      <div className="form-card">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text"placeholder="Enter username"value={username}onChange={(e) => setUsername(e.target.value)}className="form-control-custom"/>
          </Form.Group>
          <Form.Group controlId="formPassword" className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password"placeholder="Enter password"value={password}onChange={(e) => setPassword(e.target.value)}className="form-control-custom" />
          </Form.Group>
           <Form.Group controlId="formRole" className="my-3">
            <Form.Label>Role</Form.Label>
            <Form.Control as="select"value={role}onChange={(e) => setRole(e.target.value)}className="form-control-custom">
              <option value="teacher">Teacher</option>
              <option value="Supervisor">Supervisor</option>
              <option value="admin">admin</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Register
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Register;
