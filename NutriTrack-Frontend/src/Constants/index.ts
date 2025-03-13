import {
  FiHome,
} from 'react-icons/fi'
import { MdNoMeals,MdDashboardCustomize } from "react-icons/md";
import { GoGraph } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import FeaturesList from './Features';

export {
  FeaturesList,

}

export const navLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "features",
    title: "Features",
  },
  {
    id: "pricing",
    title: "Pricing",
  },
  {
    id: "faq",
    title: "FAQs",
  },
  {
    id: "testimonials",
    title: "Testimonials",
  },
];

export const features = [
  {
    id: "feature-1",
    //icon: star,
    title: "Rewards",
    content:
      "The best credit cards offer some tantalizing combinations of promotions and prizes",
  },
  {
    id: "feature-2",
    //icon: shield,
    title: "100% Secured",
    content:
      "We take proactive steps make sure your information and transactions are secure.",
  },
  {
    id: "feature-3",
    //icon: send,
    title: "Balance Transfer",
    content:
      "A balance transfer credit card can save you a lot of money in interest charges.",
  },
];
export const feedback = [
  {
    id: "feedback-1",
    content:
      "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.",
    name: "Herman Jensen",
    title: "Founder & Leader",
    //img: people01,
  },
  {
    id: "feedback-2",
    content:
      "Money makes your life easier. If you're lucky to have it, you're lucky.",
    name: "Steve Mark",
    title: "Founder & Leader",
    //img: people02,
  },
  {
    id: "feedback-3",
    content:
      "It is usually people in the money business, finance, and international trade that are really rich.",
    name: "Kenn Gallagher",
    title: "Founder & Leader",
    //img: people03,
  },
];
export const footerLinks = [
  {
    id: "about",
    title: "About Us",
  },
  {
    id: "contact",
    title: "Contact Us",
  },
  {
    id: "pricing",
    title: "Pricing",
  },
  {
    id: "faq",
    title: "FAQs",
  },
  {
    id: "terms",
    title: "Terms & Conditions",
  }, 
];

export const socialMedia = [
{
  id: "social-media-1",
  //icon: instagram,
  link: "https://www.instagram.com/",
},
{
  id: "social-media-2",
  //icon: facebook,
  link: "https://www.facebook.com/",
},
{
  id: "social-media-3",
  //icon: twitter,
  link: "https://www.twitter.com/",
},
{
  id: "social-media-4",
  //icon: linkedin,
  link: "https://www.linkedin.com/",
},
];

export const DashNavLinks = [
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
export const AdminNavLinks = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: MdDashboardCustomize,
  },
  {
    id: "profile-setup",
    title: "Profile",
    icon: CgProfile ,
  },
];        