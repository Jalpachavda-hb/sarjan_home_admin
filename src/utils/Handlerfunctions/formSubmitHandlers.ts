import { toast } from "react-toastify";
import axiosInstance from "../axiosinstance";
// import { API_PATHS } from "../utils/apiPaths";
// import { validateContact, validatePassword } from "../utils/Validation";
import { validateContact, validatePassword } from "../Validation";
import { API_PATHS } from "../apiPaths";
import {getAdminId} from "./getdata";

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
  setErrors,
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




// ======================

//  ADD SPLASH SCREEN 


// export const submitSplashScreen = async (
//   splashscreen_image: File | null,
//   title: string
// ) => {
//   try {
//     const admin_id = getAdminId();

//     if (!admin_id) {
//       toast.error("Admin ID not found. Please login again.");
//       return;
//     }

//     if (!splashscreen_image) {
//       toast.error("Please upload a splash screen image.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("splashscreen_image", splashscreen_image);
//     formData.append("admin_id", admin_id);

//     const res = await axiosInstance.post(
//       API_PATHS.APPSETTING.INSERTSPLASHSCREEN,
//       formData,
//       {
//         headers: { "Content-Type": "multipart/form-data" },
//       }
//     );

//     if (res.status === 200) {
//       toast.success("Splash screen added successfully!");
//       return res.data;
//     } else {
//       toast.error(res.data.message || "Failed to add splash screen");
//     }
//   } catch (error: any) {
//     console.error("Error while adding splash screen:", error);
//     toast.error(error.response?.data?.message || "Something went wrong");
//   }
// };

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
      toast.success("Splash screen added successfully!");
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