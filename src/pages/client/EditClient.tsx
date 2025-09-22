// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import PageMeta from "../../components/common/PageMeta";
// import ComponentCard from "../../components/common/ComponentCard";
// import Label from "../../components/form/Label";
// import Input from "../../components/form/input/InputField";
// import SiteSelector from "../../components/form/input/SelectSiteinput";
// import FileInput from "../../components/form/input/FileInput";
// import { toast } from "react-toastify";
// import Button from "../../components/ui/button/Button";
// import Select from "../../components/form/Select";
// import TextArea from "../../components/form/input/TextArea";
// import { CiMail } from "react-icons/ci";
// import MultiSelect from "../../components/form/MultiSelect";
// import { FaRegEye, FaEyeSlash } from "react-icons/fa";
// import {
//   fetchUnitType,
//   getClientName,
//   getBlockFromSiteId,
//   getBlockFromBlockid,
//   fetchClientDetails,
//   getAdminId,
// } from "../../utils/Handlerfunctions/getdata";
// import { editClient } from "../../utils/Handlerfunctions/formEditHandlers";

// type Option = { label: string; value: string | number };

// const EditClient: React.FC = () => {
//   const navigate = useNavigate();
//   const params = useParams();
//   const location = useLocation();
//   const adminId = getAdminId();

//   const client_milestone_id =
//     (location.state as any)?.client_milestone_id || params.id;

//   const [loading, setLoading] = useState(false);
//   const [unitTypes, setUnitTypes] = useState<Option[]>([]);
//   const [clients, setClients] = useState<Option[]>([]);
//   const [blocks, setBlocks] = useState<Option[]>([]);
//   const [blockDetails, setBlockDetails] = useState<
//     { label: string; value: number }[]
//   >([]);
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [aadharCard, setAadharCard] = useState<File | null>(null);
//   const [panCard, setPanCard] = useState<File | null>(null);
//   const [originalData, setOriginalData] = useState<any>({});
//   const [existingAadharUrl, setExistingAadharUrl] = useState<string>("");
//   const [existingPanUrl, setExistingPanUrl] = useState<string>("");
//   const [removeAadhar, setRemoveAadhar] = useState<boolean>(false);
//   const [removePan, setRemovePan] = useState<boolean>(false);

//   const [clientData, setClientData] = useState<any>({
//     site_detail_id: "",
//     site_name: "",
//     name: "",
//     email: "",
//     contact: "",
//     address: "",
//     unit_type: "",
//     block_id: "",
//     block_detail_id: [],
//     block_number: "",
//     property_amount: "",
//     gst_slab: "",
//     gst_amount: "",
//     total_amount: "",
//     client_type: "1",
//     existing_client_id: "",
//     clientid: "",
//   });

//   // Load client details for editing
//   useEffect(() => {
//     if (!client_milestone_id || !adminId) return;

//     const loadClientData = async () => {
//       try {
//         const data = await fetchClientDetails(adminId, client_milestone_id);
//         console.log("Fetched client data:", data);

//         const clientDataObj = {
//           site_detail_id: data.site_detail_id || "",
//           site_name: data.site_name || "",
//           name: data.name || "",
//           email: data.email || "",
//           contact: data.contact || "",
//           address: data.address || "",
//           unit_type: data.unit_type || "",
//           block_id: data.block_id || "",
//           block_detail_id: data.block_detail_id
//             ? [String(data.block_detail_id)]
//             : [],
//           block_number: data.block_number || "",
//           property_amount: data.property_amount || "",
//           gst_slab: data.gst_slab || "",
//           gst_amount: data.gst_amount || "",
//           total_amount: data.total_amount || "",
//           client_type: data.client_type || "1",
//           existing_client_id: data.existing_client_id || "",
//           clientid: data.clientid || "",
//         };

//         setClientData(clientDataObj);
//         setOriginalData(clientDataObj);

//         if (data.password) {
//           setPassword(data.password);
//         }

//         // Set existing file URLs
//         if (data.aadhar_card) {
//           setExistingAadharUrl(data.aadhar_card);
//         }
//         if (data.pan_card) {
//           setExistingPanUrl(data.pan_card);
//         }
//       } catch (e: any) {
//         console.error("Error loading client data:", e);
//         toast.error(e.message || "Failed to fetch client details");
//       }
//     };

//     loadClientData();
//   }, [adminId, client_milestone_id]);

//   const handleSelectChange = (field: string) => (val: any) => {
//     const finalVal =
//       val && typeof val === "object" && "value" in val ? val.value : val;
//     setClientData((prev: any) => ({ ...prev, [field]: finalVal }));
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;

//     if (name === "property_amount") {
//       const principal = parseFloat(value) || 0;
//       const gstSlab = parseFloat(clientData.gst_slab) || 0;
//       const gstAmount = principal * (gstSlab / 100);
//       const total = principal + gstAmount;

//       setClientData((prev: any) => ({
//         ...prev,
//         [name]: value,
//         gst_amount: gstAmount.toFixed(2),
//         total_amount: total.toFixed(2),
//       }));
//     } else {
//       setClientData((prev: any) => ({ ...prev, [name]: value }));
//     }
//   };
//   const getImageUrl = (url: string) => {
//     if (!url) return "";
//     // If URL is already absolute, return as is
//     if (url.startsWith("http")) return url;

//     const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
//     return `${baseUrl}/storage/uploads/${url}`;
//   };

//   const handleSubmit = async () => {
//     if (!clientData.name) {
//       toast.error("Name is required");
//       return;
//     }
//     if (!clientData.email || !clientData.contact) {
//       toast.error("Email and Contact are required");
//       return;
//     }
//     if (!clientData.site_detail_id) {
//       toast.error("Site selection is required");
//       return;
//     }

//     setLoading(true);
//     try {
//       const submitData = {
//         ...clientData,
//         password,
//         admin_id: adminId,
//         client_milestone_id,
//       };
//       const res = await editClient(
//         submitData,
//         originalData,
//         removeAadhar ? null : aadharCard,
//         removePan ? null : panCard
//       );
//       if (res.status === 200) {
//         toast.success(res.message || "Client updated successfully!");
//         navigate(-1);
//       } else {
//         toast.error(res.message || "Failed to update client");
//       }
//     } catch (e: any) {
//       console.error("Submit error:", e);
//       toast.error(e.response?.data?.message || "Failed to update client");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <PageMeta title="Edit Client" />
//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
//         <div className="space-y-6">
//           <ComponentCard title="Edit Client">
//             <div className="space-y-6">
//               {/* Selected Site */}

//               {/* Basic fields */}
//               <div>
//                 <Label>Name</Label>
//                 <Input
//                   name="name"
//                   value={clientData.name}
//                   onChange={handleChange}
//                   placeholder="Enter client name"
//                 />
//               </div>

//               <div>
//                 <Label>Email</Label>
//                 <div className="relative">
//                   <Input
//                     name="email"
//                     value={clientData.email}
//                     onChange={handleChange}
//                     placeholder="info@gmail.com"
//                     type="email"
//                     className="pl-[62px]"
//                   />
//                   <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500">
//                     <CiMail className="size-6" />
//                   </span>
//                 </div>
//               </div>

//               <div>
//                 <Label>Contact Number</Label>
//                 <Input
//                   name="contact"
//                   value={clientData.contact}
//                   onChange={handleChange}
//                   placeholder="9876543210"
//                 />
//               </div>

//               {/* Address */}
//               <div>
//                 <Label>Address</Label>
//                 <TextArea
//                   value={clientData.address}
//                   onChange={(val) =>
//                     setClientData((prev: any) => ({ ...prev, address: val }))
//                   }
//                   rows={4}
//                 />
//               </div>

//               {/* Aadhar Card */}
//               <div>
//                 <Label>Aadhar Card</Label>
//                 <div className="flex items-center gap-2">
//                   <FileInput
//                     id="aadharCardUpload"
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                       setAadharCard(e.target.files?.[0] || null);
//                     }}
//                   />
//                   {existingAadharUrl && (
//                     <Button
//                       type="button"
//                       variant="secondary"
//                       onClick={() => window.open(getImageUrl(existingAadharUrl), '_blank')}
//                     >
//                       View
//                     </Button>
//                   )}
//                 </div>
//               </div>

//               {/* PAN Card */}
//               <div>
//                 <Label>PAN Card</Label>
//                 <div className="flex items-center gap-2">
//                   <FileInput
//                     id="panCardUpload"
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                       setPanCard(e.target.files?.[0] || null);
//                     }}
//                   />
//                   {existingPanUrl && (
//                     <Button
//                       type="button"
//                       variant="secondary"
//                       onClick={() => window.open(getImageUrl(existingPanUrl), '_blank')}
//                     >
//                       View
//                     </Button>
//                   )}
//                 </div>
//               </div>

//               {/* Selected Site */}
//               <div>
//                 <Label>Selected Site</Label>
//                 <Input
//                   name="site_name"
//                   value={clientData.site_name}
//                   disabled
//                   className="disabledInput"
//                   placeholder="Site Name"
//                 />
//               </div>

//               {/* Unit Type */}
//               <div>
//                 <Label>Unit Type</Label>
//                 <Input
//                   name="unit_type"
//                   value={clientData.unit_type}
//                   disabled
//                   className="disabledInput"
//                   placeholder="Unit Type"
//                 />
//               </div>

//               {/* Block Number */}
//               <div>
//                 <Label>Block Number</Label>
//                 <Input
//                   name="block_number"
//                   value={clientData.block_number}
//                   disabled
//                   className="disabledInput"
//                   placeholder="Block Number"
//                 />
//               </div>

//               {/* Property Amount */}
//               <div>
//                 <Label>Property Amount</Label>
//                 <Input
//                   name="property_amount"
//                   value={clientData.property_amount}
//                   onChange={handleChange}
//                   placeholder="50000"
//                   type="number"
//                 />
//               </div>

//               {/* GST Slab */}
//               <div>
//                 <Label>GST Slab</Label>
//                 <Input
//                   name="gst_slab"
//                   value={clientData.gst_slab ? `${clientData.gst_slab}%` : ""}
//                   disabled
//                   className="disabledInput"
//                   placeholder="GST Slab"
//                 />
//               </div>

//               {/* GST Amount */}
//               <div>
//                 <Label>GST Amount</Label>
//                 <Input
//                   name="gst_amount"
//                   disabled
//                   className="disabledInput"
//                   value={clientData.gst_amount}
//                 />
//               </div>

//               {/* Total Amount */}
//               <div>
//                 <Label>Total Amount</Label>
//                 <Input
//                   name="total_amount"
//                   disabled
//                   className="disabledInput"
//                   value={clientData.total_amount}
//                 />
//               </div>

//               {/* Password */}
//               <div>
//                 <Label>Password</Label>
//                 <div className="relative">
//                   <Input
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-1/2 -translate-y-1/2"
//                   >
//                     {showPassword ? <FaRegEye /> : <FaEyeSlash />}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </ComponentCard>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="mt-6 flex gap-4">
//         <Button onClick={handleSubmit} disabled={loading}>
//           {loading ? "Updating..." : "Update Client"}
//         </Button>
//         <Button variant="secondary" onClick={() => navigate(-1)}>
//           Cancel
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default EditClient;
//                     }}
//                   />
//                   {existingAadharUrl && (
//                     <Button
//                       type="button"
//                       variant="secondary"
//                       onClick={() => window.open(getImageUrl(existingAadharUrl), '_blank')}
//                     >
//                       View
//                     </Button>
//                   )}
//                 </div>
//               </div>

//               {/* PAN Card */}
//               <div>
//                 <Label>PAN Card</Label>
//                 <div className="flex items-center gap-2">
//                   <FileInput
//                     id="panCardUpload"
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                       setPanCard(e.target.files?.[0] || null);
//                     }}
//                   />
//                   {existingPanUrl && (
//                     <Button
//                       type="button"
//                       variant="secondary"
//                       onClick={() => window.open(getImageUrl(existingPanUrl), '_blank')}
//                     >
//                       View
//                     </Button>
//                   )}
//                 </div>
//               </div>
//                       setRemoveAadhar(false); // replace old with new
//                     }}
//                   />

//                   {/* Show Eye + Remove if existing */}
//                   {existingAadharUrl && !aadharCard && !removeAadhar && (
//                     <>
//                       <button
//                         type="button"
//                         onClick={() =>
//                           window.open(getImageUrl(existingAadharUrl), "_blank")
//                         }
//                         className="p-2 rounded bg-gray-200 hover:bg-gray-300"
//                         title="View Aadhar"
//                       >
//                         <FaRegEye />
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setRemoveAadhar(true);
//                           setAadharCard(null);
//                         }}
//                         className="p-2 rounded bg-red-500 text-white hover:bg-red-600"
//                         title="Remove Aadhar"
//                       >
//                         ✕
//                       </button>
//                     </>
//                   )}
//                 </div>

//                 {removeAadhar && (
//                   <p className="text-sm text-red-600 mt-1">
//                     Aadhar will be removed
//                   </p>
//                 )}
//               </div>

//               {/* PAN Card */}
//               <div>
//                 <Label>PAN Card</Label>
//                 <div className="flex items-center gap-2">
//                   <FileInput
//                     id="panCardUpload"
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                       setPanCard(e.target.files?.[0] || null);
//                       setRemovePan(false); // replace old with new
//                     }}
//                   />

//                   {/* Show Eye + Remove if existing */}
//                   {existingPanUrl && !panCard && !removePan && (
//                     <>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           const fileUrl = getImageUrl(existingAadharUrl);
//                           window.open(fileUrl, "_blank", "noopener,noreferrer");
//                         }}
//                         className="p-2 rounded bg-gray-200 hover:bg-gray-300"
//                         title="View Aadhar"
//                       >
//                         <FaRegEye />
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setRemovePan(true);
//                           setPanCard(null);
//                         }}
//                         className="p-2 rounded bg-red-500 text-white hover:bg-red-600"
//                         title="Remove PAN"
//                       >
//                         ✕
//                       </button>
//                     </>
//                   )}
//                 </div>

//                 {removePan && (
//                   <p className="text-sm text-red-600 mt-1">
//                     PAN will be removed
//                   </p>
//                 )}
//               </div>

//               {/* Existing Client Selection */}
//               {clientData.client_type === "2" && (
//                 <div>
//                   <Label>Select Client Name</Label>
//                   <Select
//                     options={clients}
//                     value={clientData.existing_client_id}
//                     onChange={handleSelectChange("existing_client_id")}
//                     placeholder="Select Existing Client"
//                   />
//                 </div>
//               )}

//               {/* Unit Type */}

//               <div>
//                 <Label>Selected Site</Label>
//                 <Input
//                   name="site_name"
//                   value={clientData.site_name}
//                   disabled
//                   className="disabledInput"
//                   placeholder="Site Name"
//                 />
//               </div>

//               <div>
//                 <Label>Unit Type</Label>
//                 <Input
//                   name="unit_type"
//                   value={clientData.unit_type}
//                   disabled
//                   className="disabledInput"
//                   placeholder="Unit Type"
//                 />
//               </div>
//               {/* Block Number */}
//               <div>
//                 <Label>Block Number</Label>
//                 <Input
//                   name="block_number"
//                   value={clientData.block_number}
//                   disabled
//                   className="disabledInput"
//                   placeholder="Block Number"
//                 />
//               </div>

//               {/* Property Amount */}
//               <div>
//                 <Label>Property Amount</Label>
//                 <Input
//                   name="property_amount"
//                   value={clientData.property_amount}
//                   onChange={handleChange}
//                   placeholder="50000"
//                   type="number"
//                 />
//               </div>

//               {/* GST Slab */}
//               <div>
//                 <Label>GST Slab</Label>
//                 <Input
//                   name="gst_slab"
//                   value={clientData.gst_slab ? `${clientData.gst_slab}%` : ""}
//                   disabled
//                   className="disabledInput"
//                   placeholder="GST Slab"
//                 />
//               </div>

//               {/* GST Amount */}
//               <div>
//                 <Label>GST Amount</Label>
//                 <Input
//                   name="gst_amount"
//                   disabled
//                   className="disabledInput"
//                   value={clientData.gst_amount}
//                 />
//               </div>

//               {/* Total Amount */}
//               <div>
//                 <Label>Total Amount</Label>
//                 <Input
//                   name="total_amount"
//                   disabled
//                   className="disabledInput"
//                   value={clientData.total_amount}
//                 />
//               </div>

//               {/* Password */}
//               <div>
//                 <Label>Password</Label>
//                 <div className="relative">
//                   <Input
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-1/2 -translate-y-1/2"
//                   >
//                     {showPassword ? <FaRegEye /> : <FaEyeSlash />}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </ComponentCard>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="mt-6 flex gap-4">
//         <Button onClick={handleSubmit} disabled={loading}>
//           {loading ? "Updating..." : "Update Client"}
//         </Button>
//         <Button variant="secondary" onClick={() => navigate(-1)}>
//           Cancel
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default EditClient;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { CiMail } from "react-icons/ci";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  fetchClientDetails,
  getAdminId,
} from "../../utils/Handlerfunctions/getdata";
import { editClient } from "../../utils/Handlerfunctions/formEditHandlers";

const EditClient: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const adminId = getAdminId();
  const client_milestone_id =
    (location.state as any)?.client_milestone_id || params.id;

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [aadharCard, setAadharCard] = useState<File | null>(null);
  const [panCard, setPanCard] = useState<File | null>(null);
  const [removeAadhar, setRemoveAadhar] = useState(false);
  const [removePan, setRemovePan] = useState(false);
  const [existingAadharUrl, setExistingAadharUrl] = useState("");
  const [existingPanUrl, setExistingPanUrl] = useState("");
  const [originalData, setOriginalData] = useState<any>({});
  const [clientData, setClientData] = useState<any>({
    site_detail_id: "",
    site_name: "",
    name: "",
    email: "",
    contact: "",
    address: "",
    unit_type: "",
    block_id: "",
    block_detail_id: [],
    block_number: "",
    property_amount: "",
    gst_slab: "",
    gst_amount: "",
    total_amount: "",
    client_type: "1",
    existing_client_id: "",
    clientid: "",
  });

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
    return `${baseUrl}/storage/uploads/${url}`;
  };

  useEffect(() => {
    if (!client_milestone_id || !adminId) return;

    const loadClientData = async () => {
      try {
        const data = await fetchClientDetails(adminId, client_milestone_id);
        const clientDataObj = {
          site_detail_id: data.site_detail_id || "",
          site_name: data.site_name || "",
          name: data.name || "",
          email: data.email || "",
          contact: data.contact || "",
          address: data.address || "",
          unit_type: data.unit_type || "",
          block_id: data.block_id || "",
          block_detail_id: data.block_detail_id ? [String(data.block_detail_id)] : [],
          block_number: data.block_number || "",
          property_amount: data.property_amount || "",
          gst_slab: data.gst_slab || "",
          gst_amount: data.gst_amount || "",
          total_amount: data.total_amount || "",
          client_type: data.client_type || "1",
          existing_client_id: data.existing_client_id || "",
          clientid: data.clientid || "",
        };
        setClientData(clientDataObj);
        setOriginalData(clientDataObj);
        if (data.password) setPassword(data.password);
        if (data.aadhar_card) setExistingAadharUrl(data.aadhar_card);
        if (data.pan_card) setExistingPanUrl(data.pan_card);
      } catch (e: any) {
        console.error(e);
        toast.error(e.message || "Failed to fetch client details");
      }
    };
    loadClientData();
  }, [adminId, client_milestone_id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "property_amount") {
      const principal = parseFloat(value) || 0;
      const gstSlab = parseFloat(clientData.gst_slab) || 0;
      const gstAmount = principal * (gstSlab / 100);
      const total = principal + gstAmount;
      setClientData((prev: any) => ({
        ...prev,
        [name]: value,
        gst_amount: gstAmount.toFixed(2),
        total_amount: total.toFixed(2),
      }));
    } else setClientData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!clientData.name) return toast.error("Name is required");
    if (!clientData.email || !clientData.contact)
      return toast.error("Email and Contact required");
    if (!clientData.site_detail_id)
      return toast.error("Site selection is required");

    setLoading(true);
    try {
      const submitData = {
        ...clientData,
        password,
        admin_id: adminId,
        client_milestone_id,
      };
      const res = await editClient(
        submitData,
        originalData,
        removeAadhar ? null : aadharCard,
        removePan ? null : panCard
      );
      if (res.status === 200) {
        toast.success(res.message || "Client updated successfully!");
        navigate(-1);
      } else toast.error(res.message || "Failed to update client");
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || "Failed to update client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta title="Edit Client" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Edit Client">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <Label>Name</Label>
                <Input
                  name="name"
                  value={clientData.name}
                  onChange={handleChange}
                  placeholder="Enter client name"
                />
              </div>

              {/* Email */}
              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Input
                    name="email"
                    value={clientData.email}
                    onChange={handleChange}
                    placeholder="info@gmail.com"
                    type="email"
                    className="pl-[62px]"
                  />
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500">
                    <CiMail className="size-6" />
                  </span>
                </div>
              </div>

              {/* Contact */}
              <div>
                <Label>Contact Number</Label>
                <Input
                  name="contact"
                  value={clientData.contact}
                  onChange={handleChange}
                  placeholder="9876543210"
                />
              </div>

              {/* Address */}
              <div>
                <Label>Address</Label>
                <TextArea
                  value={clientData.address}
                  onChange={(val) =>
                    setClientData((prev: any) => ({ ...prev, address: val }))
                  }
                  rows={4}
                />
              </div>

              {/* Aadhar Card */}
              <div>
                <Label>Aadhar Card</Label>
                <div className="flex items-center gap-2">
                  <FileInput
                    id="aadharCardUpload"
                    onChange={(e) => {
                      setAadharCard(e.target.files?.[0] || null);
                      setRemoveAadhar(false);
                    }}
                  />
                  {existingAadharUrl && !aadharCard && !removeAadhar && (
                    <>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          window.open(
                            getImageUrl(existingAadharUrl),
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          setRemoveAadhar(true);
                          setAadharCard(null);
                        }}
                      >
                        Remove
                      </Button>
                    </>
                  )}
                  {removeAadhar && (
                    <p className="text-sm text-red-600 mt-1">
                      Aadhar will be removed
                    </p>
                  )}
                </div>
              </div>

              {/* PAN Card */}
              <div>
                <Label>PAN Card</Label>
                <div className="flex items-center gap-2">
                  <FileInput
                    id="panCardUpload"
                    onChange={(e) => {
                      setPanCard(e.target.files?.[0] || null);
                      setRemovePan(false);
                    }}
                  />
                  {existingPanUrl && !panCard && !removePan && (
                    <>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          window.open(
                            getImageUrl(existingPanUrl),
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          setRemovePan(true);
                          setPanCard(null);
                        }}
                      >
                        Remove
                      </Button>
                    </>
                  )}
                  {removePan && (
                    <p className="text-sm text-red-600 mt-1">
                      PAN will be removed
                    </p>
                  )}
                </div>
              </div>

              {/* Disabled fields */}
              <div>
                <Label>Selected Site</Label>
                <Input
                  name="site_name"
                  value={clientData.site_name}
                  disabled
                  className="disabledInput"
                />
              </div>
              <div>
                <Label>Unit Type</Label>
                <Input
                  name="unit_type"
                  value={clientData.unit_type}
                  disabled
                  className="disabledInput"
                />
              </div>
              <div>
                <Label>Block Number</Label>
                <Input
                  name="block_number"
                  value={clientData.block_number}
                  disabled
                  className="disabledInput"
                />
              </div>

              {/* Property & GST */}
              <div>
                <Label>Property Amount</Label>
                <Input
                  name="property_amount"
                  value={clientData.property_amount}
                  onChange={handleChange}
                  type="number"
                />
              </div>
              <div>
                <Label>GST Slab</Label>
                <Input
                  name="gst_slab"
                  value={clientData.gst_slab ? `${clientData.gst_slab}%` : ""}
                  disabled
                  className="disabledInput"
                />
              </div>
              <div>
                <Label>GST Amount</Label>
                <Input
                  name="gst_amount"
                  value={clientData.gst_amount}
                  disabled
                  className="disabledInput"
                />
              </div>
              <div>
                <Label>Total Amount</Label>
                <Input
                  name="total_amount"
                  value={clientData.total_amount}
                  disabled
                  className="disabledInput"
                />
              </div>

              {/* Password */}
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <FaRegEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Update Client"}
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditClient;
