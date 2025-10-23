// /api/read/[id].js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'ID is required' })
  }

  try {
    // Get KV namespace ID from environment
    const kvNamespaceId = process.env.KV_NAMESPACE_ID || process.env.README_STORE_ID

    if (!kvNamespaceId) {
      console.error('KV Namespace ID not found in environment variables')
      return res.status(500).json({
        error: 'KV configuration error',
        details: 'KV Namespace ID not configured',
      })
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
        return res.status(404).json({
          error: 'README not found',
          details: 'The requested README does not exist',
        })
      }

      const errorText = await kvResponse.text()
      console.error('KV API error:', errorText)
      return res.status(500).json({
        error: 'Failed to load README',
        details: 'KV storage error',
      })
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

    return res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Read error:', error)
    return res.status(500).json({
      error: 'Failed to load README',
      details: error.message,
    })
  }
}
