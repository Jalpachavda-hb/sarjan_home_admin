import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";


import Calendar from "./pages/Calendar";
import MyTiket from "./pages/Tiket request/MyTiket";
import AddnewTiket from "./pages/Tiket request/AddnewTiket";
import Tikethistory from "./pages/Tiket request/Tikethistory";
import UserLog from "./pages/UserLog";
import ClientTiket from "./pages/Tiket request/ClientTiket";
import ProjectType from "./pages/Project/ProjectType";
import ProjectCategory from "./pages/Project/ProjectCategory";
import Addcategory from "./pages/Project/Addcategory";
import Sitedetails from "./pages/Project/Sitedetails";
import Addsite from "./pages/Project/Addsite";
import PropertyDetails from "./pages/Project/PropertyDetails";
import Adminuser from "./pages/Admin user/Adminuser";
import Addadminuser from "./pages/Admin user/Addadminuser";
import Commundocument from "./pages/Document/Commundocument";
import Personaldocument from "./pages/Document/Personaldocument";
import Addcommunoc from "./pages/Document/Addcommunoc";
import AddpersonalDoc from "./pages/Document/AddpersonalDoc";
import Clientreport from "./pages/Report/Clientreport";
import Sitereport from "./pages/Report/Sitereport";
import Addnewclient from "./pages/client/Addnewclient";
import TodayReceivedpayment from "./pages/Pandingforaprovel";
import ClientsProperty from "./pages/client/ClientsProperty";
import Client from "./pages/client/Client";
import Payment from "./pages/Payment/Payment";
import Addpaymentdetails from "./pages/Payment/Addpaymentdetails";
import Inquiry from "./pages/SiteInquiery/Inquiry";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";

import Home from "./pages/Dashboard/Home";
import Homeslider from "./pages/App settings/Homeslider";
import Addscreen from "./pages/App settings/Addscreen";
import WebSetting from "./pages/WebSetting";
import Addpropertydetails from "./pages/Project/Addpropertydetails";
export default function App() {
  return (
    <>
      <Router>

        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/admin/dashboard" element={<Home />} />
            <Route
              path="/admin/pending_for_approvals"
              element={<TodayReceivedpayment />}
            />
            <Route path="/admin/clients/jR" element={<Client />} />

            <Route path="admin/selectproject" element={<ClientsProperty />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route
              path="/admin/clients/addnewclient"
              element={<Addnewclient />}
            />
            <Route path="/admin/ticket-request/mytiket" element={<MyTiket />} />
            <Route path="/admin/ticket-request/mytiket/addtiket" element={<AddnewTiket />} />
            <Route
              path="/admin/ticket-request/client"
              element={<ClientTiket />}
            />
            <Route
              path="/admin/ticket-request/history"
              element={<Tikethistory />}
            />
            

            <Route path="/admin/log" element={<UserLog />} />
            <Route path="/admin/projects_type" element={<ProjectType />} />
            <Route
              path="/admin/projects_category"
              element={<ProjectCategory />}
            />
            <Route
              path="/admin/projects_category/addcategory"
              element={<Addcategory />}
            />
            <Route path="/category/edit/:id" element={<Addcategory />} />
            <Route
              path="/admin/projects/site_details"
              element={<Sitedetails />}
            />
            <Route
              path="/admin/projects/site_details/Addsite"
              element={<Addsite />}
            />
            <Route
              path="/admin/projects/property_details"
              element={<PropertyDetails />}
            />
              <Route
              path="/admin/projects/add_property"
              element={<Addpropertydetails/>}
            />

            <Route path="/admin/admin_users" element={<Adminuser />} />

            <Route path="/admin/admin_users/add" element={<Addadminuser />} />

            <Route
              path="/admin/common_documents"
              element={<Commundocument />}
            />

            <Route
              path="/admin/common_documents/add"
              element={<Addcommunoc />}
            />
            <Route
              path="/admin/personal_documents"
              element={<Personaldocument />}
            />
            <Route
              path="/admin/personal_documents/add"
              element={<AddpersonalDoc />}
            />
            <Route path="/admin/reports_client" element={<Clientreport />} />
            <Route path="/admin/reports_site" element={<Sitereport />} />

            <Route path="/admin/payments" element={<Payment />} />
            <Route path="/admin/payments/add" element={<Addpaymentdetails />} />
            <Route path="/admin/inquiry" element={<Inquiry />} />
            <Route
              path="/admin/settings/home_slider"
              element={<Homeslider />}
            />
             <Route
              path="/admin/settings/home_slider/addscreen"
              element={<Addscreen />}
            />
            
            <Route path="/admin/web_settings" element={<WebSetting />} />
            {/* Ui Elements */}
            {/* <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} /> */}

            {/* Charts */}
           
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
