
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  List, 
  Truck, 
  Share,
  User,
  ChartBar
} from 'lucide-react';

interface NgoLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const NgoLayout: React.FC<NgoLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {title && (
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
          <div className="container px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold">{title}</h1>
            <Link to="/ngo/profile">
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-secondary" />
              </div>
            </Link>
          </div>
        </header>
      )}
      
      <main className="flex-1 container px-4 pb-16">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t py-2 z-10">
        <div className="container flex justify-around">
          <Link 
            to="/ngo/dashboard" 
            className={`flex flex-col items-center p-1 ${isActive('/ngo/dashboard') ? 'text-secondary' : 'text-muted-foreground'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            to="/ngo/available-donations" 
            className={`flex flex-col items-center p-1 ${isActive('/ngo/available-donations') ? 'text-secondary' : 'text-muted-foreground'}`}
          >
            <List className="h-5 w-5" />
            <span className="text-xs mt-1">Donations</span>
          </Link>
          
          <Link 
            to="/ngo/active-pickups" 
            className={`flex flex-col items-center p-1 ${isActive('/ngo/active-pickups') ? 'text-secondary' : 'text-muted-foreground'}`}
          >
            <Truck className="h-5 w-5" />
            <span className="text-xs mt-1">Pickups</span>
          </Link>
          
          <Link 
            to="/ngo/analytics" 
            className={`flex flex-col items-center p-1 ${isActive('/ngo/analytics') ? 'text-secondary' : 'text-muted-foreground'}`}
          >
            <ChartBar className="h-5 w-5" />
            <span className="text-xs mt-1">Analytics</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default NgoLayout;
