import { useContext } from 'react';
import { ChildContext } from '@/context/ChildContext';

export const useChild = () => {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
};

export default useChild;
