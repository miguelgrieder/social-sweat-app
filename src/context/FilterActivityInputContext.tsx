import React, { createContext, useState, useContext } from 'react';

interface FilterActivityInputContextProps {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

const FilterActivityInputContext = createContext<FilterActivityInputContextProps>({
  filters: {},
  setFilters: () => {},
});

export const FilterActivityInputProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [filters, setFilters] = useState({});

  return (
    <FilterActivityInputContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterActivityInputContext.Provider>
  );
};

export const useFilters = () => useContext(FilterActivityInputContext);
