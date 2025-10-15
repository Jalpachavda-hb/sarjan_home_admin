// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";

// import ComponentCard from "../../components/common/ComponentCard";
// import Label from "../../components/form/Label";
// import Input from "../../components/form/input/InputField";

// import Button from "../../components/ui/button/Button";
// import Select from "../../components/form/Select";
// import { CiMail } from "react-icons/ci";
// import MultiSelect from "../../components/form/MultiSelect";
// import { validateContact } from "../../utils/Validation";
// import {
//   fetchUnitType,
//   getClientName,
//  getBlockFromSiteId

// } from "../../utils/Handlerfunctions/getdata";
// import AccessDenied from "../../components/ui/AccessDenied";
// import { usePermissions } from "../../hooks/usePermissions";
// import { addNewClient } from "../../utils/Handlerfunctions/formSubmitHandlers";

// type ClientErrors = {
//   name?: string;
//   email?: string;
//   contact?: string;
//   client_type?: string;
//   existing_client_id?: string;
//   unit_type?: string;
//   block_id?: string;
//   block_detail_id?: string;
//   property_amount?: string;
//   gst_slab?: string;
//   submit?: string;
// };

// interface ClientData {
//   site_detail_id: string;
//   name: string;
//   email: string;
//   contact: string;
//   address: string;
//   unit_type: string;
//   block_id: string;
//   block_detail_id: string[];
//   property_amount: string;
//   gst_slab: string;
//   gst_amount: string;
//   total_amount: string;
//   client_type: string;
//   existing_client_id: string;
// }

// type Option = { label: string; value: string | number };

// const Addnewclient: React.FC = () => {
//   const navigate = useNavigate();
//   const params = useParams();
//   const location = useLocation();

//   const resolveSiteId = (): string | null => {
//     if (params.siteId) return params.siteId;
//     if (params.id) return params.id;
//     if ((params as any).site_id) return (params as any).site_id;
//     const qp = new URLSearchParams(location.search).get("site_id");
//     if (qp) return qp;
//     const parts = location.pathname.split("/").filter(Boolean);
//     const last = parts[parts.length - 1];
//     if (last === "addnewclient" && parts.length >= 2) {
//       return parts[parts.length - 2];
//     }
//     return null;
//   };

//   const initialSiteId = resolveSiteId();
//   const [errors, setErrors] = useState<ClientErrors>({});
//   const [loading, setLoading] = useState(false);
//   const [unitTypes, setUnitTypes] = useState<Option[]>([]);
//   const [clients, setClients] = useState<Option[]>([]);
//   const [blocks, setBlocks] = useState<Option[]>([]);
//   const [blockDetails, setBlockDetails] = useState<
//     { label: string; value: number }[]
//   >([]);
//   const [siteId] = useState<string | null>(initialSiteId);

// const [clientData, setClientData] = useState<ClientData>({
//   site_detail_id: initialSiteId ?? "",
//   name: "",
//   email: "",
//   contact: "",
//   address: "",
//   unit_type: "",
//   block_id: "",
//   block_detail_id: [],
//   property_amount: "",
//   gst_slab: "",
//   gst_amount: "",
//   total_amount: "",
//   client_type: "1",
//   existing_client_id: "",
// });

//   const [aadharCard] = useState<File | null>(null);
//   const [panCard] = useState<File | null>(null);

//   // Safe select handler
//   const handleSelectChange = (field: string) => (val: any) => {
//     const finalVal =
//       val && typeof val === "object" && "value" in val ? val.value : val;
//     setClientData((prev: any) => ({ ...prev, [field]: finalVal }));
//   };
//   const {  canView , loading: permissionLoading } = usePermissions();
//    const canViewClient = canView ("Clients")
//   // const canCreateClient = canCreate("Clients");
//   // const canEditClient = canEdit("Clients");

//   // Load unit types + clients
// useEffect(() => {
//   let mounted = true;
//   const load = async () => {
//     try {
//       const [u, c] = await Promise.all([fetchUnitType(), getClientName()]);
//       if (!mounted) return;
      
//       // Transform data to use string values only
//       const transformedUnitTypes = u.map((item: any) => ({
//         value: String(item.value),
//         label: item.label,
//       }));

//       const transformedClients = c.map((client: any) => ({
//         value: String(client.value),
//         label: client.label,
//       }));

//       setUnitTypes(transformedUnitTypes);
//       setClients(transformedClients);
//     } catch (e) {
//       console.error("Error loading dropdowns:", e);
//     }
//   };
//   load();
//   return () => {
//     mounted = false;
//   };
// }, []);
//   // Load blocks from siteId
//   // useEffect(() => {
//   //   if (!siteId) return;
//   //   setClientData((prev: any) => ({ ...prev, site_detail_id: siteId }));
//   //   let mounted = true;
//   //   const fetchBlocks = async () => {
//   //     try {
//   //       const data = await getBlockFromSiteId(siteId);
//   //       if (!mounted) return;
//   //       setBlocks(data);
//   //     } catch (err) {
//   //       console.error("Error fetching blocks:", err);
//   //       setBlocks([]);
//   //     }
//   //   };
//   //   fetchBlocks();
//   //   return () => {
//   //     mounted = false;
//   //   };
//   // }, [siteId]);

//   // Fetch block numbers when block_id changes
//  useEffect(() => {
//   if (!siteId) return;
//   setClientData((prev: any) => ({ ...prev, site_detail_id: siteId }));
//   let mounted = true;
//   const fetchBlocks = async () => {
//     try {
//       const data = await getBlockFromSiteId(siteId); // You need to import this
//       if (!mounted) return;
      
//       // Transform blocks to use string values
//       const transformedBlocks = data.map((block: any) => ({
//         value: String(block.value),
//         label: block.label,
//       }));
      
//       setBlocks(transformedBlocks);
//     } catch (err) {
//       console.error("Error fetching blocks:", err);
//       setBlocks([]);
//     }
//   };
//   fetchBlocks();
//   return () => {
//     mounted = false;
//   };
// }, [siteId]);
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     let finalValue = value;

//     if (name === "contact") {
//       finalValue = value.replace(/\D/g, "").slice(0, 10);
//     }

//     setClientData((prev: any) => ({ ...prev, [name]: finalValue }));

//     // Individual field validation
//     let error: string | undefined;
//     switch (name) {
//       case "name":
//         if (!finalValue) error = "Name is required";
//         break;

//       case "contact":
//         if (!finalValue) error = "Contact is required";
//         else if (finalValue.length !== 10) error = "Contact must be 10 digits";
//         break;
//       case "property_amount":
//         if (finalValue && Number(finalValue) <= 0)
//           error = "Amount must be positive";
//         break;
//     }

//     setErrors((prev) => ({ ...prev, [name]: error }));
//   };

//   const handleSubmit = async () => {
//     const newErrors: ClientErrors = {};

//     // Validate all fields
//     if (!clientData.client_type)
//       newErrors.client_type = "Client type is required";

//     if (clientData.client_type === "1") {
//       if (!clientData.name) newErrors.name = "Name is required";

//       const contactError = validateContact(clientData.contact);
//       if (!clientData.contact) newErrors.contact = "Contact is required";
//       else if (contactError) newErrors.contact = contactError;
//     } else if (clientData.client_type === "2") {
//       if (!clientData.existing_client_id)
//         newErrors.existing_client_id = "Select existing client";
//     }

//     if (!clientData.unit_type) newErrors.unit_type = "Unit type is required";
//     if (clientData.unit_type && !clientData.block_id)
//       newErrors.block_id = "Select block/shop";
//     if (blockDetails.length && clientData.block_detail_id.length === 0)
//       newErrors.block_detail_id = "Select at least one block number";
//     if (clientData.property_amount && Number(clientData.property_amount) <= 0)
//       newErrors.property_amount = "Property amount must be positive";
//     if (clientData.property_amount && !clientData.gst_slab)
//       newErrors.gst_slab = "GST slab is required";

//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) return;

//     setLoading(true);
//     try {
//       const res = await addNewClient(clientData, aadharCard, panCard);
//       if (res) navigate(-1);
//     } catch (e) {
//       console.error("Submit error:", e);
//       setErrors({ submit: "Failed to create client. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (permissionLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!canViewClient) {
//     return (
//       <AccessDenied message="You don't have permission to view clients." />
//     );
//   }

//   return (
//     <div>
     
//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
//         <div className="space-y-6">
//           <ComponentCard title="Add Client">
//             <div className="space-y-6">
//               {/* Client Type */}
//               <div>
//                 <Label>
//                   Client Type <span className="text-red-500">*</span>
//                 </Label>
//                 <Select
//                   options={[
//                     { value: "1", label: "New Client" },
//                     { value: "2", label: "Existing Client" },
//                   ]}
//                   value={clientData.client_type}
//                   onChange={(val: any) =>
//                     setClientData((prev: any) => ({
//                       ...prev,
//                       client_type: typeof val === "object" ? val.value : val,
//                     }))
//                   }
//                   placeholder="Select Client Type"
//                 />
//                 {errors.client_type && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.client_type}
//                   </p>
//                 )}
//               </div>

//               {/* New Client */}
//               {clientData.client_type === "1" && (
//                 <>
//                   <div>
//                     <Label>
//                       Name <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       name="name"
//                       value={clientData.name}
//                       onChange={handleChange}
//                     />
//                     {errors.name && (
//                       <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//                     )}
//                   </div>
//                   <div>
//                     <Label>Email</Label>
//                     <div className="relative">
//                       <Input
//                         name="email"
//                         value={clientData.email}
//                         onChange={handleChange}
//                         placeholder="info@gmail.com"
//                         type="text"
//                         className="pl-[62px]"
//                       />
//                       <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
//                         <CiMail className="size-6" />
//                       </span>
//                     </div>
//                   </div>
//                   <div>
//                     <Label>
//                       Contact Number <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       name="contact"
//                       value={clientData.contact}
//                       onChange={handleChange}
//                       placeholder="9876543210"
//                     />
//                     {errors.contact && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.contact}
//                       </p>
//                     )}
//                   </div>
//                 </>
//               )}

//               {/* Existing Client */}
//               {clientData.client_type === "2" && (
//                 <div>
//                   <Label>
//                     Select Client Name <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     options={clients}
//                     value={clientData.existing_client_id}
//                     onChange={handleSelectChange("existing_client_id")}
//                     placeholder="Select Existing Client"
//                   />
//                   {errors.existing_client_id && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.existing_client_id}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* Unit Type */}
//               <div>
//                 <Label>
//                   Unit Type <span className="text-red-500">*</span>
//                 </Label>
//                 <Select
//                   options={unitTypes}
//                   value={clientData.unit_type}
//                   onChange={handleSelectChange("unit_type")}
//                   placeholder="Select Unit Type"
//                 />
//                 {errors.unit_type && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.unit_type}
//                   </p>
//                 )}
//               </div>

//               {/* Block/Shop */}
//               {clientData.unit_type && (
//                 <div>
//                   <Label>
//                     Block/Shop <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     options={blocks}
//                     value={clientData.block_id}
//                     onChange={handleSelectChange("block_id")}
//                     placeholder="Select Block"
//                   />
//                   {errors.block_id && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.block_id}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* Block Numbers */}
//               {blockDetails.length > 0 && (
//                 <div>
//                   <Label>
//                     Block Numbers <span className="text-red-500">*</span>
//                   </Label>
//                   <MultiSelect
//                   label=""
//                     options={blockDetails.map((o) => ({
//                       value: String(o.value),
//                       text: o.label,
//                     }))}
//                     onChange={(selected: string[]) =>
//                       setClientData((prev) => ({
//                         ...prev,
//                         block_detail_id: selected,
//                       }))
//                     }
//                   />
//                   {errors.block_detail_id && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.block_detail_id}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* Property Amount */}
//               <div>
//                 <Label>
//                   Property Amount <span className="text-red-500">*</span>{" "}
//                 </Label>
//                 <Input
//                   name="property_amount"
//                   value={clientData.property_amount}
//                   onChange={handleChange}
//                   placeholder="50000"
//                   type="number"
//                 />
//                 {errors.property_amount && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.property_amount}
//                   </p>
//                 )}
//               </div>

//               {/* GST Slab */}
//               {clientData.property_amount && (
//                 <div>
//                   <Label>
//                     GST Slab <span className="text-red-500">*</span>
//                   </Label>
//                   <Select
//                     options={[
//                       { value: "1", label: "1%" },
//                       { value: "5", label: "5%" },
//                     ]}
//                     value={clientData.gst_slab}
//                     onChange={(val: any) => {
//                       const slab = typeof val === "object" ? val.value : val;
//                       const principal = parseFloat(
//                         clientData.property_amount || "0"
//                       );
//                       const gstAmount = principal * (parseFloat(slab) / 100);
//                       const total = principal + gstAmount;
//                       setClientData((prev) => ({
//                         ...prev,
//                         gst_slab: slab,
//                         gst_amount: gstAmount.toFixed(2),
//                         total_amount: total.toFixed(2),
//                       }));
//                     }}
//                     placeholder="Select GST Slab"
//                   />
//                   {errors.gst_slab && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.gst_slab}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {clientData.gst_slab && (
//                 <>
//                   <div>
//                     <Label>GST Amount </Label>
//                     <Input
//                       name="gst_amount"
//                       disabled
//                       className="disabledInput"
//                       value={clientData.gst_amount}
//                     />
//                   </div>
//                   <div>
//                     <Label>Total Amount</Label>
//                     <Input
//                       name="total_amount"
//                       disabled
//                       className="disabledInput"
//                       value={clientData.total_amount}
//                     />
//                   </div>
//                 </>
//               )}
//             </div>
//           </ComponentCard>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="mt-6 flex gap-4">
//         <Button onClick={handleSubmit} disabled={loading}>
//           {loading ? "Submitting..." : "Submit"}
//         </Button>
//         <Button variant="secondary" onClick={() => navigate(-1)}>
//           Cancel
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Addnewclient;



import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";

import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import { CiMail } from "react-icons/ci";
import MultiSelect from "../../components/form/MultiSelect";
import { validateContact } from "../../utils/Validation";
import {
  fetchUnitType,
  getClientName,
  getBlockFromSiteId
} from "../../utils/Handlerfunctions/getdata";
import AccessDenied from "../../components/ui/AccessDenied";
import { usePermissions } from "../../hooks/usePermissions";
import { addNewClient } from "../../utils/Handlerfunctions/formSubmitHandlers";

type ClientErrors = {
  name?: string;
  email?: string;
  contact?: string;
  client_type?: string;
  existing_client_id?: string;
  unit_type?: string;
  block_id?: string;
  block_detail_id?: string;
  property_amount?: string;
  gst_slab?: string;
  submit?: string;
};

interface ClientData {
  site_detail_id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  unit_type: string;
  block_id: string;
  block_detail_id: string[];
  property_amount: string;
  gst_slab: string;
  gst_amount: string;
  total_amount: string;
  client_type: string;
  existing_client_id: string;
}

type Option = { label: string; value: string };

const Addnewclient: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const resolveSiteId = (): string | null => {
    if (params.siteId) return params.siteId;
    if (params.id) return params.id;
    if ((params as any).site_id) return (params as any).site_id;
    const qp = new URLSearchParams(location.search).get("site_id");
    if (qp) return qp;
    const parts = location.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (last === "addnewclient" && parts.length >= 2) {
      return parts[parts.length - 2];
    }
    return null;
  };

  const initialSiteId = resolveSiteId();
  const [errors, setErrors] = useState<ClientErrors>({});
  const [loading, setLoading] = useState(false);
  const [unitTypes, setUnitTypes] = useState<Option[]>([]);
  const [clients, setClients] = useState<Option[]>([]);
  const [blocks, setBlocks] = useState<Option[]>([]);
  const [blockDetails, setBlockDetails] = useState<Option[]>([]);
  const [siteId] = useState<string | null>(initialSiteId);

  const [clientData, setClientData] = useState<ClientData>({
    site_detail_id: initialSiteId ?? "",
    name: "",
    email: "",
    contact: "",
    address: "",
    unit_type: "",
    block_id: "",
    block_detail_id: [],
    property_amount: "",
    gst_slab: "",
    gst_amount: "",
    total_amount: "",
    client_type: "1",
    existing_client_id: "",
  });

  const [aadharCard] = useState<File | null>(null);
  const [panCard] = useState<File | null>(null);

  const { canView, loading: permissionLoading } = usePermissions();
  const canViewClient = canView("Clients");

  // Load unit types + clients
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [u, c] = await Promise.all([fetchUnitType(), getClientName()]);
        if (!mounted) return;
        
        // Transform data to use string values only
        const transformedUnitTypes = u.map((item: any) => ({
          value: String(item.value),
          label: item.label,
        }));

        const transformedClients = c.map((client: any) => ({
          value: String(client.value),
          label: client.label,
        }));

        setUnitTypes(transformedUnitTypes);
        setClients(transformedClients);
      } catch (e) {
        console.error("Error loading dropdowns:", e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Load blocks from siteId
  useEffect(() => {
    if (!siteId) return;
    setClientData((prev: ClientData) => ({ ...prev, site_detail_id: siteId }));
    let mounted = true;
    const fetchBlocks = async () => {
      try {
        const data = await getBlockFromSiteId(siteId);
        if (!mounted) return;
        
        // Transform blocks to use string values
        const transformedBlocks = data.map((block: any) => ({
          value: String(block.value),
          label: block.label,
        }));
        
        setBlocks(transformedBlocks);
      } catch (err) {
        console.error("Error fetching blocks:", err);
        setBlocks([]);
      }
    };
    fetchBlocks();
    return () => {
      mounted = false;
    };
  }, [siteId]);

  // Fetch block numbers when block_id changes
  useEffect(() => {
    if (!clientData.block_id) return;
    const fetchBlockDetails = async () => {
      try {
        const data = await getBlockFromSiteId(clientData.block_id);
        // Transform block details to use string values
        const transformedBlockDetails = data.map((block: any) => ({
          value: String(block.value),
          label: block.label,
        }));
        setBlockDetails(transformedBlockDetails);
      } catch (err) {
        console.error("Error fetching block details:", err);
        setBlockDetails([]);
      }
    };
    fetchBlockDetails();
  }, [clientData.block_id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === "contact") {
      finalValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setClientData((prev: ClientData) => ({ ...prev, [name]: finalValue }));

    // Individual field validation
    let error: string | undefined;
    switch (name) {
      case "name":
        if (!finalValue) error = "Name is required";
        break;
      case "contact":
        if (!finalValue) error = "Contact is required";
        else if (finalValue.length !== 10) error = "Contact must be 10 digits";
        break;
      case "property_amount":
        if (finalValue && Number(finalValue) <= 0)
          error = "Amount must be positive";
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSelectChange = (field: keyof ClientData) => (value: string) => {
    setClientData((prev: ClientData) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const newErrors: ClientErrors = {};

    // Validate all fields
    if (!clientData.client_type)
      newErrors.client_type = "Client type is required";

    if (clientData.client_type === "1") {
      if (!clientData.name) newErrors.name = "Name is required";

      const contactError = validateContact(clientData.contact);
      if (!clientData.contact) newErrors.contact = "Contact is required";
      else if (contactError) newErrors.contact = contactError;
    } else if (clientData.client_type === "2") {
      if (!clientData.existing_client_id)
        newErrors.existing_client_id = "Select existing client";
    }

    if (!clientData.unit_type) newErrors.unit_type = "Unit type is required";
    if (clientData.unit_type && !clientData.block_id)
      newErrors.block_id = "Select block/shop";
    if (blockDetails.length > 0 && clientData.block_detail_id.length === 0)
      newErrors.block_detail_id = "Select at least one block number";
    if (clientData.property_amount && Number(clientData.property_amount) <= 0)
      newErrors.property_amount = "Property amount must be positive";
    if (clientData.property_amount && !clientData.gst_slab)
      newErrors.gst_slab = "GST slab is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await addNewClient(clientData, aadharCard, panCard);
      if (res) navigate(-1);
    } catch (e) {
      console.error("Submit error:", e);
      setErrors({ submit: "Failed to create client. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (permissionLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!canViewClient) {
    return (
      <AccessDenied message="You don't have permission to view clients." />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Add Client">
            <div className="space-y-6">
              {/* Client Type */}
              <div>
                <Label>
                  Client Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  options={[
                    { value: "1", label: "New Client" },
                    { value: "2", label: "Existing Client" },
                  ]}
                  value={clientData.client_type}
                  onChange={handleSelectChange("client_type")}
                  placeholder="Select Client Type"
                />
                {errors.client_type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.client_type}
                  </p>
                )}
              </div>

              {/* New Client */}
              {clientData.client_type === "1" && (
                <>
                  <div>
                    <Label>
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      name="name"
                      value={clientData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="relative">
                      <Input
                        name="email"
                        value={clientData.email}
                        onChange={handleChange}
                        placeholder="info@gmail.com"
                        type="text"
                        className="pl-[62px]"
                      />
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        <CiMail className="size-6" />
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label>
                      Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      name="contact"
                      value={clientData.contact}
                      onChange={handleChange}
                      placeholder="9876543210"
                    />
                    {errors.contact && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.contact}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Existing Client */}
              {clientData.client_type === "2" && (
                <div>
                  <Label>
                    Select Client Name <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    options={clients}
                    value={clientData.existing_client_id}
                    onChange={handleSelectChange("existing_client_id")}
                    placeholder="Select Existing Client"
                  />
                  {errors.existing_client_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.existing_client_id}
                    </p>
                  )}
                </div>
              )}

              {/* Unit Type */}
              <div>
                <Label>
                  Unit Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  options={unitTypes}
                  value={clientData.unit_type}
                  onChange={handleSelectChange("unit_type")}
                  placeholder="Select Unit Type"
                />
                {errors.unit_type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.unit_type}
                  </p>
                )}
              </div>

              {/* Block/Shop */}
              {clientData.unit_type && (
                <div>
                  <Label>
                    Block/Shop <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    options={blocks}
                    value={clientData.block_id}
                    onChange={handleSelectChange("block_id")}
                    placeholder="Select Block"
                  />
                  {errors.block_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.block_id}
                    </p>
                  )}
                </div>
              )}

              {/* Block Numbers */}
              {blockDetails.length > 0 && (
                <div>
                  <Label>
                    Block Numbers <span className="text-red-500">*</span>
                  </Label>
                  <MultiSelect
                    label=""
                    options={blockDetails.map((o) => ({
                      value: o.value,
                      text: o.label,
                    }))}
                    onChange={(selected: string[]) =>
                      setClientData((prev: ClientData) => ({
                        ...prev,
                        block_detail_id: selected,
                      }))
                    }
                  />
                  {errors.block_detail_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.block_detail_id}
                    </p>
                  )}
                </div>
              )}

              {/* Property Amount */}
              <div>
                <Label>
                  Property Amount <span className="text-red-500">*</span>{" "}
                </Label>
                <Input
                  name="property_amount"
                  value={clientData.property_amount}
                  onChange={handleChange}
                  placeholder="50000"
                  type="number"
                />
                {errors.property_amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.property_amount}
                  </p>
                )}
              </div>

              {/* GST Slab */}
              {clientData.property_amount && (
                <div>
                  <Label>
                    GST Slab <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    options={[
                      { value: "1", label: "1%" },
                      { value: "5", label: "5%" },
                    ]}
                    value={clientData.gst_slab}
                    onChange={(value: string) => {
                      const principal = parseFloat(clientData.property_amount || "0");
                      const gstAmount = principal * (parseFloat(value) / 100);
                      const total = principal + gstAmount;
                      setClientData((prev: ClientData) => ({
                        ...prev,
                        gst_slab: value,
                        gst_amount: gstAmount.toFixed(2),
                        total_amount: total.toFixed(2),
                      }));
                    }}
                    placeholder="Select GST Slab"
                  />
                  {errors.gst_slab && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.gst_slab}
                    </p>
                  )}
                </div>
              )}

              {clientData.gst_slab && (
                <>
                  <div>
                    <Label>GST Amount </Label>
                    <Input
                      name="gst_amount"
                      disabled
                      className="disabledInput"
                      value={clientData.gst_amount}
                    />
                  </div>
                  <div>
                    <Label>Total Amount</Label>
                    <Input
                      name="total_amount"
                      disabled
                      className="disabledInput"
                      value={clientData.total_amount}
                    />
                  </div>
                </>
              )}
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Addnewclient;