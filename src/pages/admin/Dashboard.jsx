import { useState, useEffect } from "react";
import {
  Leaf,
  Home,
  Package,
  ShoppingBag,
  Users,
  BarChart2,
  MessageSquare,
  Settings,
  Search,
  Bell,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BRAND_NAME, ADMIN_EMAIL } from "../../constants";
import {
  getKpis,
  getRevenue,
  getCategories,
  getOrders,
  getProducts,
  getCustomers,
  getReviews,
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct,
  featureReview,
  uploadProductImage,
} from "../../api/client.js";
import "./Dashboard.css";

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "orders", label: "Orders", icon: Package },
  { key: "products", label: "Products", icon: ShoppingBag },
  { key: "customers", label: "Customers", icon: Users },
  { key: "analytics", label: "Analytics", icon: BarChart2 },
  { key: "reviews", label: "Reviews", icon: MessageSquare },
  { key: "settings", label: "Settings", icon: Settings },
];

const SETTINGS_ITEMS = [
  { label: "Store status", value: "Online" },
  { label: "Default fulfillment", value: "Pan India delivery" },
  { label: "Low stock alert", value: "Below 5 units" },
  { label: "Admin email", value: ADMIN_EMAIL },
];

const useCountUp = (end, duration = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{label}</p>
        <p className="value">Rs.{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [toast, setToast] = useState(null);
  const [lowStockDismissed, setLowStockDismissed] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [modalState, setModalState] = useState({ type: null, product: null });
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Live data state
  const [kpis, setKpis] = useState({
    total_revenue: 0,
    orders_today: 0,
    active_products: 0,
    new_customers: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const revCount = useCountUp(kpis.total_revenue, 1500);
  const orderCount = useCountUp(kpis.orders_today, 1000);
  const prodCount = useCountUp(kpis.active_products, 1000);
  const custCount = useCountUp(kpis.new_customers, 1000);

  const activeLabel =
    NAV_ITEMS.find((item) => item.key === activeSection)?.label || "Dashboard";

  useEffect(() => {
    document.body.classList.add("admin-body");
    return () => document.body.classList.remove("admin-body");
  }, []);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Fetch all data on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [k, rev, cat, ord, inv, cust, rev2] = await Promise.all([
          getKpis(),
          getRevenue(),
          getCategories(),
          getOrders({ limit: 50 }),
          getProducts({ limit: 50 }),
          getCustomers(),
          getReviews(),
        ]);
        setKpis(k);
        setRevenueData(rev);
        setCategoryData(cat);
        setOrders(ord.orders ?? []);
        setInventory(inv.products ?? []);
        setCustomers(cust);
        setReviews(rev2);
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const getSortedOrders = () => {
    if (!sortConfig.key) return orders;
    return [...orders].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const getStatusClass = (status) => {
    const map = {
      Pending: "status-pending",
      Processing: "status-processing",
      Shipped: "status-shipped",
      Delivered: "status-delivered",
      Cancelled: "status-cancelled",
      "In Stock": "status-instock",
      "Low Stock": "status-pending",
      "Out of Stock": "status-outofstock",
    };
    return map[status] || "";
  };

  const getStockClass = (stock) => {
    if (stock > 10) return "stock-good";
    if (stock >= 3) return "stock-low";
    return "stock-out";
  };

  const openModal = (type, product = null) => {
    setFormData(
      product
        ? {
            name: product.name,
            sku: product.sku,
            category: product.category,
            stock: product.stock,
            price: product.price,
            status: product.status,
            description: product.description || "",
            images: [
              product.image1,
              product.image2,
              product.image3,
              product.image4,
              product.image5,
            ].filter(Boolean),
          }
        : {
            name: "",
            sku: "",
            category: "Medical Kits",
            stock: 0,
            price: 0,
            status: "In Stock",
            description: "",
            images: [],
          },
    );
    setModalState({ type, product });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const total = (formData.images?.length || 0) + files.length;
    if (total > 5) {
      showToast("Maximum 5 images allowed", "error");
      return;
    }
    setUploading(true);
    try {
      const urls = await uploadProductImage(files);
      setFormData((f) => ({ ...f, images: [...(f.images || []), ...urls] }));
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (idx) =>
    setFormData((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== idx),
    }));

  const handleSaveModal = async () => {
    setSaving(true);
    try {
      if (modalState.type === "delete") {
        await deleteProduct(modalState.product.id);
        setInventory((prev) =>
          prev.filter((p) => p.id !== modalState.product.id),
        );
        showToast("Product deleted");
      } else if (modalState.type === "edit") {
        const images = formData.images || [];
        const updated = await updateProduct(modalState.product.id, {
          ...formData,
          image1: images[0] || null,
          image2: images[1] || null,
          image3: images[2] || null,
          image4: images[3] || null,
          image5: images[4] || null,
        });
        setInventory((prev) =>
          prev.map((p) => (p.id === modalState.product.id ? updated : p)),
        );
        showToast("Product updated");
      } else {
        const images = formData.images || [];
        const created = await createProduct({
          ...formData,
          image1: images[0] || null,
          image2: images[1] || null,
          image3: images[2] || null,
          image4: images[3] || null,
          image5: images[4] || null,
        });
        setInventory((prev) => [...prev, created]);
        showToast("Product added");
      }
      setModalState({ type: null, product: null });
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const hasLowStock = inventory.some((item) => item.stock < 5);

  const renderKpiCards = () => (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div
          className="kpi-icon"
          style={{
            background: "rgba(47, 143, 139, 0.1)",
            color: "var(--admin-gold)",
          }}
        >
          <DollarSign size={20} />
        </div>
        <span className="kpi-trend trend-success">+12.4% up</span>
        <h2 className="kpi-value">Rs.{revCount.toLocaleString()}</h2>
        <p className="kpi-label">Total Revenue</p>
        <svg className="kpi-sparkline" viewBox="0 0 80 24">
          <path
            d="M0,24 L10,18 L20,20 L30,12 L40,15 L50,8 L60,10 L70,2 L80,0"
            fill="none"
            stroke="var(--admin-gold)"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="kpi-card">
        <div
          className="kpi-icon"
          style={{
            background: "rgba(76, 175, 125, 0.1)",
            color: "var(--admin-success)",
          }}
        >
          <ShoppingCart size={20} />
        </div>
        <span className="kpi-trend trend-success">+8 today</span>
        <h2 className="kpi-value">{orderCount}</h2>
        <p className="kpi-label">Orders Today</p>
        <svg className="kpi-sparkline" viewBox="0 0 80 24">
          <path
            d="M0,20 L20,24 L40,12 L60,16 L80,4"
            fill="none"
            stroke="var(--admin-success)"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="kpi-card">
        <div
          className="kpi-icon"
          style={{
            background: "rgba(92, 155, 224, 0.1)",
            color: "var(--admin-info)",
          }}
        >
          <Package size={20} />
        </div>
        <span className="kpi-trend trend-warning">3 low stock</span>
        <h2 className="kpi-value">{prodCount}</h2>
        <p className="kpi-label">Active Products</p>
        <svg className="kpi-sparkline" viewBox="0 0 80 24">
          <path
            d="M0,12 L20,12 L40,12 L60,12 L80,12"
            fill="none"
            stroke="var(--admin-info)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>
      </div>
      <div className="kpi-card">
        <div
          className="kpi-icon"
          style={{
            background: "rgba(224, 92, 92, 0.1)",
            color: "var(--admin-danger)",
          }}
        >
          <Users size={20} />
        </div>
        <span className="kpi-trend trend-success">+18.3% up</span>
        <h2 className="kpi-value">{custCount}</h2>
        <p className="kpi-label">New Customers</p>
        <svg className="kpi-sparkline" viewBox="0 0 80 24">
          <path
            d="M0,24 L20,15 L40,18 L60,8 L80,2"
            fill="none"
            stroke="var(--admin-danger)"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );

  const renderCharts = () => (
    <div className="charts-row">
      <div className="chart-card">
        <h3>Monthly Revenue</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <XAxis
                dataKey="name"
                stroke="var(--admin-border)"
                tick={{ fill: "var(--admin-muted)", fontSize: 12 }}
              />
              <YAxis
                stroke="var(--admin-border)"
                tick={{ fill: "var(--admin-muted)", fontSize: 12 }}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--admin-gold)"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: "var(--admin-surface)",
                  stroke: "var(--admin-gold)",
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3 style={{ textAlign: "center" }}>Sales by Category</h3>
        <div
          className="chart-container"
          style={{ position: "relative", height: "200px" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: "var(--admin-muted)",
                display: "block",
              }}
            >
              Total Sales
            </span>
          </div>
        </div>
        <div className="donut-legend">
          {categoryData.map((item) => (
            <div key={item.name} className="legend-item">
              <span
                className="legend-dot"
                style={{ backgroundColor: item.color }}
              ></span>
              <span>
                {item.name} <span className="legend-val">{item.value}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrdersTable = (title = "Recent Orders") => (
    <div className="table-card">
      <div className="table-header">
        <h3>
          {title} <span className="table-count">({orders.length} total)</span>
        </h3>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>
                Order ID <ArrowUpDown size={12} />
              </th>
              <th onClick={() => handleSort("customer_name")}>
                Customer <ArrowUpDown size={12} />
              </th>
              <th onClick={() => handleSort("total_amount")}>
                Amount <ArrowUpDown size={12} />
              </th>
              <th onClick={() => handleSort("status")}>
                Status <ArrowUpDown size={12} />
              </th>
              <th onClick={() => handleSort("created_at")}>
                Date <ArrowUpDown size={12} />
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {getSortedOrders().map((order) => (
              <tr key={order.id}>
                <td className="mono-text mono-gold">#{order.id}</td>
                <td>{order.customer_name ?? order.customer_email}</td>
                <td className="mono-text">
                  Rs.{Number(order.total).toLocaleString()}
                </td>
                <td>
                  <span
                    className={`status-pill ${getStatusClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  {new Date(order.created_at).toLocaleDateString("en-IN")}
                </td>
                <td>
                  <select
                    className="action-link"
                    defaultValue={order.status}
                    onChange={async (e) => {
                      try {
                        await updateOrderStatus(order.id, e.target.value);
                        setOrders((prev) =>
                          prev.map((o) =>
                            o.id === order.id
                              ? { ...o, status: e.target.value }
                              : o,
                          ),
                        );
                        showToast(`Order #${order.id} → ${e.target.value}`);
                      } catch (err) {
                        showToast(err.message, "error");
                      }
                    }}
                  >
                    {[
                      "Pending",
                      "Processing",
                      "Shipped",
                      "Delivered",
                      "Cancelled",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProductsTable = (title = "Inventory") => (
    <div className="table-card">
      {hasLowStock && !lowStockDismissed && (
        <div className="low-stock-alert">
          <span>3 products running low on stock</span>
          <button
            className="alert-close"
            onClick={() => setLowStockDismissed(true)}
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className="table-header">
        <h3>
          {title}{" "}
          <span className="table-count">({inventory.length} products)</span>
        </h3>
        <button className="btn-admin-outline" onClick={() => openModal("add")}>
          + Add Product
        </button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.sku}>
                <td>{item.name}</td>
                <td
                  className="mono-text"
                  style={{ color: "var(--admin-muted)" }}
                >
                  {item.sku}
                </td>
                <td>{item.category}</td>
                <td className={`mono-text ${getStockClass(item.stock)}`}>
                  {item.stock < 3 && "! "}
                  {item.stock}
                </td>
                <td className="mono-text">Rs.{item.price.toLocaleString()}</td>
                <td>
                  <span
                    className={`status-pill ${getStatusClass(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="action-icons">
                    <button
                      className="icon-action icon-edit"
                      title="Edit"
                      onClick={() => openModal("edit", item)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="icon-action icon-delete"
                      title="Delete"
                      onClick={() => openModal("delete", item)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="table-card">
      <div className="table-header">
        <h3>
          Customers{" "}
          <span className="table-count">({customers.length} profiles)</span>
        </h3>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Total Spend</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td style={{ color: "var(--admin-muted)", fontSize: "13px" }}>
                  {c.email}
                </td>
                <td className="mono-text">{c.orders ?? 0}</td>
                <td className="mono-text">
                  Rs.{Number(c.spend ?? 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="demo-card-grid">
      {reviews.map((review) => (
        <div className="demo-card" key={review.id}>
          <span className="demo-card-eyebrow">
            {review.product_name ?? `Product #${review.product_id}`}
          </span>
          <h3>
            {review.rating}/5 from{" "}
            {review.customer_name ?? review.customer_email}
          </h3>
          <p>"{review.text}"</p>
          <button
            type="button"
            className="action-link"
            onClick={async () => {
              try {
                await featureReview(review.id);
                showToast("Review marked as featured");
              } catch (err) {
                showToast(err.message, "error");
              }
            }}
          >
            {review.is_featured ? "Unfeature" : "Feature review"}
          </button>
        </div>
      ))}
    </div>
  );

  const renderSettings = () => (
    <div className="demo-card-grid">
      {SETTINGS_ITEMS.map((item) => (
        <div className="demo-card" key={item.label}>
          <span className="demo-card-eyebrow">{item.label}</span>
          <h3>{item.value}</h3>
          <p>Demo admin setting for the medical supply store dashboard.</p>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    if (activeSection === "orders") return renderOrdersTable("Orders");
    if (activeSection === "products")
      return renderProductsTable("Demo Products");
    if (activeSection === "customers") return renderCustomers();
    if (activeSection === "analytics")
      return (
        <>
          {renderKpiCards()}
          {renderCharts()}
        </>
      );
    if (activeSection === "reviews") return renderReviews();
    if (activeSection === "settings") return renderSettings();

    return (
      <>
        {renderKpiCards()}
        {renderCharts()}
        {renderOrdersTable()}
        {renderProductsTable()}
      </>
    );
  };

  return (
    <div className="admin-dashboard">
      {toast && (
        <div className={`admin-toast toast-${toast.type}`}>
          {toast.type === "success" ? "Done: " : "Error: "}
          {toast.message}
        </div>
      )}

      <aside
        className="admin-sidebar"
        style={{ width: isSidebarOpen ? "240px" : "60px" }}
      >
        <div className="sidebar-header">
          <Leaf color="var(--admin-gold)" size={24} />
          <div className="sidebar-brand-text">
            <h2>{BRAND_NAME}</h2>
            <p>Admin Panel</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`nav-item ${activeSection === key ? "active" : ""}`}
              onClick={() => setActiveSection(key)}
            >
              <Icon size={20} /> <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="admin-avatar">{getInitials("Admin User")}</div>
          <div className="admin-info">
            <p>Admin User</p>
            <span>{ADMIN_EMAIL}</span>
            <button type="button" className="logout-link" onClick={onLogout}>
              Log out
            </button>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <h1>{activeLabel}</h1>
            <span className="breadcrumb">Admin / {activeLabel}</span>
          </div>
          <div className="topbar-right">
            <span className="today-date">
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <div className="search-input-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="admin-search"
              />
            </div>
            <div className="bell-icon-wrap">
              <Bell size={20} />
              <span className="bell-badge">3</span>
            </div>
            <div className="topbar-avatar">AU</div>
          </div>
        </header>

        <div className="admin-content">{renderContent()}</div>
      </main>

      {modalState.type && (
        <div
          className="admin-modal-overlay"
          onClick={() => setModalState({ type: null, product: null })}
        >
          {(modalState.type === "edit" || modalState.type === "add") && (
            <div
              className="admin-modal anim-enter"
              style={{ width: modalState.type === "add" ? "640px" : "560px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>
                  {modalState.type === "edit"
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>
                <button
                  className="alert-close"
                  onClick={() => setModalState({ type: null, product: null })}
                >
                  <X size={20} />
                </button>
              </div>
              <div
                className="modal-body"
                style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}
              >
                <div style={{ flex: 1, minWidth: "220px" }}>
                  <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="Name"
                    />
                  </div>
                  <div
                    className="form-group"
                    style={{ display: "flex", gap: "12px" }}
                  >
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Stock Qty</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.stock ?? 0}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            stock: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.price ?? 0}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            price: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      value={formData.status || "In Stock"}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, status: e.target.value }))
                      }
                    >
                      <option>In Stock</option>
                      <option>Low Stock</option>
                      <option>Out of Stock</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Short description..."
                    />
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: "220px" }}>
                  <div
                    className="form-group"
                    style={{ display: "flex", gap: "12px" }}
                  >
                    <div style={{ flex: 1 }}>
                      <label className="form-label">SKU</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.sku || ""}
                        onChange={(e) =>
                          setFormData((f) => ({ ...f, sku: e.target.value }))
                        }
                        placeholder="EKM-XXX-000"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Category</label>
                      <select
                        className="form-control"
                        value={formData.category || "Medical Kits"}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            category: e.target.value,
                          }))
                        }
                      >
                        <option>Medical Kits</option>
                        <option>Diagnostics</option>
                        <option>Wound Care</option>
                        <option>PPE</option>
                        <option>Clinical Components</option>
                      </select>
                    </div>
                  </div>

                  <div
                    className="form-group"
                    style={{ display: "flex", gap: "12px", marginTop: "12px" }}
                  >
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        value={formData.weight ?? 0.5}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            weight: Number(e.target.value),
                          }))
                        }
                        placeholder="0.5"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Origin Pincode</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.origin_pincode || "400001"}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            origin_pincode: e.target.value,
                          }))
                        }
                        placeholder="400001"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: "12px" }}>
                    <label
                      className="form-label"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.is_cod_eligible ?? true}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            is_cod_eligible: e.target.checked,
                          }))
                        }
                      />
                      <span>Eligible for Cash on Delivery (COD)</span>
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Images ({formData.images?.length || 0}/5)
                      {uploading && (
                        <span
                          style={{
                            color: "var(--admin-muted)",
                            marginLeft: "8px",
                          }}
                        >
                          Uploading…
                        </span>
                      )}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="form-control"
                      disabled={
                        uploading || (formData.images?.length || 0) >= 5
                      }
                      onChange={handleImageUpload}
                    />
                    {formData.images?.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          marginTop: "8px",
                        }}
                      >
                        {formData.images.map((url, i) => (
                          <div key={i} style={{ position: "relative" }}>
                            <img
                              src={url}
                              alt={`img${i + 1}`}
                              style={{
                                height: "60px",
                                width: "60px",
                                objectFit: "cover",
                                borderRadius: "4px",
                                border: "1px solid var(--admin-border)",
                              }}
                            />
                            <button
                              onClick={() => removeImage(i)}
                              style={{
                                position: "absolute",
                                top: "-6px",
                                right: "-6px",
                                background: "var(--admin-danger)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50%",
                                width: "18px",
                                height: "18px",
                                cursor: "pointer",
                                fontSize: "11px",
                                lineHeight: "18px",
                                padding: 0,
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--admin-muted)",
                        marginTop: "4px",
                      }}
                    >
                      Max 5 images. First image is the main product image.
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-ghost"
                  onClick={() => setModalState({ type: null, product: null })}
                >
                  Cancel
                </button>
                <button
                  className="btn-gold-filled"
                  onClick={handleSaveModal}
                  disabled={saving}
                >
                  {saving
                    ? "Saving…"
                    : modalState.type === "edit"
                      ? "Save Changes"
                      : "Add Product"}
                </button>
              </div>
            </div>
          )}

          {modalState.type === "delete" && (
            <div
              className="admin-modal anim-enter"
              style={{ width: "400px", textAlign: "center" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-body" style={{ paddingTop: "32px" }}>
                <AlertCircle
                  size={48}
                  color="var(--admin-danger)"
                  style={{ marginBottom: "16px" }}
                />
                <h2
                  style={{
                    fontFamily: "Cormorant Garamond",
                    fontSize: "28px",
                    margin: "0 0 12px",
                  }}
                >
                  Are you sure?
                </h2>
                <p
                  style={{
                    color: "var(--admin-muted)",
                    fontSize: "14px",
                    marginBottom: "24px",
                  }}
                >
                  This permanently removes{" "}
                  <strong>{modalState.product?.name}</strong>.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "center",
                  }}
                >
                  <button
                    className="btn-ghost"
                    onClick={() => setModalState({ type: null, product: null })}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-red-filled"
                    onClick={handleSaveModal}
                    disabled={saving}
                  >
                    {saving ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
