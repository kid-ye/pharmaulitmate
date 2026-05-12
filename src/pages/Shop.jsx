import { useState, useEffect, useMemo } from 'react';
import { X, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const MOCK_PRODUCTS = [
  { id: 1, name: "Balance Baby Balance 2025 Planner", category: "Planners", price: 1299, originalPrice: 1799, isNew: false, isSoldOut: false, image1: "https://picsum.photos/seed/planner1a/600/800", image2: "https://picsum.photos/seed/planner1b/600/800", rating: 4.8, reviews: 47, featured: 10, dateAdded: '2024-01-01' },
  { id: 2, name: "Mindful Month Planner", category: "Planners", price: 999, originalPrice: 1299, isNew: false, isSoldOut: false, image1: "https://picsum.photos/seed/planner2a/600/800", image2: "https://picsum.photos/seed/planner2b/600/800", rating: 4.6, reviews: 32, featured: 9, dateAdded: '2024-02-15' },
  { id: 3, name: "Feel Your Feelings Guided Journal", category: "Journals", price: 849, originalPrice: 1299, isNew: false, isSoldOut: false, image1: "https://picsum.photos/seed/journal1a/600/800", image2: "https://picsum.photos/seed/journal1b/600/800", rating: 4.9, reviews: 128, featured: 12, dateAdded: '2023-11-20' },
  { id: 4, name: "Daily Gratitude Journal", category: "Journals", price: 749, originalPrice: null, isNew: false, isSoldOut: false, image1: "https://picsum.photos/seed/journal2a/600/800", image2: "https://picsum.photos/seed/journal2b/600/800", rating: 4.7, reviews: 85, featured: 8, dateAdded: '2024-03-10' },
  { id: 5, name: "Calm Corners of India Coloring Book", category: "Coloring Books", price: 399, originalPrice: 699, isNew: false, isSoldOut: false, image1: "https://picsum.photos/seed/color1a/600/800", image2: "https://picsum.photos/seed/color1b/600/800", rating: 4.8, reviews: 210, featured: 11, dateAdded: '2023-09-05' },
  { id: 6, name: "Botanical India Coloring Book", category: "Coloring Books", price: 449, originalPrice: null, isNew: false, isSoldOut: false, image1: "https://picsum.photos/seed/color2a/600/800", image2: "https://picsum.photos/seed/color2b/600/800", rating: 4.5, reviews: 18, featured: 7, dateAdded: '2024-04-01' },
  { id: 7, name: "The Ultimate Unwinding Kit", category: "Kits & Hampers", price: 1999, originalPrice: null, isNew: true, isSoldOut: false, image1: "https://picsum.photos/seed/kit1a/600/800", image2: "https://picsum.photos/seed/kit1b/600/800", rating: 5.0, reviews: 5, featured: 15, dateAdded: '2024-05-01' },
  { id: 8, name: "The Becoming Hamper", category: "Kits & Hampers", price: 2499, originalPrice: null, isNew: false, isSoldOut: false, image1: "https://picsum.photos/seed/hamper1a/600/800", image2: "https://picsum.photos/seed/hamper1b/600/800", rating: 4.9, reviews: 42, featured: 14, dateAdded: '2023-12-10' },
  { id: 9, name: "Affirmation Cards Deck", category: "Sticker Books", price: 599, originalPrice: null, isNew: false, isSoldOut: false, image1: "https://picsum.photos/seed/cards1a/600/800", image2: "https://picsum.photos/seed/cards1b/600/800", rating: 4.7, reviews: 93, featured: 6, dateAdded: '2024-01-20' },
  { id: 10, name: "Self Care Sticker Book", category: "Sticker Books", price: 299, originalPrice: null, isNew: false, isSoldOut: false, image1: "https://picsum.photos/seed/sticker1a/600/800", image2: "https://picsum.photos/seed/sticker1b/600/800", rating: 4.6, reviews: 54, featured: 5, dateAdded: '2024-02-28' },
  { id: 11, name: "Moments of Calm Workshop", category: "Workshops", price: 2499, originalPrice: null, isNew: false, isSoldOut: true, image1: "https://picsum.photos/seed/workshop1a/600/800", image2: "https://picsum.photos/seed/workshop1b/600/800", rating: 4.9, reviews: 112, featured: 13, dateAdded: '2024-03-05' },
  { id: 12, name: "Journaling for Beginners Workshop", category: "Workshops", price: 1499, originalPrice: null, isNew: false, isSoldOut: false, image1: "https://picsum.photos/seed/workshop2a/600/800", image2: "https://picsum.photos/seed/workshop2b/600/800", rating: 4.8, reviews: 88, featured: 16, dateAdded: '2024-04-15' }
];

const CATEGORIES = ["All", "Planners", "Journals", "Kits & Hampers", "Coloring Books", "Workshops", "Sticker Books"];

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("Featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState(1);

  const ITEMS_PER_PAGE = 9;

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS;
    if (activeCategory !== "All") {
      result = result.filter(p => p.category === activeCategory);
    }

    switch (sortOrder) {
      case "Newest":
        result = [...result].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
      case "Price: Low–High":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "Price: High–Low":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "Featured":
      default:
        result = [...result].sort((a, b) => b.featured - a.featured);
        break;
    }
    return result;
  }, [activeCategory, sortOrder]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 on filter/sort change
  }, [activeCategory, sortOrder]);

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
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
          <p className="shop-subtext">{MOCK_PRODUCTS.length} products</p>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="filter-sort-bar">
        <div className="container filter-sort-inner">
          <div className="filter-pills">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="sort-dropdown">
            <span className="sort-label">Sort by:</span>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="sort-select">
              <option value="Featured">Featured</option>
              <option value="Newest">Newest</option>
              <option value="Price: Low–High">Price: Low–High</option>
              <option value="Price: High–Low">Price: High–Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="section bg-cream" style={{ minHeight: '60vh' }}>
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="empty-state fade-up">
              <span className="empty-icon">✦</span>
              <h3>No products in this category</h3>
              <button className="text-link text-accent" onClick={() => setActiveCategory("All")}>
                View All &rarr;
              </button>
            </div>
          ) : (
            <div className="shop-grid">
              {currentProducts.map((product, index) => {
                const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;
                const isWished = wishlist.includes(product.id);

                return (
                  <ProductCard
                    key={product.id}
                    className="fade-up-staggered"
                    style={{ animationDelay: `${index * 50}ms` }}
                    name={product.name}
                    brandTag="ekaami"
                    price={product.price}
                    originalPrice={product.originalPrice}
                    discount={discountPercent}
                    isNew={product.isNew}
                    isSoldOut={product.isSoldOut}
                    imagePrimary={product.image1}
                    imageSecondary={product.image2}
                    rating={product.rating}
                    reviews={product.reviews}
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
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                &larr; Prev
              </button>

              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`page-num ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                className="page-nav"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
          <div className="modal-content scale-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}><X size={24} /></button>
            <div className="modal-grid">
              <div className="modal-image">
                <img src={selectedProduct.image1} alt={selectedProduct.name} />
              </div>
              <div className="modal-details">
                <h2 className="modal-title">{selectedProduct.name}</h2>
                <div className="shop-price-row mb-1">
                  <span className="price" style={{ fontSize: '24px' }}>₹{selectedProduct.price}</span>
                  {selectedProduct.originalPrice && <span className="price-old">₹{selectedProduct.originalPrice}</span>}
                </div>
                <p className="modal-desc">
                  Curated to elevate your mindful moments. Handcrafted in India using sustainable materials to ensure premium quality.
                </p>

                {!selectedProduct.isSoldOut && (
                  <div className="quantity-selector">
                    <button onClick={() => setQty(Math.max(1, qty - 1))}>&minus;</button>
                    <span>{qty}</span>
                    <button onClick={() => setQty(qty + 1)}>&#43;</button>
                  </div>
                )}

                {selectedProduct.isSoldOut ? (
                  <button className="btn-primary full-width" style={{ opacity: 0.6 }} disabled>Notify Me</button>
                ) : (
                  <button className="btn-primary full-width">Add to Cart — ₹{selectedProduct.price * qty}</button>
                )}

                <a href="#" className="modal-link">View Full Details &rarr;</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
