import { useState } from "react";
import ProductCard from "../components/ProductCard";
import "./Shop.css";

import kitMain from "../assets/postpartum-kit-main.jpg";
import kitBox from "../assets/postpartum-kit-box.jpg";
import supportBelt from "../assets/postpartum-support-belt.jpg";

const POSTPARTUM_PRODUCTS = [
  {
    id: 1,
    name: "Complete Postpartum Care Kit",
    category: "Postpartum Care",
    brand: "PHARMAULTIMATE",
    price: 2499,
    rating: 4.9,
    reviews: 41,
    images: [kitMain, kitBox, supportBelt],
  }
];

const Shop = ({ onAddToCart }) => {
  const [sortOrder, setSortOrder] = useState("Featured");
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((item) => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  return (
    <div className="shop-page">
      {/* Page Header */}
      <div className="shop-header">
        <div className="container text-center">
          <div className="breadcrumb">Home &rsaquo; Shop</div>
          <h1 className="shop-title">Shop All</h1>
          <p className="shop-subtext">1 product</p>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="filter-sort-bar">
        <div className="container filter-sort-inner" style={{ justifyContent: "flex-end" }}>
          {/* Category filter pills removed as requested */}
          <div className="sort-dropdown">
            <span className="sort-label">Sort by:</span>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
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

      {/* Product Grid Area */}
      <section className="section bg-cream" style={{ minHeight: "60vh" }}>
        <div className="container">
          <div className="shop-grid">
            {POSTPARTUM_PRODUCTS.map((product, index) => {
              const isWished = wishlist.includes(product.id);

              return (
                <ProductCard
                  key={product.id}
                  className="fade-up-staggered"
                  style={{ animationDelay: `${index * 50}ms` }}
                  name={product.name}
                  brandTag={product.brand}
                  price={product.price}
                  images={product.images}
                  rating={product.rating}
                  reviews={product.reviews} 
                  showWishlist={true}
                  isWished={isWished}
                  onToggleWishlist={() => toggleWishlist(product.id)}
                  onQuickShop={() => onAddToCart(product, 1)}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
