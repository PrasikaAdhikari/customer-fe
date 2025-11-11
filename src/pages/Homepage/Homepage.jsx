import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Button, Pagination } from "react-bootstrap";
import {
  BsLightningCharge,
  BsShieldCheck,
  BsTruck,
  BsArrowRight,
} from "react-icons/bs";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProductsAction,
  fetchFeaturedProductsAction,
  fetchTopRatedProductsAction,
} from "../../features/product/productAction";
import CustomFeaturedArea from "../../components/customCard/CustomFeaturedArea";

export default function Homepage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [featured, setFeatured] = useState({});
  const [activePage, setActivePage] = useState(1);

  const { topRatedProducts } = useSelector((store) => store.productStore);
  const { categories, subCategories } = useSelector(
    (store) => store.categoryStore
  );

  const itemsPerPage = 4;
  const totalPages = Math.ceil(subCategories.length / itemsPerPage);

  const currentSubCategories = subCategories.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === activePage}
        onClick={() => setActivePage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  useEffect(() => {
    dispatch(fetchAllProductsAction());
    dispatch(fetchTopRatedProductsAction());

    const getFeaturedProducts = async () => {
      const result = await fetchFeaturedProductsAction();
      if (result) setFeatured(result);
    };
    getFeaturedProducts();
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const target = document.getElementById(location.state.scrollTo);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="bg-dark text-light">
      {/* HERO SECTION */}
      <section className="hero-wrap py-5 py-md-6">
        <Container className="py-4 py-lg-5">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="d-inline-flex align-items-center gap-2 pill px-3 py-2 rounded-5 mb-3">
                <span className="badge rounded-pill bg-transparent text-light">
                  New Arrivals Weekly
                </span>
              </div>

              <h1 className="display-3 fw-bold lh-tight mb-3">
                Discover the{" "}
                <span className="d-block text-neo">Future of Tech</span>
              </h1>
              <p className="fs-5 text-white-50 mb-4">
                Premium electronics, cutting-edge gadgets, and exclusive deals.
                Experience technology that transforms your lifestyle.
              </p>
              {/* TODO */}
              <div className="d-flex flex-wrap gap-3 mb-4">
                {/* <Link to="/products">
                  <Button
                    size="lg"
                    bsPrefix="neo"
                    className="btn-neo rounded-4 px-4 d-inline-flex align-items-center gap-2"
                  >
                    Explore Collection <BsArrowRight />
                  </Button>
                </Link>
                <Link to="/deals">
                  <Button
                    size="lg"
                    bsPrefix="neo"
                    className="btn-ghost rounded-4 px-4"
                  >
                    View Deals
                  </Button>
                </Link> */}
              </div>

              <Row className="g-4 pt-2">
                {[
                  ["50+", "Products"],
                  ["50+", "Happy Customers"],
                  ["99%", "Satisfaction"],
                ].map(([val, label]) => (
                  <Col xs={4} key={label}>
                    <div className="h6 text-neo mb-0">{val}</div>
                    <div className="small text-white-50">{label}</div>
                  </Col>
                ))}
              </Row>
            </Col>

            <Col lg={6}>
              <div className="position-relative">
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 rounded-4"
                  style={{
                    background:
                      "linear-gradient(90deg,var(--neo-start),var(--neo-mid),var(--neo-end))",
                    opacity: 0.25,
                    filter: "blur(60px)",
                  }}
                />
                <div
                  className="position-relative rounded-4 overflow-hidden border"
                  style={{ borderColor: "var(--neo-border)" }}
                >
                  <img
                    className="img-fluid"
                    alt="Latest tech products"
                    src="https://images.unsplash.com/photo-1758186374131-d542d2beae0c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1632"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FEATURED */}
      <section
        className="py-5"
        id="hot-deals"
        style={{ background: "var(--neo-d1)" }}
      >
        <CustomFeaturedArea
          majorTitle="Hot Deals This Week"
          minorTitle="Featured Collection"
          titleDescription="Handpicked selection of the most popular and trending tech products"
          products={featured.hotDealsProducts}
          tagLabel="HOT"
          tagClass="tag-hot"
        />
      </section>

      {/* NEW ARRIVALS */}
      <section
        className="py-5"
        id="new-arrivals"
        style={{ background: "var(--neo-d1)" }}
      >
        <CustomFeaturedArea
          majorTitle="New Arrivals"
          minorTitle="Just In"
          titleDescription="Fresh drops you’ll love"
          products={featured.recentlyAddedProducts}
          tagLabel="New Arrival"
          tagClass="tag-arrival"
        />
      </section>

      {/* BEST SELLERS */}
      <section
        className="py-5"
        id="best-sellers"
        style={{ background: "var(--neo-d1)" }}
      >
        <CustomFeaturedArea
          majorTitle="Best Sellers"
          minorTitle="Our best selling products"
          titleDescription="Customer favorited right now"
          products={featured.bestSellerProducts}
          tagLabel="Best Seller"
          tagClass="tag-best-seller"
        />
      </section>

      {/* TESTIMONIALS */}
      <section
        className="py-5"
        style={{
          background: "var(--neo-d1)",
        }}
      >
        <Container>
          <div className="text-center mb-4">
            <h2 className="display-6 fw-bold">Testimonial</h2>
            <hr className="my-3 mx-auto" style={{ width: "15em" }} />
            <p className="text-white-50">
              Check what our recent customers has to say
            </p>
          </div>
          <Row className="g-4">
            {topRatedProducts.length === 0 ? (
              <Col xs={12} className="text-center text-white-50">
                No top-rated reviews yet.
              </Col>
            ) : (
              topRatedProducts
                .flatMap((prod) =>
                  (prod.reviews || []).map((rev) => ({
                    ...rev,
                    productName: prod.name,
                  }))
                )
                .sort((a, b) => b.rating - a.rating)
                .sort(() => 0.5 - Math.random())
                .slice(0, 4)
                .map((rev) => (
                  <Col xs={12} md={3} key={rev._id}>
                    <div
                      className="p-4 rounded-4 bg-secondary bg-opacity-10 h-100 d-flex flex-column justify-content-between card-neo "
                      style={{ maxHeight: "300px" }}
                    >
                      <div className="fw-semibold text-white mb-3">
                        {rev?.customer?.fname} {rev?.customer?.lname}
                      </div>

                      <div className="mb-2 text-warning">
                        {"★".repeat(rev.rating) + "☆".repeat(5 - rev.rating)}
                      </div>

                      <p className="fw-bold text-white mb-1 ">{rev.title}</p>
                      <p className="text-white-50 mb-2 line-clamp-2">
                        {rev.comment}
                      </p>

                      <div className="small text-white fw-bold fs-6 mt-1">
                        {rev.productName}
                      </div>
                    </div>
                  </Col>
                ))
            )}
          </Row>
        </Container>
      </section>

      {/* CATEGORIES */}
      <section
        className="py-5 hero-wrap"
        style={{
          background: "var(--neo-d1)",
        }}
      >
        <Container className="position-relative">
          <div className="text-center mb-4">
            <h2 className="display-6 fw-bold">Shop by Category</h2>
            <hr className="my-3 mx-auto" style={{ width: "20rem" }} />
            <p className="text-white-50">
              Find exactly what you're looking for
            </p>
          </div>

          <div className="position-relative">
            <Row className="g-2 g-md-3">
              {currentSubCategories.map((c) => {
                const parentCategory = categories.find(
                  (item) => item._id === c.parent
                );

                return (
                  <Col xs={6} md={4} lg={3} key={c.name}>
                    <Link
                      to={`/category/${parentCategory?.slug}/${c.slug}`}
                      className="text-decoration-none"
                    >
                      <div className="p-3 rounded-4 card-neo text-center h-100 bg-dark">
                        {/* Category Image */}
                        <div
                          className="d-flex align-items-center justify-content-center mx-auto bg-dark bg-opacity-10 rounded"
                          style={{
                            width: "auto",
                            height: "70px",
                            overflow: "hidden",
                            borderRadius: "10px",
                          }}
                        >
                          <img
                            src={c.image || "/images/placeholder.png"}
                            alt={c.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              objectPosition: "center",
                            }}
                          />
                        </div>

                        {/* Category Name */}
                        <div className="text-light fw-semibold mt-2">
                          {c.name}
                        </div>
                      </div>
                    </Link>
                  </Col>
                );
              })}
            </Row>

            {/* Prev Arrow */}
            {activePage > 1 && (
              <div
                className="position-absolute top-50 translate-middle-y"
                style={{
                  cursor: "pointer",
                  backgroundColor: "#1a1a1a",
                  color: "#fff",
                  padding: "0.5rem",
                  borderRadius: "50%",
                  left: "-2.5rem",
                  zIndex: 10,
                }}
                onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
              >
                <IoIosArrowBack size={24} />
              </div>
            )}
            {/* Next Arrow */}
            {activePage < totalPages && (
              <div
                className="position-absolute top-50 translate-middle-y"
                style={{
                  cursor: "pointer",
                  backgroundColor: "#1a1a1a",
                  color: "#fff",
                  padding: "0.5rem",
                  borderRadius: "50%",
                  right: "-2.5rem", // move arrow right outside the category
                  zIndex: 10,
                }}
                onClick={() =>
                  setActivePage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                <IoIosArrowForward size={24} />
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* FEATURES */}
      <section className="py-5" style={{ background: "var(--neo-d1)" }}>
        <Container>
          <Row className="g-4">
            {[
              {
                icon: <BsLightningCharge />,
                title: "Lightning Fast Delivery",
                desc: "Get your tech delivered in 24–48 hours with express shipping",
              },
              {
                icon: <BsShieldCheck />,
                title: "Secure & Safe",
                desc: "Industry-leading security with 100% buyer protection guarantee",
              },
              {
                icon: <BsTruck />,
                title: "Free Shipping",
                desc: "Enjoy free shipping on all orders over $50 with no hidden fees",
              },
            ].map((f) => (
              <Col xs={12} md={6} lg={4} key={f.title}>
                <div className="p-4 rounded-4 card-neo h-100">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div className="icon-pill fs-5">{f.icon}</div>
                    <h5 className="mb-0">{f.title}</h5>
                  </div>
                  <p className="text-white-50 mb-0">{f.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
}
