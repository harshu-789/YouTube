import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import store from "../store/userAuth";
import axios from "axios";






function channel (){
    const {id} = useParams()
    const [channel,setChannel] = useState(null)
    const [videos,setVideos] = useState([])
    const{user} = store()
    
    useEffect(()=>{
        const fetchChannel = async()=>{
            try {
                const {data} = await axios.get(`/channel/${id}`)
                setChannel(data)
            } catch (error) {
                console.error('Error fetching channel:', error); 
            }
        }
        const fetchVideos = async () => {
            try {
              const { data } = await axios.get(`/videos?channel=${id}`);
              setVideos(data);
            } catch (error) {
              console.error('Error fetching videos:', error);
            }
          };
      
          fetchChannel();
          fetchVideos();
    },[id])
    if (!channel) return <div>Loading...</div>;

  const isOwner = user?._id === channel.owner._id;

    return(
        <div>
      <div
        className="h-48 bg-cover bg-center"
        style={{
          backgroundImage: `url(${channel.banner || 'https://via.placeholder.com/1920x480'})`,
        }}
      />
      <div className="max-w-6xl mx-auto px-4 -mt-16">
        <div className="flex items-end gap-6 mb-8">
          <img
            src={channel.owner.avatar || 'https://via.placeholder.com/160'}
            alt={channel.name}
            className="h-40 w-40 rounded-full border-4 border-white"
          />
          <div className="mb-4">
            <h1 className="text-4xl font-bold">{channel.name}</h1>
            <p className="text-gray-600 mt-2">
              {channel.subscribers.length} subscribers
            </p>
            <p className="mt-2">{channel.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} isOwner={isOwner} />
          ))}
        </div>
      </div>
    </div>
    )
}
export default channel;