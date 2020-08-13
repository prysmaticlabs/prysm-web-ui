export default interface SidebarLink {
  name: string; 
  icon: string; 
  path?: string;
  children?: SidebarLink[];
}