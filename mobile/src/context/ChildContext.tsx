import React, { createContext, useState, useEffect, useCallback, ReactNode, useContext } from 'react';
import { parentService } from '@/services/api';
import { storage } from '@/utils/storage';
import { STORAGE_KEYS } from '@/constants/config';
import { AuthContext } from '@/context/AuthContext';

interface Child {
  id?: string;
  studentId?: string;
  name?: string;
  studentName?: string;
  firstName?: string;
  className?: string;
  class?: string;
  grade?: string;
  section?: string;
  [key: string]: any;
}

interface ChildContextType {
  children: Child[];
  activeChild: Child | null;
  setActiveChild: (child: Child) => Promise<void>;
  loadChildren: () => Promise<void>;
  getChildId: () => string | number | null;
  isLoading: boolean;
  error: string | null;
}

export const ChildContext = createContext<ChildContextType | null>(null);

interface ChildProviderProps {
  children: ReactNode;
}

export const ChildProvider = ({ children: childrenProp }: ChildProviderProps) => {
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated ?? false;

  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [activeChild, setActiveChildState] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChildren = useCallback(async () => {
    if (!isAuthenticated) {
      setChildrenList([]);
      setActiveChildState(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await parentService.getChildren();
      const childrenArray: Child[] = Array.isArray(data) ? data : data?.content || [];

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
          (childrenArray[0].id || childrenArray[0].studentId)?.toString() || ''
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load children');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  const setActiveChild = async (child: Child) => {
    setActiveChildState(child);
    await storage.setToken(
      STORAGE_KEYS.ACTIVE_CHILD_ID,
      (child.id || child.studentId)?.toString() || ''
    );
  };

  const getChildId = (): string | number | null => {
    if (!activeChild) return null;
    return activeChild.id || activeChild.studentId || null;
  };

  const value: ChildContextType = {
    children: childrenList,
    activeChild,
    setActiveChild,
    loadChildren,
    getChildId,
    isLoading,
    error,
  };

  return <ChildContext.Provider value={value}>{childrenProp}</ChildContext.Provider>;
};

export default ChildContext;
