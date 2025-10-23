import Head from 'next/head'
import ViewPage from '../../components/ViewPage'

export default function ReadmeView({ data, id, error }) {
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

      <ViewPage data={data} id={id} />
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { id } = params

  try {
    // Get KV namespace ID from environment
    const kvNamespaceId = process.env.KV_NAMESPACE_ID || process.env.README_STORE_ID

    if (!kvNamespaceId) {
      console.error('KV Namespace ID not found in environment variables')
      return {
        props: {
          data: null,
          id,
          error: 'Configuration error',
        },
      }
    }

    // Fetch from Cloudflare KV using REST API
    const kvResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${kvNamespaceId}/values/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
      }
    )

    if (!kvResponse.ok) {
      if (kvResponse.status === 404) {
        return {
          props: {
            data: null,
            id,
            error: 'README not found',
          },
        }
      }

      const errorText = await kvResponse.text()
      console.error('KV API error:', errorText)
      return {
        props: {
          data: null,
          id,
          error: 'Failed to load README',
        },
      }
    }

    const data = await kvResponse.json()

    // Increment view count (optional)
    if (data && typeof data.views === 'number') {
      data.views = data.views + 1
      // Update view count in KV (async, don't wait for it)
      fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${kvNamespaceId}/values/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      ).catch((err) => console.error('Failed to update view count:', err))
    }

    return {
      props: {
        data,
        id,
        error: null,
      },
    }
  } catch (error) {
    console.error('Error fetching README:', error)

    return {
      props: {
        data: null,
        id,
        error: 'Failed to load README',
      },
    }
  }
}
