import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    try {
      const json = await fetch("/events.json");
      return json.json();
    } catch (error) {
      
      console.error("Erreur API:", error)
      return error;
    }
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const last = useMemo(() => {
    if (!data) return null;
    return data.events?.reduce((mostRecent, event) => {
      if (!mostRecent) return event;
      return new Date(mostRecent.date) > new Date(event.date) ? mostRecent : event;
    });
  }, [data]);
const getData = useCallback(async () => {
    try {
      setData(await api.loadData());
      } catch (err) {
        setError(err);
      }
    },  []);
      
useEffect(() => {
    if (data) return;
    getData();
  });

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
         
        data,
        error,
        last,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
