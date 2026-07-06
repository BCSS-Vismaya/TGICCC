import SidebarLogo from "./SidebarLogo";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

function Sidebar() {
  return (
    <aside className="sidebar">
      <SidebarLogo />

      <SidebarMenu />

      <SidebarFooter />
    </aside>
  );
}

export default Sidebar;