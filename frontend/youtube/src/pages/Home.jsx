import { useEffect, useState } from "react"
import {useSearchParams} from "react-router-dom"
import axios from "../lib/axios.js"
import VideoCard from '../components/VideoCard';
import FilterButtons from '../components/Filterbutton.jsx';







function Home(){
    const [searchParams] = useSearchParams()
    const [videos,setVideos] = useState([])
    const[selectCategory,setSelectCategory] = useState('All')
    const [searchQuery] = searchParams.get('search')

    useEffect(()=>{
        const fetchVideos = async()=>{
            try {
                const params = new URLSearchParams()
                if(searchQuery)params.append('search',searchQuery)
                    if(selectCategory!== 'All')params.append('category',selectCategory)

                        const {data} = await axios.get(`/videos?${params.toString()}`)
                        setVideos(data)

            } catch (error) {
                 console.error('Error fetching videos:', error);
            }
        }
        fetchVideos();
    },[searchQuery, selectCategory])

    return(
        <div>
        <FilterButtons
          selectedCategory={selectCategory}
          onCategorySelect={setSelectCategory}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      </div>
    )
}
export default Home;