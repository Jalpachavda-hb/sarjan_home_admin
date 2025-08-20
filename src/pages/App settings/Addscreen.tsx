// import React from 'react'

// const Addscreen = () => {
//      const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setLogoPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleFaviconChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFaviconPreview(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div>Addscreen</div>
//   )
// }

// export default Addscreen

import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
const Addscreen = () => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFaviconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaviconPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      {/* Page Title */}
      <PageMeta title="Add Site Info" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Card 1: Logo & Group Name */}
        <div className="space-y-6">
          <ComponentCard title="Add New Splash Screen">
            <div className="space-y-6">
              {/* Group Name */}

              {/* Logo Preview */}
              <Label>preview:</Label>
              {logoPreview && (
                <div className="w-32 h-32 border rounded overflow-hidden">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Upload Logo */}
              <div>
                <Label htmlFor="logoUpload">Upload Image</Label>
                <FileInput id="fileUpload" onChange={handleLogoChange} />
              </div>
              <div>
                <Label htmlFor="groupName">Title</Label>
                <Input
                  type="text"
                  id="groupName"
                  placeholder="Enter splash screen Title"
                />
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>
      <Button className="mt-3 bg-green-600  hover:bg-green-700">Submit</Button>
      <Button className="canclebtn">Cancle</Button>
    </div>
  );
};

export default Addscreen;
