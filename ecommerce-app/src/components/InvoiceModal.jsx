import React from 'react';
import { formatINR } from '../utils/indianUtils';

const InvoiceModal = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const subtotal = order.subtotal || order.totalAmount || 0;
  const tax = order.tax || Math.round(subtotal * 0.18);
  const cgst = order.cgst || Math.round(tax / 2);
  const sgst = order.sgst || Math.round(tax / 2);
  const discount = order.discount || 0;
  const shipping = order.shipping || 0;
  const grandTotal = order.totalAmount || subtotal + tax + shipping - discount;

  return (
    <div className="modal-backdrop invoice-modal-backdrop" onClick={onClose}>
      <div className="invoice-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="invoice-action-bar no-print">
          <h2>GST Tax Invoice Preview</h2>
          <div className="action-buttons">
            <button onClick={handlePrint} className="btn btn-primary btn-sm">
              🖨️ Print / Save as PDF
            </button>
            <button onClick={onClose} className="btn btn-secondary btn-sm">
              ✕ Close
            </button>
          </div>
        </div>

        <div className="printable-invoice" id="invoice-sheet">
          {/* Header */}
          <div className="invoice-header">
            <div className="seller-info">
              <h1 className="invoice-brand">BharatBazaar 🇮🇳</h1>
              <p className="seller-company">BharatBazaar Retail India Private Limited</p>
              <p>Plot No. 44, Okhla Industrial Area Phase-III</p>
              <p>New Delhi, Delhi - 110020, India</p>
              <p>
                <strong>GSTIN:</strong> 07AABCB9123F1Z4 | <strong>PAN:</strong> AABCB9123F
              </p>
              <p>
                <strong>CIN:</strong> U52100DL2024PTC345678 | <strong>State Code:</strong> 07 (Delhi)
              </p>
            </div>

            <div className="invoice-meta">
              <div className="invoice-title-tag">TAX INVOICE</div>
              <p>
                <strong>Invoice No:</strong> BB-INV-{(order.orderId || order._id || '1001').replace('ORD-', '')}
              </p>
              <p>
                <strong>Invoice Date:</strong> {invoiceDate}
              </p>
              <p>
                <strong>Order ID:</strong> {order.orderId || order._id}
              </p>
              <p>
                <strong>Courier AWB:</strong> {order.trackingNumber || 'DEL-9382109IN'}
              </p>
              <p>
                <strong>Place of Supply:</strong> {order.shippingAddress?.state || 'Maharashtra'}
              </p>
            </div>
          </div>

          <hr className="invoice-divider" />

          {/* Customer / Billing Info */}
          <div className="invoice-parties-grid">
            <div className="party-box">
              <h3>Billed &amp; Shipped To:</h3>
              <p className="customer-name">
                <strong>{order.shippingAddress?.fullName || 'Valued Customer'}</strong>
              </p>
              <p>{order.shippingAddress?.address || 'Residential Address'}</p>
              {order.shippingAddress?.landmark && <p>Landmark: {order.shippingAddress.landmark}</p>}
              <p>
                {order.shippingAddress?.city || 'City'}, {order.shippingAddress?.state || 'State'} -{' '}
                <strong>{order.shippingAddress?.pincode || '400001'}</strong>
              </p>
              <p>
                <strong>Mobile:</strong> {order.shippingAddress?.phone || '+91 98765 43210'}
              </p>
              <p>
                <strong>Address Type:</strong> {order.shippingAddress?.addressType || 'Home'}
              </p>
            </div>

            <div className="party-box payment-summary-box">
              <h3>Payment &amp; Logistics Details:</h3>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod || 'UPI'}
              </p>
              <p>
                <strong>Payment Status:</strong>{' '}
                <span className={`payment-status-chip ${order.paymentStatus || 'completed'}`}>
                  {(order.paymentStatus || 'completed').toUpperCase()}
                </span>
              </p>
              <p>
                <strong>Logistics Partner:</strong> {order.courier || 'Delhivery Express'}
              </p>
              <p>
                <strong>Safe Delivery OTP:</strong>{' '}
                <span className="otp-highlight">{order.deliveryOtp || '4829'}</span>
              </p>
            </div>
          </div>

          {/* Table of Goods */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product Description</th>
                <th>HSN Code</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Taxable Val</th>
                <th>CGST (9%)</th>
                <th>SGST (9%)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item, idx) => {
                const itemRate = Math.round(item.price / 1.18);
                const taxableVal = itemRate * item.quantity;
                const itemCgst = Math.round((taxableVal * 0.09));
                const itemSgst = Math.round((taxableVal * 0.09));
                const itemTotal = item.price * item.quantity;

                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{item.productName || item.name}</strong>
                    </td>
                    <td>{item.hsnCode || '85183000'}</td>
                    <td>{item.quantity}</td>
                    <td>{formatINR(itemRate)}</td>
                    <td>{formatINR(taxableVal)}</td>
                    <td>{formatINR(itemCgst)}</td>
                    <td>{formatINR(itemSgst)}</td>
                    <td>
                      <strong>{formatINR(itemTotal)}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Financial Calculation */}
          <div className="invoice-footer-grid">
            <div className="footer-notes">
              <p>
                <strong>Terms &amp; Conditions:</strong>
              </p>
              <ul>
                <li>Goods once sold are covered under 7 Days Easy Replacement Policy.</li>
                <li>Manufacturer warranty applicable as per brand policy.</li>
                <li>This is a computer-generated tax invoice and requires no physical signature.</li>
              </ul>
              <div className="tri-color-bar"></div>
            </div>

            <div className="calculation-box">
              <div className="calc-row">
                <span>Taxable Amount:</span>
                <span>{formatINR(subtotal - tax)}</span>
              </div>
              <div className="calc-row">
                <span>CGST (9%):</span>
                <span>{formatINR(cgst)}</span>
              </div>
              <div className="calc-row">
                <span>SGST (9%):</span>
                <span>{formatINR(sgst)}</span>
              </div>
              {discount > 0 && (
                <div className="calc-row discount-row">
                  <span>Coupon Discount ({order.couponCode || 'PROMO'}):</span>
                  <span>- {formatINR(discount)}</span>
                </div>
              )}
              <div className="calc-row">
                <span>Shipping &amp; Handling:</span>
                <span>{shipping === 0 ? 'FREE' : formatINR(shipping)}</span>
              </div>
              <div className="calc-row grand-total-row">
                <span>Total Amount (INR):</span>
                <span>{formatINR(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="invoice-signatory">
            <div className="stamp-seal">
              <span>BHARAT BAZAAR</span>
              <small>VERIFIED SELLER</small>
            </div>
            <p>For BharatBazaar Retail India Pvt Ltd</p>
            <p className="signatory-label">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
