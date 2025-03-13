'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function CustomApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    // Check if we need to redirect based on the URL parameters
    const { path } = router.query
    if (path && typeof window !== 'undefined') {
      router.replace(`/${path}`)
    }
  }, [router])

  return <Component {...pageProps} />
} 