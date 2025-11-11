import React from "react";
import { Link } from "react-router-dom";
import { BsCart } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { addToCart } from "../../features/cart/cartSlice";
import { useDispatch } from "react-redux";

const CustomCard = ({ product, tagLabel, tagClass }) => {
  const dispatch = useDispatch();
  return (
    <div className="card-neo rounded-4 h-100 overflow-hidden d-flex flex-column flex-fill w-100">
      <Link
        to={`/product/${product.slug}`}
        className="position-relative featured-media overflow-hidden d-block"
        aria-label={`Open ${product.name}`}
      >
        <div className="overflow-hidden">
          <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            className="img-fluid w-100 transition transform"
            style={{
              height: "304.4px",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>

        <span
          className={`position-absolute top-0 end-0 m-3 chip ${tagClass} fw-semibold z-2`}
        >
          {tagLabel}
        </span>

        {product.stock && (
          <span className="position-absolute bottom-0 start-0 m-3 chip tag-stock z-2">
            In Stock
          </span>
        )}
      </Link>

      <div className="d-flex flex-column flex-grow-1 p-4">
        <h5 className="mb-1 line-clamp-2" style={{ minHeight: "3rem" }}>
          <Link
            to={`/product/${product.slug}`}
            className="small text-decoration-none link-title"
          >
            {product.name}
          </Link>
        </h5>
        {/* <p className="small text-white-50 mb-3">
          Average Rating: {product.averageRating}
        </p> */}
        <p className="small text-white-50 mb-3 line-clamp-2 overflow-hidden">
          {product.description}
        </p>

        <div className="d-flex align-items-baseline gap-2 mb-3">
          <div className="h4 m-0 text-white">${product.price.toFixed(2)}</div>
        </div>

        <Button
          onClick={() => dispatch(addToCart(product))}
          bsPrefix="neo"
          className="btn-neo rounded-4 w-100 d-inline-flex align-items-center justify-content-center gap-2 mt-auto"
        >
          <BsCart /> Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default CustomCard;
