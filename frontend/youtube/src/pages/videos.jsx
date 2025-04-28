import React, { useEffect, useState } from "react";
import { useParams }                  from "react-router-dom";
import ReactPlayer                    from "react-player";
import CommentSection                 from "../components/CommentSection";
import axios                          from "../lib/axios.js";

export default function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/video/${id}`);
        const v   = res.data.data;
        console.log("▶ Cloudinary video URL:", v.url);
        setVideo(v);
      } catch (err) {
        console.error(err);
        setError("Failed to load video");
      }
    })();
  }, [id]);

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!video) return <div className="p-4">Loading…</div>;

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="aspect-video mb-4 bg-black">
        <ReactPlayer
          url={video.url}
          controls          // show play/pause bar
          width="100%"
          height="100%"
          // playing       ← remove this line so it doesn’t try to auto‐play
        />
      </div>
      <h1 className="text-2xl font-bold">{video.title}</h1>
      <p className="mt-2 text-gray-700">{video.description}</p>
      <CommentSection videoId={id} comments={video.comments || []} />
    </div>
  );
}
