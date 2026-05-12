export const REVENUE_DATA = [
  { name: 'Jan', value: 18400 },
  { name: 'Feb', value: 22100 },
  { name: 'Mar', value: 19800 },
  { name: 'Apr', value: 31200 },
  { name: 'May', value: 28900 },
  { name: 'Jun', value: 35600 },
  { name: 'Jul', value: 41200 },
  { name: 'Aug', value: 38700 },
  { name: 'Sep', value: 44100 },
  { name: 'Oct', value: 52300 },
  { name: 'Nov', value: 48900 },
  { name: 'Dec', value: 62400 },
];

export const CATEGORY_DATA = [
  { name: 'Medical Kits', value: 35, color: '#C9A84C' },
  { name: 'Diagnostics', value: 24, color: '#8da388' },
  { name: 'Wound Care', value: 18, color: '#C2673A' },
  { name: 'PPE', value: 14, color: '#5C9BE0' },
  { name: 'Emergency', value: 9, color: '#6B6460' },
];

export const RECENT_ORDERS = [
  { id: 'EKM-1042', customer: 'Priya Sharma, Mumbai', product: 'Complete First Aid Kit', amount: 1299, status: 'Delivered', date: '10 May' },
  { id: 'EKM-1041', customer: 'Ananya Roy, Delhi', product: 'Diagnostic Essentials Kit', amount: 999, status: 'Shipped', date: '10 May' },
  { id: 'EKM-1040', customer: 'Meera Iyer, Bangalore', product: 'Wound Care Components Set x2', amount: 798, status: 'Processing', date: '09 May' },
  { id: 'EKM-1039', customer: 'Roshni Gupta, Hyderabad', product: 'Emergency Response Hamper', amount: 2499, status: 'Delivered', date: '09 May' },
  { id: 'EKM-1038', customer: 'Kavya Nair, Chennai', product: 'Home Care Medical Kit', amount: 999, status: 'Pending', date: '09 May' },
  { id: 'EKM-1037', customer: 'Divya Singh, Pune', product: 'Medicine Organizer Pack', amount: 599, status: 'Shipped', date: '08 May' },
  { id: 'EKM-1036', customer: 'Shreya Pillai, Kochi', product: 'Surgical Tools Starter Kit', amount: 1599, status: 'Delivered', date: '08 May' },
  { id: 'EKM-1035', customer: 'Tanvi Mehta, Ahmedabad', product: 'Mask and Gloves Refill Set', amount: 299, status: 'Cancelled', date: '07 May' },
];

export const INVENTORY_DATA = [
  { name: 'Complete First Aid Kit', sku: 'EKM-KIT-001', category: 'Medical Kits', stock: 24, price: 1299, status: 'In Stock' },
  { name: 'Home Care Medical Kit', sku: 'EKM-KIT-002', category: 'Medical Kits', stock: 4, price: 999, status: 'Low Stock' },
  { name: 'Diagnostic Essentials Kit', sku: 'EKM-DIA-001', category: 'Diagnostics', stock: 31, price: 849, status: 'In Stock' },
  { name: 'Medicine Organizer Pack', sku: 'EKM-DIA-002', category: 'Diagnostics', stock: 2, price: 749, status: 'Low Stock' },
  { name: 'Wound Care Components Set', sku: 'EKM-WND-001', category: 'Wound Care', stock: 18, price: 399, status: 'In Stock' },
  { name: 'Sterile Dressing Refill Pack', sku: 'EKM-WND-002', category: 'Wound Care', stock: 0, price: 449, status: 'Out of Stock' },
  { name: 'PPE Safety Pack', sku: 'EKM-PPE-001', category: 'PPE', stock: 8, price: 699, status: 'In Stock' },
  { name: 'Emergency Response Hamper', sku: 'EKM-EMG-001', category: 'Emergency Kits', stock: 3, price: 2499, status: 'Low Stock' },
  { name: 'Surgical Tools Starter Kit', sku: 'EKM-CLN-001', category: 'Clinical Components', stock: 42, price: 1599, status: 'In Stock' },
  { name: 'Mask and Gloves Refill Set', sku: 'EKM-PPE-002', category: 'PPE', stock: 15, price: 299, status: 'In Stock' },
];
