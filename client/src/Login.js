import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import './style.css'; 

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [cookies, setCookie] = useCookies(["access_token"]);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post("http://localhost:3001/login", { username, password });
            if (response.data.token) {
            setCookie("access_token", response.data.token);
            window.localStorage.setItem("userID", response.data.userID);
            window.localStorage.setItem("role", response.data.role);
            window.localStorage.setItem("token", response.data.token);
            navigate('/students');
          } 
            else {
            setError('Invalid username or password');
          }
       } catch (error) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="login-container">
            <h2 className="text-center mb-4">Login</h2>
            <Form onSubmit={handleSubmit} className="login-form">
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username"value={username}onChange={e => setUsername(e.target.value)}required/>
                </Form.Group>
                <Form.Group controlId="formPassword" className="my-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password"placeholder="Enter password"value={password}onChange={e => setPassword(e.target.value)}required/>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                 {loading ? 'Logging in...' : 'Login'}
                </Button>
            </Form>
        </Container>
    );
};
export default Login;
