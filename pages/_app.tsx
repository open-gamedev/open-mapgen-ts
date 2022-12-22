import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { wrapper } from '../redux/store';
import { Provider } from 'react-redux';

const MyApp = function ({ Component, pageProps }: AppProps) {

  const {store} = wrapper.useWrappedStore(pageProps);
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
