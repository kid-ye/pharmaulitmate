import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/client";
import "./Shop.css";

const CATEGORIES = [
  "All",
  "Medical Kits",
  "Diagnostics",
  "Wound Care",
  "PPE",
  "Emergency Kits",
  "Clinical Components",
];

const Shop = ({ onAddToCart }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("Featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    getProducts({ limit: 100 }).then((res) => setAllProducts(res.products ?? res)).catch(console.error);
  }, []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState(1);

  const ITEMS_PER_PAGE = 9;

  const filteredProducts = useMemo(() => {
    let result = allProducts;
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    switch (sortOrder) {
      case "Newest":
        result = [...result].sort(
          (a, b) => new Date(b.date_added) - new Date(a.date_added),
        );
        break;
      case "Price: Low–High":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "Price: High–Low":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "Featured":
      default:
        result = [...result].sort((a, b) => b.featured_order - a.featured_order);
        break;
    }
    return result;
  }, [activeCategory, sortOrder, allProducts]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((item) => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const openQuickShop = (product) => {
    setSelectedProduct(product);
    setQty(1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // wait for exit animation
  };

  return (
    <div className="shop-page">
      {/* Page Header */}
      <div className="shop-header">
        <div className="container text-center">
          <div className="breadcrumb">Home &rsaquo; Shop</div>
          <h1 className="shop-title">Shop All</h1>
          <p className="shop-subtext">{allProducts.length} products</p>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="filter-sort-bar">
        <div className="container filter-sort-inner">
          <div className="filter-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${activeCategory === cat ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentPage(1);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="sort-dropdown">
            <span className="sort-label">Sort by:</span>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className="sort-select"
            >
              <option value="Featured">Featured</option>
              <option value="Newest">Newest</option>
              <option value="Price: Low–High">Price: Low–High</option>
              <option value="Price: High–Low">Price: High–Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="section bg-cream" style={{ minHeight: "60vh" }}>
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="empty-state fade-up">
              <span className="empty-icon">✦</span>
              <h3>No products in this category</h3>
              <button
                className="text-link text-accent"
                onClick={() => {
                  setActiveCategory("All");
                  setCurrentPage(1);
                }}
              >
                View All &rarr;
              </button>
            </div>
          ) : (
            <div className="shop-grid">
              {currentProducts.map((product, index) => {
                const isWished = wishlist.includes(product.id);

                return (
                  <ProductCard
                    key={product.id}
                    className="fade-up-staggered"
                    style={{ animationDelay: `${index * 50}ms` }}
                    name={product.name}
                    brandTag="pharmaultimate"
                    price={product.price}
                    originalPrice={product.original_price}
                    isNew={product.is_new}
                    isSoldOut={product.is_sold_out}
                    imagePrimary={product.image1}
                    imageSecondary={product.image2}
                    rating={product.rating}
                    reviews={product.review_count}
                    showWishlist={true}
                    isWished={isWished}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                    onQuickShop={() => openQuickShop(product)}
                  />
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-nav"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                &larr; Prev
              </button>

              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`page-num ${currentPage === i + 1 ? "active" : ""}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                className="page-nav"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Quick Shop Modal */}
      {isModalOpen && selectedProduct && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal-content scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            <div className="modal-grid">
              <div className="modal-image">
                <img src={selectedProduct.image1} alt={selectedProduct.name} />
              </div>
              <div className="modal-details">
                <h2 className="modal-title">{selectedProduct.name}</h2>
                <div className="shop-price-row mb-1">
                  <span className="price" style={{ fontSize: "24px" }}>
                    Rs.{selectedProduct.price}
                  </span>
                  {selectedProduct.original_price && (
                    <span className="price-old">
                      Rs.{selectedProduct.original_price}
                    </span>
                  )}
                </div>
                <p className="modal-desc">
                  Curated for practical everyday care. Packed with organized
                  medical components and quality-checked essentials for reliable
                  use.
                </p>

                {!selectedProduct.is_sold_out && (
                  <div className="quantity-selector">
                    <button onClick={() => setQty(Math.max(1, qty - 1))}>
                      &minus;
                    </button>
                    <span>{qty}</span>
                    <button onClick={() => setQty(qty + 1)}>&#43;</button>
                  </div>
                )}

                {selectedProduct.is_sold_out ? (
                  <button
                    className="btn-primary full-width"
                    style={{ opacity: 0.6 }}
                    disabled
                  >
                    Notify Me
                  </button>
                ) : (
                  <button className="btn-primary full-width" onClick={() => { onAddToCart(selectedProduct, qty); closeModal(); }}>
                    Add to Cart — Rs.{selectedProduct.price * qty}
                  </button>
                )}

                <a href="#" className="modal-link">
                  View Full Details &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
