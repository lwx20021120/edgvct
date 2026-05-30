import { useState } from 'react'
import { useWallContext } from '../../context/WallContext'
import { MessageForm } from './MessageForm'
import { MessageList } from './MessageList'

export function WallSection() {
  const { messages, hasMore, loadMore } = useWallContext()
  const [isAdmin] = useState(
    () => sessionStorage.getItem('edg_vct_admin_auth') === 'true',
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <div className="lg:col-span-1">
        <MessageForm />
      </div>
      <div className="lg:col-span-2">
        <MessageList
          messages={messages}
          hasMore={hasMore}
          onLoadMore={loadMore}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  )
}
