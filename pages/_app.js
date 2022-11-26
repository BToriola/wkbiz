
import { Provider } from "react-redux"
import { store } from "../redux/store";
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import { ToastContainer, toast } from 'react-toastify';

import "../styles/main.css";
import "../styles/tailwind.css";
import '../styles/globals.css';
import '../public/DateTimePicker.css'
import './TimePicker.css'
import 'react-toastify/dist/ReactToastify.css';


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: false,
      // staleTime: 30000,
      staleTime: 1000,
    },
  },
});

import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
// import { Provider } from "../context";



function MyApp({ Component, pageProps }) {
  let persistor = persistStore(store)



  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer />
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}

export default MyApp;
