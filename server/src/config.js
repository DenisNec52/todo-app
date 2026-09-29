// Loads .env itself: ESM evaluates imports before index.js body runs,
// so a dotenv.config() call there would come too late for this module.
import 'dotenv/config';

function required(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    console.error(`Errore di configurazione: la variabile d'ambiente ${name} non è definita.`);
    console.error('Copia server/.env.example in server/.env e imposta un valore.');
    process.exit(1);
  }
  return value;
}

export const JWT_SECRET = required('JWT_SECRET');
