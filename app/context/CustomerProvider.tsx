import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';
//import { useStorageState } from './useStorageState';

const CustomerContext = createContext<{
  searchText: string | null;
  pageId: string | null;
  scrollId: string | null;
  id: string | null;
  setText: (text: string) => void;
  setPageId: (text: string) => void;
  setScrollId: (text: string) => void;
  setId: (text: string) => void;
}>({
  searchText: null,
  pageId: null,
  scrollId: null,
  id: null,
  setText: () => {},
  setPageId: () => {},
  setScrollId: () => {},
  setId: () => {},
});

export function useCustomer() {
  const value = useContext(CustomerContext);

  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useCustomer must be wrapped in a <CustomerProvider />');
    }
  }
  return value;
}

export function CustomerProvider({ children }: PropsWithChildren) {
  //const [[page, scrollId], setCustomer] = useStorageState('customer');
  const [searchText, setSearchText] = useState('');
  const [pageId, setPage] = useState('');
  const [scrollId, setScrollId] = useState('');
  const [id, setId] = useState('');
  return (
    <CustomerContext.Provider
      value={{
        searchText,
        pageId,
        scrollId,
        id,
        setText: (text: string) => {
          setSearchText(text);
        },
        setPageId: page => {
          setPage(page);
        },
        setId: id => {
          setScrollId(id);
        },
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}
