import  { useState, useEffect } from "react";
import Logo from "../assets/Logo.png";
import {
  ArrowLeftRightIcon,
  BarChart3Icon,
  Clock4Icon,
  LayoutDashboard,
  LogOutIcon
} from "lucide-react";
import { motion } from "framer-motion";
import RightArrowIcon from '../assets/rightArrow.svg';

const variants = {
  expanded: { width: "220px" },
  nonexpanded: { width: "90px" },
};

const navLinks = [
  {
    link: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    link: "Activity",
    icon: Clock4Icon,
  },
  {
    link: "Analytics",
    icon: BarChart3Icon,
  },
  {
    link: "Transactions",
    icon: ArrowLeftRightIcon,
  },
  {
    link: "Logout",
    icon: LogOutIcon,
  },
];

// eslint-disable-next-line react/prop-types
const Navbar =({  handleTabChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (windowWidth < 768) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleLogOut = () =>{
    localStorage.removeItem('token');
    // window.location.href = '/login';
    window.location.reload();
  }
  const handleActiveTab = (index, tabName) =>{
    setActiveIndex(index);
    handleTabChange(tabName);
    if(tabName === "Logout"){
      handleLogOut()
   }
  }
  return (
    <motion.div
      animate={isExpanded ? "expanded" : "nonexpanded"}
      variants={variants}
      className={
        "py-10 h-screen flex flex-col  border border-r-1 bg-[#FDFDFD] relative" +
        (isExpanded ? " px-10" : " px-3.5 duration-500")
      }
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer absolute -right-3 top-10 rounded-full w-6 h-6 bg-[#00827E] md:flex hidden justify-center items-center"
      >
        <img src={RightArrowIcon} className="w-2" />
      </div>

      <div className="logo-div flex space-x-4 items-center">
        <img src={Logo} width='150px' className="md:w-10 w-8 ml-2" />
        <span className={!isExpanded ? "hidden" : "block"}>Airbus Hackathon</span>
      </div>

      <div className="flex flex-col space-y-8 mt-12">
  {navLinks.map((item, index) => (
    <div className="nav-links w-full" key={index}>
      <div
        onClick={() => handleActiveTab(index, item.link)}
        className={
          "flex space-x-3 w-full p-2 rounded cursor-pointer " + 
          (activeIndex === index
            ? "bg-[#00827E] text-white"
            : " text-black") +
          (!isExpanded ? " pl-3" : "")
        }
      >
        <item.icon className="md:w-6 w-4" />
        <span className={!isExpanded ? "hidden" : "block"}>
          {item.link}
        </span>
      </div>
    </div>
  ))}
</div>

    </motion.div>
  );
}

export default Navbar;
