import '../styles/globals.css'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Loader from '../Components/common/Loader';

function MyApp({ Component, pageProps }) {
  const [LoaderAnim, setLoaderAnim] = useState(false)
  const router = useRouter();

  useEffect(() => {
    setLoaderAnim(true)

    fetch('http://localhost:4000/api/login/verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ status: false })

    }).then(async (response) => {
      const data = await response.json();
      console.log(data);
      if (data.status) {
        router.replace(`/dashboard/${data.redirect}/`)
      } else {
        router.replace('/')
      }
      setLoaderAnim(false)
    }).catch((error) => {

      router.replace('/')
      setLoaderAnim(false)
    });
  }, [])

  return <>
    {LoaderAnim && <Loader />}
    <Component {...pageProps} />
  </>

}

export default MyApp
