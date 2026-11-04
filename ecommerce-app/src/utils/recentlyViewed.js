const RECENTLY_VIEWED_KEY = 'bb_recently_viewed';

export const addRecentlyViewed = (product) => {
  if (!product) return;
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    let list = raw ? JSON.parse(raw) : [];
    const prodId = product._id || product.id;

    // Filter out existing and prepend to head
    list = list.filter((item) => (item._id || item.id) !== prodId);
    list.unshift({
      _id: prodId,
      id: prodId,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      image: product.image,
      category: product.category,
      rating: product.rating,
      badge: product.badge,
      reviewsCount: product.reviewsCount,
      brand: product.brand,
      specifications: product.specifications,
      warranty: product.warranty,
      description: product.description
    });

    // Limit to last 8 products
    list = list.slice(0, 8);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving recently viewed product:', e);
  }
};

export const getRecentlyViewed = () => {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};
