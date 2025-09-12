import { toast } from "react-toastify";
import axiosInstance from "../axiosinstance";
// import { API_PATHS } from "../utils/apiPaths";
// import { validateContact, validatePassword } from "../utils/Validation";
import { validateContact, validatePassword } from "../Validation";
import { API_PATHS } from "../apiPaths";
import { getAdminId } from "./getdata";

interface HandleLoginSubmitProps {
  e: React.FormEvent;
  contact: string;
  password: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setErrors: React.Dispatch<
    React.SetStateAction<{ contact?: string; password?: string }>
  >;
}
export const handleLoginSubmit = async ({
  e,
  contact,
  password,
  setErors,
  setLoading,
}: HandleLoginSubmitProps) => {
  e.preventDefault();
  setLoading(true); // 🔥 start loader here

  const newErrors: { contact?: string; password?: string } = {};
  const contactError = validateContact(contact);
  const passwordError = validatePassword(password);

  if (contactError) newErrors.contact = contactError;
  if (passwordError) newErrors.password = passwordError;

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setLoading(false); // stop loader if validation fails
    return;
  }

  try {
    const res = await axiosInstance.post(API_PATHS.ADMINAUTH.ADMINLOGIN, {
      contact,
      password,
    });

    if (res.data.status === 200) {
      const user = res.data.data;
      sessionStorage.setItem("user", JSON.stringify(user));

      toast.success(res.data.message || "Login successful!");

      if (user.role === 1 || user.role === 2) {
        window.location.href = "/admin/dashboard";
      } else {
        toast.error("Invalid role. Contact support.");
      }
    } else {
      toast.error(res.data.message || "Login failed!");
    }
  } catch (err: any) {
    if (err.response) {
      const { status, data } = err.response;
      if (status === 400) {
        toast.error(data.message || "Bad request");
      } else if (status === 401) {
        setErrors({ password: "Invalid password" });
      } else if (status === 404) {
        setErrors({ contact: "Phone number not found" });
      } else {
        toast.error("Something went wrong, please try again!");
      }
    } else {
      toast.error("Network error, please check your connection!");
    }
  } finally {
    setLoading(false); // ✅ always stop loader
  }
};
// utils/Handlerfunctions/formSubmitHandlers.ts
export const handleLogout = (navigate: (path: string) => void): void => {
  sessionStorage.removeItem("user");
  sessionStorage.clear();
  console.log("logout call");
  navigate("/admin/login");
};

//  ADD SPLASH SCREEN

export const submitSplashScreen = async (
  splashscreen_image: File | null,
  title: string
) => {
  if (!getAdminId()) {
    toast.error("Admin ID not found. Please login again.");
    return null;
  }

  if (!splashscreen_image) {
    toast.error("Please upload a splash screen image.");
    return null;
  }

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("splashscreen_image", splashscreen_image);
    formData.append("admin_id", getAdminId()!);

    const res = await axiosInstance.post(
      API_PATHS.APPSETTING.INSERTSPLASHSCREEN,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (res.data.status === 200) {
      // toast.success("Splash screen added successfully!");
      return res.data;
    } else {
      toast.error(res.data.message || "Failed to add splash screen");
      return null;
    }
  } catch (error: any) {
    console.error("Error while adding splash screen:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
    return null;
  }
};

export const addProjectCategory = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.PROJECTCATEGORY.ADDPROJECTCATEGORY,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding project category:", error);
    throw error;
  }
};

export const submitCommonDocument = async (
  document: File,
  common_document_name: string,
  site_detail_id: number
) => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found. Please login again.");
    return null;
  }

  if (!site_detail_id) {
    toast.error("Site ID is missing");
    return null;
  }

  try {
    const formData = new FormData();
    formData.append("common_document_name", common_document_name);
    formData.append("site_detail_id", site_detail_id);
    formData.append("document", document);
    formData.append("admin_id", adminId);

    const res = await axiosInstance.post(
      API_PATHS.COMMONDOCUMENTS.ADDCOMMUNDOCUMENT,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (res.data.status === 200) {
      toast.success("Document added successfully!");
      return res.data;
    } else {
      toast.error(res.data.message || "Failed to add document");
      return null;
    }
  } catch (error: any) {
    console.error("Error while adding document:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
    return null;
  }
};

export const submitPersonalDocument = async (
  p_doc: File,
  document_name: string,
  site_detail_id: number,
  client_id: number,
  block_detail_id: number
) => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found. Please login again.");
    return null;
  }
  if (!site_detail_id) {
    toast.error("Site ID is missing");
    return null;
  }
  try {
    const formData = new FormData();
    formData.append("document_name", document_name);
    formData.append("site_detail_id", String(site_detail_id));
    formData.append("client_id", String(client_id));
    formData.append("block_details", String(block_detail_id));
    formData.append("admin_id", String(adminId));
    formData.append("p_doc", p_doc);

    const res = await axiosInstance.post(
      API_PATHS.PERSONALDOCUMENT.ADDPERSONALDOCUMENT,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (res.data.status === 200) {
      // toast.success("Document added successfully!");
      return res.data;
    } else {
      toast.error(res.data.message || "Failed to add document");
      return null;
    }
  } catch (error: any) {
    console.error("Error while adding document:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
    return null;
  }
};

export const addAdminUser = async (
  name: string,
  email: string,
  contact: string,
  password: string,
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
    formData.append("admin_id", adminId);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("contact", contact);
    formData.append("password", password);
    formData.append("site_detail_id", String(site_detail_id));
    formData.append("role_id", String(role_id));

    // ✅ Clients
    clients.forEach((c) => formData.append("clients[]", c));

    // ✅ Permissions - Send as individual form fields (convert to lowercase)
    Object.entries(permissions).forEach(([feature, values]) => {
      const lowercaseFeature = feature.toLowerCase(); // Convert to lowercase
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
      API_PATHS.ADMINUSERAPI.ADDADMINUSER,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (res.data.status === 200) {
      toast.success("Admin user added successfully!");
      return res.data;
    } else {
      toast.error(res.data.message || "Failed to add admin user");
      return null;
    }
  } catch (error: any) {
    console.error("Error while adding admin user:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
    return null;
  }
};
export const addPropertyDetails = async (formData: FormData) => {
  const adminId = getAdminId();
  if (!adminId) {
    toast.error("Admin ID not found. Please login again.");
    return null;
  }

  try {
    // append admin_id if not already
    if (!formData.has("admin_id")) {
      formData.append("admin_id", String(adminId));
    }

    const response = await axiosInstance.post(
      API_PATHS.SITEDETAILS.ADDPROPERTDETAILS,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding property details:", error);
    toast.error("Failed to add property details");
    return null;
  }
};



export const addPaymentDetail = async ({
  adminId,
  clientId,
  siteDetailId,
  blockDetailsId,
  receivedAmountType,
  receivedAmount,
  paymentDate,
  receiptFile = null,
}) => {
  try {
    const formData = new FormData();
    formData.append("admin_id", adminId); // dynamic admin ID
    formData.append("client_id", clientId);
    formData.append("site_detail_id", siteDetailId);
    formData.append("block_details_id", blockDetailsId);
    formData.append("received_amount_type", receivedAmountType);
    formData.append("received_amount", receivedAmount);
    formData.append("received_payment_date", paymentDate);

    if (receiptFile) {
      formData.append("receipt", receiptFile);
    }

    const response = await axiosInstance.post(
      API_PATHS.CLIENTDATA.ADDPAYMENTFROMCLIENT,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log("✅ Payment Added:", response.data);
    return response.data; // return response for further use
  } catch (error) {
    console.error("❌ Error submitting payment:", error);
    throw error; // throw error so caller can handle it
  }
};

