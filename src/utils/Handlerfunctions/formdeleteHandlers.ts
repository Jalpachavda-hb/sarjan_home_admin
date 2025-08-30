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