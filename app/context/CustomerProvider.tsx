import { createContext, useContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';

const CustomerContext = createContext<{
  searchText: string | null;
  pageId: string | null;
  scrollId: string | null;
  id: string | null;
  refreshFlg: boolean | false;
  flg: boolean | false;
  setText: (text: string) => void;
  setPage: (text: string) => void;
  setScrollId: (text: string) => void;
  setId: (text: string) => void;
  setRefreshFlg: (text: boolean) => void;
  setFlg: (text: boolean) => void;
}>({
  searchText: null,
  pageId: null,
  scrollId: null,
  id: null,
  refreshFlg: null,
  flg: false,

  setText: () => {},
  setPage: () => {},
  setScrollId: () => {},
  setId: () => {},
  setRefreshFlg: () => {},
  setFlg: () => {},
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
  const [searchText, setSearchText] = useStorageState('searchText');
  const [scrollId, setScrollId] = useStorageState('id', null);
  const [page, setPageID] = useStorageState('page', null);
  const [refreshFlg, setRefreshFlg] = useStorageState('flg', null);
  //const [searchText, setSearchText] = useState('');
  //const [pageId, setPage] = useState('');
  //const [scrollId, setScrollId] = useState('');

  //const [id, setScrollId] = useState(null);
  //const [page, setPage] = useState(null);
  //const [flg, setFlg] = useState<boolean>(false);
  //console.log('プロバイダー', scrollId, pageId);

  return (
    <CustomerContext.Provider
      value={{
        // searchText,
        page,
        scrollId,
        //id,
        //flg
        refreshFlg,

        setText: (text: string) => {
          setSearchText(text);
        },
        setPage: (page: string) => {
          setPageID(page);
          console.log('page変更', page);
        },

        setId: (id: string) => {
          setScrollId(id);
          console.log('id変更', id);
        },

        setFlg: (flg: boolean) => {
          setRefreshFlg(flg);
          console.log('flg変更', flg);
        },
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}
