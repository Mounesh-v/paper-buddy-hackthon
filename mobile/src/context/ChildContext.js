import React, { createContext, useState, useEffect, useCallback } from 'react';
import { parentService } from '@/services/api';
import { storage } from '@/utils/storage';
import { STORAGE_KEYS } from '@/constants/config';

export const ChildContext = createContext(null);

export const ChildProvider = ({ children }) => {
  const [childrenList, setChildrenList] = useState([]);
  const [activeChild, setActiveChildState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadChildren = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await parentService.getChildren();
      const childrenArray = Array.isArray(data) ? data : data?.content || [];

      setChildrenList(childrenArray);

      const savedChildId = await storage.getToken(STORAGE_KEYS.ACTIVE_CHILD_ID);

      if (savedChildId) {
        const found = childrenArray.find(
          (child) => child.id?.toString() === savedChildId || child.studentId?.toString() === savedChildId
        );
        if (found) {
          setActiveChildState(found);
          setIsLoading(false);
          return;
        }
      }

      if (childrenArray.length > 0) {
        setActiveChildState(childrenArray[0]);
        await storage.setToken(
          STORAGE_KEYS.ACTIVE_CHILD_ID,
          (childrenArray[0].id || childrenArray[0].studentId)?.toString()
        );
      }
    } catch (err) {
      setError(err.message || 'Failed to load children');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  const setActiveChild = async (child) => {
    setActiveChildState(child);
    await storage.setToken(
      STORAGE_KEYS.ACTIVE_CHILD_ID,
      (child.id || child.studentId)?.toString()
    );
  };

  const getChildId = () => {
    if (!activeChild) return null;
    return activeChild.id || activeChild.studentId;
  };

  const value = {
    children: childrenList,
    activeChild,
    setActiveChild,
    loadChildren,
    getChildId,
    isLoading,
    error,
  };

  return <ChildContext.Provider value={value}>{children}</ChildContext.Provider>;
};

export default ChildContext;
