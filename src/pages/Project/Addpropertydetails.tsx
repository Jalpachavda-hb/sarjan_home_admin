// import React from 'react'

// const Addpropertydetails = () => {
//   return (
//     <div>Addpropertydetails</div>
//   )
// }

// export default Addpropertydetails
import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import Button from "../../components/ui/button/Button";
import SiteSelector from "../../components/form/input/SelectSiteinput";
const Addpropertydetails = () => {
  const [receiptPreview, setReceiptPreview] = useState(null);
 const [selectedSite, setSelectedSite] = useState(null);
  // Dropdown options
  const siteOptions = [
    { value: "site1", label: "Site 1" },
    { value: "site2", label: "Site 2" },
    { value: "site3", label: "Site 3" },
  ];

  const amountTypeOptions = [
    { value: "cash", label: "Cash" },
    { value: "bank", label: "Bank Transfer" },
    { value: "cheque", label: "Cheque" },
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
      <PageMeta title="Add Project Details" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        {/* Card 1: Payment Info */}
        <div className="space-y-6">
          <ComponentCard title="Add Property Details">
            <div className="space-y-6">
              {/* Select Site */}
              <div>
                 <SiteSelector
                onChange={(site) => setSelectedSite(site?.value || null)}
              />
              </div>
              <div>
                <Label>Unit </Label>
                <Input placeholder="Enter Block number" />
              </div>
              {/* Received Amount */}
              <div>
                <Label>Unit Number</Label>
                <Input type="number" placeholder="Enter Block Number" />
              </div>
              <div>
                <Label>Rera Area</Label>
                <Input type="number" placeholder="Enter Block Number" />
              </div>
              <div>
                <Label>Balcony Area</Label>
                <Input type="number" placeholder="Enter Balcony Area" />
              </div>
              <div>
                <Label>Wash Area</Label>
                <Input type="number" placeholder="Enter Wash Area" />
              </div>
              <div>
                <Label>Terrace Area (if)</Label>
                <Input type="number" placeholder="Enter Terrace Area" />
              </div>
               <div>
                <Label>Undivided Landshare</Label>
                <Input type="number" placeholder="Enter Undivided Landshare" />
              </div>
             
              {/* Received Payment Date */}
              <div>
                <Label>Received Payment Date</Label>
                <DatePicker
                  id="payment-date"
                  placeholder="Select payment date"
                  onChange={(dates, currentDateString) =>
                    console.log({ dates, currentDateString })
                  }
                />
              </div>
               <div>
                <Label>North : </Label>
                <Input placeholder="Enter North description" />
              </div>
               <div>
                <Label>East  : </Label>
                <Input placeholder="Enter East description" />
              </div>
               <div>
                <Label>West  : </Label>
                <Input placeholder="Enter West description" />
              </div>
               <div>
                <Label>South  : </Label>
                <Input placeholder="Enter South description" />
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Buttons */}
      <Button className="Submitbtn">Submit</Button>
      <Button className="canclebtn">Cancel</Button>
    </div>
  );
};

export default Addpropertydetails;
