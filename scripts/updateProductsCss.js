const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'ecommerce-app', 'src', 'styles', 'Products.css');
const content = fs.readFileSync(cssPath, 'utf-8');

const targetHeader = '/* Catalog Grid */';
const idx = content.indexOf(targetHeader);
if (idx === -1) {
  console.error('Target not found in Products.css');
  process.exit(1);
}

const restOfFile = content.substring(idx);

const newTop = `/* Products Catalog Modern Styling */

.products-page {
  background-color: #f8fafc;
  min-height: 100vh;
  padding-bottom: 70px;
}

/* Banner */
.products-top-banner {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%);
  color: #ffffff;
  padding: 36px 20px;
  border-bottom: 3px solid #f97316;
  position: relative;
  overflow: hidden;
}

.products-top-banner::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

.products-banner-content {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.banner-breadcrumb {
  font-size: 0.8125rem;
  color: #94a3b8;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.banner-breadcrumb a {
  color: #cbd5e1;
  text-decoration: none;
  transition: color 0.15s;
}

.banner-breadcrumb a:hover {
  color: #f97316;
}

.banner-breadcrumb .crumb-active {
  color: #fdba74;
  font-weight: 600;
}

.banner-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(249, 115, 22, 0.2);
  border: 1px solid rgba(249, 115, 22, 0.4);
  color: #fed7aa;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

.banner-heading {
  font-size: 2.2rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.banner-subtext {
  font-size: 0.9375rem;
  color: #cbd5e1;
  margin: 0;
  max-width: 720px;
  line-height: 1.5;
}

.banner-subtext strong {
  color: #f97316;
}

/* Layout */
.products-layout-container {
  max-width: 1400px;
  margin: 28px auto 0;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}

/* Mobile Filter Bar */
.mobile-filter-bar {
  display: none;
  margin-bottom: 16px;
}

.mobile-filter-toggle-btn {
  width: 100%;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.filter-count-pill {
  background: #ea580c;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;
}

/* Sidebar */
.products-sidebar {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 22px 18px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
  position: sticky;
  top: 90px;
}

.sidebar-header-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 18px;
}

.sidebar-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-header-title h3 {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.sidebar-header-title .active-badge {
  background: #fff7ed;
  color: #ea580c;
  border: 1px solid #fed7aa;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
}

.clear-filters-link {
  background: transparent;
  border: none;
  color: #ea580c;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.15s;
}

.clear-filters-link:hover {
  text-decoration: underline;
  color: #c2410c;
}

.sidebar-filter-block {
  margin-bottom: 22px;
  padding-bottom: 18px;
  border-bottom: 1px solid #f1f5f9;
}

.block-title {
  font-size: 0.8125rem;
  font-weight: 800;
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 12px;
}

/* Categories in Sidebar */
.categories-filter-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.category-filter-item {
  width: 100%;
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: inherit;
  font-size: 0.84rem;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  transition: all 0.18s ease;
  text-align: left;
}

.category-filter-item:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #ea580c;
  transform: translateX(2px);
}

.category-filter-item.is-active {
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border-color: #f97316;
  color: #c2410c;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(249, 115, 22, 0.12);
}

.cat-item-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cat-icon-badge {
  font-size: 1rem;
}

.cat-label-text {
  flex: 1;
}

.cat-count-pill {
  font-size: 0.6875rem;
  background: #f1f5f9;
  color: #64748b;
  padding: 2px 7px;
  border-radius: 999px;
  font-weight: 600;
}

.category-filter-item.is-active .cat-count-pill {
  background: #f97316;
  color: #ffffff;
}

/* Price Range in Sidebar */
.price-filter-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.price-radio-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 0.84rem;
  color: #334155;
  font-weight: 500;
  transition: all 0.15s ease;
}

.price-radio-card:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.price-radio-card.selected {
  background: #fff7ed;
  border-color: #fdba74;
  color: #9a3412;
  font-weight: 700;
}

.radio-circle {
  width: 16px;
  height: 16px;
  border: 2px solid #94a3b8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}

.price-radio-card.selected .radio-circle {
  border-color: #ea580c;
}

.radio-dot {
  width: 8px;
  height: 8px;
  background: #ea580c;
  border-radius: 50%;
}

.custom-price-form {
  margin-top: 8px;
}

.custom-inputs-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.price-input-field {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 0.8125rem;
  outline: none;
  color: #0f172a;
}

.price-input-field:focus {
  border-color: #f97316;
}

.price-separator {
  color: #94a3b8;
  font-weight: 700;
}

.price-go-btn {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}

.price-go-btn:hover {
  background: #ea580c;
}

/* Rating Filter */
.rating-filter-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rating-filter-item {
  width: 100%;
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.8125rem;
  color: #334155;
  font-weight: 500;
  transition: all 0.15s;
  text-align: left;
}

.rating-filter-item:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.rating-filter-item.is-active {
  background: #fff7ed;
  border-color: #fdba74;
  color: #9a3412;
  font-weight: 700;
}

.rating-stars {
  color: #f59e0b;
  font-size: 0.95rem;
  letter-spacing: 1px;
}

/* Fast Delivery Toggle */
.fast-delivery-toggle-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.fast-delivery-toggle-card:hover {
  border-color: #cbd5e1;
}

.fast-delivery-toggle-card.is-active {
  background: #ecfdf5;
  border-color: #10b981;
}

.delivery-checkbox {
  accent-color: #10b981;
  margin-top: 3px;
  cursor: pointer;
}

.delivery-toggle-info {
  display: flex;
  flex-direction: column;
}

.toggle-heading {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #0f172a;
}

.toggle-sub {
  font-size: 0.6875rem;
  color: #64748b;
  margin-top: 2px;
}

/* Trust Box */
.sidebar-trust-box {
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border: 1px dashed #fdba74;
  border-radius: 10px;
  padding: 14px;
}

.trust-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.trust-head h4 {
  font-size: 0.8125rem;
  font-weight: 800;
  color: #9a3412;
  margin: 0;
}

.trust-guarantees-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.73rem;
  color: #7c2d12;
  font-weight: 600;
}

/* Main Column Top: Quick Category Pills */
.quick-category-pills-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 12px;
  margin-bottom: 16px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.quick-category-pills-bar::-webkit-scrollbar {
  display: none;
}

.quick-cat-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.quick-cat-pill:hover {
  background: #f8fafc;
  border-color: #f97316;
  color: #ea580c;
  transform: translateY(-1px);
}

.quick-cat-pill.active {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  border-color: #ea580c;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25);
}

.quick-cat-pill.active .pill-icon {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* Active Filter Chips Bar */
.active-filter-chips-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  padding: 10px 14px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.active-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff7ed;
  border: 1px solid #fdba74;
  color: #9a3412;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
}

.filter-chip button {
  background: transparent;
  border: none;
  color: #ea580c;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  padding: 0 2px;
}

.filter-chip button:hover {
  color: #991b1b;
}

.clear-all-chip-btn {
  background: transparent;
  border: none;
  color: #ea580c;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  margin-left: auto;
}

.clear-all-chip-btn:hover {
  text-decoration: underline;
}

/* Toolbar */
.catalog-toolbar {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 18px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.toolbar-count {
  font-size: 0.875rem;
  color: #475569;
}

.toolbar-count strong {
  color: #0f172a;
}

.active-cat-badge {
  color: #ea580c;
  font-weight: 700;
}

.toolbar-sort {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

.sort-select {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.875rem;
  outline: none;
  cursor: pointer;
  background: #ffffff;
  font-weight: 500;
  color: #0f172a;
}

.sort-select:focus {
  border-color: #f97316;
}

@media (max-width: 992px) {
  .products-layout-container {
    grid-template-columns: 1fr;
  }
  .mobile-filter-bar {
    display: block;
  }
  .products-sidebar {
    display: none;
  }
  .products-sidebar.mobile-visible {
    display: block;
    position: static;
    margin-bottom: 20px;
  }
}

`;

fs.writeFileSync(cssPath, newTop + restOfFile, 'utf-8');
console.log('Successfully updated Products.css with modern styles!');
