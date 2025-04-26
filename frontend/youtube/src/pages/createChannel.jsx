import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import axios from '../lib/axios';





function createChannel () {
    const url = `https://youtube-4vf7.onrender.com/api/channel`
    const [formData,setFormData] = useState({
        name: '',
    description: '',
    title: '',
    })
    const navigate = useNavigate()
    const handleSubmit = async(e)=>{
        e.preventDefault()
        try {
            const { data } = await axios.post('/channel', formData);
            toast.success('Channel created successfully!');
            navigate(`/channel/${data._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating channel');
        }
    }

    return(
        <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Create a New Channel</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Channel Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
  
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
  
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Banner URL
            </label>
            <input
              type="url"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
  
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Channel
          </button>
        </form>
      </div>
    )
}
export default createChannel;