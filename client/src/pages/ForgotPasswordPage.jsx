import { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { forgotPasswordRequest } from '../services/authService.js';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const data = await forgotPasswordRequest({ email });
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: 420 }}>
      <Card.Body>
        <h2 className="mb-4 text-center">Password dimenticata</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="nome@esempio.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? 'Invio in corso...' : 'Invia link di reset'}
          </Button>
        </Form>
        <p className="mt-3 mb-0 text-center">
          <Link to="/login">Torna al login</Link>
        </p>
      </Card.Body>
    </Card>
  );
};

export default ForgotPasswordPage;
