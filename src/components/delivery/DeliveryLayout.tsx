
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  List, 
  History, 
  User,
  Truck
} from 'lucide-react';

interface DeliveryLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DeliveryLayout: React.FC<DeliveryLayoutProps> = ({ children, title }) => {
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
            <Link to="/delivery/profile">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
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
            to="/delivery/dashboard" 
            className={`flex flex-col items-center p-1 ${isActive('/delivery/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            to="/delivery/available" 
            className={`flex flex-col items-center p-1 ${isActive('/delivery/available') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <List className="h-5 w-5" />
            <span className="text-xs mt-1">Available</span>
          </Link>
          
          <Link 
            to="/delivery/active" 
            className={`flex flex-col items-center p-1 ${isActive('/delivery/active') || location.pathname.includes('/delivery/navigation') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Truck className="h-5 w-5" />
            <span className="text-xs mt-1">Active</span>
          </Link>
          
          <Link 
            to="/delivery/history" 
            className={`flex flex-col items-center p-1 ${isActive('/delivery/history') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <History className="h-5 w-5" />
            <span className="text-xs mt-1">History</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default DeliveryLayout;
