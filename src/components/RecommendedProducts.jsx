import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { BsCart } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

export default function RecommendedProducts({ products }) {
  const dispatch = useDispatch();
  const handleAddToCart = (p) => dispatch(addToCart(p));

  return (
    <div className="card-neo rounded-4 p-4">
      <div className="d-flex justify-content-between align-items-center mb-3 text-white">
        <h5 className="m-0">Recommended for you</h5>
      </div>

      {products.length === 0 ? (
        <div className="text-white-50">No recommendations yet.</div>
      ) : (
        <div className="rec-grid">
          {products.map((p) => (
            <div key={p._id} className="rec-tile text-center">
              <div className="rec-media position-relative overflow-hidden">
                <img src={p.images[0]} alt={p.name} />
                <div className="rec-hover position-absolute d-flex align-items-center justify-content-center flex-column gap-2 p-3">
                  <Link
                    to={`/product/${p.slug || p._id}`}
                    className="btn-ghost neo border rounded-4 w-100"
                  >
                    View
                  </Link>
                  <Button
                    type="button"
                    size="lg"
                    bsPrefix="neo"
                    className="btn-neo rounded-4 w-100 gap-2"
                    onClick={() => handleAddToCart(p)}
                  >
                    <BsCart /> Add to Cart
                  </Button>
                </div>
              </div>
              <div className="rec-info text-white p-2">
                <div className="name fw-bold" title={p.name}>
                  {p.name}
                </div>
                <div className="price">${Number(p.price || 0).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
