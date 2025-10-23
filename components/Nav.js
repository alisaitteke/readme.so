import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import Menu from './icons/Menu'
import Close from './icons/Close'
import useDeviceDetect from '../hooks/useDeviceDetect'
import PublishModal from './PublishModal'

export const Nav = ({
  selectedSectionSlugs,
  setShowModal,
  getTemplate,
  onMenuClick,
  isDrawerOpen,
  darkMode,
  setDarkMode,
  focusedSectionSlug,
  templates,
}) => {
  const [isPublishing, setIsPublishing] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState('')
  const [publishedId, setPublishedId] = useState('')

  const markdown = selectedSectionSlugs.reduce((acc, section) => {
    const template = getTemplate(section)
    if (template) {
      return `${acc}${template.markdown}`
    } else {
      return acc
    }
  }, ``)

  const { isMobile } = useDeviceDetect()

  const downloadMarkdownFile = () => {
    const a = document.createElement('a')
    const blob = new Blob([markdown])
    a.href = URL.createObjectURL(blob)
    a.download = 'README.md'
    a.click()
    if (isMobile && isDrawerOpen) {
      onMenuClick()
    }
    setShowModal(true)
  }

  const handlePublish = async () => {
    if (!markdown.trim()) {
      alert('Please add some content before publishing!')
      return
    }

    setIsPublishing(true)

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markdown,
          sections: selectedSectionSlugs,
          darkMode,
          templates: templates.filter((t) => selectedSectionSlugs.includes(t.slug)),
        }),
      })

      const result = await response.json()

      if (result.success) {
        const fullUrl = `${window.location.origin}${result.url}`
        setPublishedUrl(fullUrl)
        setPublishedId(result.id)
        setShowPublishModal(true)
      } else {
        alert('Failed to publish README. Please try again.')
      }
    } catch (error) {
      console.error('Publish error:', error)
      alert('Failed to publish README. Please try again.')
    } finally {
      setIsPublishing(false)
    }
  }

  const { t } = useTranslation('editor')

  return (
    <nav className="flex justify-between p-2 bg-gray-800 align-center w-full">
      <Link href="/">
        <a className="focus:outline-none focus:ring-2 focus:ring-emerald-400 flex items-center">
          <img className="w-auto h-12" src="readme.svg" alt="readme.so logo" />
        </a>
      </Link>
      <div className="flex flex-row-reverse md:flex-row">
        {/* visible for sm only */}
        <button
          className="focus:outline-none focus:ring-2 focus:ring-emerald-400"
          onClick={onMenuClick}
        >
          {isDrawerOpen ? (
            <Close className="w-10 h-10 md:hidden fill-current text-emerald-500" />
          ) : (
            <Menu className="w-10 h-10 md:hidden fill-current text-emerald-500" />
          )}
        </button>
        {/* visible for md and above */}
        {focusedSectionSlug !== 'noEdit' && (
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Color Mode"
            className="toggle-dark-mode focus:outline-none transition transform motion-reduce:transition-none motion-reduce:transform-none  pr-4"
          >
            <Image
              className="w-auto h-8 mr-2"
              alt={darkMode ? 'dark' : 'light'}
              src={darkMode ? '/toggle_sun.svg' : '/toggle_moon.svg'}
              width={40}
              height={40}
            />
          </button>
        )}

        <div className="flex gap-2 mr-4 md:mr-0">
          <button
            type="button"
            aria-label="Publish"
            disabled={isPublishing}
            className={`flex flex-row relative items-center px-3 py-1.5 text-xs font-medium tracking-wide text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors ${
              isPublishing
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-400 focus:ring-blue-500'
            }`}
            onClick={handlePublish}
          >
            {isPublishing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-1 h-3 w-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="hidden md:inline-block">Publishing...</span>
                <span className="md:hidden">⏳</span>
              </>
            ) : (
              <>
                <span className="hidden md:inline-block">Publish</span>
                <span className="md:hidden">📤</span>
              </>
            )}
          </button>

          <button
            type="button"
            aria-label="Download Markdown"
            className="flex flex-row relative items-center px-3 py-1.5 text-xs font-medium tracking-wide text-white border border-transparent rounded-md shadow-sm bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500"
            onClick={downloadMarkdownFile}
          >
            <img className="w-auto h-4 cursor-pointer" src="download.svg" />
            <span className="hidden md:inline-block ml-1">{t('nav-download')}</span>
          </button>
        </div>
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <PublishModal
          setShowModal={setShowPublishModal}
          publishedUrl={publishedUrl}
          publishedId={publishedId}
        />
      )}
    </nav>
  )
}
