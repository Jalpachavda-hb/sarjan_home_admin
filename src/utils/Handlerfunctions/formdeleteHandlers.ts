import axiosInstance from "../axiosinstance";
import { toast } from "react-toastify";
import { API_PATHS } from "../apiPaths";
import { getAdminId } from "./getdata";

export const handleDeleteSplashScreen = async (id: number) => {
  try {
    const adminId = getAdminId();
    if (!adminId) {
      toast.error("Admin ID not found");
      return false;
    }
    console.log("delete call");

    // 🔥 Hit delete API with query params
    const res = await axiosInstance.get(
      API_PATHS.APPSETTING.DELETESPLASHSCREEN,
      {
        params: { admin_id: adminId, id },
      }
    );

    if (res.status === 200) {
      toast.success("Splash screen deleted successfully!");
      return true;
    }

    toast.error("Failed to delete splash screen");
    return false;
  } catch (err: any) {
    console.error("Error deleting splash screen:", err);
    toast.error("Failed to delete splash screen");
    return false;
  }
};

export const deleteProjectType = async (id: string) => {
  try {
    const admin_id = getAdminId();

    const response = await axiosInstance.post("/deleteProjectType", {
      admin_id,
      id,
    });

    return response.data; // { status, message }
  } catch (error) {
    console.error("Error deleting project type:", error);
    throw error;
  }
};

export const deleteProjectCategory = async (id: string, adminId: string) => {
  try {
    const formData = new FormData();
    formData.append("admin_id", adminId);
    formData.append("id", id);

    const response = await axiosInstance.post(
      API_PATHS.PROJECTCATEGORY.DELETPROJECTCATEGORY,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting project category:", error);
    throw error;
  }
};

export const deleteCommonDocument = async (id: string) => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found");
    return false;
  }

  console.log("delete call");

  // 🔥 Hit delete API with form-data (as per Postman)
  const formData = new FormData();
  formData.append("id", id);
  formData.append("admin_id", adminId);

  const res = await axiosInstance.post(
    API_PATHS.COMMONDOCUMENTS.DELETECOMMONDOCUMENTS,
    formData
  );

  return res;
};

export const deletePersonalDocument = async (id: string) => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found");
    return false;
  }

  console.log("delete call");

  const formData = new FormData();
  formData.append("id", id);
  formData.append("admin_id", adminId);

  const res = await axiosInstance.post(
    API_PATHS.PERSONALDOCUMENT.DELETEPersonalDocuments,
    formData
  );

  return res;
};

export const deleteAdminUser = async (id: string) => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found");
    return false;
  }

  try {
    console.log("Deleting Admin User ID:", id);

    const formData = new FormData();
    formData.append("adminuser_id", id); 
    formData.append("admin_id", adminId);

    const res = await axiosInstance.post(
      API_PATHS.ADMINUSERAPI.DELETEADMINUSER,
      formData
    );

    if (res?.status === 200) {
      toast.success("Admin user deleted successfully!");
      return true;
    } else {
      toast.error(res?.data?.message || "Failed to delete admin user");
      return false;
    }
  } catch (error: any) {
    console.error("Delete Admin User failed:", error);
    toast.error("Failed to delete admin user");
    return false;
  }
};



export const deletePropertyDetails = async (block_detail_id: string) => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found");
    return false;
  }

  try {
    console.log("Deleting ProprtyDetail ID:", block_detail_id);

    const formData = new FormData();
    formData.append("block_detail_id", block_detail_id); 
    formData.append("admin_id", adminId);

    const res = await axiosInstance.post(
      API_PATHS.SITEDETAILS.DELETEPROPERTYDETAILS,
      formData
    );

    if (res?.status === 200) {
      toast.success("Property Detail deleted successfully!");
      return true;
    } else {
      toast.error(res?.data?.message || "Failed to delete Property Detail");
      return false;
    }
  } catch (error: any) {
    console.error("Delete Property Detail failed:", error);
    toast.error("Failed to delete Property Detail");
    return false;
  }
};







export const destroyPaymentDetails = async (payment_id: number) => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found");
    return false;
  }

  try {
    console.log("Deleting ProprtyDetail ID:", payment_id);

    const formData = new FormData();
    formData.append("payment_id", payment_id); 
    formData.append("admin_id", adminId);

    const res = await axiosInstance.post(
      API_PATHS. PAYMENT.DESTROYPAYMENTDETAILS,
      formData
    );

    if (res?.status === 200) {
      // toast.success("Payment Details deleted successfully!");
      return true;
    } else {
      toast.error(res?.data?.message || "Failed to delete PaymentDetails");
      return false;
    }
  } catch (error: any) {
    console.error("Delete Payment Details failed:", error);
    toast.error("Failed to delete Payment Details");
    return false;
  }
};