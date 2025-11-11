import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Badge, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { addToCart } from "../../features/cart/cartSlice";
import { BsCart } from "react-icons/bs";
import DashboardSidebar from "../../components/DashboardSidebar.jsx";
import RecommendedProducts from "../../components/RecommendedProducts.jsx";
import {
  BsArrowRight,
  BsCartPlus,
  BsTruck,
  BsCheck2Circle,
  BsClockHistory,
} from "react-icons/bs";

import { fetchAllProductsAction } from "../../features/product/productAction";
import { retrieveAllOrder } from "../../features/order/orderAPI";
import { getRecentlyViewedProducts } from "../../features/customer/customerAPI.js";

const statusVariant = (s) => {
  const v = String(s || "").toLowerCase();
  if (v.includes("delivered")) return "success";
  if (v.includes("shipped")) return "warning";
  if (v.includes("processing") || v.includes("received")) return "primary";
  return "secondary";
};
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");
const getCreatedAt = (x) => {
  if (!x) return new Date(0);
  if (x.createdAt) return new Date(x.createdAt);
  if (x._id) {
    const ts = parseInt(String(x._id).substring(0, 8), 16) * 1000;
    return new Date(ts);
  }
  return new Date(0);
};

function SectionRecentOrders({ orders }) {
  const recent = [...orders]
    .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
    .slice(0, 3);

  return (
    <div className="card-neo rounded-4 p-3">
      <div className="d-flex justify-content-between align-items-center mb-2 text-white">
        <h5 className="m-0 text-capitalize">Recent purchases</h5>
        <Link to="/recent-purchases" className="btn-ghost neo rounded-4">
          View all
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="text-white-50 py-4 text-center">
          You have no orders yet.
        </div>
      ) : (
        <Table responsive hover borderless className="mb-0 table-transparent">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th className="text-center">Items</th>
              <th>Total</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o._id}>
                <td>#{String(o._id).slice(-6)}</td>
                <td>{fmtDate(o.createdAt)}</td>
                <td className="text-center">{o.items?.length ?? 0}</td>
                <td>${Number(o.total || 0).toFixed(2)}</td>
                <td>
                  <Badge
                    bg={statusVariant(o.status)}
                    className="text-capitalize"
                  >
                    {o.status || "—"}
                  </Badge>
                </td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <Link to="/orders" className="btn-ghost neo rounded-4">
                      Details
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default function CustomerDashboard() {
  const dispatch = useDispatch();
  const { customer } = useSelector((store) => store.customerStore);
  const storeOrders = useSelector(
    (store) => (store.orderStore && store.orderStore.orders) || []
  );
  const { products } = useSelector((store) => store.productStore);
  const [orders, setOrders] = useState(storeOrders || []);

  useEffect(() => {
    setOrders(storeOrders || []);
  }, [storeOrders]);

  useEffect(() => {
    if (!Array.isArray(products) || products.length === 0) {
      dispatch(fetchAllProductsAction());
    }
    (async () => {
      if (
        (!Array.isArray(storeOrders) || storeOrders.length === 0) &&
        customer?._id
      ) {
        const res = await retrieveAllOrder(customer._id);
        if (res?.status === "success" && Array.isArray(res.orders))
          setOrders(res.orders);
      } else {
        setOrders(storeOrders);
      }
    })();
  }, [dispatch, customer?._id]);

  const openOrders = orders.filter(
    (o) => String(o.status).toLowerCase() !== "delivered"
  );
  const deliveredOrders = orders.filter(
    (o) => String(o.status).toLowerCase() === "delivered"
  );
  const lastOrder =
    [...orders].sort(
      (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
    )[0] || null;

  const recommendations = [...products]
    .sort((a, b) => getCreatedAt(b) - getCreatedAt(a))
    .slice(0, 4);

  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const firstImage = (p) =>
    Array.isArray(p?.images)
      ? p.images[0] || p.image
      : typeof p?.images === "string"
      ? p.images
      : p?.image;

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const res = await getRecentlyViewedProducts(3);
        if (on && res?.status === "success")
          setRecentlyViewed(res.products || []);
      } catch {}
    })();
    return () => {
      on = false;
    };
  }, []);

  return (
    <section
      className="py-5 with-customer-sidebar"
      style={{
        background: "linear-gradient(180deg,var(--neo-d1),var(--neo-d2))",
      }}
    >
      <DashboardSidebar />
      <Container className="px-4">
        {/* HERO */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            <div className="text-white">
              <h2 className="fw-bold mb-0">Dashboard Overview</h2>
              <small className="text-white-50">
                Track orders, manage your account, and discover picks for you.
              </small>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Link
              to="/"
              className="btn-neo rounded-4 d-inline-flex align-items-center gap-2 text-decoration-none"
            >
              Shop now <BsArrowRight />
            </Link>
          </div>
        </div>

        {/* QUICK STATS */}
        <Row className="g-4 mb-4">
          <Col md={4}>
            <div className="card-neo rounded-4 h-100 p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-white">Open orders</div>
                  <div className="h3 m-0 text-white-50">
                    {openOrders.length}
                  </div>
                </div>
                <BsTruck
                  size={26}
                  className="text-white"
                  aria-label="Open orders"
                />
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="card-neo rounded-4 h-100 p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-white">Delivered</div>
                  <div className="h3 m-0 text-white-50">
                    {deliveredOrders.length}
                  </div>
                </div>
                <BsCheck2Circle
                  size={26}
                  className="text-white"
                  aria-label="Delivered"
                />
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="card-neo rounded-4 h-100 p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-white">Last order</div>
                  <div className="h5 m-0 text-white-50">
                    {lastOrder ? `#${String(lastOrder._id).slice(-6)}` : "—"}
                  </div>
                  <div className="small text-white-50">
                    {lastOrder ? fmtDate(lastOrder.createdAt) : "No orders yet"}
                  </div>
                </div>
                <BsClockHistory
                  size={26}
                  className="text-white"
                  aria-label="Last order"
                />
              </div>
            </div>
          </Col>
        </Row>

        {/* RECENT ORDERS */}
        <SectionRecentOrders orders={orders} />

        {/* RECENTLY VIEWED */}
        <div className="card-neo rounded-4 p-4 my-4">
          <div className="d-flex justify-content-between align-items-center mb-2 text-white">
            <h5 className="m-0">Recently viewed</h5>
            <span className="badge bg-light text-dark rounded-pill">
              {recentlyViewed.length}
            </span>
          </div>
          {recentlyViewed.length === 0 ? (
            <div className="text-white-50">
              You have not viewed any items recently.
            </div>
          ) : (
            <ul className="rv-list list-unstyled m-0">
              {recentlyViewed.map((p) => (
                <li
                  key={p._id}
                  className="rv-item d-flex align-items-center gap-3 px-3 py-3"
                >
                  {/* Thumbnail */}
                  <div className="rv-thumb rounded-3 overflow-hidden">
                    <img
                      src={firstImage(p)}
                      alt={p.name}
                      className="w-100 h-100"
                      style={{ objectFit: "cover", display: "block" }}
                    />
                  </div>

                  {/* Title + sub */}
                  <div className="flex-grow-1">
                    <Link
                      to={`/product/${p.slug || p._id}`}
                      className="rv-title text-decoration-none text-white fw-semibold"
                    >
                      {p.name}
                    </Link>
                    <div className="rv-sub text-white-50 small">
                      {p.category?.name || "Viewed recently"}
                    </div>
                  </div>

                  {/* Right meta (date) */}
                  <div className="rv-meta text-white-50 small">
                    {fmtDate(getCreatedAt(p))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RECOMMENDATIONS */}
        <RecommendedProducts products={recommendations} />

        {/* SUPPORT STRIP */}
        <div className="card-neo rounded-4 p-4 mt-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex flex-column text-white">
              <div className="h5 m-0">Need help with an order?</div>
              <div className="text-white-50 small">
                We’re here to help with delivery updates, returns and more.
              </div>
            </div>
            <Link to="/support" className="btn btn-ghost neo rounded-4">
              Contact support
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
