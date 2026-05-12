import { useState, useEffect } from 'react';
import { 
  Leaf, Home, Package, ShoppingBag, Users, BarChart2, MessageSquare, Settings, 
  Search, Bell, DollarSign, ShoppingCart, AlertCircle, X, Edit2, Trash2, ArrowUpDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { REVENUE_DATA, CATEGORY_DATA, RECENT_ORDERS, INVENTORY_DATA } from './constants';
import { BRAND_NAME, ADMIN_EMAIL } from '../../constants';
import './Dashboard.css';

// Admin Avatar initials
const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

// Count-up hook
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

// Custom Chart Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{label}</p>
        <p className="value">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' }
  const [lowStockDismissed, setLowStockDismissed] = useState(false);
  const [inventory, setInventory] = useState(INVENTORY_DATA);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Modals state
  const [modalState, setModalState] = useState({ type: null, product: null }); // type: 'edit' | 'add' | 'delete'

  const revCount = useCountUp(124580, 1500);
  const orderCount = useCountUp(34, 1000);
  const prodCount = useCountUp(18, 1000);
  const custCount = useCountUp(127, 1000);

  // Apply admin body class
  useEffect(() => {
    document.body.classList.add('admin-body');
    return () => {
      document.body.classList.remove('admin-body');
    };
  }, []);

  // Resize handler
  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toast Auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortedOrders = () => {
    if (!sortConfig.key) return RECENT_ORDERS;
    return [...RECENT_ORDERS].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const hasLowStock = inventory.some(item => item.stock < 5);

  const getStatusClass = (status) => {
    const map = {
      'Pending': 'status-pending',
      'Processing': 'status-processing',
      'Shipped': 'status-shipped',
      'Delivered': 'status-delivered',
      'Cancelled': 'status-cancelled',
      'In Stock': 'status-instock',
      'Low Stock': 'status-pending',
      'Out of Stock': 'status-outofstock'
    };
    return map[status] || '';
  };

  const getStockClass = (stock) => {
    if (stock > 10) return 'stock-good';
    if (stock >= 3) return 'stock-low';
    return 'stock-out';
  };

  const handleSaveModal = () => {
    showToast(modalState.type === 'delete' ? 'Product removed' : 'Product updated successfully');
    setModalState({ type: null, product: null });
  };

  return (
    <div className="admin-dashboard">
      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast toast-${toast.type}`}>
          {toast.type === 'success' ? '✓ ' : '✕ '}{toast.message}
        </div>
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ width: isSidebarOpen ? '240px' : '60px' }}>
        <div className="sidebar-header">
          <Leaf color="var(--admin-gold)" size={24} />
          <div className="sidebar-brand-text">
            <h2>{BRAND_NAME}</h2>
            <p>Admin Panel</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item active"><Home size={20} /> <span>Dashboard</span></button>
          <button className="nav-item"><Package size={20} /> <span>Orders</span></button>
          <button className="nav-item"><ShoppingBag size={20} /> <span>Products</span></button>
          <button className="nav-item"><Users size={20} /> <span>Customers</span></button>
          <button className="nav-item"><BarChart2 size={20} /> <span>Analytics</span></button>
          <button className="nav-item"><MessageSquare size={20} /> <span>Reviews</span></button>
          <button className="nav-item"><Settings size={20} /> <span>Settings</span></button>
        </nav>
        <div className="sidebar-footer">
          <div className="admin-avatar">{getInitials('Admin User')}</div>
          <div className="admin-info">
            <p>Admin User</p>
            <span>{ADMIN_EMAIL}</span>
            <a href="#" className="logout-link">Log out</a>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <h1>Dashboard</h1>
            <span className="breadcrumb">Admin / Dashboard</span>
          </div>
          <div className="topbar-right">
            <span className="today-date">10 May 2026</span>
            <div className="search-input-wrap">
              <Search size={16} />
              <input type="text" placeholder="Search..." className="admin-search" />
            </div>
            <div className="bell-icon-wrap">
              <Bell size={20} />
              <span className="bell-badge">3</span>
            </div>
            <div className="topbar-avatar">AU</div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="admin-content">
          
          {/* KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon" style={{background: 'rgba(201, 168, 76, 0.1)', color: 'var(--admin-gold)'}}><DollarSign size={20}/></div>
              <span className="kpi-trend trend-success">+12.4% &uarr;</span>
              <h2 className="kpi-value">₹{revCount.toLocaleString()}</h2>
              <p className="kpi-label">Total Revenue</p>
              <svg className="kpi-sparkline" viewBox="0 0 80 24">
                <path d="M0,24 L10,18 L20,20 L30,12 L40,15 L50,8 L60,10 L70,2 L80,0" fill="none" stroke="var(--admin-gold)" strokeWidth="2"/>
              </svg>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon" style={{background: 'rgba(76, 175, 125, 0.1)', color: 'var(--admin-success)'}}><ShoppingCart size={20}/></div>
              <span className="kpi-trend trend-success">+8 since yesterday</span>
              <h2 className="kpi-value">{orderCount}</h2>
              <p className="kpi-label">Orders Today</p>
              <svg className="kpi-sparkline" viewBox="0 0 80 24">
                <path d="M0,20 L20,24 L40,12 L60,16 L80,4" fill="none" stroke="var(--admin-success)" strokeWidth="2"/>
              </svg>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon" style={{background: 'rgba(92, 155, 224, 0.1)', color: 'var(--admin-info)'}}><Package size={20}/></div>
              <span className="kpi-trend trend-warning">3 low stock ⚠️</span>
              <h2 className="kpi-value">{prodCount}</h2>
              <p className="kpi-label">Active Products</p>
              <svg className="kpi-sparkline" viewBox="0 0 80 24">
                <path d="M0,12 L20,12 L40,12 L60,12 L80,12" fill="none" stroke="var(--admin-info)" strokeWidth="2" strokeDasharray="4 4"/>
              </svg>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon" style={{background: 'rgba(224, 92, 92, 0.1)', color: 'var(--admin-danger)'}}><Users size={20}/></div>
              <span className="kpi-trend trend-success">+18.3% &uarr;</span>
              <h2 className="kpi-value">{custCount}</h2>
              <p className="kpi-label">New Customers</p>
              <svg className="kpi-sparkline" viewBox="0 0 80 24">
                <path d="M0,24 L20,15 L40,18 L60,8 L80,2" fill="none" stroke="var(--admin-danger)" strokeWidth="2"/>
              </svg>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            <div className="chart-card">
              <h3>Monthly Revenue</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REVENUE_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <XAxis dataKey="name" stroke="var(--admin-border)" tick={{fill: 'var(--admin-muted)', fontSize: 12}} />
                    <YAxis stroke="var(--admin-border)" tick={{fill: 'var(--admin-muted)', fontSize: 12}} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="value" stroke="var(--admin-gold)" strokeWidth={2.5} dot={{r: 4, fill: 'var(--admin-surface)', stroke: 'var(--admin-gold)'}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="chart-card">
              <h3 style={{textAlign: 'center'}}>Sales by Category</h3>
              <div className="chart-container" style={{position: 'relative', height: '200px'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={CATEGORY_DATA} innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                      {CATEGORY_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
                  <span style={{fontSize: '11px', color: 'var(--admin-muted)', display: 'block'}}>Total Sales</span>
                </div>
              </div>
              <div className="donut-legend">
                {CATEGORY_DATA.map(item => (
                  <div key={item.name} className="legend-item">
                    <span className="legend-dot" style={{backgroundColor: item.color}}></span>
                    <span>{item.name} <span className="legend-val">{item.value}%</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="table-card">
            <div className="table-header">
              <h3>Recent Orders <span className="table-count">(8 total)</span></h3>
            </div>
            <div style={{overflowX: 'auto'}}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('id')}>Order ID <ArrowUpDown size={12}/></th>
                    <th onClick={() => handleSort('customer')}>Customer <ArrowUpDown size={12}/></th>
                    <th onClick={() => handleSort('product')}>Product <ArrowUpDown size={12}/></th>
                    <th onClick={() => handleSort('amount')}>Amount <ArrowUpDown size={12}/></th>
                    <th onClick={() => handleSort('status')}>Status <ArrowUpDown size={12}/></th>
                    <th onClick={() => handleSort('date')}>Date <ArrowUpDown size={12}/></th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedOrders().map(order => (
                    <tr key={order.id}>
                      <td className="mono-text mono-gold">{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.product}</td>
                      <td className="mono-text">₹{order.amount.toLocaleString()}</td>
                      <td><span className={`status-pill ${getStatusClass(order.status)}`}>{order.status}</span></td>
                      <td>{order.date}</td>
                      <td><a href="#" className="action-link">View &rarr;</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="table-card">
            {hasLowStock && !lowStockDismissed && (
              <div className="low-stock-alert">
                <span>⚠️ 3 products running low on stock</span>
                <button className="alert-close" onClick={() => setLowStockDismissed(true)}><X size={16}/></button>
              </div>
            )}
            <div className="table-header">
              <h3>Inventory <span className="table-count">(18 products)</span></h3>
              <button className="btn-admin-outline" onClick={() => setModalState({ type: 'add', product: null })}>+ Add New Product</button>
            </div>
            <div style={{overflowX: 'auto'}}>
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
                  {inventory.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td className="mono-text" style={{color: 'var(--admin-muted)'}}>{item.sku}</td>
                      <td>{item.category}</td>
                      <td className={`mono-text ${getStockClass(item.stock)}`}>
                        {item.stock < 3 && '⚠ '}{item.stock}
                      </td>
                      <td className="mono-text">₹{item.price.toLocaleString()}</td>
                      <td><span className={`status-pill ${getStatusClass(item.status)}`}>{item.status}</span></td>
                      <td>
                        <div className="action-icons">
                          <button className="icon-action icon-edit" title="Edit" onClick={() => setModalState({ type: 'edit', product: item })}><Edit2 size={16}/></button>
                          <button className="icon-action icon-delete" title="Delete" onClick={() => setModalState({ type: 'delete', product: item })}><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {modalState.type && (
        <div className="admin-modal-overlay" onClick={() => setModalState({ type: null, product: null })}>
          
          {/* Edit / Add Modal */}
          {(modalState.type === 'edit' || modalState.type === 'add') && (
            <div className="admin-modal anim-enter" style={{width: modalState.type === 'add' ? '640px' : '560px'}} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{modalState.type === 'edit' ? 'Edit Product' : 'Add New Product'}</h2>
                <button className="alert-close" onClick={() => setModalState({ type: null, product: null })}><X size={20}/></button>
              </div>
              <div className="modal-body" style={{display: modalState.type === 'add' ? 'flex' : 'block', gap: '24px'}}>
                <div style={{flex: 1}}>
                  {modalState.type === 'add' && (
                    <div className="form-group">
                      <label className="form-label">Product Name</label>
                      <input type="text" className="form-control" placeholder="Name" />
                    </div>
                  )}
                  <div className="form-group" style={{display: 'flex', gap: '12px'}}>
                    <div style={{flex: 1}}>
                      <label className="form-label">Stock Qty</label>
                      <input type="number" className="form-control" defaultValue={modalState.product?.stock || 0} />
                    </div>
                    <div style={{flex: 1}}>
                      <label className="form-label">Price</label>
                      <input type="number" className="form-control" defaultValue={modalState.product?.price || 0} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-control" defaultValue={modalState.product?.status || 'In Stock'}>
                      <option>In Stock</option>
                      <option>Low Stock</option>
                      <option>Out of Stock</option>
                    </select>
                  </div>
                  {modalState.type === 'edit' && (
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" placeholder="Short description..."></textarea>
                    </div>
                  )}
                </div>

                {modalState.type === 'add' && (
                  <div style={{flex: 1}}>
                    <div className="form-group">
                      <label className="form-label">SKU</label>
                      <input type="text" className="form-control" placeholder="EKM-XXX-000" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select className="form-control">
                        <option>Planners</option>
                        <option>Journals</option>
                        <option>Kits</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Image Upload</label>
                      <div style={{border: '1px dashed var(--admin-border)', padding: '32px', textAlign: 'center', borderRadius: '6px', color: 'var(--admin-muted)', fontSize: '12px'}}>
                        Drag and drop image here
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-ghost" onClick={() => setModalState({ type: null, product: null })}>Cancel</button>
                <button className="btn-gold-filled" onClick={handleSaveModal}>
                  {modalState.type === 'edit' ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </div>
          )}

          {/* Delete Confirm Modal */}
          {modalState.type === 'delete' && (
            <div className="admin-modal anim-enter" style={{width: '400px', textAlign: 'center'}} onClick={e => e.stopPropagation()}>
              <div className="modal-body" style={{paddingTop: '32px'}}>
                <AlertCircle size={48} color="var(--admin-danger)" style={{marginBottom: '16px'}} />
                <h2 style={{fontFamily: 'Cormorant Garamond', fontSize: '28px', margin: '0 0 12px'}}>Are you sure?</h2>
                <p style={{color: 'var(--admin-muted)', fontSize: '14px', marginBottom: '24px'}}>
                  This permanently removes <strong>{modalState.product?.name}</strong>.
                </p>
                <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                  <button className="btn-ghost" onClick={() => setModalState({ type: null, product: null })}>Cancel</button>
                  <button className="btn-red-filled" onClick={handleSaveModal}>Delete</button>
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
