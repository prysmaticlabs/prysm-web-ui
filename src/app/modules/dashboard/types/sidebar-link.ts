export default interface SidebarLink {
  name: string;
  icon: string;
  path?: string;
  externalUrl?: string;
  children?: SidebarLink[];
}
