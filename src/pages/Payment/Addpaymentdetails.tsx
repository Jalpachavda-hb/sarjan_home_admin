import React, { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import Button from "../../components/ui/button/Button";
import SiteSelector from "../../components/form/input/SelectSiteinput";

const Addpaymentdetails = () => {
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
      <PageMeta title="Add Payment Details" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        {/* Card 1: Payment Info */}
        <div className="space-y-6">
          <ComponentCard title="Add Payment Details">
            <div className="space-y-6">
              {/* Select Site */}
              {/* <div>
                <Label>Select Site</Label>
                <Select
                  options={siteOptions}
                  placeholder="Select a site"
                  className="dark:bg-dark-900"
                />
              </div> */}
              <SiteSelector
                onChange={(site) => setSelectedSite(site?.value || null)}
              />

              {/* Received Amount */}
              <div>
                <Label>Received Amount</Label>
                <Input type="number" placeholder="Enter amount" />
              </div>
              <div>
                <Label>Amount Type</Label>
                <Select
                  options={siteOptions}
                  placeholder="Select a site"
                  className="dark:bg-dark-900"
                />
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
                <Label>Upload Receipt</Label>
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

export default Addpaymentdetails;
