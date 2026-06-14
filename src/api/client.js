const BASE = "/api";

const getToken = () => localStorage.getItem("pharma-admin-token");

const headers = (extra = {}) => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const sessionId = () => {
  let sid = localStorage.getItem("pharma-session-id");
  if (!sid) {
    sid = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("pharma-session-id", sid);
  }
  return sid;
};

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: headers({ "x-session-id": sessionId() }),
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// Auth
export const loginAdmin = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
export const getAdminMe = () => request("/auth/me");

// User auth
export const registerUser = (name, email, password) =>
  request("/users/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
export const loginUser = (email, password) =>
  request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// User profile
const userHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("pharma-user-token")}`,
});
const userRequest = async (path, options = {}) => {
  const res = await fetch(`/api${path}`, {
    headers: userHeaders(),
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};
export const getProfile = () => userRequest("/users/profile");
export const updateProfile = (body) =>
  userRequest("/users/profile", { method: "PUT", body: JSON.stringify(body) });
export const changePassword = (body) =>
  userRequest("/users/password", { method: "PUT", body: JSON.stringify(body) });
export const getUserOrders = () => userRequest("/users/orders");
export const trackOrder = (awb) => request(`/shiprocket/track/${awb}`);
export const checkServiceability = (pickup, delivery, weight, cod) =>
  request(
    `/shiprocket/serviceability?pickup_postcode=${pickup}&delivery_postcode=${delivery}&weight=${weight}&cod=${cod}`,
  );
export const getAddresses = () => userRequest("/users/addresses");
export const addAddress = (body) =>
  userRequest("/users/addresses", {
    method: "POST",
    body: JSON.stringify(body),
  });
export const updateAddress = (id, body) =>
  userRequest(`/users/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const deleteAddress = (id) =>
  userRequest(`/users/addresses/${id}`, { method: "DELETE" });

// Products
export const getProducts = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/products${qs ? `?${qs}` : ""}`);
};
export const getFeaturedProducts = () => request("/products/featured");
export const getProduct = (id) => request(`/products/${id}`);
export const createProduct = (body) =>
  request("/products", { method: "POST", body: JSON.stringify(body) });
export const updateProduct = (id, body) =>
  request(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteProduct = (id) =>
  request(`/products/${id}`, { method: "DELETE" });
export const uploadProductImage = async (files) => {
  const form = new FormData();
  files.forEach((f) => form.append("images", f));
  const res = await fetch("/api/products/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("pharma-admin-token")}`,
    },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.urls;
};

// Payment
export const createPaymentOrder = (amount) =>
  request("/payment/create-order", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
export const verifyPayment = (body) =>
  request("/payment/verify", {
    method: "POST",
    body: JSON.stringify(body),
  });

// Orders
export const placeOrder = (body) =>
  request("/orders", { method: "POST", body: JSON.stringify(body) });
export const getOrders = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/orders${qs ? `?${qs}` : ""}`);
};
export const getOrder = (id) => request(`/orders/${id}`);
export const updateOrderStatus = (id, status) =>
  request(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// Shiprocket admin actions
export const srSchedulePickup = (shipmentId) =>
  request("/shiprocket/pickup", {
    method: "POST",
    body: JSON.stringify({ shipment_id: [String(shipmentId)] }),
  });
export const srGenerateLabel = (shipmentId) =>
  request("/shiprocket/label", {
    method: "POST",
    body: JSON.stringify({ shipment_id: [String(shipmentId)] }),
  });
export const srGenerateManifest = (shipmentId) =>
  request("/shiprocket/manifests/generate", {
    method: "POST",
    body: JSON.stringify({ shipment_id: [String(shipmentId)] }),
  });

// Calculate shipping cost
export const calculateShipping = (delivery_postcode, items) =>
  request("/shiprocket/calculate-shipping", {
    method: "POST",
    body: JSON.stringify({ delivery_postcode, items }),
  });

// Customers
export const getCustomers = () => request("/customers");
export const getCustomer = (id) => request(`/customers/${id}`);

// Analytics
export const getKpis = () => request("/analytics/kpis");
export const getRevenue = () => request("/analytics/revenue");
export const getCategories = () => request("/analytics/categories");

// Reviews
export const getReviews = (productId) =>
  request(`/reviews${productId ? `?productId=${productId}` : ""}`);
export const submitReview = (body) =>
  request("/reviews", { method: "POST", body: JSON.stringify(body) });
export const featureReview = (id) =>
  request(`/reviews/${id}/feature`, { method: "PATCH" });

// Contact
export const sendContact = (body) =>
  request("/contact", { method: "POST", body: JSON.stringify(body) });

// Newsletter
export const subscribeNewsletter = (email) =>
  request("/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

// Cart
export const loadCart = (email) =>
  request(`/cart?email=${encodeURIComponent(email)}`);
export const syncCart = (email, items) =>
  request("/cart/sync", {
    method: "POST",
    body: JSON.stringify({ email, items }),
  });

// Wishlist
export const getWishlist = () => request("/wishlist");
export const addToWishlist = (productId) =>
  request(`/wishlist/${productId}`, { method: "POST" });
export const removeFromWishlist = (productId) =>
  request(`/wishlist/${productId}`, { method: "DELETE" });
