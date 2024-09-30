"use client"
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import React from "react"
import Icon from "@atoms/Icon"
import Title from "@atoms/Title"

const sidebarItems = [
  { text: "Dashboard", icon: "Dashboard" },
  { text: "Transacciones", icon: "Receipt" },
  { text: "Inventario", icon: "Inventory" },
  { text: "Reportes", icon: "Assessment" },
]

const Sidebar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#1e293b",
          color: "white",
        },
      }}
    >
      <div className="p-4">
        <Title text="Self-Checkout Dashboard" size="h6" />
      </div>
      <List>
        {sidebarItems.map((item) => (
          <ListItem key={item.text} component="li">
            <ListItemIcon>
              <Icon name={item.icon as any} className="text-white" />
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default Sidebar