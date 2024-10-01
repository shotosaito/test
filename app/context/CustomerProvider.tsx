import { createContext, useContext, type PropsWithChildren } from 'react';

import { useStorageState } from './useStorageState';

const CustomerContext = createContext<{
  searchText: string | null;
  //text: string | null;
  pageId: string;
  scrollId: string | null;
  //id: string | null;
  refreshFlg: boolean;
  flg: boolean;
  setSearchText: (text: string) => void;
  setText: (text: string) => void;
  setPage: (text: string) => void;
  setScrollId: (text: string) => void;
  setId: (text: string) => void;
  setRefreshFlg: (text: boolean) => void;
  setFlg: (text: boolean) => void;
}>({
  searchText: null,
  //text: null,
  pageId: '1',
  scrollId: null,
  //id: null,
  refreshFlg: 'false',
  flg: 'false',

  setSearchText: () => {},
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

export function CustomerProvider({ children }: PropsWithChildren<{}>) {
  const [[isSearchTextFlg, searchText], setSearchText] = useStorageState<
    string | null
  >('searchText');
  //const [text, setText] = useStorageState<string | null>('text',null);
  const [[isLoading, scrollId], setScrollId] = useStorageState<string | null>(
    'scrollId'
  );
  const [[isPageIdFlg, pageId], setPageId] = useStorageState<string | '1'>(
    'pageId'
  );
  //const [page, setPage] = useStorageState('page');
  const [[isRefrechFlg, refreshFlg], setRefreshFlg] = useStorageState(
    'refreshFlg',
    'false'
  );

  return (
    <CustomerContext.Provider
      value={{
        searchText,
        //text,
        pageId,
        scrollId,
        //id,
        //flg,
        refreshFlg,

        /*************  ✨ Codeium Command ⭐  *************/
        /**
         * Set the search word.
         * @param {string} searchText search word.
         */
        /******  06e34c7a-7e96-4d3c-a616-ab3baac8c625  *******/ setText: (
          searchText: string
        ) => {
          //   setSearchText(searchText);
          //   console.log('検索ワード', searchText);
        },
        setPage: (pageId: string) => {
          setPageId(pageId);
          //   console.log('page変更', pageId);
        },

        setId: (id: string) => {
          setScrollId(id);
          //   console.log('id変更', id);
        },

        setFlg: (flg: string) => {
          setRefreshFlg(flg);
          //   console.log('flg変更', flg);
        },
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}
