import { useState } from "react";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { BRAND_NAME } from "../constants";
import "./ProductCard.css";

const ProductCard = ({
  name,
  brandTag = BRAND_NAME,
  price,
  originalPrice = null,
  discount = null,
  isNew = false,
  isSoldOut = false,
  imagePrimary,
  imageSecondary,
  images: imagesProp = null,
  rating = null,
  reviews = null,
  showWishlist = false,
  isWished = false,
  onToggleWishlist,
  onQuickShop,
  onCardClick,
  className = "",
  onClick,
  style = {},
}) => {
  const images = imagesProp ?? [
    imagePrimary,
    imageSecondary,
  ].filter(Boolean);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const discountPercent =
    discount ??
    (originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className={`product-card ${className}`}
      style={{ ...style, cursor: (onClick || onCardClick) ? "pointer" : "default" }}
      onClick={onCardClick ?? onClick}
    >
      <div className="product-image-wrap">
        {discountPercent && (
          <span className="badge discount-badge">-{discountPercent}%</span>
        )}
        {isNew && <span className="badge new-badge">NEW</span>}
        {isSoldOut && <span className="badge soldout-badge">SOLD OUT</span>}

        {showWishlist && (
          <button
            className="wishlist-btn"
            onClick={onToggleWishlist}
            aria-label="Wishlist"
          >
            <Heart
              size={20}
              fill={isWished ? "var(--accent)" : "transparent"}
              color={isWished ? "var(--accent)" : "var(--text)"}
            />
          </button>
        )}

        <div className="product-images">
          {images.length > 0 && (
            <img
              src={images[currentImageIndex]}
              alt={name}
              className="img-primary"
            />
          )}
        </div>

        {images.length > 1 && (
          <>
            <button
              className="carousel-arrow left"
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="carousel-arrow right"
              onClick={handleNextImage}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
            <div className="carousel-dots">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`carousel-dot ${idx === currentImageIndex ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                />
              ))}
            </div>
          </>
        )}

        {!isSoldOut && (
          <button
            className="quick-shop-btn"
            onClick={(e) => {
              e.stopPropagation();
              onQuickShop && onQuickShop(e);
            }}
          >
            Add to Cart
          </button>
        )}
      </div>

      <div className="product-info">
        <span className="brand-tag">{brandTag}</span>
        <h3 className="product-name">{name}</h3>
        {rating != null && (
          <div className="product-rating">
            <Star size={12} fill="var(--gold)" color="var(--gold)" />
            <span>
              {rating} <span className="reviews">({reviews})</span>
            </span>
          </div>
        )}
        <div className="product-price-row">
          <span className="product-price">Rs.{price}</span>
          {originalPrice && (
            <span className="product-price-old">Rs.{originalPrice}</span>
          )}
        </div>
        {isSoldOut && (
          <button className="btn-add-cart disabled" disabled>
            Notify Me
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
