import React from 'react'
import { formatDistanceToNow } from 'date-fns';

function videoCard(video) {
    
  return (
    <div className="flex flex-col gap-2">
    <Link to={`/video/${video._id}`}>
      <div className="relative aspect-video rounded-xl overflow-hidden">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />
      </div>
    </Link>
    <div className="flex gap-3">
      <Link to={`/channel/${video.channel._id}`}>
        <img
          src={video.channel.avatar || 'https://via.placeholder.com/40'}
          alt={video.channel.name}
          className="h-10 w-10 rounded-full"
        />
      </Link>
      <div>
        <h3 className="font-semibold line-clamp-2">{video.title}</h3>
        <Link
          to={`/channel/${video.channel._id}`}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {video.channel.name}
        </Link>
        <div className="text-sm text-gray-600">
          <span>{video.views} views</span>
          <span className="mx-1">•</span>
          <span>
            {formatDistanceToNow(new Date(video.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </div>
  </div>
  )
}

export default videoCard