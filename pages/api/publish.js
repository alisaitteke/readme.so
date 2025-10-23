// /api/publish.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { markdown, sections, darkMode } = req.body

    if (!markdown) {
      return res.status(400).json({ error: 'Markdown content is required' })
    }

    // Generate unique ID
    const id = generateUniqueId()

    // Prepare data to store in KV
    const data = {
      markdown,
      sections: sections || [],
      darkMode: darkMode || false,
      createdAt: new Date().toISOString(),
      views: 0,
    }

    // Store in KV using Cloudflare KV API
    const kvNamespaceId = process.env.KV_NAMESPACE_ID || process.env.README_STORE_ID

    if (!kvNamespaceId) {
      console.error('KV Namespace ID not found in environment variables')
      return res.status(500).json({
        error: 'KV configuration error',
        details: 'KV Namespace ID not configured',
      })
    }

    // Use Cloudflare KV REST API
    const kvResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${kvNamespaceId}/values/${id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    if (!kvResponse.ok) {
      const errorText = await kvResponse.text()
      console.error('KV API error:', errorText)
      return res.status(500).json({
        error: 'Failed to store README',
        details: 'KV storage error',
      })
    }

    console.log(`Successfully stored README with ID: ${id}`)

    return res.status(200).json({
      success: true,
      id,
      url: `/r/${id}`,
    })
  } catch (error) {
    console.error('Publish error:', error)
    return res.status(500).json({
      error: 'Failed to publish README',
      details: error.message,
    })
  }
}

// Generate unique ID using crypto.randomUUID or fallback
function generateUniqueId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '').substring(0, 12)
  }

  // Fallback for environments without crypto.randomUUID
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
