import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export default function VideoCard({ video }) {
  const {
    thumbnailUrl,
    title,
    channel,
    views,
    createdAt, // might be undefined if your backend didn’t send it
  } = video;

  // only compute a humanized date if createdAt is valid
  let timeAgo = "";
  if (createdAt) {
    const date = new Date(createdAt);
    if (!isNaN(date.getTime())) {
      timeAgo = formatDistanceToNow(date, { addSuffix: true });
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Link to={`/video/${video._id}`}>
        <div className="relative aspect-video rounded-xl overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="flex gap-3">
        <Link to={`/channel/${channel._id}`}>
          <img
            src={channel.avatar || "https://via.placeholder.com/40"}
            alt={channel.name}
            className="h-10 w-10 rounded-full"
          />
        </Link>
        <div>
          <h3 className="font-semibold line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-600">
            {channel.name} • {views} views
            {timeAgo && <> • {timeAgo}</>}
          </p>
        </div>
      </div>
    </div>
  );
}
