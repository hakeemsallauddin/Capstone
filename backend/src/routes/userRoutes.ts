import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';
import { validateRequest, validateQuery, validateParams } from '../middlewares/validationMiddleware';
import {
  createUserSchema,
  updateUserSchema,
  loginSchema,
  refreshTokenSchema,
  paginationSchema,
  idParamSchema,
  sendOtpSchema,
  sendLoginOtpSchema,
  verifyOtpSchema,
  completeRegistrationSchema
} from '../utils/validationSchemas';

const router = Router();
const userController = new UserController();

// Public routes
// New OTP-based registration flow
router.post('/register/send-otp', validateRequest(sendOtpSchema), userController.sendRegistrationOtp);
router.post('/register/verify-otp', validateRequest(verifyOtpSchema), userController.verifyRegistrationOtp);
router.post('/register/complete', validateRequest(completeRegistrationSchema), userController.completeRegistration);

// New OTP-based login flow
router.post('/login/send-otp', validateRequest(sendLoginOtpSchema), userController.sendLoginOtp);
router.post('/login/verify-otp', validateRequest(verifyOtpSchema), userController.verifyLoginOtp);

// Legacy routes (can be removed later)
router.post('/register', validateRequest(createUserSchema), userController.createUser);
router.post('/login', validateRequest(loginSchema), userController.login);

router.post('/refresh-token', validateRequest(refreshTokenSchema), userController.refreshToken);

// Protected routes
router.use(authenticateToken);

// Profile routes (All authenticated users)
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// User management routes (Admin only for list and delete operations)
router.get('/', requireAdmin, validateQuery(paginationSchema), userController.getAllUsers);
router.get('/:id', requireAdmin, validateParams(idParamSchema), userController.getUserById);
router.put('/:id', requireAdmin, validateParams(idParamSchema), validateRequest(updateUserSchema), userController.updateUser);
router.delete('/:id', requireAdmin, validateParams(idParamSchema), userController.deleteUser);

export default router;