// import { useState } from "react"
// import { Outlet } from 'react-router-dom';
// import Header from './Header';
// import Sidebar from './Sidebar';




// function Layout(){
//     const [isSidebarOpen,setIsSidebarOpen] = useState(true)

//     return(
//         <div className="min-h-screen bg-gray-100">
//         <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
//         <div className="flex">
//           <Sidebar isOpen={isSidebarOpen} />
//           <main className="flex-1 p-4">
//             <Outlet />
//           </main>
//         </div>
//       </div>
//     )
// }
// export default Layout




import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="min-h-screen bg-gray-100">
      <Header onMenuClick={() => setIsOpen(!isOpen)} />
      <div className="flex">
        <Sidebar isOpen={isOpen} />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}