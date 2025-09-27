import axiosInstance from "../axiosinstance";
import { toast } from "react-toastify";
import { API_PATHS } from "../apiPaths";

export const getAdminId = (): string | null => {
  const user = sessionStorage.getItem("user");
  if (user) {
    try {
      const parsed = JSON.parse(user);
      return parsed.admin_id?.toString() || null;
    } catch {
      return null;
    }
  }
  return null;
};

export const getRoleId = (): string | null => {
  const user = sessionStorage.getItem("user");
  if (user) {
    try {
      const parsed = JSON.parse(user);
      return parsed.role_id?.toString() || null;
    } catch {
      return null;
    }
  }
  return null;
};

export const getUserRole = (): number | null => {
  const user = sessionStorage.getItem("user");
  if (user) {
    try {
      const parsed = JSON.parse(user);
      return parsed.role_id || parsed.role || null;
    } catch {
      return null;
    }
  }
  return null;
};

export const fetchProfile = async () => {
  try {
    const res = await axiosInstance.get(
      `${API_PATHS.ADMINAUTH.GET_PROFILE}?admin_id=${getAdminId()}`
    );

    const data = res.data.data;

    return {
      admin_id: data.id, // 👈 map 'id' to 'admin_id'
      name: data.name,
      email: data.email,
      role_id: data.role_id,
      contact_no: data.contact_no?.toString() || "",
    };
  } catch (err: any) {
    toast.error("Failed to fetch profile");
    throw err;
  }
};

export const fetchDashboardCount = async () => {
  try {
    const admin_id = getAdminId(); // 👈 fetch from session
    if (!admin_id) throw new Error("Admin ID not found");

    const res = await axiosInstance.get(
      `${API_PATHS.DASHBOARD.DASHBOARDCOUNT}?admin_id=${admin_id}`
    );

    const data = res.data.data;
    return {
      clientCount: data.clientCount,
      projectTypes: data.projectTypes,
      adminUsers: data.adminUsers,
      siteDetailsCount: data.siteDetailsCount,
      today_payment: data.today_payment,
      sitenames: data.sitenames,
    };
  } catch (err: any) {
    toast.error("Failed to fetch Dashboardcount");
    throw err;
  }
};

// ==============5=======================//

// USER LOG FATCH DATA API

// WITH PAGINATION LOGIC

// export const fetchAdminLogs = async (page: number = 1, perPage: number = 12) => {
//   try {
//     const res = await axiosInstance.get(
//       `${API_PATHS.ADMIN.GET_LOGS}?page=${page}&per_page=${perPage}`
//     );
//     return res.data;
//   } catch (err: any) {
//     toast.error("Failed to fetch admin logs");
//     throw err;
//   }
// };

// ============================

// =========================

// SITE DETAILS
export const fetchSiteDetails = async () => {
  try {
    const res = await axiosInstance.get(API_PATHS.SITEDETAILS.GETSITEDETAILS);
    return res.data.data; // assuming backend returns { data: [...] }
  } catch (err: any) {
    toast.error("Failed to fetch site details");
    throw err;
  }
};

// ==============================
// WEBSETTING API

export const fetchWebSetting = async () => {
  try {
    const res = await axiosInstance.get(API_PATHS.WEBSETTING.GETWEBSETTING);
    return res.data.data;
  } catch (err: any) {
    toast.error("Failed to fetch Web Setting ❌");
    throw err;
  }
};
// ==========================

// APP SEETING
export const fetchSplashScreens = async (adminId: string) => {
  try {
    const res = await axiosInstance.get(API_PATHS.APPSETTING.GETSPLASHSCREEN, {
      params: { admin_id: adminId },
    });
    return res.data.data; // data array from your API response
  } catch (err) {
    console.error("Error fetching splash screens:", err);
    throw err;
  }
};

// ==================
// SITE INQUERY

export const fetchSiteInquiry = async (
  adminId: string,
  siteFilter?: number,
  searchByDays?: number
) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.SITEINQUIRY.SHOWSITEINQUIRY,
      {
        params: {
          admin_id: adminId,
          siteFilter: siteFilter || "",
          searchByDays: searchByDays || "",
        },
      }
    );

    return response.data?.data || []; // return array of inquiries
  } catch (error) {
    console.error("Error fetching site inquiry:", error);
    throw error;
  }
};

export const fetchInquiryThrough = async (adminId: string) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.SITEINQUIRY.INQUIRYTHROUGH,
      {
        params: { admin_id: adminId },
      }
    );

    // Ensure response has correct structure
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching inquiry through:", error);
    throw error;
  }
};

export const fetchSiteList = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.MULTITIMEUSEAPI.SHOWCODESITELIST
    );

    return (
      response.data?.data?.map((site: { id: number; title: string }) => ({
        value: site.id, // ✅ react-select expects "value"
        label: site.title, // ✅ react-select expects "label"
      })) || []
    );
  } catch (error) {
    console.error("Error fetching site list:", error);
    return [];
  }
};

// =============================
// get payment details

// utils/Handlerfunctions/getPaymentData.ts

export interface PaymentDetails {
  id: string;
  clientName: string;
  siteName: string;
  unitNo: string;
  propertyAmount: string;
  gstAmount: string;
  receivedDate: string;
  receivedAmountType: string;
  receivedAmount: string;
  receiptUrl: string;
}

export const fetchPaymentDetails = async (
  adminId: string,
  site_id?: string,
  dateFilter?: number
): Promise<PaymentDetails[]> => {
  try {
    const params = new URLSearchParams();

    if (adminId) params.append("admin_id", adminId);
    if (site_id) params.append("site_id", site_id);
    if (dateFilter && dateFilter > 0)
      params.append("searchByDays", dateFilter.toString());

    const response = await axiosInstance.get(
      `${API_PATHS.PAYMENT.SHOWPAYMENTDETAILS}?${params.toString()}`
    );

    if (response.data.status === 200) {
      return response.data.data.map((item: any) => ({
        id: item.id.toString(),
        clientName: item.name || "N/A",
        siteName: item.title || "N/A",
        unitNo: item.block_number || "N/A",
        propertyAmount: `₹${item.property_amount ?? 0}`,
        gstAmount: `₹${item.gst_amount ?? 0}`,
        receivedDate: item.received_payment_date || "N/A",
        receivedAmountType: item.received_amount_type || "N/A",
        receivedAmount: `₹${item.received_amount ?? 0}`,
        receiptUrl: item.payment_receipt || "",
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return [];
  }
};
// ==============================

export const fetchClientReportSummary = async (adminId: string) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.CLIENTREPORT.SHOWCLIENTREPORTSUMMERY,
      {
        params: { admin_id: adminId },
      }
    );

    if (response.data.status === 200) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching client report summary:", error);
    return null;
  }
};

export const fetchClientReports = async (adminId: string) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.CLIENTREPORT.SHOWCLIENTREPORT,
      {
        params: { admin_id: adminId },
      }
    );

    if (response.data.status === 200) {
      return response.data.data.map((item: any, index: number) => ({
        id: item.client_id + "-" + item.block_detail_id, // unique id
        clientName: item.name || "N/A",
        purchasedSiteName: item.title || "N/A",
        unitType: item.bhk_details || "N/A",
        unitNumber: item.block_number || "N/A",
        principalAmount: `₹${item.property_amount ?? 0}`,
        gstAmount: `₹${item.gst_amount ?? 0}`,
        receivedPrincipalAmount: `₹${
          item.total_received_principal_amount ?? 0
        }`,
        receivedGstAmount: `₹${item.total_received_gst_amount ?? 0}`,
        remainingPrincipalAmount: `₹${
          item.total_remaining_principal_amount ?? 0
        }`,
        remainingGstAmount: `₹${item.total_remaining_gst_amount ?? 0}`,
        ledger: "", // keep empty unless API provides ledger_url
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching client reports:", error);
    return [];
  }
};

export const fetchSiteReports = async (adminId: string) => {
  try {
    const res = await axiosInstance.get(API_PATHS.SITEREPORT.SHOWSITEREPORT, {
      params: { admin_id: adminId },
    });

    if (res.data.status === 200) {
      return res.data.data; // return only the data array
    }
    return [];
  } catch (err) {
    console.error("Error fetching site reports:", err);
    return [];
  }
};

export const fetchProjectTypes = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.PROJECTTYPE.GETPROJECTTYPE
    );
    return response.data?.data || []; // return array of project types
  } catch (error) {
    console.error("Error fetching project types:", error);
    return [];
  }
};

// GET PROJECT TYPE

export const fetchProjectcategory = async (adminId?: string) => {
  try {
    const res = await axiosInstance.get(
      API_PATHS.PROJECTCATEGORY.GETPROJECTCATEGORY,
      {
        params: adminId ? { admin_id: adminId } : {},
      }
    );
    return res.data.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error("Error fetching project Category:", err);
    return [];
  }
};

export const fetchCommonDocuments = async (adminId: string) => {
  try {
    const res = await axiosInstance.get(
      API_PATHS.COMMONDOCUMENTS.SHOWCOMMUNDOCUMENT,
      {
        params: adminId ? { admin_id: adminId } : {},
      }
    );
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching common documents:", err);
    return [];
  }
};

export const fetchAdminUsers = async () => {
  const adminId = getAdminId();

  if (!adminId) {
    toast.error("Admin ID not found");
    return null;
  }

  try {
    const res = await axiosInstance.get(API_PATHS.ADMINUSERAPI.SHOWADMINUSER, {
      params: { admin_id: adminId },
    });

    return res.data; // return only API response
  } catch (error) {
    console.error("Error fetching admin users:", error);
    toast.error("Failed to fetch admin users");
    throw error;
  }
};

export const fetchAdminTickets = async (siteId?: string) => {
  const adminId = getAdminId();

  if (!adminId) {
    toast.error("Admin ID not found");
    return null;
  }

  try {
    const params: any = { admin_id: adminId };
    if (siteId) {
      params.requestSiteFilter = siteId; // pass selected site filter if available
    }

    const res = await axiosInstance.get(API_PATHS.TICKET.SHOWADMINTICKET, {
      params,
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching admin tickets:", error);
    toast.error("Failed to fetch tickets");
    throw error;
  }
};

export const fetchUnitNumbersBySite = async (siteId: number) => {
  try {
    const response = await axiosInstance.get(
      `${API_PATHS.PAYMENT.GETBLOCKDETAILSFROMSITE}?site_id=${siteId}`
    );

    return (
      response.data?.data?.map(
        (unit: { id: number; block_number: string }) => ({
          value: unit.id.toString(),
          label: unit.block_number, // ✅ use block_number for dropdown label
        })
      ) || []
    );
  } catch (error) {
    console.error("Error fetching unit numbers:", error);
    return [];
  }
};

export const fetchClientNamesByBlockId = async (blockId: number) => {
  try {
    const response = await axiosInstance.get(
      `${API_PATHS.MULTITIMEUSEAPI.GETCLIENTNAMEFROMBLOCKID}?block_details_id=${blockId}`
    );

    return (
      response.data?.data?.map((client: { id: number; name: string }) => ({
        value: client.id.toString(),
        label: client.name, // ✅ client name in dropdown
      })) || []
    );
  } catch (error) {
    console.error("Error fetching client names:", error);
    return [];
  }
};

export const fetchPersonalDocuments = async () => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found. Please login again.");
    return [];
  }

  try {
    const res = await axiosInstance.get(
      `${API_PATHS.PERSONALDOCUMENT.GETPERSONALDOCUMENT}?admin_id=${adminId}`
    );

    if (res.data.status === 200) {
      return res.data.data; // array of docs
    } else {
      toast.error(res.data.message || "Failed to fetch documents");
      return [];
    }
  } catch (error: any) {
    console.error("Error fetching personal documents:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
    return [];
  }
};

export const fetchRolePermissions = async () => {
  const adminId = getAdminId();

  if (!adminId) {
    toast.error("Admin ID not found");
    return null;
  }

  try {
    const response = await axiosInstance.get(
      API_PATHS.ADMINAUTH.ADMINROLEPERMISSION,
      {
        params: { admin_id: adminId },
      }
    );

    if (response.data.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    toast.error("Error fetching role permissions");
    throw error;
  }
};

export const getAdminUserById = async (id: string) => {
  try {
    const res = await axiosInstance.get(
      `${API_PATHS.ADMINUSERAPI.GETADMINUSER}?admin_id=${id}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching admin user:", err);
    throw err;
  }
};

export const showPropertyDetailsList = async (
  site_id: number | string,
  page: number
) => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found");
    return null;
  }

  try {
    const res = await axiosInstance.get(
      API_PATHS.SITEDETAILS.PROPERTYDETAILSLIST,
      { params: { admin_id: adminId, site_id, page } }
    );

    const mappedData = res.data?.details?.map((item: any) => ({
      id: item.block_detail_id,
      siteName: item.title,
      unit: item.block,
      unitNumber: item.block_number,
    }));

    return {
      data: mappedData || [],
      total: res.data.pagination?.total || 0,
      per_page: res.data.pagination?.per_page || 12,
      current_page: res.data.pagination?.current_page || 1,
    };
  } catch (error) {
    console.error("Error fetching property details:", error);
    toast.error("Failed to fetch property details");
    return null;
  }
};

export const fetchAdminLogs = async (page: number) => {
  try {
    const res = await axiosInstance.get(
      `${API_PATHS.USERLOG.GETUSERADMINLOG}?page=${page}`
    );
    return res.data;
  } catch (err: any) {
    toast.error("Failed to fetch admin logs");
    throw err;
  }
};

export const TodayReceivedpayment = async (siteId: string) => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found");
    return null;
  }

  try {
    const res = await axiosInstance.get(
      API_PATHS.DASHBOARD.TODAYRECEIVEDPAYMENT,
      {
        params: { admin_id: adminId, site_id: siteId },
      }
    );
    return res.data || null;
  } catch (error) {
    console.error(`Error fetching Payment data for siteId ${siteId}:`, error);
    toast.error("Failed to fetch Payment data");
    return null;
  }
};

export const showTicketHistory = async () => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found");
    return null;
  }

  try {
    const res = await axiosInstance.get(API_PATHS.TICKET.SHOWTICKETGISTORY, {
      params: { admin_id: adminId },
    });
    return res.data || null;
  } catch (error) {
    toast.error("Failed to Ticket history data");
    return null;
  }
};

export const showclientTicket = async (requestSiteFilter?: string) => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found");
    return null;
  }

  try {
    const res = await axiosInstance.get(API_PATHS.TICKET.SHOWCLIENTTICKET, {
      params: {
        admin_id: adminId,
        requestSiteFilter: requestSiteFilter || "", // 👈 match your backend param
      },
    });
    return res.data || null;
  } catch (error) {
    toast.error("Failed to fetch Ticket history data");
    return null;
  }
};

export const showclientlist = async (siteId: string, page: number = 1) => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found");
    return null;
  }

  try {
    const res = await axiosInstance.get(API_PATHS.CLIENTDATA.SHOWCLIENTLIST, {
      params: {
        admin_id: adminId,
        site_id: siteId,
        page,
      },
    });
    return res.data || null;
  } catch (error) {
    console.error(`Error fetching site data for siteId ${siteId}:`, error);
    toast.error("Failed to fetch site data");
    return null;
  }
};

export const fetchUnitType = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.MULTITIMEUSEAPI.UNITTYPE
    );

    // Convert array of strings into dropdown-friendly objects
    return (
      response.data?.data?.map((item, index) => ({
        label: item, // what you display
        value: item, // value you store
        id: index, // optional (if you need a unique key)
      })) || []
    );
  } catch (error) {
    console.error("Error fetching unit types:", error);
    return [];
  }
};

export const getClientName = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.MULTITIMEUSEAPI.GETCLIENTNAMEFROMSITEID
    );

    // Map API response into dropdown format
    return (
      response.data?.data?.map((item) => ({
        label: item.name, // text shown in dropdown
        value: item.id, // value you submit/store
      })) || []
    );
  } catch (error) {
    console.error("Error fetching client names:", error);
    return [];
  }
};

export const getClientCountOfSite = async (siteId?: string) => {
  const adminId = getAdminId();
  if (!adminId) throw new Error("Admin ID not found");

  // ✅ Send admin_id as query param
  const res = await axiosInstance.get(
    API_PATHS.CLIENTDATA.GETCLIENTECOUNTOFSITE,
    {
      params: { admin_id: adminId, site_id: siteId },
    }
  );

  return res.data?.data || [];
};

export const getBlockFromSiteId = async (siteId: string) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.MULTITIMEUSEAPI.GETBLOCKFROMSITEID,
      { params: { site_id: siteId } }
    );
    // map into {label, value}
    return (
      response.data?.data?.map((item: any) => ({
        label: item.block,
        value: item.id,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching block list:", error);
    return [];
  }
};

export const getBlockFromBlockid = async (block_id: string) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.MULTITIMEUSEAPI.GETBLOCKNUMBERFROMBLOCK,
      { params: { block_id: block_id } }
    );

    // Check if response has data and it's an array
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data.map((item: any) => ({
        label: item.block_number,
        value: item.id,
      }));
    }

    console.error("Unexpected API response format:", response.data);
    return [];
  } catch (error) {
    console.error("Error fetching block list:", error);
    return [];
  }
};

export const fetchBookingDetails = async (
  // adminId: string,
  client_id: number,
  site_id: string,
  block_id: string
) => {
  try {
    const res = await axiosInstance.get(API_PATHS.CLIENTDATA.GETCLIENTPAYMENT, {
      params: {
        // ...(adminId ? { admin_id: adminId } : {}),
        client_id,
        site_id,
        block_id, // 👈 match exactly what Postman expects
      },
    });

    if (res.data.status === 200) {
      return res.data.data || null;
    } else {
      toast.error(res.data.message || "Failed to fetch client payment details");
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching client payment details:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
    return null;
  }
};

export const fetchClientNameFromBlockId = async (block_id: string) => {
  try {
    const res = await axiosInstance.get(
      API_PATHS.MULTITIMEUSEAPI.GETCLIENTNAMEFROMBLOCKID,
      {
        params: { block_details_id: block_id }, // backend expects block_details_id
      }
    );

    if (res.data.status === 200 && res.data.data?.length > 0) {
      const { id, name } = res.data.data[0];
      return { clientId: id, clientName: name }; // return both
    } else {
      toast.error(res.data.message || "Failed to fetch client details");
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching client name:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
    return null;
  }
};

export const getpropertydetailsByblockId = async (blockDetailId: string) => {
  try {
    const adminId = getAdminId(); // 👈 fetch from local/session storage
    if (!adminId) {
      throw new Error("Admin ID not found");
    }

    const res = await axiosInstance.get(
      `${API_PATHS.SITEDETAILS.GETBLOCKDETAILS}?admin_id=${adminId}&block_detail_id=${blockDetailId}`
    );

    return res;
  } catch (err) {
    console.error("Error fetching property detail:", err);
    throw err;
  }
};

export const fetchClientDetails = async (
  adminId: string,
  client_milestone_id: string
) => {
  try {
    const res = await axiosInstance.get(
      `${API_PATHS.CLIENTDATA.EDITCLIENT}?admin_id=${adminId}&client_milestone_id=${client_milestone_id}`
    );

    if (res.data.status === 200 && res.data.data) {
      const d = res.data.data;

      // normalize response
      return {
        site_detail_id: d.site_detail_id,
        site_name: d.site_name || "",
        name: d.eu_data?.name || "",
        email: d.eu_data?.email || "",
        contact: d.eu_data?.contact_no || "",
        address: d.eu_data?.address || "",
        unit_type: d.clientMileStoneData?.unit_type || "",
        block_id: d.eu_data?.block_id || "",
        block_detail_id: d.block_detail_id || "",
        block_number: d.blockNumber || "",
        property_amount: d.property_amount || "",
        gst_slab: d.gst_slab || "",
        gst_amount: d.gst_amount || "",
        total_amount: d.total_amount || "",
        password: d.eu_data?.user_password || "",
        aadhar_card: d.eu_data?.adhar_card || "",
        pan_card: d.eu_data?.pan_card || "",
        client_type: "1",
        existing_client_id: d.clientid || "",
        clientid: d.clientid || "",
      };
    } else {
      throw new Error(res.data.message || "Failed to fetch client details");
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const getTicketMessages = async (id: string) => {
  try {
    const adminId = getAdminId(); // 👈 fetch from local/session storage
    if (!adminId) {
      throw new Error("Admin ID not found");
    }

    const res = await axiosInstance.get(
      `${API_PATHS.TICKET.GETTICKETMESSAGES}?admin_id=${adminId}&ticket_id=${id}`
    );

    return res;
  } catch (err) {
    console.error("Error fetching property detail:", err);
    throw err;
  }
};

export const pendingForApprovals = async () => {
  try {
    const adminId = getAdminId();
    if (!adminId) throw new Error("Admin ID not found");

    const res = await axiosInstance.get(
      `${API_PATHS.PENDINGFORAPPROVALSTABLE.PENDINGFORAPPROVALS}?admin_id=${adminId}`
    );

    if (res.data.status === 200 && res.data.data) {
      // map API data to Aprovel type
      return res.data.data.map((item: any) => ({
        id: item.id,
        clientName: item.name,
        siteName: item.site_details,
        contactNumber: item.contact_no,
        Email: item.email,
        blocknumber: item.block_number,
      }));
    } else {
      return [];
    }
  } catch (err) {
    console.error("Error fetching pending approvals:", err);
    return [];
  }
};

export const getSiteData = async (adminId: string) => {
  try {
    const res = await axiosInstance.get(API_PATHS.MULTITIMEUSEAPI.GETSITEDATA, {
      params: { admin_id: adminId },
    });
    return res.data.status === 200 ? res.data.data : [];
  } catch (err) {
    console.error("Error fetching site data", err);
    return [];
  }
};
