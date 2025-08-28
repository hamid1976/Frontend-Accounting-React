// src/hooks/useAPData.js
import { useState, useEffect } from 'react';
import { apApiService } from '../../../services/apApiService';

export const useAPData = () => {
  const [purchaseOrders, setPurchaseOrders] = useState({ loading: false, data: [], error: null });
  const [vendors, setVendors] = useState({ loading: false, data: [], error: null });
  const [products, setProducts] = useState({ loading: false, data: [], error: null });

  const fetchProducts = async () => {
    setProducts(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await apApiService.fetchProducts();
      window.productsData = data;
      setProducts({ loading: false, data: data, error: null });
    } catch (error) {
      console.error('Error fetching products:', error);
      const sampleProducts = apApiService.getSampleProducts();
      window.productsData = sampleProducts;
      setProducts({ loading: false, data: sampleProducts, error: null });
    }
  };

  const fetchPurchaseOrders = async () => {
    setPurchaseOrders(prev => ({ ...prev, loading: true, error: null }));
    try {
      const allData = await apApiService.fetchPurchaseOrders();
      window.allPurchaseOrdersData = allData;
      
      // Store ALL purchase orders (including applied ones) for complete visibility
      // Don't filter by status here - let individual components decide what to show
      setPurchaseOrders({ loading: false, data: allData, error: null });
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      setPurchaseOrders({ loading: false, data: [], error: error.message });
    }
  };

  const fetchVendors = async () => {
    setVendors(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await apApiService.fetchVendors();
      const allPOData = window.allPurchaseOrdersData || [];
      
      // Transform API vendors to match our structure with real calculated data
      const transformedVendors = apApiService.transformVendors(data, allPOData);
      setVendors({ loading: false, data: transformedVendors, error: null });
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setVendors({ loading: false, data: [], error: error.message });
    }
  };

  // Refresh all data function
  const refreshAllData = async () => {
    await fetchProducts();
    await fetchPurchaseOrders();
    setTimeout(() => fetchVendors(), 500);
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();
      await fetchPurchaseOrders();
      setTimeout(() => fetchVendors(), 500);
    };
    loadData();
  }, []);

  const loading = purchaseOrders.loading || vendors.loading || products.loading;
  const error = purchaseOrders.error || vendors.error || products.error;

  return {
    purchaseOrders,
    vendors,
    products,
    loading,
    error,
    refreshAllData
  };
};