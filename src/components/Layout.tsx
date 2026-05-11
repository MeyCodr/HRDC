import { LayoutDashboard, BookOpen, ClipboardList, Settings, Bell, ChevronRight } from 'lucide-react';
import { ROUTE_PATHS } from '@/lib/index';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',      path: ROUTE_PATHS.HOME,   active: true  },
  // { icon: BookOpen,        label: 'All Trainings',  path: ROUTE_PATHS.HOME,   active: false },
  // { icon: ClipboardList,   label: 'HRDC Claims',    path: ROUTE_PATHS.HOME,   active: false },
  // { icon: Settings,        label: 'Settings',       path: ROUTE_PATHS.HOME,   active: false },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col border-r border-sidebar-border bg-sidebar">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold text-sidebar-foreground leading-none">Training</p>
              <p className="text-xs text-muted-foreground mt-0.5">HRDC Monitor</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                item.active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground">PHN Industry Sdn Bhd</p>
          <p className="text-xs text-muted-foreground opacity-60">© 2026 HR L&D Section</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card flex-shrink-0">
          <div>
            <h1 className="text-base font-semibold text-foreground">Training & HRDC Grant Monitoring</h1>
            <p className="text-xs text-muted-foreground">Dashboard Overview</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">HR</span>
              </div>
              <span className="text-sm font-medium text-foreground">Fikri Honda</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
