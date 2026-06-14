import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, checkServiceability, getReviews, submitReview } from "../api/client";
import { CURRENCY_SYMBOL } from "../constants";
import {
  Minus,
  Plus,
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  MapPin,
  Star,
} from "lucide-react";
import "./ProductDetails.css";

const ProductDetails = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  // Delivery check states
  const [pincode, setPincode] = useState("");
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState(null);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, text: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const [productData, reviewsData] = await Promise.all([
          getProduct(id),
          getReviews(id)
        ]);
        setProduct(productData.product || productData);
        setReviews(reviewsData || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load product details.");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="product-details-loading">Loading...</div>;
  if (error || !product)
    return (
      <div className="product-details-error">
        Product not found.{" "}
        <button onClick={() => navigate("/shop")}>Back to Shop</button>
      </div>
    );

  const images = [];
  if (product.image1) images.push(product.image1);
  if (product.image2) images.push(product.image2);
  if (product.image3) images.push(product.image3);
  if (product.image4) images.push(product.image4);
  if (product.image5) images.push(product.image5);

  if (images.length === 0) images.push("/images/placeholder.svg"); // Fallback if no images

  const handleAddToCart = () => {
    onAddToCart(product, qty);
  };

  const handleCheckPincode = async () => {
    if (!pincode || pincode.length !== 6) return;
    setCheckingPincode(true);
    setDeliveryResult(null);
    try {
      const res = await checkServiceability(
        product.origin_pincode || "400001",
        pincode,
        product.weight || 0.5,
        product.is_cod_eligible ? 1 : 0,
      );

      if (
        res.status === 200 &&
        res.data?.available_courier_companies?.length > 0
      ) {
        // Find the quickest/cheapest courier logic, here we just take the first recommended one
        const estimatedDate =
          res.data.available_courier_companies[0].estimated_delivery_date;
        const rate = res.data.available_courier_companies[0].rate;

        setDeliveryResult({
          available: true,
          date: estimatedDate,
          rate: rate,
        });
      } else {
        setDeliveryResult({ available: false });
      }
    } catch (err) {
      setDeliveryResult({
        available: false,
        error: "Could not fetch delivery details.",
      });
    } finally {
      setCheckingPincode(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) return;
    setSubmittingReview(true);
    try {
      const newReview = await submitReview({
        product_id: product.id,
        customer_name: reviewForm.name,
        rating: reviewForm.rating,
        text: reviewForm.text,
      });
      setReviews([newReview, ...reviews]);
      setReviewForm({ name: "", rating: 5, text: "" });
      setShowReviewForm(false);
      // Refresh product to update rating
      const updated = await getProduct(id);
      setProduct(updated.product || updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        {/* Left Side: Images */}
        <div className="product-gallery">
          <div className="main-image-container">
            <img
              src={images[currentImage]}
              alt={product.name}
              className="main-image"
            />
          </div>
          {images.length > 1 && (
            <div className="thumbnail-list">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${currentImage === index ? "active" : ""}`}
                  onClick={() => setCurrentImage(index)}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Info */}
        <div className="product-info-panel">
          <div className="product-breadcrumbs">
            <span onClick={() => navigate("/shop")}>Shop</span> /{" "}
            <span>{product.category}</span>
          </div>

          <h1 className="product-title">{product.name}</h1>

          <div className="product-price-row">
            <span className="current-price">
              {CURRENCY_SYMBOL}
              {product.price}
            </span>
            {product.original_price &&
              product.original_price > product.price && (
                <span className="original-price">
                  {CURRENCY_SYMBOL}
                  {product.original_price}
                </span>
              )}
          </div>

          <div className="stock-badges">
            <span
              className={`status-badge ${product.status === "In Stock" ? "instock" : product.status === "Low Stock" ? "lowstock" : "outstock"}`}
            >
              {product.status}
            </span>
            {product.sku && (
              <span className="sku-badge">SKU: {product.sku}</span>
            )}
          </div>

          <p className="product-description">
            {product.description ||
              "No description available for this product."}
          </p>

          <div className="product-trust-badges">
            <div className="trust-badge">
              <Check size={18} /> Quality Assured
            </div>
            <div className="trust-badge">
              <ShieldCheck size={18} /> Secure Checkout
            </div>
            <div className="trust-badge">
              <Truck size={18} /> Fast Delivery
            </div>
          </div>

          <hr className="divider" />

          {/* Delivery Check Section */}
          <div className="delivery-check-section">
            <h4>
              <MapPin size={18} /> Check Delivery & Shipping Details
            </h4>
            <div className="pincode-input-group">
              <input
                type="text"
                placeholder="Enter 6-digit Pincode"
                value={pincode}
                onChange={(e) =>
                  setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
              <button
                onClick={handleCheckPincode}
                disabled={pincode.length !== 6 || checkingPincode}
              >
                {checkingPincode ? "Checking..." : "Check"}
              </button>
            </div>

            {deliveryResult && (
              <div
                className={`delivery-result ${deliveryResult.available ? "success" : "error"}`}
              >
                {deliveryResult.available ? (
                  <>
                    <p className="delivery-status">
                      ✓ Delivery Available to {pincode}
                    </p>
                    <p className="delivery-estimate">
                      Estimated Delivery:{" "}
                      <strong>
                        {new Date(deliveryResult.date).toLocaleDateString()}
                      </strong>
                    </p>
                    <p className="delivery-rate">
                      Estimated Shipping Cost:{" "}
                      <strong>
                        {CURRENCY_SYMBOL}
                        {deliveryResult.rate}
                      </strong>
                    </p>
                  </>
                ) : (
                  <p className="delivery-status">
                    ✕ Service unavailable for this pincode right now.
                  </p>
                )}
              </div>
            )}
          </div>

          <hr className="divider" />

          {/* Add to Cart Controls */}
          {product.is_sold_out ? (
            <div className="sold-out-alert">
              This item is currently sold out.
            </div>
          ) : (
            <div className="add-to-cart-controls">
              <div className="qty-selector">
                <button
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus size={16} />
                </button>
                <span>{qty}</span>
                <button
                  aria-label="Increase quantity"
                  disabled={qty >= product.stock}
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                className="add-to-cart-btn btn stretch"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          <div className="reviews-summary">
            <div className="rating-display">
              <Star size={24} fill="#f59e0b" color="#f59e0b" />
              <span className="rating-value">{product.rating || 0}</span>
              <span className="rating-count">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
            </div>
            <button className="btn-outline" onClick={() => setShowReviewForm(!showReviewForm)}>
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>
        </div>

        {showReviewForm && (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                value={reviewForm.name}
                onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Rating</label>
              <div className="star-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={32}
                    fill={star <= reviewForm.rating ? "#f59e0b" : "none"}
                    color={star <= reviewForm.rating ? "#f59e0b" : "#d1d5db"}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Your Review</label>
              <textarea
                value={reviewForm.text}
                onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                rows={4}
                required
              />
            </div>
            <button type="submit" className="btn" disabled={submittingReview}>
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews
              .sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
              .map((review) => (
                <div key={review.id} className={`review-card ${review.is_featured ? 'featured' : ''}`}>
                  {review.is_featured && <span className="featured-badge">Featured</span>}
                  <div className="review-header">
                    <div className="review-author">{review.customer_name}</div>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < review.rating ? "#f59e0b" : "none"}
                          color={i < review.rating ? "#f59e0b" : "#d1d5db"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-text">{review.text}</p>
                  <span className="review-date">
                    {new Date(review.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
