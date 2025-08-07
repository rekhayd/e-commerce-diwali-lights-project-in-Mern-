


import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CheckoutSuccess = () => {
  return (
    <Container className="text-center mt-5">
      <h2>🎉 Order Placed Successfully!</h2>
      <p>Thank you for your purchase.</p>
      <Link to="/banner">Back to Home</Link>
    </Container>
  );
};

export default CheckoutSuccess;
