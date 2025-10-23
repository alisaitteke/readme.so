import Head from 'next/head'
import { useEffect, useState } from 'react'
import ViewPage from '../../components/ViewPage'

export default function ReadmeView({ id }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/read/${id}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError('README not found')
          } else {
            setError('Failed to load README')
          }
          setLoading(false)
          return
        }

        const result = await response.json()
        setData(result.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching README:', err)
        setError('Failed to load README')
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading... - readme.so</title>
          <meta name="description" content="Loading README..." />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Mali&display=swap"
            rel="stylesheet"
          />
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{data ? 'README' : 'README Not Found'} - readme.so</title>
        <meta
          name="description"
          content={data ? 'View this README created with readme.so' : 'README not found'}
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Mali&display=swap" rel="stylesheet" />
      </Head>

      <ViewPage data={data} id={id} error={error} />
    </>
  )
}
