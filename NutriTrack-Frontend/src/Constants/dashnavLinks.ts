import {
    FiHome,
  } from 'react-icons/fi'
import { MdNoMeals,MdDashboardCustomize,MdTrackChanges,MdSearch } from "react-icons/md";
import { GoGraph } from "react-icons/go";
import { GiHotMeal } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { FaUserDoctor } from "react-icons/fa6";
import { FaCalendarCheck } from "react-icons/fa6";

const DashNavLinks = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: FiHome,
    },
    {
      id: "track",
      title: "Track",
      icon: MdTrackChanges,
    },
    {
      id: "mealsConsumed",
      title: "Meals Consumed",
      icon: MdNoMeals ,
    },
    {
      id: "customFood",
      title: "Custom Food",
      icon: MdSearch,
    },
    {
      id: "book-coach",
      title: "Book Coach",
      icon: FaUserDoctor,
    },
    {
      id: "appointments",
      title: "Appointments",
      icon: FaCalendarCheck,
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
      id: "recipe",
      title: "Recipe",
      icon: GiHotMeal ,
    },
    {
      id: "profile-setup",
      title: "Profile",
      icon: CgProfile ,
    }
   
  ];   

export default DashNavLinks;