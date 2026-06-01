import { useState, useRef } from 'react'
import { apiPost, apiUpload, getPublicUrl } from '../../config/api'
import { Upload, Loader2 } from 'lucide-react'
import { useToast } from '../shared/Toast'

export function VideoUpload() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  async function handleUpload(file: File) {
    if (!title || !author) {
      showToast('请填写标题和昵称', 'warning')
      return
    }
    setUploading(true)
    const fileName = `${Date.now()}-${file.name}`

    const res = await apiUpload('fan_videos', fileName, file)
    if (!res.ok) {
      showToast('上传失败', 'error')
      setUploading(false)
      return
    }

    const publicUrl = getPublicUrl('fan_videos', fileName)

    await apiPost('/rest/v1/video_playlist', {
      title, author, type: 'upload', video_url: publicUrl
    })

    showToast('上传成功！视频已加入轮播列表')
    setTitle('')
    setAuthor('')
    setUploading(false)
  }

  return (
    <div className="rounded-xl bg-[#1a1a1a]/80 backdrop-blur-sm border border-white/[0.06] p-6 md:p-8">
      <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
        <Upload className="h-6 w-6 text-primary" />
        上传应援视频
      </h3>
      <div className="space-y-4">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="视频标题（如：EDG加油混剪）"
          className="w-full rounded-lg bg-[#111] border border-white/5 px-4 py-3 text-body text-text-primary placeholder:text-text-tertiary focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none transition-colors"
        />
        <input
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="你的昵称"
          className="w-full rounded-lg bg-[#111] border border-white/5 px-4 py-3 text-body text-text-primary placeholder:text-text-tertiary focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:outline-none transition-colors"
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full rounded-lg bg-white text-black py-3.5 text-body font-bold hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {uploading ? <><Loader2 className="h-5 w-5 animate-spin" /> 上传中...</> : <>📁 选择视频文件</>}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
        <p className="text-caption text-text-tertiary text-center pt-1">
          支持 mp4/webm，单个视频建议不超过 50MB
        </p>
      </div>
    </div>
  )
}
