import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Activity, Folder, LucideHome, Utensils, LucideCalendar, LucideSettings, LucideCalculator } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LucideHome,
    },
    {
        title: 'Food Log',
        href: '/food-log',
        icon: Utensils,
    },
    {
        title: 'History (In Progress)',
        href: '/history',
        icon: LucideCalendar,
    },
    {
        title: 'TDEE Calculator',
        href: '/tdee-calculator',
        icon: LucideCalculator,
    },
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: LucideSettings,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/BruceGoodGuy/calories-app.git',
        icon: Folder,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
                                    <Activity className="h-4 w-4 text-primary-foreground" />
                                </div>
                                <span className="ml-2 text-sm font-semibold">CalorieTracker Pro</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
