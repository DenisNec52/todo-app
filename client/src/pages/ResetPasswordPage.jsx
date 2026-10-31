import { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { resetPasswordRequest } from '../services/authService.js';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [values, setValues] = useState({ password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (values.password !== values.confirmPassword) {
      setError('Le password non coincidono');
      return;
    }
    setLoading(true);
    try {
      const data = await resetPasswordRequest({ token, password: values.password });
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
        <h2 className="mb-4 text-center">Nuova password</h2>
        {!token && <Alert variant="danger">Link non valido: manca il token.</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        {message ? (
          <>
            <Alert variant="success">{message}</Alert>
            <Link to="/login">Vai al login</Link>
          </>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Nuova password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Minimo 6 caratteri"
                value={values.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="confirmPassword">
              <Form.Label>Conferma password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100" disabled={loading || !token}>
              {loading ? 'Salvataggio...' : 'Salva password'}
            </Button>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

export default ResetPasswordPage;
