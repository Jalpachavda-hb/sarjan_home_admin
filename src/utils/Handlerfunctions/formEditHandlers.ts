import axiosInstance from "../axiosinstance";
import { toast } from "react-toastify";
import { API_PATHS } from "../apiPaths";
import { getAdminId } from "./getdata";

export const handleUpdateProfile = async (
  formData: {
    admin_id: string;
    name: string;
    email: string;
    contact_no: string;
    password?: string;
  },
  onSuccess: () => void
) => {
  try {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!/^\d{10}$/.test(formData.contact_no)) {
      toast.error("Contact number must be exactly 10 digits");
      return;
    }

    // Build payload (note: backend expects "contact", not "contact_no")
    const payload = {
      admin_id: formData.admin_id,
      name: formData.name,
      email: formData.email,
      contact: formData.contact_no,
      ...(formData.password ? { password: formData.password } : {}),
    };

    const { data } = await axiosInstance.post(
      API_PATHS.ADMINAUTH.UPDATE_PROFIL,
      payload
    );

    if (data.status === 200) {
      toast.success(data.message);
      onSuccess(); // refresh UI
    } else {
      toast.error(data.message || "Something went wrong");
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Error updating profile");
  }
};

// ======================

// WEB SETTING UPDATE

export const updateWebSetting = async (
  adminId: string | null,
  Group_name: string,
  logoFile: File | null,
  faviconFile: File | null
) => {
  if (!adminId) {
    toast.error("Admin ID is missing");
    throw new Error("Admin ID is required");
  }

  const formData = new FormData();
  formData.append("Group_name", Group_name);
  formData.append("admin_id", adminId);

  if (logoFile) formData.append("logo", logoFile);
  if (faviconFile) formData.append("favicon", faviconFile);

  try {
    const res = await axiosInstance.post(
      API_PATHS.WEBSETTING.UPDATEWEBSETTING,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    toast.success("Web Setting updated successfully");
    return res.data;
  } catch (err: any) {
    console.error("Update WebSetting error:", err);
    toast.error("Failed to update Web Setting");
    throw err;
  }
};

// edit projecttype

export const editProjectType = async (
  admin_id: string,
  id: string,
  project_type_name: string
) => {
  try {
    const formData = new FormData();
    formData.append("admin_id", admin_id);
    formData.append("id", id);
    formData.append("project_type_name", project_type_name);

    const response = await axiosInstance.post("/editProjectType", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // { status, message, data }
  } catch (error) {
    console.error("Error editing project type:", error);
    throw error;
  }
};

export const editProjectCategory = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.PROJECTCATEGORY.EDITPROJECTCATEGORY,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error editing project category:", error);
    throw error;
  }
};

export const updatePropertyDetails = async (
  block_detail_id: number,
  formData: any
) => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found. Please login again.");
    return null;
  }

  try {
    const payload = {
      block_detail_id, // which block to update
      site_detail_id: formData.site_detail_id,
      block: formData.block,
      block_number: formData.block_number,
      rera_area: formData.rera_area,
      balcony_area: formData.balcony_area,
      wash_area: formData.wash_area,
      terrace_area: formData.terrace_area,
      undivided_landshare: formData.undivided_landshare,
      north: formData.north,
      south: formData.south,
      east: formData.east,
      west: formData.west,
    };

    // Pass admin_id in URL as query param
    const res = await axiosInstance.post(
      `${API_PATHS.SITEDETAILS.EDITPROPERTYDETAILS}?admin_id=${adminId}`,
      payload
    );

    if (res.data.status === 200) {
      // toast.success("Property Detail updated successfully!");
      return res.data;
    } else {
      toast.error(res.data.message || "Failed to update Property Detail");
      return null;
    }
  } catch (error: any) {
    console.error("Error while updating Property Detail:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
    return null;
  }
};

export const updateAdminUser = async (
  id: string,
  name: string,
  email: string,
  contact: string,
  site_detail_id: number,
  role_id: number,
  permissions: { [feature: string]: string[] },
  clients: string[] = []
) => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found. Please login again.");
    return null;
  }

  try {
    const formData = new FormData();
    // formData.append("admin_id", adminId);
    formData.append("admin_user_id", id);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("contact", contact);
    formData.append("site_detail_id", String(site_detail_id));
    formData.append("role_id", String(role_id));

    // ✅ Clients
    clients.forEach((c) => formData.append("clients[]", c));

    // ✅ Permissions - same handling as addAdminUser
    Object.entries(permissions).forEach(([feature, values]) => {
      const lowercaseFeature = feature.toLowerCase(); // convert to lowercase
      if (Array.isArray(values) && values.length > 0) {
        values.forEach((val) => {
          formData.append(`${lowercaseFeature}[]`, val);
        });
      } else {
        // Send empty array if no permissions selected
        formData.append(`${lowercaseFeature}[]`, "");
      }
    });

    // Debugging – log what's being sent
    for (let [k, v] of formData.entries()) {
      console.log(k, v);
    }

    const res = await axiosInstance.post(
      API_PATHS.ADMINUSERAPI.UPDATEADMINUSER,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (res.data.status === 200) {
      toast.success("Admin user updated successfully!");
      return res.data;
    } else {
      toast.error(res.data.message || "Failed to update admin user");
      return null;
    }
  } catch (error: any) {
    console.error("Error while updating admin user:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
    return null;
  }
};

export const editPaymentfromAdmin = async (
  admin_id: string,
  id: string,
  received_amount_type: string,
  received_amount: number,
  received_payment_date: string,
  receipt: File | null // only File or null
) => {
  try {
    const formData = new FormData();
    formData.append("admin_id", admin_id);
    formData.append("id", id);
    formData.append("received_amount_type", received_amount_type);
    formData.append("received_amount", received_amount.toString());
    formData.append("received_payment_date", received_payment_date);

    // ✅ Only attach if a new file is selected
    if (receipt) {
      formData.append("receipt", receipt);
    }

    const response = await axiosInstance.post(
      API_PATHS.PAYMENT.EDITPAYMENTFROMADMIN,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data; // { status, message, data }
  } catch (error) {
    console.error("Error editing payment:", error);
    throw error;
  }
};




export const editClient = async (
  clientData: any,
  originalData: any,
  aadharCard: File | null,
  panCard: File | null
) => {
  try {
    const formData = new FormData();

    // ✅ Map to exact field names expected by backend
    formData.append("admin_id", clientData.admin_id);
    formData.append("clientid", clientData.clientid);
    formData.append("site_detail_id", clientData.site_detail_id || "");
    formData.append("client_name", clientData.name || "");
    formData.append("edit_email", clientData.email || "");
    formData.append("edit_contact", clientData.contact || "");
    formData.append("edit_address", clientData.address || "");
    formData.append("update_password", clientData.password || "");
    formData.append("client_milestone_id", clientData.client_milestone_id || "");
    formData.append("edit_unit_type_option", clientData.unit_type || "");
    formData.append("edit_property_amount", clientData.property_amount || "");
    formData.append("edit_gst_slab", clientData.gst_slab || "");
    formData.append("edit_gst_amount", clientData.gst_amount || "");
    formData.append("edit_total_amount", clientData.total_amount || "");

    // ✅ Only attach if a new file is selected
    if (aadharCard) {
      formData.append("edit_aadhar_card", aadharCard);
    }
    if (panCard) {
      formData.append("edit_pan_card", panCard);
    }

    const response = await axiosInstance.post(
      API_PATHS.CLIENTDATA.UPDATECLIENTDATA,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data; // { status, message, data }
  } catch (error) {
    console.error("Error editing client:", error);
    throw error;
  }
};
