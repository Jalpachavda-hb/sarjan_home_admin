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

    const response = await axiosInstance.post(
      "/editProjectType",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

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
