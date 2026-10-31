import { Router } from 'express';
import { body } from 'express-validator';

import { login, register, profile } from '../controllers/authController.js';
import { forgotPassword, resetPassword } from '../controllers/passwordController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

const emailValidation = body('email').isEmail().withMessage('Email non valida');
const passwordValidation = body('password')
  .isLength({ min: 6 })
  .withMessage('La password deve contenere almeno 6 caratteri');

router.post(
  '/register',
  [body('name').notEmpty().withMessage('Il nome è obbligatorio'), emailValidation, passwordValidation],
  register
);

router.post('/login', [emailValidation, passwordValidation], login);
router.post('/forgot-password', [emailValidation], forgotPassword);
router.post(
  '/reset-password',
  [body('token').isString().notEmpty().withMessage('Token mancante'), passwordValidation],
  resetPassword
);
router.get('/me', authenticate, profile);

export default router;
