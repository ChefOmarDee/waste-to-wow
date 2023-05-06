import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Nav from '../Mods/Nav'
function MyApp({ Component, pageProps }: AppProps) {
  return(
    <UserProvider>
        <Nav/>
        <Component {...pageProps} />  
    </UserProvider>
  )}

export default MyApp
