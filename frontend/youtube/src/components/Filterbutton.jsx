function FilterButtons({ selectedCategory, onCategorySelect }) {
    const categories = [
      'All',
      'Music',
      'Gaming',
      'Sports',
      'News',
      'Education',
      'Entertainment',
      'Technology',
    ];
  
    return (
      <div className="flex gap-3 overflow-x-auto scrollbar-hide py-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`px-4 py-1 rounded-full whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-black text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    );
  }
  
  export default FilterButtons;