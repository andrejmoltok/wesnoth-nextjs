import '@/styles/globals.scss';
import Layout from '../pages/layout';
import { useState } from 'react';
import { HatterContext } from '@/pages/HatterContext';
import { KozepContext } from '@/pages/KozepContext';
import { AfterContext } from '@/pages/AfterContext';
import { createGlobalStyle } from "styled-components";
import { config, dom } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;
const GlobalStyles = createGlobalStyle`
    ${dom.css()}
    // Insert any other global styles you want here
`;

export default function App({ Component, pageProps }) {

  const [tarthatter, setTarthatter] = useState(0);
  const [tartkozep, setTartkozep] = useState(0);
  const [after, setAfter] = useState(0);

  const handleUpdateTarthatter = (value) => {
    setTarthatter(value);
  };

  const handleUpdateTartkozep = (value) => {
    setTartkozep(value);
  };

  const handleUpdateAfter = (value) => {
    setAfter(value);
  };

  return <>
    <HatterContext.Provider value={{tarthatter,setTarthatter: handleUpdateTarthatter}}>
    <KozepContext.Provider value={{tartkozep,setTartkozep: handleUpdateTartkozep}}>
    <AfterContext.Provider value={{after,setAfter: handleUpdateAfter}}>
      <Layout>
        <GlobalStyles />
        <Component {...pageProps} />
      </Layout>
    </AfterContext.Provider>
    </KozepContext.Provider>
    </HatterContext.Provider>
  </>
}
