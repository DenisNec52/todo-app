import { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(values);
      navigate('/tasks');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: 420 }}>
      <Card.Body>
        <h2 className="mb-4 text-center">Accedi</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="nome@esempio.com"
              value={values.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="********"
              value={values.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </Button>
        </Form>
        <p className="mt-3 mb-1 text-center">
          <Link to="/forgot-password">Password dimenticata?</Link>
        </p>
        <p className="mb-0 text-center">
          Non hai un account? <Link to="/register">Registrati</Link>
        </p>
      </Card.Body>
    </Card>
  );
};

export default LoginPage;
