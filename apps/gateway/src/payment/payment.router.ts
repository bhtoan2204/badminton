import express from 'express';
import { PaymentController } from './payment.controller';
const router = express.Router();

router.get('/vnpay/vnpay_return', PaymentController.vnpayReturn);
//router.get('/confirm/success', PaymentController.success);
//router.get('/confirm/cancel', PaymentController.cancel);

export default router;