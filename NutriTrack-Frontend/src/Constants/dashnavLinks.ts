import {
    FiHome,
  } from 'react-icons/fi'
import { MdNoMeals,MdDashboardCustomize } from "react-icons/md";
import { GoGraph } from "react-icons/go";
import { CgProfile } from "react-icons/cg";

const DashNavLinks = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: FiHome,
    },
    {
      id: "track",
      title: "Track",
      icon: FiHome
    },
    {
      id: "mealsConsumed",
      title: "Meals Consumed",
      icon: MdNoMeals ,
    },
    {
      id: "customFood",
      title: "Custom Food",
      icon: FiHome,
    },
    {
      id: "dailydashboard",
      title: "Daily Dashboard",
      icon: MdDashboardCustomize,
    },
    {
      id: "historical",
      title: "Historical",
      icon: GoGraph,
    },
    {
      id: "profile-setup",
      title: "Profile",
      icon: CgProfile ,
    },
  ];   

export default DashNavLinks;