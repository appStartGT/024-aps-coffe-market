import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { firestore } from '@config/firebaseConfig';
import { getBudgetAction } from '../store/modules/budget';
import { catRubroCatalogAction } from '../store/modules/catalogs';

const BudgetListenerContext = createContext();

export const useBudgetListener = () => useContext(BudgetListenerContext);

export const BudgetListenerProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Set up listeners for multiple collections
    const collections = ['purchase_detail', 'expense', 'loan'];

    const unsubscribes = collections.map((collectionName) => {
      const collectionQuery = query(collection(firestore, collectionName));
      return onSnapshot(collectionQuery, (snapshot) => {
        if (!snapshot.empty) {
          //   console.log(`update budget due to changes in ${collectionName}`);
          dispatch(getBudgetAction());
        }
      });
    });

    // Cleanup listeners on unmount
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [dispatch]);

  useEffect(() => {
    dispatch(catRubroCatalogAction());
    dispatch(getBudgetAction());
  }, [dispatch]);

  return (
    <BudgetListenerContext.Provider value={null}>
      {children}
    </BudgetListenerContext.Provider>
  );
};

export default BudgetListenerProvider;
