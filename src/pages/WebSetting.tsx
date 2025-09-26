// import { useState, useEffect } from "react";
// import PageMeta from "../components/common/PageMeta";
// import ComponentCard from "../components/common/ComponentCard";
// import Label from "../components/form/Label";
// import Input from "../components/form/input/InputField";
// import FileInput from "../components/form/input/FileInput";
// import Button from "../components/ui/button/Button";
// import { updateWebSetting } from "../utils/Handlerfunctions/formEditHandlers";
// import { fetchWebSetting } from "../utils/Handlerfunctions/getdata";
// import { getAdminId } from "../utils/Handlerfunctions/getdata";
// const WebSetting = () => {
//   const [logoPreview, setLogoPreview] = useState(null);
//   const [faviconPreview, setFaviconPreview] = useState(null);
//   const [groupName, setGroupName] = useState("");
//   const [logoFile, setLogoFile] = useState<File | null>(null);
//   const [faviconFile, setFaviconFile] = useState<File | null>(null);

//   const handleUpdate = async () => {
//     try {
//       const adminId = getAdminId();
//       const updated = await updateWebSetting(
//         adminId,
//         groupName,
//         logoFile,
//         faviconFile
//       );

//       // update state from response
//       setGroupName(updated.group_name || groupName);
//       if (updated.logo) setLogoPreview(updated.logo);
//       if (updated.favicon) setFaviconPreview(updated.favicon);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setLogoFile(file);
//       setLogoPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFaviconFile(file);
//       setFaviconPreview(URL.createObjectURL(file));
//     }
//   };

//   useEffect(() => {
//     fetchWebSetting()
//       .then((data) => {
//         setGroupName(data.group_name || "");
//         setLogoPreview(data.logo || null);
//         setFaviconPreview(data.favicon || null);
//       })
//       .catch((err) => console.error("Error fetching web setting:", err));
//   }, []);

//   return (
//     <div>
//       <PageMeta title="Add Site Info" />

//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
//         {/* Card 1: Logo & Group Name */}
//         <div className="space-y-6">
//           <ComponentCard title="Site Logo & Group Name">
//             <div className="space-y-6">
//               <Label>Current Logo preview:</Label>
//               {logoPreview && (
//                 <div className="w-50 h-32 border rounded overflow-hidden">
//                   <img
//                     src={logoPreview}
//                     alt="Logo Preview"
//                     className="w-full h-full object-contain"
//                   />
//                 </div>
//               )}

//               <div>
//                 <Label htmlFor="logoUpload"> Upload Logo</Label>
//                 <FileInput id="logoUpload" onChange={handleLogoChange} />
//               </div>

//               <div>
//                 <Label htmlFor="groupName">Group Name</Label>
//                 <Input
//                   type="text"
//                   id="groupName"
//                   placeholder="Enter group name"
//                   value={groupName}
//                   onChange={(e) => setGroupName(e.target.value)}
//                 />
//               </div>
//             </div>
//           </ComponentCard>
//         </div>

//         {/* Card 2: Favicon */}
//         <div className="space-y-6">
//           <ComponentCard title="Favicon Icon">
//             <div className="space-y-6">
//               <Label>Current Favicon icon preview:</Label>

//               {faviconPreview && (
//                 <div className="w-50 h-32 border rounded overflow-hidden">
//                   <img
//                     src={faviconPreview}
//                     alt="Favicon Preview"
//                     className="w-full h-full object-contain"
//                   />
//                 </div>
//               )}
//               <div>
//                 <Label htmlFor="faviconUpload">Upload Favicon</Label>
//                 <FileInput id="faviconUpload" onChange={handleFaviconChange} />
//               </div>
//             </div>
//           </ComponentCard>
//         </div>
//       </div>

//       <Button
//         className="mt-3 bg-green-600 hover:bg-green-700"
//         onClick={handleUpdate}
//       >
//         Update
//       </Button>
//       <Button className="canclebtn">Cancel</Button>
//     </div>
//   );
// };

// export default WebSetting;




import { useState, useEffect } from "react";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import FileInput from "../components/form/input/FileInput";
import Button from "../components/ui/button/Button";
import { updateWebSetting } from "../utils/Handlerfunctions/formEditHandlers";
import { fetchWebSetting } from "../utils/Handlerfunctions/getdata";
import { getAdminId } from "../utils/Handlerfunctions/getdata";

const WebSetting = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  const [errors, setErrors] = useState({
    groupName: "",
    logoFile: "",
    faviconFile: "",
  });

  const validateField = (field: string, value: any) => {
    let errorMsg = "";
    switch (field) {
      case "groupName":
        if (!value.trim()) errorMsg = "Group name is required";
        break;
      case "logoFile":
        if (!value) errorMsg = "Logo file is required";
        break;
      case "faviconFile":
        if (!value) errorMsg = "Favicon file is required";
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    return errorMsg === "";
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setLogoFile(file || null);
    setLogoPreview(file ? URL.createObjectURL(file) : null);
    validateField("logoFile", file);
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFaviconFile(file || null);
    setFaviconPreview(file ? URL.createObjectURL(file) : null);
    validateField("faviconFile", file);
  };

  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGroupName(value);
    validateField("groupName", value);
  };

  const handleUpdate = async () => {
    const isGroupValid = validateField("groupName", groupName);
    const isLogoValid = validateField("logoFile", logoFile);
    const isFaviconValid = validateField("faviconFile", faviconFile);

    if (!isGroupValid || !isLogoValid || !isFaviconValid) return;

    try {
      const adminId = getAdminId();
      const updated = await updateWebSetting(adminId, groupName, logoFile, faviconFile);

      // update state from response
      setGroupName(updated.group_name || groupName);
      if (updated.logo) setLogoPreview(updated.logo);
      if (updated.favicon) setFaviconPreview(updated.favicon);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWebSetting()
      .then((data) => {
        setGroupName(data.group_name || "");
        setLogoPreview(data.logo || null);
        setFaviconPreview(data.favicon || null);
      })
      .catch((err) => console.error("Error fetching web setting:", err));
  }, []);

  return (
    <div>
      <PageMeta title="Add Site Info" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        {/* Card 1: Logo & Group Name */}
        <div className="space-y-6">
          <ComponentCard title="Site Logo & Group Name">
            <div className="space-y-6">
              <Label>Current Logo preview:</Label>
              {logoPreview && (
                <div className="w-50 h-32 border rounded overflow-hidden">
                  <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                </div>
              )}

              <div>
                <Label htmlFor="logoUpload"> Upload Logo <span className="text-red-500">*</span> </Label>
                <FileInput id="logoUpload" onChange={handleLogoChange} />
                {errors.logoFile && <p className="text-red-500 text-sm mt-1">{errors.logoFile}</p>}
              </div>

              <div>
                <Label htmlFor="groupName">Group Name <span className="text-red-500">*</span></Label>
                <Input
                  type="text"
                  id="groupName"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={handleGroupNameChange}
                  error={!!errors.groupName}
                />
                {errors.groupName && <p className="text-red-500 text-sm mt-1">{errors.groupName}</p>}
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Card 2: Favicon */}
        <div className="space-y-6">
          <ComponentCard title="Favicon Icon">
            <div className="space-y-6">
              <Label>Current Favicon icon preview:</Label>
              {faviconPreview && (
                <div className="w-50 h-32 border rounded overflow-hidden">
                  <img src={faviconPreview} alt="Favicon Preview" className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <Label htmlFor="faviconUpload">Upload Favicon <span className="text-red-500">*</span> </Label>
                <FileInput id="faviconUpload" onChange={handleFaviconChange} />
                {errors.faviconFile && <p className="text-red-500 text-sm mt-1">{errors.faviconFile}</p>}
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      <Button className="mt-3 bg-green-600 hover:bg-green-700" onClick={handleUpdate}>
        Update
      </Button>
  
    </div>
  );
};

export default WebSetting;
