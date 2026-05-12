import { Heart, Star } from 'lucide-react';
import { BRAND_NAME } from '../constants';
import './ProductCard.css';

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
  rating = null,
  reviews = null,
  showWishlist = false,
  isWished = false,
  onToggleWishlist,
  onQuickShop,
  className = '',
  style = {}
}) => {
  const discountPercent = discount ?? (originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null);

  return (
    <div className={`product-card ${className}`} style={style}>
      <div className="product-image-wrap">
        {discountPercent && <span className="badge discount-badge">-{discountPercent}%</span>}
        {isNew && <span className="badge new-badge">NEW</span>}
        {isSoldOut && <span className="badge soldout-badge">SOLD OUT</span>}

        {showWishlist && (
          <button className="wishlist-btn" onClick={onToggleWishlist} aria-label="Wishlist">
            <Heart size={20} fill={isWished ? 'var(--accent)' : 'transparent'} color={isWished ? 'var(--accent)' : 'var(--text)'} />
          </button>
        )}

        <div className="product-images">
          <img src={imagePrimary} alt={name} className="img-primary" />
          <img src={imageSecondary} alt={name} className="img-secondary" />
        </div>

        <button className="quick-shop-btn" onClick={onQuickShop}>Quick Shop</button>
      </div>

      <div className="product-info">
        <span className="brand-tag">{brandTag}</span>
        <h3 className="product-name">{name}</h3>
        {rating != null && (
          <div className="product-rating">
            <Star size={12} fill="var(--gold)" color="var(--gold)" />
            <span>{rating} <span className="reviews">({reviews})</span></span>
          </div>
        )}
        <div className="product-price-row">
          <span className="product-price">₹{price}</span>
          {originalPrice && <span className="product-price-old">₹{originalPrice}</span>}
        </div>
        {isSoldOut ? (
          <button className="btn-add-cart disabled" disabled>Notify Me</button>
        ) : (
          <button className="btn-add-cart">Add to Cart</button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
