export default interface SidebarLink {
  name: string;
  icon: string;
  path?: string;
  externalUrl?: string;
  comingSoon?: boolean;
  children?: SidebarLink[];
}
