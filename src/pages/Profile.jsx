import { useState, useEffect } from 'react';
import { User, MapPin, Package, Lock, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, changePassword, getUserOrders, getAddresses, addAddress, updateAddress, deleteAddress, trackOrder } from '../api/client';
import { CURRENCY_SYMBOL } from '../constants';
import './Profile.css';

const TABS = [
  { key: 'account',   label: 'Account',   icon: User },
  { key: 'addresses', label: 'Addresses', icon: MapPin },
  { key: 'orders',    label: 'My Orders', icon: Package },
  { key: 'security',  label: 'Security',  icon: Lock },
];

const STATUS_CLASS = {
  Pending: 'status-pending', Processing: 'status-processing',
  Shipped: 'status-shipped', Delivered: 'status-delivered', Cancelled: 'status-cancelled',
};

const EMPTY_ADDR = { label: 'Home', full_name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', is_default: false };

const Profile = ({ user, onUserUpdate }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('account');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [trackingData, setTrackingData] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [toast, setToast] = useState('');

  // Account edit
  const [editingAccount, setEditingAccount] = useState(false);
  const [accountForm, setAccountForm] = useState({ name: '', city: '', phone: '' });

  // Password
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [pwError, setPwError] = useState('');

  // Address form
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const [addrForm, setAddrForm] = useState(EMPTY_ADDR);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    if (!user) { navigate('/signin', { state: { from: '/profile' } }); return; }
    getProfile()
      .then(p => { setProfile(p); setAccountForm({ name: p.name, city: p.city || '', phone: p.phone || '' }); })
      .catch(() => navigate('/signin', { state: { from: '/profile' } }))
      .finally(() => setLoading(false));
    getAddresses().then(setAddresses).catch(() => {});
    getUserOrders().then(setOrders).catch(() => {});
  }, []);

  // --- Account ---
  const handleAccountSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateProfile(accountForm);
      setProfile(updated);
      onUserUpdate({ ...user, name: updated.name });
      setEditingAccount(false);
      showToast('Profile updated');
    } catch (err) { showToast(err.message); }
  };

  // --- Password ---
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.new_password !== pwForm.confirm) { setPwError('Passwords do not match'); return; }
    try {
      await changePassword({ current_password: pwForm.current_password, new_password: pwForm.new_password });
      setPwForm({ current_password: '', new_password: '', confirm: '' });
      showToast('Password changed successfully');
    } catch (err) { setPwError(err.message); }
  };

  const handleTrack = async (awb, orderId) => {
    if (trackingData[orderId]) { setTrackingData(p => ({ ...p, [orderId]: null })); return; }
    try {
      const data = await trackOrder(awb);
      setTrackingData(p => ({ ...p, [orderId]: data }));
    } catch { showToast('Tracking unavailable'); }
  };

  // --- Addresses ---
  const openAddAddr = () => { setAddrForm(EMPTY_ADDR); setEditingAddr(null); setShowAddrForm(true); };
  const openEditAddr = (addr) => { setAddrForm({ ...addr }); setEditingAddr(addr.id); setShowAddrForm(true); };

  const handleAddrSave = async (e) => {
    e.preventDefault();
    try {
      if (editingAddr) {
        const updated = await updateAddress(editingAddr, addrForm);
        setAddresses(prev => prev.map(a => a.id === editingAddr ? updated : (addrForm.is_default ? { ...a, is_default: false } : a)));
      } else {
        const created = await addAddress(addrForm);
        setAddresses(prev => [...(addrForm.is_default ? prev.map(a => ({ ...a, is_default: false })) : prev), created]);
      }
      setShowAddrForm(false);
      showToast('Address saved');
    } catch (err) { showToast(err.message); }
  };

  const handleAddrDelete = async (id) => {
    try {
      await deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
      showToast('Address removed');
    } catch (err) { showToast(err.message); }
  };

  const handleSetDefault = async (addr) => {
    try {
      await updateAddress(addr.id, { ...addr, is_default: true });
      setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === addr.id })));
      showToast('Default address updated');
    } catch (err) { showToast(err.message); }
  };

  return (
    <div className="profile-page">
      {toast && <div className="profile-toast">{toast}</div>}

      {loading ? (
        <div className="profile-loading">Loading your account…</div>
      ) : (
        <>
          <div className="profile-header">
            <div className="container">
              <div className="breadcrumb">Home › Account</div>
              <h1>My Account</h1>
              {profile && <p className="profile-sub">Welcome back, {profile.name}</p>}
            </div>
          </div>

          <div className="container profile-layout">
            <aside className="profile-sidebar">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button key={key} className={`profile-tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
                  <Icon size={16} /> {label}
                </button>
              ))}
            </aside>

            <div className="profile-content">

              {/* ACCOUNT */}
              {tab === 'account' && profile && (
                <div className="profile-card">
                  <div className="profile-card-header">
                    <h2>Personal Information</h2>
                    {!editingAccount && (
                      <button className="btn-outline-sm" onClick={() => setEditingAccount(true)}><Edit2 size={14} /> Edit</button>
                    )}
                  </div>
                  {editingAccount ? (
                    <form onSubmit={handleAccountSave} className="profile-form">
                      <label>Full Name<input value={accountForm.name} onChange={e => setAccountForm(f => ({ ...f, name: e.target.value }))} required /></label>
                      <label>City<input value={accountForm.city} onChange={e => setAccountForm(f => ({ ...f, city: e.target.value }))} placeholder="Your city" /></label>
                      <label>Phone<input value={accountForm.phone} onChange={e => setAccountForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" /></label>
                      <div className="form-actions">
                        <button type="submit" className="btn-primary">Save Changes</button>
                        <button type="button" className="btn-ghost" onClick={() => setEditingAccount(false)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="profile-info-grid">
                      <div className="info-item"><span>Name</span><p>{profile.name}</p></div>
                      <div className="info-item"><span>Email</span><p>{profile.email}</p></div>
                      <div className="info-item"><span>Phone</span><p>{profile.phone || '—'}</p></div>
                      <div className="info-item"><span>City</span><p>{profile.city || '—'}</p></div>
                      <div className="info-item"><span>Member since</span><p>{new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p></div>
                    </div>
                  )}
                </div>
              )}

              {/* ADDRESSES */}
              {tab === 'addresses' && (
                <div className="profile-card">
                  <div className="profile-card-header">
                    <h2>Saved Addresses</h2>
                    <button className="btn-outline-sm" onClick={openAddAddr}><Plus size={14} /> Add New</button>
                  </div>
                  {showAddrForm && (
                    <form onSubmit={handleAddrSave} className="profile-form addr-form">
                      <h3>{editingAddr ? 'Edit Address' : 'New Address'}</h3>
                      <div className="form-row">
                        <label>Label
                          <select value={addrForm.label} onChange={e => setAddrForm(f => ({ ...f, label: e.target.value }))}>
                            {['Home', 'Work', 'Other'].map(l => <option key={l}>{l}</option>)}
                          </select>
                        </label>
                        <label>Full Name<input value={addrForm.full_name} onChange={e => setAddrForm(f => ({ ...f, full_name: e.target.value }))} required /></label>
                      </div>
                      <div className="form-row">
                        <label>Phone<input value={addrForm.phone} onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" /></label>
                        <label>Pincode<input value={addrForm.pincode} onChange={e => setAddrForm(f => ({ ...f, pincode: e.target.value }))} required /></label>
                      </div>
                      <label>Address Line 1<input value={addrForm.line1} onChange={e => setAddrForm(f => ({ ...f, line1: e.target.value }))} required /></label>
                      <label>Address Line 2 (optional)<input value={addrForm.line2} onChange={e => setAddrForm(f => ({ ...f, line2: e.target.value }))} /></label>
                      <div className="form-row">
                        <label>City<input value={addrForm.city} onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} required /></label>
                        <label>State<input value={addrForm.state} onChange={e => setAddrForm(f => ({ ...f, state: e.target.value }))} required /></label>
                      </div>
                      <label className="checkbox-label">
                        <input type="checkbox" checked={addrForm.is_default} onChange={e => setAddrForm(f => ({ ...f, is_default: e.target.checked }))} />
                        Set as default address
                      </label>
                      <div className="form-actions">
                        <button type="submit" className="btn-primary">Save Address</button>
                        <button type="button" className="btn-ghost" onClick={() => setShowAddrForm(false)}>Cancel</button>
                      </div>
                    </form>
                  )}
                  {addresses.length === 0 && !showAddrForm && (
                    <p className="profile-empty">No saved addresses yet.</p>
                  )}
                  <div className="addr-grid">
                    {addresses.map(addr => (
                      <div key={addr.id} className={`addr-card ${addr.is_default ? 'addr-default' : ''}`}>
                        <div className="addr-card-top">
                          <span className="addr-label">{addr.label}</span>
                          {addr.is_default && <span className="addr-default-badge"><Check size={11} /> Default</span>}
                        </div>
                        <p className="addr-name">{addr.full_name}</p>
                        <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                        <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                        {addr.phone && <p>{addr.phone}</p>}
                        <div className="addr-actions">
                          {!addr.is_default && <button className="link-btn" onClick={() => handleSetDefault(addr)}>Set as default</button>}
                          <button className="link-btn" onClick={() => openEditAddr(addr)}><Edit2 size={13} /> Edit</button>
                          <button className="link-btn link-danger" onClick={() => handleAddrDelete(addr.id)}><Trash2 size={13} /> Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ORDERS */}
              {tab === 'orders' && (
                <div className="profile-card">
                  <div className="profile-card-header"><h2>Order History</h2></div>
                  {orders.length === 0 ? (
                    <p className="profile-empty">You haven't placed any orders yet.</p>
                  ) : (
                    <div className="orders-list">
                      {orders.map(order => (
                        <div key={order.id} className="order-card">
                          <div className="order-card-header">
                            <div>
                              <span className="order-ref">{order.order_ref}</span>
                              <span className="order-date">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <span className={`status-pill ${STATUS_CLASS[order.status] || ''}`}>{order.status}</span>
                          </div>
                          <div className="order-items-list">
                            {(order.items || []).filter(i => i.product_name).map((item, idx) => (
                              <div key={idx} className="order-item-row">
                                <span>{item.product_name}</span>
                                <span>×{item.qty}</span>
                                <span>{CURRENCY_SYMBOL}{Number(item.price).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          <div className="order-card-footer">
                            <span>Total: <strong>{CURRENCY_SYMBOL}{Number(order.total).toLocaleString()}</strong></span>
                            <span>Shipping: {order.shipping > 0 ? `${CURRENCY_SYMBOL}${order.shipping}` : 'Free'}</span>
                            {order.awb_code && (
                              <button className="link-btn" onClick={() => handleTrack(order.awb_code, order.id)}>
                                {trackingData[order.id] ? 'Hide Tracking' : 'Track Shipment'}
                              </button>
                            )}
                          </div>
                          {trackingData[order.id] && (
                            <div className="order-tracking">
                              <p><strong>AWB:</strong> {order.awb_code}</p>
                              <p><strong>Courier:</strong> {order.courier_name || '—'}</p>
                              <p><strong>Status:</strong> {trackingData[order.id]?.tracking_data?.shipment_status || '—'}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECURITY */}
              {tab === 'security' && (
                <div className="profile-card">
                  <div className="profile-card-header"><h2>Change Password</h2></div>
                  <form onSubmit={handlePasswordSave} className="profile-form">
                    <label>Current Password<input type="password" value={pwForm.current_password} onChange={e => setPwForm(f => ({ ...f, current_password: e.target.value }))} required /></label>
                    <label>New Password<input type="password" value={pwForm.new_password} onChange={e => setPwForm(f => ({ ...f, new_password: e.target.value }))} placeholder="Min. 6 characters" required /></label>
                    <label>Confirm New Password<input type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} required /></label>
                    {pwError && <p className="signin-error">{pwError}</p>}
                    <div className="form-actions">
                      <button type="submit" className="btn-primary">Update Password</button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;