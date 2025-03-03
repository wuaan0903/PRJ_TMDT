//paymentController.js
const renderPaymentSuccess = async (req, res) => {
    try {
        res.render('paymentSuccess');
    } catch (error) {
      console.error('Error rendering payment success page:', error);
      res.status(500).send('Failed to render payment success page');
    }
  };

const renderPaymentFailed = async (req, res) => {
    try {
        res.render('paymentFailed');
    } catch (error) {
      console.error('Error rendering payment failed page:', error);
      res.status(500).send('Failed to render payment failed page');
    }
  }
  
  module.exports = {
      renderPaymentSuccess,
      renderPaymentFailed
  }