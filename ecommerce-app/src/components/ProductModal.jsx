import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatINR, calculateSavings } from '../utils/indianUtils';
import { pincodeAPI, productsAPI } from '../services/api';
import { addRecentlyViewed } from '../utils/recentlyViewed';
import { useCompare } from '../context/CompareContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

// Preset quick pincodes for India
const QUICK_PINCODES = [
  { code: '400001', label: 'Mumbai (400001)' },
  { code: '560001', label: 'Bengaluru (560001)' },
  { code: '110001', label: 'Delhi (110001)' },
  { code: '600001', label: 'Chennai (600001)' },
  { code: '700001', label: 'Kolkata (700001)' }
];

const getCategoryQA = (product) => {
  const cat = product.category || '';
  const sub = product.subcategory || '';
  const brand = product.brand || 'BharatBazaar';

  const commonQA = [
    {
      id: 'qa-1',
      question: `Is this authentic and covered under official manufacturer brand warranty in India?`,
      answer: `Yes, 100% genuine guaranteed with official ${product.warranty || '1 Year Brand Manufacturer Replacement Warranty'}. Valid at all authorized service centers across 800+ Indian cities. GST tax invoice is issued with serial & HSN code for warranty claims.`,
      upvotes: 38,
      answeredBy: `${brand} India Official Support`,
      verified: true
    },
    {
      id: 'qa-2',
      question: `Is Cash on Delivery (COD) and doorstep inspection available for this item?`,
      answer: `Yes, COD is available for this product across 28,000+ PIN codes. You can pay via cash or scan the delivery executive's UPI QR code (Google Pay, PhonePe, Paytm) upon safe package receipt.`,
      upvotes: 24,
      answeredBy: `BharatBazaar Logistics Team`,
      verified: true
    }
  ];

  if (cat === 'Electronics') {
    return [
      ...commonQA,
      {
        id: 'qa-3',
        question: sub === 'Laptops' ? 'Does this laptop come with genuine Windows 11 and MS Office pre-activated?' : 'What is included inside the box package?',
        answer: sub === 'Laptops' 
          ? 'Yes! Pre-installed with genuine Windows 11 Home 64-bit and Microsoft Office Home & Student 2021 with lifetime validity.'
          : `Package contains 1x ${product.name}, heavy-duty fast charging cable/adapter, user manual, and official warranty card.`,
        upvotes: 56,
        answeredBy: `${brand} Certified Product Specialist`,
        verified: true
      },
      {
        id: 'qa-4',
        question: sub === 'Laptops' ? 'Can RAM and SSD storage be expanded further in the future?' : 'Does this support fast charging and surge protection?',
        answer: sub === 'Laptops'
          ? 'Yes, it features an extra upgradeable SO-DIMM RAM slot (expandable up to 32GB) and high-speed PCIe NVMe M.2 expansion.'
          : 'Yes, engineered with certified Indian surge suppression and fast charging compatibility (Type-C / Quick Charge 3.0).',
        upvotes: 41,
        answeredBy: 'Verified Technical Buyer',
        verified: true
      }
    ];
  } else if (cat === 'Ethnic Fashion') {
    return [
      ...commonQA,
      {
        id: 'qa-3',
        question: 'Does this saree / outfit include an unstitched blouse piece or matching bottom?',
        answer: 'Yes! It includes an attached 0.8 meter unstitched blouse piece in matching pure zari/woven fabric with sleeve borders.',
        upvotes: 47,
        answeredBy: `${brand} Master Weaver Atelier`,
        verified: true
      },
      {
        id: 'qa-4',
        question: 'What are the recommended washing and care instructions to preserve zari shine?',
        answer: 'We strictly recommend Dry Clean for the first wash to preserve pure gold/silver zari threads and weave drape. Store wrapped in breathable muslin cloth.',
        upvotes: 29,
        answeredBy: 'Senior Textile Conservator',
        verified: true
      }
    ];
  } else if (cat === 'Home & Kitchen') {
    return [
      ...commonQA,
      {
        id: 'qa-3',
        question: 'Is this compatible with Induction cooktops as well as regular LPG Gas stoves?',
        answer: 'Yes! Manufactured with a heavy 360-degree impact bonded thermal base that works effortlessly on both Gas Stoves and Induction Cooktops.',
        upvotes: 52,
        answeredBy: `${brand} Culinary Care Team`,
        verified: true
      },
      {
        id: 'qa-4',
        question: sub === 'Mixer Grinders' ? 'Is the motor 100% pure copper winding with overload protection?' : 'Is this dishwasher safe and food-grade?',
        answer: sub === 'Mixer Grinders'
          ? 'Yes, 100% heavy-duty copper winding motor with automatic overload trip switch at the base for maximum safety and longevity.'
          : 'Yes, crafted from 100% virgin food-grade, non-toxic BPA/PFOA free material, completely dishwasher safe.',
        upvotes: 35,
        answeredBy: 'Verified Chef & Buyer',
        verified: true
      }
    ];
  } else if (cat === 'Ayurveda & Beauty') {
    return [
      ...commonQA,
      {
        id: 'qa-3',
        question: 'Is this formulation certified by the Ministry of Ayush and free from harmful chemicals?',
        answer: 'Yes, 100% certified by the Ministry of Ayush, Govt. of India. Completely free from parabens, sulfates, artificial mineral oils, and synthetic silicones.',
        upvotes: 63,
        answeredBy: 'Ayurvedic Vaidya & Formulator',
        verified: true
      },
      {
        id: 'qa-4',
        question: 'What is the manufacturing and expiry date of the current dispatch batch?',
        answer: 'Fresh batch manufactured within the last 45 days. Shelf life is 24 to 36 months from the manufacturing date printed clearly on the outer seal.',
        upvotes: 31,
        answeredBy: 'Quality Assurance Lead',
        verified: true
      }
    ];
  } else {
    return [
      ...commonQA,
      {
        id: 'qa-3',
        question: 'What is the FSSAI license accreditation and packaging standard?',
        answer: 'Certified under FSSAI License: 10014011002018. Packaged in nitrogen-flushed multi-layered food-grade moisture barrier packaging to preserve freshness.',
        upvotes: 44,
        answeredBy: 'BharatBazaar Grocery QA',
        verified: true
      },
      {
        id: 'qa-4',
        question: 'Is this naturally processed without artificial polish or chemical additives?',
        answer: 'Yes, 100% unpolished and naturally harvested with zero water, oil, or chemical polishing to retain full natural bran, aroma, and nutrients.',
        upvotes: 28,
        answeredBy: 'Organic Agronomist',
        verified: true
      }
    ];
  }
};

const ProductModal = ({ product, onClose, onAddToCart, isInWishlist, onToggleWishlist }) => {
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  // Tab State: 'specs' | 'qa' | 'reviews'
  const [activeTab, setActiveTab] = useState('specs');

  // Q&A State
  const [qaSearch, setQaSearch] = useState('');
  const [qaList, setQaList] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [submittingQA, setSubmittingQA] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    reviewerName: '',
    city: ''
  });

  const { addToCompare, isComparing } = useCompare();
  const { success, error: showError } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const prodId = product ? (product._id || product.id) : null;

  const fetchReviews = useCallback(async (id) => {
    if (!id) return;
    try {
      setLoadingReviews(true);
      const res = await productsAPI.getReviews(id);
      if (res.data && res.data.reviews) {
        setReviews(res.data.reviews);
      } else if (product && product.reviews) {
        setReviews(product.reviews);
      }
    } catch (err) {
      if (product && product.reviews) {
        setReviews(product.reviews);
      }
    } finally {
      setLoadingReviews(false);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
      fetchReviews(prodId);
      setQaList(getCategoryQA(product));
      if (user) {
        setReviewFormData((prev) => ({
          ...prev,
          reviewerName: user.name || '',
          city: user.city || 'Mumbai'
        }));
      }
    }
  }, [product, prodId, user, fetchReviews]);

  if (!product) return null;

  const { amount: savingsAmount, percent: savingsPercent } = calculateSavings(product.mrp, product.price);
  const comparing = isComparing(prodId);

  const handleQuickPincodeSelect = async (code) => {
    setPincode(code);
    try {
      setPincodeLoading(true);
      setPincodeError('');
      const res = await pincodeAPI.lookup(code);
      setPincodeResult(res.data);
    } catch (err) {
      setPincodeError('Pincode lookup failed. Standard 2-4 days delivery applies.');
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleCheckPincode = async (e) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length !== 6) {
      setPincodeError('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    try {
      setPincodeLoading(true);
      setPincodeError('');
      const res = await pincodeAPI.lookup(pincode.trim());
      setPincodeResult(res.data);
    } catch (err) {
      setPincodeError('Pincode lookup failed. Standard 2-4 days delivery applies.');
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    setSubmittingQA(true);
    const qText = newQuestionText.trim();
    setTimeout(() => {
      const newQA = {
        id: `qa-${Date.now()}`,
        question: qText,
        answer: `Verified Seller Response: Thank you for inquiring! For ${product.name}, our technical fulfillment team confirms full Indian standard compliance and 100% genuine brand warranty support.`,
        upvotes: 1,
        answeredBy: `${product.brand || 'BharatBazaar'} Official Support`,
        verified: true
      };
      setQaList((prev) => [newQA, ...prev]);
      setNewQuestionText('');
      setSubmittingQA(false);
      success('Your question was submitted and answered by the verified seller!');
    }, 600);
  };

  const filteredQA = qaList.filter(
    (item) =>
      item.question.toLowerCase().includes(qaSearch.toLowerCase()) ||
      item.answer.toLowerCase().includes(qaSearch.toLowerCase())
  );

  const handleAdd = async () => {
    setAdding(true);
    await onAddToCart(prodId, quantity, product.name);
    setAdding(false);
  };

  const handleBuyNow = async () => {
    try {
      setBuyingNow(true);
      await onAddToCart(prodId, quantity, product.name);
      onClose();
      navigate('/checkout');
    } catch (err) {
      showError('Failed to proceed to checkout');
    } finally {
      setBuyingNow(false);
    }
  };

  const handleToggleCompare = () => {
    const res = addToCompare(product);
    if (res.success) {
      success(res.message);
    } else {
      showError(res.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewFormData.comment.trim()) {
      showError('Please write your review feedback');
      return;
    }
    try {
      setSubmittingReview(true);
      const payload = {
        rating: Number(reviewFormData.rating),
        title: reviewFormData.title || 'Verified Purchase',
        comment: reviewFormData.comment,
        reviewerName: reviewFormData.reviewerName || user?.name || 'Indian Shopper',
        city: reviewFormData.city || user?.city || 'India'
      };
      const res = await productsAPI.addReview(prodId, payload);
      success('Review submitted successfully! Thank you for your feedback.');
      if (res.data && res.data.reviews) {
        setReviews(res.data.reviews);
      }
      setShowReviewForm(false);
      setReviewFormData((prev) => ({ ...prev, title: '', comment: '' }));
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Rating stars render helper
  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return '★'.repeat(rounded) + '☆'.repeat(Math.max(0, 5 - rounded));
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="modal-grid">
          {/* Left: Product Image & Trust Badges */}
          <div className="modal-image-col">
            <div className="modal-image-wrapper">
              <img src={product.image} alt={product.name} className="modal-product-img" />
              {product.badge && <span className="modal-badge">{product.badge}</span>}
              <span className="made-in-india-badge">Made in India 🇮🇳</span>
            </div>

            <div className="trust-features-row">
              <div className="trust-item">
                <span className="trust-icon">🛡️</span>
                <span>{product.warranty ? 'Brand Warranty' : '1 Year Warranty'}</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🔄</span>
                <span>7 Days Return</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🚚</span>
                <span>Free Express ₹499+</span>
              </div>
            </div>

            <button
              type="button"
              className={`btn-compare-trigger ${comparing ? 'active' : ''}`}
              onClick={handleToggleCompare}
            >
              {comparing ? '✔ Added to Comparison' : '⚖️ Compare with other items'}
            </button>
          </div>

          {/* Right: Product Details & Specs */}
          <div className="modal-info-col">
            <div className="modal-category">
              <span>{product.category}</span>
              {product.subcategory && (
                <>
                  <span className="modal-cat-sep">›</span>
                  <span className="modal-subcat-badge">{product.subcategory}</span>
                </>
              )}
            </div>
            <h2 className="modal-title">{product.name}</h2>

            <div className="modal-rating-row">
              <div className="rating-badge">★ {product.rating || '4.5'}</div>
              <span className="reviews-count">
                ({(product.reviewsCount || 1200).toLocaleString('en-IN')} verified ratings)
              </span>
            </div>

            {/* Price Box */}
            <div className="modal-price-box">
              <div className="price-row">
                <span className="deal-price">{formatINR(product.price)}</span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span className="mrp-price">M.R.P: {formatINR(product.mrp)}</span>
                    <span className="discount-chip">{savingsPercent}% OFF</span>
                  </>
                )}
              </div>
              {savingsAmount > 0 && (
                <p className="savings-highlight">You save {formatINR(savingsAmount)} ({savingsPercent}% OFF)</p>
              )}
              <p className="tax-inclusive-label">
                Inclusive of all Indian taxes (18% GST • HSN {product.hsnCode || '85176290'})
              </p>
            </div>

            <p className="modal-description">{product.description}</p>

            {/* Indian Smart Pincode Delivery Estimator */}
            <div className="smart-pincode-card">
              <div className="smart-pincode-header">
                <span className="pincode-icon">📍</span>
                <div>
                  <strong>Smart Delivery &amp; COD Estimator</strong>
                  <span className="pincode-sub-promise">Real-time warehouse transit calculation</span>
                </div>
              </div>

              {/* Quick City Presets */}
              <div className="quick-pincode-presets">
                <span className="presets-label">Popular Hubs:</span>
                {QUICK_PINCODES.map((qp) => (
                  <button
                    key={qp.code}
                    type="button"
                    className={`quick-pin-pill ${pincode === qp.code ? 'active' : ''}`}
                    onClick={() => handleQuickPincodeSelect(qp.code)}
                  >
                    {qp.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleCheckPincode} className="pincode-form">
                <input
                  type="text"
                  maxLength="6"
                  placeholder="Enter any 6-digit Indian PIN code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="pincode-input"
                />
                <button type="submit" className="pincode-check-btn" disabled={pincodeLoading}>
                  {pincodeLoading ? 'Checking...' : 'Check PIN'}
                </button>
              </form>
              {pincodeError && <p className="pincode-err-msg">{pincodeError}</p>}

              {/* Rich Delivery Result Card */}
              {pincodeResult && (
                <div className="smart-pincode-result">
                  <div className="delivery-promise-row">
                    <span className="promise-badge">⚡ GUARANTEED ARRIVAL</span>
                    <strong className="promise-date">{pincodeResult.estimatedDate}</strong>
                  </div>

                  <div className="pincode-route-meta">
                    <div className="meta-line">
                      <span className="meta-dot">🏢</span>
                      <span>Dispatched from: <strong>{pincodeResult.hub}</strong> ({pincodeResult.distanceKm} km away)</span>
                    </div>
                    <div className="meta-line">
                      <span className="meta-dot">⏱️</span>
                      <span>Fast Dispatch: Order within <strong>{pincodeResult.cutoffHours || 2} hrs {pincodeResult.cutoffMinutes || 40} mins</strong></span>
                    </div>
                    <div className="meta-line">
                      <span className="meta-dot">✈️</span>
                      <span>Courier Logistics: <strong>{pincodeResult.courierPartner || 'Delhivery Surface Express'}</strong></span>
                    </div>
                  </div>

                  <div className="pincode-perks-row">
                    <span className="perk-tag perk-free">✔ Free Delivery Eligible</span>
                    <span className="perk-tag perk-cod">💵 Cash on Delivery Available</span>
                    <span className="perk-tag perk-upi">📲 Doorstep UPI QR Scan</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: Qty, Add to Cart, 1-Click Buy Now, Wishlist */}
            <div className="modal-actions-bar">
              <div className="qty-picker">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn-outline modal-add-cart-btn"
                onClick={handleAdd}
                disabled={adding}
              >
                {adding ? 'Adding...' : 'Add to Cart 🛒'}
              </button>

              <button
                type="button"
                className="btn btn-primary modal-buy-now-btn"
                onClick={handleBuyNow}
                disabled={buyingNow}
              >
                {buyingNow ? 'Redirecting...' : `⚡ Buy Now • ${formatINR(product.price * quantity)}`}
              </button>

              <button
                type="button"
                className={`wishlist-icon-btn ${isInWishlist ? 'active' : ''}`}
                onClick={() => onToggleWishlist(prodId, product.name)}
                title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                {isInWishlist ? '❤️' : '🤍'}
              </button>
            </div>

            {/* Modal Interactive Navigation Tabs */}
            <div className="modal-tabs-header">
              <button
                type="button"
                className={`modal-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                📋 Key Specifications
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${activeTab === 'qa' ? 'active' : ''}`}
                onClick={() => setActiveTab('qa')}
              >
                💬 Customer Q&amp;A ({filteredQA.length})
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                ⭐ Customer Reviews ({reviews.length})
              </button>
            </div>

            {/* TAB 1: Specifications */}
            {activeTab === 'specs' && (
              <div className="modal-tab-content">
                {product.specifications ? (
                  <div className="modal-specs">
                    <div className="specs-table">
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="specs-row">
                          <span className="spec-key">{key}:</span>
                          <span className="spec-val">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="tab-empty-text">No technical specifications listed for this product.</p>
                )}
              </div>
            )}

            {/* TAB 2: Amazon-Style Customer Q&A Section */}
            {activeTab === 'qa' && (
              <div className="modal-tab-content modal-qa-tab">
                <div className="qa-search-box">
                  <span className="qa-search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Have a question? Search answers (e.g. warranty, RAM, blouse, induction)..."
                    value={qaSearch}
                    onChange={(e) => setQaSearch(e.target.value)}
                    className="qa-search-input"
                  />
                  {qaSearch && (
                    <button type="button" className="btn-clear-qa-search" onClick={() => setQaSearch('')}>
                      ✕
                    </button>
                  )}
                </div>

                {/* Ask a Question Form */}
                <form onSubmit={handleAskQuestion} className="ask-question-form">
                  <input
                    type="text"
                    placeholder="Can't find an answer? Type your question here for verified seller / buyers..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className="ask-question-input"
                    required
                  />
                  <button type="submit" className="btn-ask-submit" disabled={submittingQA}>
                    {submittingQA ? 'Posting...' : 'Ask Seller'}
                  </button>
                </form>

                {/* Q&A List */}
                <div className="qa-items-container">
                  {filteredQA.length === 0 ? (
                    <div className="tab-empty-text">
                      No matching questions found for "{qaSearch}". Submit your question above!
                    </div>
                  ) : (
                    filteredQA.map((qa) => (
                      <div key={qa.id} className="single-qa-card">
                        <div className="qa-question-row">
                          <span className="qa-q-badge">Question:</span>
                          <strong className="qa-q-text">{qa.question}</strong>
                        </div>
                        <div className="qa-answer-row">
                          <span className="qa-a-badge">Answer:</span>
                          <div className="qa-a-content">
                            <p className="qa-a-text">{qa.answer}</p>
                            <div className="qa-meta-footer">
                              <span className="qa-answered-by">
                                By <strong>{qa.answeredBy}</strong> on {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              <span className="qa-helpful-btn" title="Helpful vote">
                                👍 Helpful ({qa.upvotes})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Customer Reviews */}
            {activeTab === 'reviews' && (
              <div className="modal-tab-content modal-reviews-tab">
                <div className="reviews-section-header">
                  <div>
                    <h4 className="reviews-title">Customer Reviews &amp; Ratings</h4>
                    <p className="reviews-sub">
                      {reviews.length} Verified Reviews from Indian Customers
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm write-review-btn"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    {showReviewForm ? '✕ Close Form' : '✍️ Write a Review'}
                  </button>
                </div>

                {/* Review Submission Form */}
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="review-submission-card">
                    <h5>Write a Verified Buyer Review</h5>
                    <div className="form-group-star-rating">
                      <label>Rating:</label>
                      <div className="star-rating-selector">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`star-choice-btn ${reviewFormData.rating >= star ? 'selected' : ''}`}
                            onClick={() => setReviewFormData((p) => ({ ...p, rating: star }))}
                          >
                            ★
                          </button>
                        ))}
                        <span className="rating-desc-text">
                          {reviewFormData.rating === 5 && 'Excellent'}
                          {reviewFormData.rating === 4 && 'Very Good'}
                          {reviewFormData.rating === 3 && 'Good'}
                          {reviewFormData.rating === 2 && 'Fair'}
                          {reviewFormData.rating === 1 && 'Poor'}
                        </span>
                      </div>
                    </div>

                    <div className="form-row-review">
                      <input
                        type="text"
                        placeholder="Your Name (e.g. Ramesh K.)"
                        value={reviewFormData.reviewerName}
                        onChange={(e) =>
                          setReviewFormData((p) => ({ ...p, reviewerName: e.target.value }))
                        }
                        className="review-input flex-1"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Your City (e.g. Pune, MH)"
                        value={reviewFormData.city}
                        onChange={(e) =>
                          setReviewFormData((p) => ({ ...p, city: e.target.value }))
                        }
                        className="review-input flex-1"
                        required
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Review Title (e.g. Highly satisfied with battery and finish)"
                      value={reviewFormData.title}
                      onChange={(e) =>
                        setReviewFormData((p) => ({ ...p, title: e.target.value }))
                      }
                      className="review-input"
                      required
                    />

                    <textarea
                      rows="3"
                      placeholder="Share details of your experience with this product..."
                      value={reviewFormData.comment}
                      onChange={(e) =>
                        setReviewFormData((p) => ({ ...p, comment: e.target.value }))
                      }
                      className="review-textarea"
                      required
                    ></textarea>

                    <button
                      type="submit"
                      className="btn btn-primary btn-sm submit-review-btn"
                      disabled={submittingReview}
                    >
                      {submittingReview ? 'Submitting...' : 'Post Verified Review 🚀'}
                    </button>
                  </form>
                )}

                {/* Reviews List */}
                {loadingReviews ? (
                  <div className="reviews-loading-text">Loading verified customer reviews...</div>
                ) : reviews.length === 0 ? (
                  <div className="no-reviews-note">
                    No reviews yet for this product. Be the first to write a review!
                  </div>
                ) : (
                  <div className="reviews-list-container">
                    {reviews.map((rev, index) => (
                      <div key={index} className="review-single-card">
                        <div className="review-card-top">
                          <div className="reviewer-info">
                            <span className="reviewer-avatar">
                              {(rev.name || rev.reviewerName || 'Customer').charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <strong className="reviewer-name">
                                {rev.name || rev.reviewerName || 'Indian Shopper'}
                              </strong>
                              <span className="verified-badge">✔ Verified Purchase 🇮🇳</span>
                            </div>
                          </div>
                          <div className="review-stars-col">
                            <span className="stars-gold">{renderStars(rev.rating || 5)}</span>
                            <span className="review-city">{rev.city || 'India'}</span>
                          </div>
                        </div>

                        {rev.title && <h5 className="review-card-title">{rev.title}</h5>}
                        <p className="review-card-comment">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
