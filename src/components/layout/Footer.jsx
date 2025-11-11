import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { subscribeCustomerAction } from "../../features/subscribe/subscribeAction";

const Footer = () => {
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      const redirect = document.getElementById(id);
      if (redirect) redirect.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    subscribeCustomerAction(email, setEmail, setMessage, setLoading);
  };
  return (
    <footer className="bg-dark text-light py-4 z-2">
      <div className="container">
        <div className="row gy-3 d-flex flex-row justify-content-between">
          {/* Brand + blurb */}
          <div className="col-12 col-md-4">
            <h5 className="fw-bold">Electra Hub</h5>
            <p className="text-secondary mb-2">
              Your Hub for All Things Electric.
            </p>
          </div>

          {/* Shop links */}
          <div className="col-6 col-md-2">
            <h6 className="text-uppercase fw-semibold mb-2">Shop</h6>
            <ul className="list-unstyled">
              <li>
                <Link
                  className="btn btn-link link-light link-underline-opacity-0 p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("hot-deals");
                  }}
                >
                  Hot Deals
                </Link>
              </li>
              <li>
                <Link
                  className="btn btn-link link-light link-underline-opacity-0 p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("new-arrivals");
                  }}
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  className="btn btn-link link-light link-underline-opacity-0 p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("best-sellers");
                  }}
                >
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-12 col-md-4 text-center text-md-start">
            <h6 className="text-uppercase fw-semibold mb-3">Get Updates</h6>

            <form onSubmit={handleSubmit} noValidate>
              <label
                htmlFor="footerEmail"
                className="form-label small d-block mb-2"
              >
                Subscribe to our newsletter
              </label>

              <div className="input-group mb-2">
                <input
                  type="email"
                  className="form-control form-control-sm"
                  id="footerEmail"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={loading}
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </div>

              {message && (
                <small
                  className={`d-block ${
                    message.startsWith("🎉") ? "text-success" : "text-danger"
                  }`}
                >
                  {message}
                </small>
              )}

              <small className="text-secondary d-block mt-2">
                By subscribing, you agree to our{" "}
                <a href="/privacy-policy" className="link-light">
                  Privacy Policy
                </a>
                .
              </small>
            </form>
          </div>
        </div>

        <hr className="border-secondary my-3" />

        {/* Bottom strip */}
        <div className="row">
          <div className="col-12 text-center">
            <div className="text-secondary small">
              © {year} Electra Hub Pty Ltd. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
