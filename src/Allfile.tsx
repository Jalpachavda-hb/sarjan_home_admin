import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/OtherPage/NotFound";

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
import EditClient from "./pages/client/EditClient";
import Addclientpayment from "./pages/client/Addclientpayment";
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

import UserProfiles from "./pages/UserProfiles";
export default function Allfile() {
  return (
    <Routes>
      {/* Dashboard Layout */}
      <Route element={<AppLayout />}>
        <Route index path="dashboard" element={<Home />} />
        <Route
          path="pending_for_approvals"
          element={<TodayReceivedpayment />}
        />
        <Route path="clients/:id" element={<Client />} />
        <Route path="selectproject" element={<ClientsProperty />} />

        {/* Others Page */}
        <Route path="profile" element={<UserProfiles />} />
        <Route path="blank" element={<Blank />} />

        {/* Forms */}

        <Route path="clients/:id/addnewclient" element={<Addnewclient />} />
        <Route path="clients/:id/:id/edit" element={<EditClient />} />
         <Route path="clients/:id/:id/payment_details/add" element={<Addclientpayment />} />
        <Route path="ticket-request/mytiket" element={<MyTiket />} />
        <Route
          path="ticket-request/mytiket/addtiket"
          element={<AddnewTiket />}
        />

        <Route path="ticket-request/client" element={<ClientTiket />} />
        <Route path="ticket-request/history" element={<Tikethistory />} />

        <Route path="log" element={<UserLog />} />
        <Route path="projects_type" element={<ProjectType />} />
        <Route path="projects_category" element={<ProjectCategory />} />
        <Route path="projects_category/addcategory" element={<Addcategory />} />
        <Route path="category/edit/:id" element={<Addcategory />} />
        <Route path="projects/site_details" element={<Sitedetails />} />
        <Route path="projects/site_details/addsite" element={<Addsite />} />
        <Route path="projects/property_details" element={<PropertyDetails />} />

        <Route
          path="projects/add_property"
          element={<Addpropertydetails mode="add" />}
        />
        <Route
          path="projects/add_property/:id"
          element={<Addpropertydetails mode="edit" />}
        />

        <Route path="admin_users" element={<Adminuser />} />
        <Route path="admin_users/add" element={<Addadminuser mode="add" />} />
        <Route
          path="admin_users/edit/:id"
          element={<Addadminuser mode="edit" />}
        />

        <Route path="common_documents" element={<Commundocument />} />
        <Route path="common_documents/add" element={<Addcommunoc />} />
        <Route path="personal_documents" element={<Personaldocument />} />
        <Route path="personal_documents/add" element={<AddpersonalDoc />} />

        <Route path="reports_client" element={<Clientreport />} />
        <Route path="reports_site" element={<Sitereport />} />

        <Route path="payments" element={<Payment />} />
        <Route path="payments/add" element={<Addpaymentdetails />} />
        <Route path="inquiry" element={<Inquiry />} />
        <Route path="settings/home_slider" element={<Homeslider />} />
        <Route path="settings/home_slider/addscreen" element={<Addscreen />} />

        <Route path="web_settings" element={<WebSetting />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
