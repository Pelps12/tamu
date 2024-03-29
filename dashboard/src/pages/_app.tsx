import QueryProvider from "components/providers/QueryProvider";
import "components/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return(
    <QueryProvider>
      <Component {...pageProps} />
     </QueryProvider>
  );
}
