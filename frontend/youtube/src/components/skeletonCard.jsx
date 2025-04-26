function SkeletonCard() {
    return (
      <div className="bg-gray-200 animate-pulse rounded-lg overflow-hidden">
        <div className="w-full h-48 bg-gray-300" />
        <div className="p-2 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    )
  }
  
  export default SkeletonCard
  