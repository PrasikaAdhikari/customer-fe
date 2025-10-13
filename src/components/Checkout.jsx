// src/pages/Checkout.jsx
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { setPurchases } from "../features/purchase/purchaseSlice";
import { clearCart } from "../features/cart/cartSlice";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "./StripePaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  const { items: cartItems } = useSelector((state) => state.cartStore);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleOrderSuccess = () => {
    dispatch(
      setPurchases({
        customer: form,
        orderItems: cartItems,
        total,
        date: new Date().toISOString(),
      })
    );
    dispatch(clearCart());
    toast.success("Order placed successfully!");
    navigate("/thank-you");
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    handleOrderSuccess();
  };

  if (cartItems.length === 0) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
        <h2>Your cart is empty</h2>
        <p className="text-muted">Add items before proceeding to checkout.</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        {/* Billing Details */}
        <Col lg={7}>
          <Card className="shadow-sm mb-4">
            <Card.Header as="h5" className="btn-neo text-white">
              Customer Details
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleManualSubmit}>
                {/* Customer Info */}
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter your shipping address"
                    required
                  />
                </Form.Group>

                {/* Payment Method */}
                <h5 className="mt-4 mb-3">Payment Method</h5>
                <Form.Check
                  type="radio"
                  label="Credit Card"
                  name="paymentMethod"
                  id="creditCard"
                  value="creditCard"
                  checked={paymentMethod === "creditCard"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  label="PayPal"
                  name="paymentMethod"
                  id="paypal"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  label="Cash on Delivery"
                  name="paymentMethod"
                  id="cod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                {/* Render Stripe if credit card selected */}
                {paymentMethod === "creditCard" && (
                  <div className="mt-4">
                    <Elements stripe={stripePromise}>
                      <StripePaymentForm
                        total={total}
                        onPaymentSuccess={handleOrderSuccess}
                      />
                    </Elements>
                  </div>
                )}

                {/* Other payment methods */}
                {paymentMethod !== "creditCard" && (
                  <Button
                    type="submit"
                    bsPrefix="as"
                    className="w-100 mt-5 rounded-4 btn-neo"
                  >
                    Pay Now
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col lg={5}>
          <Card className="shadow-sm sticky-top" style={{ top: "2rem" }}>
            <Card.Body>
              <h4 className="mb-4">Order Summary</h4>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between text-muted mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between text-muted mb-2">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold mb-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
