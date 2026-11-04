import React from 'react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { formatINR, calculateSavings, getDeliverySpeed } from '../utils/indianUtils';
import '../styles/CompareModal.css';

const CompareModal = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    isCompareOpen,
    setIsCompareOpen
  } = useCompare();

  const { addToCart } = useCart();
  const { success } = useToast();
  const navigate = useNavigate();

  if (compareList.length === 0) {
    return null;
  }

  // Collect all unique specification keys across comparing products
  const allSpecKeys = Array.from(
    new Set(
      compareList.flatMap((p) => (p.specifications ? Object.keys(p.specifications) : []))
    )
  );

  const handleAddToCart = async (product) => {
    await addToCart(product._id || product.id, 1);
    success(`Added "${product.name}" to cart!`);
  };

  const handleBuyNow = async (product) => {
    await addToCart(product._id || product.id, 1);
    setIsCompareOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Floating Bottom Dock */}
      <div className="compare-floating-dock">
        <div className="dock-left-info">
          <span className="dock-icon">⚖️</span>
          <div className="dock-text">
            <strong>Product Comparison ({compareList.length}/3)</strong>
            <span>Compare specs, warranties &amp; pricing side-by-side</span>
          </div>
        </div>

        <div className="dock-thumbs-row">
          {compareList.map((prod) => (
            <div key={prod._id || prod.id} className="dock-thumb-item" title={prod.name}>
              <img src={prod.image} alt={prod.name} />
              <button
                type="button"
                className="dock-remove-thumb"
                onClick={() => removeFromCompare(prod._id || prod.id)}
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="dock-actions">
          <button
            type="button"
            className="btn btn-primary dock-open-btn"
            onClick={() => setIsCompareOpen(true)}
          >
            Compare Now →
          </button>
          <button
            type="button"
            className="dock-clear-btn"
            onClick={clearCompare}
            title="Clear all comparison items"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Full Comparison Modal Dialog */}
      {isCompareOpen && (
        <div className="compare-modal-backdrop" onClick={() => setIsCompareOpen(false)}>
          <div className="compare-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="compare-dialog-header">
              <div className="header-title-box">
                <h2>⚖️ Compare Products Side-by-Side</h2>
                <p>Detailed technical specifications, warranty, and Indian pricing breakdown</p>
              </div>
              <div className="header-actions">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={clearCompare}
                >
                  Clear All
                </button>
                <button
                  type="button"
                  className="dialog-close-btn"
                  onClick={() => setIsCompareOpen(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="compare-table-wrapper">
              <table className="compare-specs-table">
                <thead>
                  <tr>
                    <th className="feature-col-th">Product Details</th>
                    {compareList.map((product) => {
                      const { amount: savingsAmount, percent: savingsPercent } = calculateSavings(
                        product.mrp,
                        product.price
                      );

                      return (
                        <th key={product._id || product.id} className="product-col-th">
                          <button
                            type="button"
                            className="compare-remove-btn"
                            onClick={() => removeFromCompare(product._id || product.id)}
                            title="Remove from comparison"
                          >
                            ✕ Remove
                          </button>
                          <div className="compare-product-header-card">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="compare-table-img"
                            />
                            <span className="compare-cat-pill">{product.category}</span>
                            <h4 className="compare-item-name">{product.name}</h4>
                            <div className="compare-price-row">
                              <span className="deal-price">{formatINR(product.price)}</span>
                              {product.mrp && product.mrp > product.price && (
                                <span className="mrp-price">{formatINR(product.mrp)}</span>
                              )}
                            </div>
                            {savingsAmount > 0 && (
                              <span className="savings-badge">
                                Save {formatINR(savingsAmount)} ({savingsPercent}% OFF)
                              </span>
                            )}
                            <div className="compare-cta-row">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline"
                                onClick={() => handleAddToCart(product)}
                              >
                                Add to Cart 🛒
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-primary btn-buy-now"
                                onClick={() => handleBuyNow(product)}
                              >
                                ⚡ Buy Now
                              </button>
                            </div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="row-label">Brand &amp; Origin</td>
                    {compareList.map((p) => (
                      <td key={p._id || p.id} className="row-value">
                        <strong>{p.brand || 'Authentic Brand'}</strong>
                        <div className="origin-sub">Made in India 🇮🇳</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Customer Rating</td>
                    {compareList.map((p) => (
                      <td key={p._id || p.id} className="row-value">
                        <span className="rating-pill">★ {p.rating || '4.5'}</span>
                        <small> ({(p.reviewsCount || 1000).toLocaleString('en-IN')} reviews)</small>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Warranty &amp; Service</td>
                    {compareList.map((p) => (
                      <td key={p._id || p.id} className="row-value">
                        {p.warranty || '1 Year Official Manufacturer Warranty across India'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Delivery Speed</td>
                    {compareList.map((p) => (
                      <td key={p._id || p.id} className="row-value">
                        <span className="speed-highlight">{getDeliverySpeed(p)}</span>
                        <div className="cod-avail">✔ Cash on Delivery Available</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">HSN &amp; GST</td>
                    {compareList.map((p) => (
                      <td key={p._id || p.id} className="row-value">
                        HSN {p.hsnCode || '85176290'} • 18% GST Included
                      </td>
                    ))}
                  </tr>

                  {/* Dynamic Specifications */}
                  {allSpecKeys.map((specKey) => (
                    <tr key={specKey}>
                      <td className="row-label">{specKey}</td>
                      {compareList.map((p) => (
                        <td key={p._id || p.id} className="row-value">
                          {p.specifications && p.specifications[specKey]
                            ? p.specifications[specKey]
                            : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompareModal;
