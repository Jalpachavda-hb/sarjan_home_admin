// import React from 'react'

// const Addsite = () => {
//   return (
//     <div>Addsite</div>
//   )
// }

// export default Addsite

import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import Select from "../../components/form/Select";

import Button from "../../components/ui/button/Button";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import TextArea from "../../components/form/input/TextArea";
import TitleDescriptionList from "../../components/form/form-elements/Dynamicgroup";
import DynamicInputFields from "../../components/form/form-elements/DynamicInputFields ";
import Dynamicgroup from "../../components/form/form-elements/Dynamicgroup";
const Addsite = () => {
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  // Dropdown options
  const siteOptions = [
    { value: "site1", label: "Ongoing site" },
    { value: "site2", label: "Completed project" },
  ];

  const sitecategory = [
    { value: "site1", label: "	Residential Commercial Mix" },
    { value: "site2", label: "	Commercial" },
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
      <PageMeta title="" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        {/* Card 1: Payment Info */}
        <div className="space-y-6">
          <ComponentCard title="Site Information">
            <div className="space-y-6">
              {/* Select Site */}
              <div>
                <Label>Select Project Type</Label>
                <Select
                  options={siteOptions}
                  placeholder="Select a site"
                  className="dark:bg-dark-900"
                />
              </div>
              <div>
                <Label>Select Project category</Label>
                <Select
                  options={sitecategory}
                  placeholder="Select a site"
                  className="dark:bg-dark-900"
                />
              </div>

              <div>
                <Label htmlFor="inputTwo">Title </Label>
                <Input type="text" id="inputTwo" placeholder="info@gmail.com" />
              </div>
              <div>
                <Label>Rera Number </Label>
                <Input placeholder="Enter amount" />
              </div>
              <div>
                <Label>BHK Details</Label>
                <Input placeholder="Enter BHK Details" />
              </div>

              <div>
                <Label>Description </Label>
                <TextArea />
              </div>
              <div>
                <Label>Google Map Link (iframe) </Label>
                <Input placeholder="Enter Google Map Link " />
              </div>
              <div>
                <Label>Youtube Video Link</Label>
                <Input placeholder="Enter Youtube Video Link" />
              </div>
              {/* <Label>Password Input</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <FaRegEye className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <FaEyeSlash className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </button>
              </div> */}
              {/* Received Amount */}
              {/* <div>
                <Label>Clients/Property</Label>
                <Select
                  options={siteOptions}
                  placeholder="Select a site"
                  className="dark:bg-dark-900"
                />
              </div> */}
              {/* Received Payment Date */}
            </div>
          </ComponentCard>
          {/* <ComponentCard title="Add Aminities">
            <TitleDescriptionList />
          </ComponentCard> */}
        </div>

        {/* Card 2: Upload & Select Type */}
        <div className="space-y-6">
          <ComponentCard title="Upload Images">
            <div className="space-y-6">
              <div>
                <Label>Banner Image</Label>
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
              <div>
                <Label>Gallery</Label>
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
              <div>
                <Label>Key Plan</Label>
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
              <div>
                <Label>Layout Plan </Label>
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
              <div>
                <Label>Floor Plan</Label>
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
              <div>
                <Label>Brochure</Label>
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
              <div>
                <Label>Rera Documents </Label>
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

          <ComponentCard title="Add Aminities">
            <DynamicInputFields />
          </ComponentCard>
          <ComponentCard title="Add Speciality">
            <Dynamicgroup />
          </ComponentCard>
        </div>
      </div>

      {/* Buttons */}
      <Button className="Submitbtn">Submit</Button>
      <Button className="canclebtn">Cancel</Button>
    </div>
  );
};

export default Addsite;
 