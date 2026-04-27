/**
 * PromptThumbnail - Lazy-loaded thumbnail component using Intersection Observer
 * Only loads image when near viewport (100px threshold)
 */

import { useRef, useState, useEffect } from 'react'
import { Shapes } from 'lucide-react'
import { queueImageLoad } from '@/lib/sync/image-loader-queue'

interface PromptThumbnailProps {
  relativePath: string      // Image path relative to backup folder
  promptName: string        // Prompt name for alt text
  onClick?: () => void      // Click handler for preview modal
}

// Threshold for early loading (load when within 100px of viewport)
const INTERSECTION_THRESHOLD = 100

export function PromptThumbnail({
  relativePath,
  promptName,
  onClick,
}: PromptThumbnailProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)

  // Intersection Observer for lazy loading
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            // Disconnect observer once in view
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: `${INTERSECTION_THRESHOLD}px`, // Start loading 100px before visible
        threshold: 0,
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  // Load image when in view
  useEffect(() => {
    if (!isInView || isLoaded) return

    const loadImage = async () => {
      const url = await queueImageLoad(relativePath)
      if (url) {
        setImageUrl(url)
      }
      setIsLoaded(true)
    }

    loadImage()
  }, [isInView, isLoaded, relativePath])

  // Revoke blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [imageUrl])

  return (
    <div
      ref={ref}
      className="dropdown-item-thumbnail"
      style={onClick && imageUrl ? { cursor: 'pointer' } : {}}
      onClick={(e) => {
        if (onClick && imageUrl) {
          e.stopPropagation()
          onClick()
        }
      }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={promptName} />
      ) : (
        <Shapes className="dropdown-item-thumbnail-placeholder" style={{ width: 20, height: 20 }} />
      )}
    </div>
  )
}