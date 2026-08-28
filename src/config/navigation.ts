import {
  BarChart3,
  Boxes,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  Activity,
  Users,
  Wallet,
} from "lucide-react";

export const adminNavigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Sales",
    path: "/sales",
    icon: BarChart3,
  },
  {
    label: "Inventory / Stock",
    path: "/inventory",
    icon: Boxes,
  },
  {
    label: "Finance",
    path: "/finance",
    icon: Wallet,
  },
  {
    label: "Users",
    path: "/users",
    icon: Users,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: FileText,
  },
  {
    label: "Products",
    path: "/products",
    icon: Package,
  },
  {
    label: "Activity",
    path: "/activity",
    icon: Activity,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export const staffNavigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Sales",
    path: "/sales",
    icon: BarChart3,
  },
  {
    label: "Inventory / Stock",
    path: "/inventory",
    icon: Boxes,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
