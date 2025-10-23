import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { useState } from 'react'

const ViewPage = ({ data, id, error }) => {
  const [darkMode, setDarkMode] = useState(data?.darkMode || false)

  const handleEditCopy = () => {
    // Store the data in localStorage to load in editor
    localStorage.setItem(
      'imported-readme',
      JSON.stringify({
        markdown: data.markdown,
        sections: data.sections,
        darkMode: data.darkMode,
      })
    )

    // Redirect to editor
    window.location.href = '/'
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  if (!data || error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            README Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "The README you're looking for doesn't exist or has been removed."}
          </p>
          <Link href="/">
            <a className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors">
              Create New README
            </a>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Link href="/">
          <a className="focus:outline-none focus:ring-2 focus:ring-emerald-400 flex items-center">
            <img className="w-auto h-8" src="/readme.svg" alt="readme.so logo" />
          </a>
        </Link>

        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-transform"
          >
            <Image
              className="w-auto h-6"
              alt={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              src={darkMode ? '/toggle_sun.svg' : '/toggle_moon.svg'}
              width={24}
              height={24}
            />
          </button>

          {/* Edit Copy Button */}
          <button
            onClick={handleEditCopy}
            className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit a Copy
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom styling for better GitHub-like appearance
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 mt-8">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
                  {children}
                </h3>
              ),
              code: ({ children, className }) => {
                const isInline = !className
                return isInline ? (
                  <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                ) : (
                  <code className={className}>{children}</code>
                )
              },
              pre: ({ children }) => (
                <pre className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 rounded-lg overflow-x-auto">
                  {children}
                </pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-gray-700 dark:text-gray-300">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
                  {children}
                </td>
              ),
            }}
          >
            {data.markdown}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Created with{' '}
            <Link href="/">
              <a className="text-emerald-500 hover:text-emerald-600 font-medium">readme.so</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ViewPage
