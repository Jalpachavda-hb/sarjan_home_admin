import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";

import Select from "../../components/form/Select";

import Button from "../../components/ui/button/Button";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const Addadminuser = () => {
  const [showPassword, setShowPassword] = useState(false);
  // Dropdown options
  const siteOptions = [
    { value: "site1", label: "Site 1" },
    { value: "site2", label: "Site 2" },
    { value: "site3", label: "Site 3" },
  ];

  // File upload preview

  return (
    <div>
      {/* Page Title */}
      <PageMeta title="" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        {/* Card 1: Payment Info */}
        <div className="space-y-6">
          <ComponentCard title="User Information">
            <div className="space-y-6">
              {/* Select Site */}
              <div>
                <Label>Name</Label>
                <Input placeholder="Enter amount" />
              </div>
              <div>
                <Label htmlFor="inputTwo">Email</Label>
                <Input type="text" id="inputTwo" placeholder="info@gmail.com" />
              </div>
              <div>
                <Label>Contact Number</Label>
                <Input placeholder="Enter amount" />
              </div>
              <div>
                <Label>Allocate Site/Project </Label>
                <Select
                  options={siteOptions}
                  placeholder="Select a site"
                  className="dark:bg-dark-900"
                  onChange={(val) => console.log(val)} // 👈 required handler
                />
              </div>

              <Label>Password Input</Label>
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
              </div>
              {/* Received Amount */}
              <div>
                <Label>Clients/Property</Label>
                <Select
                  options={siteOptions}
                  placeholder="Select a site"
                  className="dark:bg-dark-900"
                  onChange={(val) => console.log(val)}
                />
              </div>
              {/* Received Payment Date */}
            </div>
          </ComponentCard>
        </div>

        {/* Card 2: Upload & Select Type */}
        <div className="space-y-6">
          <ComponentCard title="User Permission">
            <div className="space-y-6">
              <div>
                <Label>User Log </Label>
                <Select
                  options={siteOptions}
                  placeholder="Select a site"
                  className="dark:bg-dark-900"
                  onChange={(val) => console.log(val)}
                />
              </div>
              <div>
                <Label>Property/Projects </Label>
                <Select
                  options={siteOptions}
                  placeholder="Select a site"
                  className="dark:bg-dark-900"
                  onChange={(val) => console.log(val)}
                />
              </div>
              <div>
                <Label>Admin Users</Label>
                <Select
                  options={siteOptions}
                  placeholder="Select a site"
                  className="dark:bg-dark-900"
                  onChange={(val) => console.log(val)}
                />
              </div>
              <div>
                <Label>Documents </Label>
                <Select
                  options={siteOptions}
                  placeholder="Select a site"
                  className="dark:bg-dark-900"
                  onChange={(val) => console.log(val)}
                />
              </div>
              <div>
                <Label>Reports</Label>
                <Select
                  options={siteOptions}
                  placeholder="Select a site"
                  className="dark:bg-dark-900"
                  onChange={(val) => console.log(val)}
                />
              </div>
              <div>
                <Label>Payment </Label>
                <Select
                  options={siteOptions}
                  placeholder="Select a site"
                  className="dark:bg-dark-900"
                  onChange={(val) => console.log(val)}
                />
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

export default Addadminuser;
