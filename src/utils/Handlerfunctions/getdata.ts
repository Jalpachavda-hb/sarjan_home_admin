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

export const fetchProfile = async () => {
  try {
    const res = await axiosInstance.get(
      `${API_PATHS.ADMINAUTH.GET_PROFILE}?admin_id=${getAdminId()}`
    );

    const data = res.data.data;

    return {
      admin_id: data.admin_id, // 👈 include admin_id
      name: data.name,
      email: data.email,
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

export const fetchAdminLogs = async () => {
  try {
    const res = await axiosInstance.get(API_PATHS.USERLOG.GETUSERADMINLOG);
    return res.data; // will return all logs
  } catch (err: any) {
    toast.error("Failed to fetch admin logs");
    throw err;
  }
};

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

// ==========================

// GET SITE SITE NAME

export const fetchSiteList = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.MULTITIMEUSEAPI.SHOWCODESITELIST
    );

    return (
      response.data?.data?.map((site: { id: number; title: string }) => ({
        value: site.id, // use id as value
        label: site.title, // show title in dropdown
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
  siteFilter?: string,
  dateFilter?: number
): Promise<PaymentDetails[]> => {
  try {
    const params = new URLSearchParams();

    if (adminId) params.append("admin_id", adminId);
    if (siteFilter) params.append("siteFilter", siteFilter);
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

export const getClientCountOfSite = async () => {
  const adminId = getAdminId();
  if (!adminId) throw new Error("Admin ID not found");

  // ✅ Send admin_id as query param
  const res = await axiosInstance.get(
    API_PATHS.CLIENTDATA.GETCLIENTECOUNTOFSITE,
    {
      params: { admin_id: adminId },
    }
  );

  return res.data?.data || [];
};

export const showclientlist = async (siteId: string) => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found");
    return null;
  }

  try {
    const res = await axiosInstance.get(
      API_PATHS.CLIENTDATA.SHOWCLIENTLIST,
      { params: { admin_id: adminId, site_id: siteId } } 
    );
    return res.data || null;
  } catch (error) {
    console.error(`Error fetching site data for siteId ${siteId}:`, error);
    toast.error("Failed to fetch site data");
    return null;
  }
};

export const showPropertyDetailsList = async () => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found");
    return null;
  }

  try {
    const res = await axiosInstance.get(
      API_PATHS.SITEDETAILS.PROPERTYDETAILSLIST,
      { params: { admin_id: adminId } } 
    );

    // Correct: use res.data.details
    const mappedData = res.data?.details?.map((item: any) => ({
      id: item.block_detail_id,
      siteName: item.title,
      unit: item.block,
      unitNumber: item.block_number,
    }));

    return mappedData || [];
  } catch (error) {
    console.error("Error fetching property details:", error);
    toast.error("Failed to fetch property details");
    return null;
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


export const fetchAdminTickets = async () => {
  const adminId = getAdminId();

  if (!adminId) {
    toast.error("Admin ID not found");
    return null;
  }

  try {
    const res = await axiosInstance.get(API_PATHS.TICKET.SHOWADMINTICKET, {
      params: { admin_id: adminId },
    });

    return res.data; // return raw API response
  } catch (error) {
    console.error("Error fetching admin tickets:", error);
    toast.error("Failed to fetch tickets");
    throw error;
  }
};