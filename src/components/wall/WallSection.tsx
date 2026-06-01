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
    <div className="flex flex-col lg:flex-row justify-center gap-4 md:gap-6">
      <div className="w-full lg:w-[340px] lg:flex-shrink-0">
        <MessageForm />
      </div>
      <div className="w-full lg:flex-1 lg:max-w-[800px]">
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
