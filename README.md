# readme.so

Readme.so is an online editor to help developers make readmes for their project.

Link to production site: [readme.so](https://readme.so)

## Features

- Choose from list of sections to add to your readme
- Edit the contents of each section
- Drag and drop to rearrange sections
- Download your readme file
- **NEW**: Publish your README and share with a public URL
- **NEW**: View published READMEs with clean, GitHub-style rendering

## Contributing

Contributions are always welcome!

See [CONTRIBUTING.md](/CONTRIBUTING.md) for ways to get started.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [dnd kit](https://dndkit.com/)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Cloudflare KV](https://developers.cloudflare.com/kv/)

## Running the Dev Server

To run the dev server, run `npm run dev` and navigate to `localhost:3000`

## Deployment to Cloudflare Pages

### Prerequisites

1. Cloudflare account
2. Git repository (GitHub recommended)

### Setup Steps

1. **Create KV Namespace:**

   ```bash
   # Install Wrangler CLI
   npm install -g wrangler

   # Login to Cloudflare
   wrangler login

   # Create KV namespace
   wrangler kv:namespace create "README_STORE"
   wrangler kv:namespace create "README_STORE" --preview
   ```

2. **Update wrangler.toml:**

   - Replace `your-kv-namespace-id` with the actual namespace ID from step 1
   - Replace `your-preview-kv-namespace-id` with the preview namespace ID

3. **Deploy to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to Workers & Pages > Create Application
   - Select "Pages" tab
   - Connect your Git repository
   - Configure build settings:
     - **Framework preset:** Next.js (Static HTML Export)
     - **Build command:** `npm run pages:build`
     - **Build output directory:** `out`
   - Add environment variables:
     - `KV_NAMESPACE_ID`: Your production KV namespace ID
   - Deploy!

### Environment Variables

- `KV_NAMESPACE_ID`: Cloudflare KV namespace ID for storing published READMEs

### Local Development with KV

1. **Get Cloudflare API Credentials:**

   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to My Profile > API Tokens
   - Create a custom token with:
     - **Permissions:** Zone:Zone:Read, Account:Cloudflare Workers:Edit
     - **Account Resources:** Include your account
     - **Zone Resources:** Include all zones (or specific zone)

2. **Get Account ID:**

   - In Cloudflare Dashboard, go to Workers & Pages
   - Your Account ID is shown in the right sidebar

3. **Create `.dev.vars` file:**

   ```
   KV_NAMESPACE_ID=1d51a9b952354e19baebc01755aec0b0
   CLOUDFLARE_ACCOUNT_ID=your-account-id-here
   CLOUDFLARE_API_TOKEN=your-api-token-here
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/publish` - Publish a README and get a shareable URL
- `GET /r/[id]` - View a published README

## Feedback

Feedback is appreciated! Reach out on [Twitter](https://twitter.com/katherinecodes) or submit a new issue!

## License

[MIT](/LICENSE)

This readme was created with [readme.so](https://readme.so) :)
