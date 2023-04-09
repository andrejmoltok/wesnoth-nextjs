import '@/styles/globals.scss';
import { createGlobalStyle } from "styled-components";
import { config, dom } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;
const GlobalStyles = createGlobalStyle`
    ${dom.css()}
    // Insert any other global styles you want here
`;

export default function App({ Component, pageProps }) {
  return <><GlobalStyles /><Component {...pageProps} /></>
}
