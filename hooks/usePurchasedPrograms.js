import { useState, useEffect } from 'react';
import programsApi from '../api/programsApi';

const usePurchasedPrograms = () => {
  const [purchasedPrograms, setPurchasedPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPurchasedPrograms = async () => {
    try {
      setLoading(true);
      const response = await programsApi.getPurchasedPrograms();
      setPurchasedPrograms(response.programs || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch purchased programs');
      console.error('Error in fetchPurchasedPrograms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasedPrograms();
  }, []);

  return {
    purchasedPrograms,
    loading,
    error,
    refetch: fetchPurchasedPrograms
  };
};

export default usePurchasedPrograms; 