const { checkUserRole } = require('../middlewares/authMiddleware');
const Payment = require('../models/payment');

// Get all payments
const getPayments = async (req, res) => {
  const payments = await Payment.findAll();
  res.status(200).json(payments);
};

// Get a specific payment by ID
const getPaymentById = async (req, res) => {
  const { paymentId } = req.validatedPaymentId;

  // check if payment exists
  const payment = await Payment.findByPk(paymentId);

  if (!payment) {
    res.status(404).json({ error: 'Payment not found' });
    return;
  }

  res.status(200).json(payment);
};

// Update a payment by ID
const updatePayment = async (req, res) => {
  const { paymentId } = req.validatedPaymentId;
  const user = req.user;

  // check if payment exists
  const payment = await Payment.findByPk(paymentId);

  if (!payment) {
    res.status(404).json({ error: 'Payment not found' });
    return;
  }

  // Update the payment
  const [updatedRows] = await Payment.update(
    { ...req.validatedPartialPayment, updatedBy: user.id },
    {
      where: { id: paymentId }
    }
  );

  if (updatedRows > 0) {
    res.status(200).json({ message: 'Payment updated successfully' });
  } else {
    res.status(500).json({ error: 'Error updating payment' });
  }
};

module.exports = { getPayments, getPaymentById, updatePayment };
