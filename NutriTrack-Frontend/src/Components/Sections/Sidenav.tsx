import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu,menuClasses, MenuItemStyles} from "react-pro-sidebar";
import { logo } from "../../Assets/index.ts";
import { Switch } from '../ui/SidebarComponents/Switch.tsx';
import { SidebarHeader } from '../ui/SidebarComponents/SidebarHeader.tsx';
import { SidebarFooter } from '../ui/SidebarComponents/SidebarFooter.tsx';
import { Badge } from '../ui/SidebarComponents/Badge.tsx';
import { Typography } from '../ui/SidebarComponents/Typography.tsx';

const Sidenav = () => {

  const [collapsed, setCollapsed] = React.useState(false);
  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: '13px',
      fontWeight: 400,
    },
    icon: {
      color: "var(--soft-white)",
      [`&.${menuClasses.disabled}`]: {
        color: "var(--bright-green)",
      },
    },
    SubMenuExpandIcon: {
      color: "var(--bright-green)" ,
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? "var(--dark-gray)" : 'transparent',
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: "var(--bright-green)" ,
      },
      '&:hover': {
        backgroundColor: "var(--dark-gray)",
        color: "var(--soft-white)",
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };
  return (
    <div style={{ display: 'flex', height: '100%'}}>
      <Sidebar
        collapsed={collapsed}
        image={logo}
        breakPoint="md"
        backgroundColor={"var( --dark-green)"}
        rootStyles={{
          color: "var(--bright-green)",
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <SidebarHeader style={{ marginBottom: '24px', marginTop: '16px' }} />
          <div style={{ flex: 1, marginBottom: '32px' }}>
            <div style={{ padding: '0 24px', marginBottom: '8px' }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
              >
                General
              </Typography>
            </div>
            <Menu menuItemStyles={menuItemStyles}>
              <SubMenu
                label="Charts"
                suffix={
                  <Badge variant="danger" shape="circle">
                    6
                  </Badge>
                }
              >
                <MenuItem> Pie charts</MenuItem>
                <MenuItem> Line charts</MenuItem>
                <MenuItem> Bar charts</MenuItem>
              </SubMenu>
              <SubMenu label="Maps">
                <MenuItem> Google maps</MenuItem>
                <MenuItem> Open street maps</MenuItem>
              </SubMenu>
              <SubMenu label="Theme">
                <MenuItem> Dark</MenuItem>
                <MenuItem> Light</MenuItem>
              </SubMenu>
              <SubMenu label="Components">
                <MenuItem> Grid</MenuItem>
                <MenuItem> Layout</MenuItem>
                <SubMenu label="Forms">
                  <MenuItem> Input</MenuItem>
                  <MenuItem> Select</MenuItem>
                  <SubMenu label="More">
                    <MenuItem> CheckBox</MenuItem>
                    <MenuItem> Radio</MenuItem>
                  </SubMenu>
                </SubMenu>
              </SubMenu>
              <SubMenu label="E-commerce">
                <MenuItem> Product</MenuItem>
                <MenuItem> Orders</MenuItem>
                <MenuItem> Credit card</MenuItem>
              </SubMenu>
            </Menu>

            <div style={{ padding: '0 24px', marginBottom: '8px', marginTop: '32px' }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
              >
                Extra
              </Typography>
            </div>

            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem  suffix={<Badge variant="success">New</Badge>}>
                Calendar
              </MenuItem>
              <MenuItem>Documentation</MenuItem>
              <MenuItem disabled>
                Examples
              </MenuItem>
            </Menu>
          </div>
          <SidebarFooter collapsed={collapsed} />
        </div>
      </Sidebar>

      <main>
        <div style={{ padding: '16px 24px', color: "var(--footer-color)" }}>
          <div style={{ marginBottom: '48px' }}>
            <Typography variant="h4" fontWeight={600}>
              React Pro Sidebar
            </Typography>
            <Typography variant="body2">
              React Pro Sidebar provides a set of components for creating high level and
              customizable side navigation
            </Typography>
          </div>

          <div style={{ padding: '0 8px' }}>
            <div style={{ marginBottom: 16 }}>
              <Switch
                id="collapse"
                checked={collapsed}
                onChange={() => setCollapsed(!collapsed)}
                label="Collapse"
              />
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default Sidenav;
