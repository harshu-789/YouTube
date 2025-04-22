import { Link } from 'react-router-dom';
import {
  HomeIcon,
  FireIcon,
  FilmIcon,
  ClockIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';

function Sidebar({ isOpen }) {
  const menuItems = [
    { icon: HomeIcon, text: 'Home', path: '/' },
    { icon: FireIcon, text: 'Trending', path: '/?category=trending' },
    { icon: FilmIcon, text: 'Subscriptions', path: '/?category=subscriptions' },
    { icon: ClockIcon, text: 'History', path: '/?category=history' },
    { icon: BookmarkIcon, text: 'Library', path: '/?category=library' },
  ];

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-white h-[calc(100vh-64px)] sticky top-16 transition-all duration-300 ease-in-out`}
    >
      <nav className="p-2">
        {menuItems.map((item) => (
          <Link
            key={item.text}
            to={item.path}
            className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg"
          >
            <item.icon className="h-6 w-6" />
            {isOpen && <span>{item.text}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;