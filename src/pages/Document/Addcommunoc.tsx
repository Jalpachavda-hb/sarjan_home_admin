// import React from 'react'

// const Addcommunoc = () => {
//   return (
//     <div>Addcommunoc</div>
//   )
// }

// export default Addcommunoc

import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import SiteSelector from "../../components/form/input/SelectSiteinput";

import Button from "../../components/ui/button/Button";

const Addcommunoc = () => {
  const [receiptPreview, setReceiptPreview] = useState(null);
 const [selectedSite, setSelectedSite] = useState(null);
  // Dropdown options
  const siteOptions = [
    { value: "site1", label: "Site 1" },
    { value: "site2", label: "Site 2" },
    { value: "site3", label: "Site 3" },
  ];

  // File upload preview
  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      {/* Page Title */}
      <PageMeta title="Add CommunDocument Details" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        {/* Card 1: Payment Info */}
        <div className="space-y-6">
          <ComponentCard title="Add Commun Document Details">
            <div className="space-y-6">
              {/* Select Site */}
              <div>
               
                {/* <Select
                  options={siteOptions}
                  placeholder="Select a site"
                  className="dark:bg-dark-900"
                /> */}  <SiteSelector
                onChange={(site) => setSelectedSite(site?.value || null)}
              />
              </div>

              {/* Received Amount */}
              <div>
                <Label>Enter Document Name </Label>
                <Input placeholder="Enter amount" />
              </div>

              {/* Received Payment Date */}
            </div>
            <div>
              <Label>Upload Document </Label>
              <FileInput id="fileUpload" onChange={handleReceiptChange} />
              {/* {receiptPreview && (
                  <div className="mt-2 w-40 h-40 border rounded overflow-hidden">
                    <img
                      src={receiptPreview}
                      alt="Receipt Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )} */}
            </div>
          </ComponentCard>
        </div>

        {/* Card 2: Upload & Select Type */}
      </div>

      {/* Buttons */}
      <Button className="Submitbtn">Submit</Button>
      <Button className="canclebtn">Cancel</Button>
    </div>
  );
};

export default Addcommunoc;
