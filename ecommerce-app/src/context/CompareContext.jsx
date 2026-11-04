import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    try {
      const stored = localStorage.getItem('compare_products');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('compare_products', JSON.stringify(compareList));
    } catch (e) {}
  }, [compareList]);

  const addToCompare = (product) => {
    const id = product._id || product.id;
    if (compareList.some((p) => (p._id || p.id) === id)) {
      return { success: false, message: 'Product already added to comparison' };
    }
    if (compareList.length >= 3) {
      return { success: false, message: 'You can compare up to 3 products at a time' };
    }
    setCompareList((prev) => [...prev, product]);
    return { success: true, message: `Added "${product.name}" to comparison` };
  };

  const removeFromCompare = (productId) => {
    setCompareList((prev) => prev.filter((p) => (p._id || p.id) !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isComparing = (productId) => {
    return compareList.some((p) => (p._id || p.id) === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
        isCompareOpen,
        setIsCompareOpen
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export default CompareContext;
