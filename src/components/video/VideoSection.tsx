import { useState, useEffect, useRef } from 'react'
import type { VideoItem } from '../../types/video'
import { presetVideos } from '../../config/videos'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

const PRESET: VideoItem[] = presetVideos.map((v, i) => ({
  id: `preset-${i}`,
  title: v.title,
  author: v.author,
  type: v.type,
  bvid: v.bvid,
  createdAt: Date.now(),
  isPinned: v.isPinned,
}))

export function VideoSection() {
  const [videos, setVideos] = useState<VideoItem[]>(PRESET)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch('/data-proxy?table=video_playlist&select=*&order=is_pinned.desc,created_at.desc')
      .then(async r => {
        if (!r.ok) return
        const data = await r.json()
        if (Array.isArray(data) && data.length > 0) {
          const remote: VideoItem[] = data.map((row: Record<string, unknown>) => ({
            id: row.id as string,
            title: row.title as string,
            author: row.author as string,
            type: row.type as VideoItem['type'],
            bvid: row.bvid as string | undefined,
            videoUrl: row.video_url as string | undefined,
            thumbnail: row.thumbnail as string | undefined,
            createdAt: new Date(row.created_at as string).getTime(),
            isPinned: (row.is_pinned as boolean) || false,
          }))
          setVideos(remote)
        }
      })
      .catch(() => { /* keep preset data */ })
  }, [])

  useEffect(() => {
    if (!isPlaying || videos.length === 0) return
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % videos.length)
    }, 180000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, videos.length])

  const prev = () => setCurrentIndex(i => (i - 1 + videos.length) % videos.length)
  const next = () => setCurrentIndex(i => (i + 1) % videos.length)

  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-tertiary">暂无视频，快去添加吧！</p>
      </div>
    )
  }

  const currentVideo = videos[currentIndex]

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        {currentVideo.type === 'bilibili' ? (
          <iframe
            key={currentVideo.bvid}
            src={`https://player.bilibili.com/player.html?bvid=${currentVideo.bvid}&autoplay=1&muted=1`}
            className="absolute inset-0 w-full h-full border-0"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        ) : (
          <video
            key={currentVideo.videoUrl}
            src={currentVideo.videoUrl}
            className="absolute inset-0 w-full h-full object-contain"
            controls
            autoPlay
            muted
            playsInline
          />
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-white font-medium text-sm">{currentVideo.title}</p>
          <p className="text-white/60 text-xs mt-0.5">@{currentVideo.author}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={prev} className="rounded-lg bg-[#111] hover:bg-bg-elevated p-2 transition-colors">
            <ChevronLeft className="h-5 w-5 text-text-secondary" />
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="rounded-lg bg-[#111] hover:bg-bg-elevated p-2 transition-colors">
            {isPlaying ? <Pause className="h-5 w-5 text-text-secondary" /> : <Play className="h-5 w-5 text-text-secondary" />}
          </button>
          <button onClick={next} className="rounded-lg bg-[#111] hover:bg-bg-elevated p-2 transition-colors">
            <ChevronRight className="h-5 w-5 text-text-secondary" />
          </button>
        </div>

        <span className="text-caption text-text-tertiary">
          {currentIndex + 1} / {videos.length}
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {videos.map((v, i) => (
          <button
            key={v.id}
            onClick={() => setCurrentIndex(i)}
            className={`relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
              i === currentIndex ? 'border-primary shadow-[0_0_10px_rgba(225,6,0,0.3)]' : 'border-transparent hover:border-white/10'
            }`}
          >
            <div className="absolute inset-0 bg-bg-elevated flex items-center justify-center">
              {v.type === 'bilibili' ? (
                <span className="text-xs text-text-tertiary">B站视频</span>
              ) : (
                <Play className="h-5 w-5 text-text-tertiary" />
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-0.5">
              <p className="text-[10px] text-white truncate">{v.title}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
