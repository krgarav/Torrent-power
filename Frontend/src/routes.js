/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import UserManagment from "views/UserManagment";
import Jobs from "views/Jobs";
import Template from "views/Template";
import Settings from "views/Settings";
import JobQueue from "views/JobQueue";
import DesignTemplate from "views/DesignTemplate";
import Booklet32Page from "views/Booklet32Page";
import Booklet24Page from "views/Booklet24Page";
import Warehouse from "views/Warehouse";
import Tagging from "views/Tagging";
import AddFile from "views/AddFile";
import Maintainance from "views/Maintainance";
import Report from "views/Report";
import DashboardData from "views/DashboardData";



const auth = JSON.parse(localStorage.getItem('auth'));
const access = auth?.userData?.permissions;

var routes = [


  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },

  ...(access?.fileEntryAccess ? [{
    path: "/fileEntry",
    name: "File Entry",
    icon: "ni ni-briefcase-24 text-yellow",
    component: <AddFile />,
    layout: "/admin",
  }] : []),

  ...(access?.taggingAccess ? [{
    path: "/tagging",
    name: "Tagging",
    icon: "ni ni-briefcase-24 text-yellow",
    component: <Tagging />,
    layout: "/admin",
  }] : []),
  ...(access?.wareHouseAccess ? [{
    path: "/warehouse",
    name: "Warehouse",
    icon: "ni ni-shop text-orange",
    component: <Warehouse />,
    layout: "/admin",
  }] : []),

  ...(access?.userManagementAccess ? [{
    path: "/user-managment",
    name: "User Managment",
    icon: "ni ni-circle-08 text-info",
    component: <UserManagment />,
    layout: "/admin",
  }] : []),

  ...(access?.maintainanceAccess ? [{
    path: "/maintainance",
    name: "Maintainance",
    icon: "ni ni-controller text-primary",
    component: <Maintainance />,
    layout: "/admin",
  }] : []),
  ...(access?.reportAccess ? [{
    path: "/report",
    name: "Report",
    icon: "ni ni-chart-pie-35 text-primary",
    component: <Report />,
    layout: "/admin",
  }] : []),


];


// export const generateRoutes = () => {
//   const auth = JSON.parse(localStorage.getItem('auth'));
//   const access = auth?.userData?.permissions;

//   return [
//     {
//       path: "/index",
//       name: "Dashboard",
//       icon: "ni ni-tv-2 text-primary",
//       component: <Index />,
//       layout: "/admin",
//     },
//     ...(access?.fileEntryAccess ? [{
//       path: "/fileEntry",
//       name: "File Entry",
//       icon: "ni ni-briefcase-24 text-yellow",
//       component: <AddFile />,
//       layout: "/admin",
//     }] : []),
//     ...(access?.taggingAccess ? [{
//       path: "/tagging",
//       name: "Tagging",
//       icon: "ni ni-briefcase-24 text-yellow",
//       component: <Tagging />,
//       layout: "/admin",
//     }] : []),
//     ...(access?.wareHouseAccess ? [{
//       path: "/warehouse",
//       name: "Warehouse",
//       icon: "ni ni-shop text-orange",
//       component: <Warehouse />,
//       layout: "/admin",
//     }] : []),
//     ...(access?.userManagementAccess ? [{
//       path: "/user-managment",
//       name: "User Managment",
//       icon: "ni ni-circle-08 text-info",
//       component: <UserManagment />,
//       layout: "/admin",
//     }] : []),
//   ];
// };

// Initially generate routes when the application loads
// const routes = generateRoutes();
export default routes;


