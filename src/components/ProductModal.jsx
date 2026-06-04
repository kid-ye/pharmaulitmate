import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Star, ShoppingCart, Check, ShieldCheck, Truck } from "lucide-react";
import { BRAND_NAME, CURRENCY_SYMBOL } from "../constants";
import "./ProductModal.css";

const ProductModal = ({ product, onClose, onAddToCart }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    product.image1, product.image2, product.image3, product.image4, product.image5,
  ].filter(Boolean);
  if (images.length === 0) images.push("/images/placeholder.svg");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const prev = (e) => { e.stopPropagation(); setCurrentImage((i) => (i === 0 ? images.length - 1 : i - 1)); };
  const next = (e) => { e.stopPropagation(); setCurrentImage((i) => (i === images.length - 1 ? 0 : i + 1)); };

  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <div className="pmodal-overlay" onClick={onClose}>
      <div className="pmodal" onClick={(e) => e.stopPropagation()}>
        <button className="pmodal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>

        <div className="pmodal-body">
          {/* Carousel */}
          <div className="pmodal-gallery">
            <div className="pmodal-main-img">
              <img src={images[currentImage]} alt={product.name} />
              {images.length > 1 && (
                <>
                  <button className="pmodal-arrow left" onClick={prev}><ChevronLeft size={22} /></button>
                  <button className="pmodal-arrow right" onClick={next}><ChevronRight size={22} /></button>
                </>
              )}
              {discountPercent && <span className="pmodal-badge discount">-{discountPercent}%</span>}
              {product.is_new && <span className="pmodal-badge new">NEW</span>}
            </div>
            {images.length > 1 && (
              <div className="pmodal-thumbs">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`pmodal-thumb ${i === currentImage ? "active" : ""}`}
                    onClick={() => setCurrentImage(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pmodal-info">
            <span className="pmodal-brand">{BRAND_NAME}</span>
            <h2 className="pmodal-name">{product.name}</h2>

            {product.rating > 0 && (
              <div className="pmodal-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(product.rating) ? "var(--gold)" : "transparent"} color="var(--gold)" />
                ))}
                <span>{product.rating} ({product.reviews_count ?? product.review_count ?? 0} reviews)</span>
              </div>
            )}

            <div className="pmodal-price-row">
              <span className="pmodal-price">{CURRENCY_SYMBOL}{product.price}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="pmodal-price-old">{CURRENCY_SYMBOL}{product.original_price}</span>
              )}
            </div>

            <div className="pmodal-badges">
              <span className={`pmodal-status ${product.status === "In Stock" ? "instock" : product.status === "Low Stock" ? "lowstock" : "outstock"}`}>
                {product.status}
              </span>
              {product.sku && <span className="pmodal-sku">SKU: {product.sku}</span>}
            </div>

            {product.description && (
              <p className="pmodal-description">{product.description}</p>
            )}

            <div className="pmodal-trust">
              <span><Check size={14} /> Quality Assured</span>
              <span><ShieldCheck size={14} /> Secure Checkout</span>
              <span><Truck size={14} /> Fast Delivery</span>
            </div>

            {product.is_sold_out ? (
              <div className="pmodal-soldout">Currently sold out</div>
            ) : (
              <button
                className="pmodal-add-btn"
                onClick={() => { onAddToCart && onAddToCart(product); onClose(); }}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
