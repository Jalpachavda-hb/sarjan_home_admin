import React, { useState } from "react";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import FileInput from "../components/form/input/FileInput";
import Button from "../components/ui/button/Button";
import Badge from "../components/ui/badge/Badge";
const WebSetting = () => {
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
          <ComponentCard title="Site Logo & Group Name">
            <div className="space-y-6">
              {/* Group Name */}
            

              {/* Logo Preview */}
              <Label>Logo preview:</Label>
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
                <Label htmlFor="logoUpload">Upload Logo</Label>
                  <FileInput id="fileUpload"  onChange={handleLogoChange} />
              
              </div>
                <div>
                <Label htmlFor="groupName">Group Name</Label>
                <Input type="text" id="groupName" placeholder="Enter group name" />
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Card 2: Favicon */}
        <div className="space-y-6">
          <ComponentCard title="Favicon Icon">
            <div className="space-y-6">
              {/* Favicon Preview */}
               <Label>Favicon icon preview:</Label>
              {faviconPreview && (
                // <div className="w-16 h-16 border rounded overflow-hidden">
                  <img
                    src={faviconPreview}
                    alt="Favicon Preview"
                    className="w-full h-full object-contain"
                  />
                // </div>
              )}

              {/* Upload Favicon */}
              <div>
                <Label htmlFor="faviconUpload">Upload Favicon</Label>
                  <FileInput id="fileUpload"  onChange={handleFaviconChange}/>
                {/* <input
                  type="file"
                  id="faviconUpload"
                  accept="image/*"
                  onChange={handleFaviconChange}
                /> */}
              </div>
            </div>
          </ComponentCard>
         
        </div>
      </div>
      <Button className="mt-3 bg-green-600  hover:bg-green-700" >Submit</Button>
      <Button className="canclebtn">Cancle</Button>
    </div>
  );
};

export default WebSetting;
