import React, { useEffect, useState } from "react";
import { useSearchParams }             from "react-router-dom";
import axios                           from "../lib/axios.js";
import VideoCard                       from "../components/VideoCard.jsx";
import FilterButtons                   from "../components/Filterbutton.jsx";

export default function Home() {
  const [searchParams]                = useSearchParams();
  const searchQuery                   = searchParams.get("search") || "";
  const [selectCategory, setCategory] = useState("All");
  const [videos, setVideos]           = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery)        params.append("search", searchQuery);
        if (selectCategory !== "All")
                                 params.append("category", selectCategory);

        const res = await axios.get(`/video?${params.toString()}`);
        // unwrap the real array:
        setVideos(res.data.data || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };
    fetchVideos();
  }, [searchQuery, selectCategory]);

  return (
    <>
      <FilterButtons
        selectedCategory={selectCategory}
        onCategorySelect={setCategory}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((v) => (
          <VideoCard key={v._id} video={v} />
        ))}
      </div>
    </>
  );
}