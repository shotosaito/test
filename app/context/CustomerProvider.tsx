import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';

const CustomerContext = createContext<{
  searchText: string | null;
  setText: (text: string) => void;
}>({
  searchText: null,
  setText: () => {},
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
  const [searchText, setSearchText] = useState('');

  return (
    <CustomerContext.Provider
      value={{
        searchText,
        setText: (text: string) => {
          console.log('asfasdf');

          setSearchText(text);
        },
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}
