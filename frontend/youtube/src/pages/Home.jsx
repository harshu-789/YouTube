import { useEffect, useState } from 'react'
import { useSearchParams }      from 'react-router-dom'
import axios                    from '../lib/axios.js'
import VideoCard                from '../components/videoCard'
import FilterButtons            from '../components/Filterbutton'
import SkeletonCard             from '../components/skeletonCard'

function Home() {
  const [searchParams]  = useSearchParams()
  const searchQuery     = searchParams.get('search') || ''
  const [selectCategory, setSelectCategory] = useState('All')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)     // Start loading
        const params = new URLSearchParams()
        if (searchQuery) params.append('search', searchQuery)
        if (selectCategory !== 'All') params.append('category', selectCategory)

          const { data } = await axios.get(`http://localhost:8000/api/video?${params.toString()}`)

        setVideos(data)
      } catch (err) {
        console.error('Error fetching videos:', err)
      } finally {
        setLoading(false)    // Stop loading
      }
    }
    fetchVideos()
  }, [searchQuery, selectCategory])

  return (
    <div>
      <FilterButtons
        selectedCategory={selectCategory}
        onCategorySelect={setSelectCategory}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))
        }
      </div>
    </div>
  )
}

export default Home



