import { useState } from 'react'
import { useTranslation } from 'next-i18next'

const PublishModal = ({ setShowModal, publishedUrl, publishedId }) => {
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation('editor')

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publishedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const handleViewPublished = () => {
    window.open(publishedUrl, '_blank')
  }

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900">
            <svg
              className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-4">
            README Published Successfully!
          </h3>
          <div className="mt-4 px-7 py-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Your README has been published and is now available at:
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3 mb-4">
              <code className="text-sm text-gray-800 dark:text-gray-200 break-all">
                {publishedUrl}
              </code>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleCopyUrl}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                }`}
              >
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
              <button
                onClick={handleViewPublished}
                className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-md hover:bg-emerald-600 transition-colors"
              >
                View Published
              </button>
            </div>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublishModal
