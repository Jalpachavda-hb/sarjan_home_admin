

import { useEffect, useState } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { handleUpdateProfile } from "../../utils/Handlerfunctions/formEditHandlers";
import { fetchProfile } from "../../utils/Handlerfunctions/getdata";


export default function EditProfile() {
  const [formData, setFormData] = useState({
    admin_id: "",
    name: "",
    email: "",
    contact_no: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    contact_no?: string;
  }>({});
  // Fetch profile data

useEffect(() => {
  fetchProfile()
    .then((data) => {
      console.log("Fetched profile data:", data); // Debug log
      setFormData({ ...data, password: "" }); // data already has admin_id
    })
    .catch((err) => console.error("Error fetching profile:", err));
}, []);



  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;

  //   // Contact number: digits only
  //   if (name === "contact_no") {
  //     setFormData({ ...formData, contact_no: value.replace(/\D/g, "") });
  //     return;
  //   }

  //   setFormData({ ...formData, [name]: value });
  // };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue = value;

    // Contact number: digits only
    if (name === "contact_no") {
      newValue = value.replace(/\D/g, "");
      setFormData({ ...formData, contact_no: newValue });

      // Live validation
      if (!newValue) setErrors({ ...errors, contact_no: "Contact is required" });
      else if (newValue.length !== 10)
        setErrors({ ...errors, contact_no: "Contact must be 10 digits" });
      else setErrors({ ...errors, contact_no: "" });

      return;
    }

    setFormData({ ...formData, [name]: newValue });

    // Name validation
    if (name === "name") {
      setErrors({ ...errors, name: newValue.trim() ? "" : "Name is required" });
    }

    // Email validation
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors({
        ...errors,
        email: newValue.trim()
          ? emailRegex.test(newValue)
            ? ""
            : "Invalid email address"
          : "Email is required",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

     const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^\d{10}$/.test(formData.contact_no))
      newErrors.contact_no = "Contact must be 10 digits";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;




    console.log("Form data before submit:", formData); // Debug log
    
    if (!formData.admin_id) {
      console.error("Admin ID missing");
      return;
    }

    handleUpdateProfile(formData, () => {
      console.log("Profile updated successfully ✅");
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Edit Personal Information">
            <div className="space-y-6">
              <div>
                <Label htmlFor="name">Name<span className="text-red-500">*</span></Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                   className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
                <Input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                />
                 {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contact_no">Contact Number<span className="text-red-500">*</span></Label>
                <Input
                  type="text"
                  id="contact_no"
                  name="contact_no"
                  value={formData.contact_no}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="Enter Contact Number"
                />
                 {errors.contact_no && (
                  <p className="text-red-500 text-sm">{errors.contact_no}</p>
                )}
              </div>

              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <FaRegEye className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <FaEyeSlash className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </button>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <Button type="submit" className="Submitbtn">
          Update
        </Button>
       
      </div>
    </form>
  );
}





// import { useEffect, useState } from "react";
// import Label from "../../components/form/Label";
// import Input from "../../components/form/input/InputField";
// import ComponentCard from "../../components/common/ComponentCard";
// import Button from "../../components/ui/button/Button";
// import { FaRegEye, FaEyeSlash } from "react-icons/fa";
// import { handleUpdateProfile } from "../../utils/Handlerfunctions/formEditHandlers";
// import { fetchProfile } from "../../utils/Handlerfunctions/getdata";

// export default function EditProfile() {
//   const [formData, setFormData] = useState({
//     admin_id: "",
//     name: "",
//     email: "",
//     contact_no: "",
//     password: "",
//   });

  // const [errors, setErrors] = useState<{
  //   name?: string;
  //   email?: string;
  //   contact_no?: string;
  // }>({});

//   const [showPassword, setShowPassword] = useState(false);

//   // Fetch profile data
//   useEffect(() => {
//     fetchProfile()
//       .then((res) => {
//         const data = res.data; // ensure data contains id, name, email, contact_no
//         setFormData({
//           admin_id: data.id,
//           name: data.name || "",
//           email: data.email || "",
//           contact_no: data.contact_no?.toString() || "",
//           password: "",
//         });
//       })
//       .catch((err) => console.error("Error fetching profile:", err));
//   }, []);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;

  //   let newValue = value;

  //   // Contact number: digits only
  //   if (name === "contact_no") {
  //     newValue = value.replace(/\D/g, "");
  //     setFormData({ ...formData, contact_no: newValue });

  //     // Live validation
  //     if (!newValue) setErrors({ ...errors, contact_no: "Contact is required" });
  //     else if (newValue.length !== 10)
  //       setErrors({ ...errors, contact_no: "Contact must be 10 digits" });
  //     else setErrors({ ...errors, contact_no: "" });

  //     return;
  //   }

  //   setFormData({ ...formData, [name]: newValue });

  //   // Name validation
  //   if (name === "name") {
  //     setErrors({ ...errors, name: newValue.trim() ? "" : "Name is required" });
  //   }

  //   // Email validation
  //   if (name === "email") {
  //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     setErrors({
  //       ...errors,
  //       email: newValue.trim()
  //         ? emailRegex.test(newValue)
  //           ? ""
  //           : "Invalid email address"
  //         : "Email is required",
  //     });
  //   }
  // };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Final check before submit
//     const newErrors: typeof errors = {};
//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     if (!/^\d{10}$/.test(formData.contact_no))
//       newErrors.contact_no = "Contact must be 10 digits";

//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) return;

//     if (!formData.admin_id) {
//       console.error("Admin ID missing");
//       return;
//     }

//     handleUpdateProfile(formData, () => {
//       console.log("Profile updated successfully ✅");
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
//         <div className="space-y-6">
//           <ComponentCard title="Edit Personal Information">
//             <div className="space-y-6">
//               <div>
//                 <Label htmlFor="name">Name<span className="text-red-500">*</span></Label>
//                 <Input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Enter name"
//                   className={errors.name ? "border-red-500" : ""}
//                 />
//                 {errors.name && (
//                   <p className="text-red-500 text-sm">{errors.name}</p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
//                 <Input
//                   type="text"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Enter Email"
//                   className={errors.email ? "border-red-500" : ""}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm">{errors.email}</p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="contact_no">Contact Number<span className="text-red-500">*</span></Label>
//                 <Input
//                   type="text"
//                   id="contact_no"
//                   name="contact_no"
//                   value={formData.contact_no}
//                   onChange={handleChange}
//                   maxLength={10}
//                   placeholder="Enter Contact Number"
//                   className={errors.contact_no ? "border-red-500" : ""}
//                 />
//                 {errors.contact_no && (
//                   <p className="text-red-500 text-sm">{errors.contact_no}</p>
//                 )}
//               </div>

//               <Label>Password</Label>
//               <div className="relative">
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
//                 >
//                   {showPassword ? (
//                     <FaRegEye className="fill-gray-500 dark:fill-gray-400 size-5" />
//                   ) : (
//                     <FaEyeSlash className="fill-gray-500 dark:fill-gray-400 size-5" />
//                   )}
//                 </button>
//               </div>
//             </div>
//           </ComponentCard>
//         </div>
//       </div>

//       <div className="mt-6 flex gap-4">
//         <Button type="submit" className="Submitbtn">
//           Update
//         </Button>
//       </div>
//     </form>
//   );
// }
