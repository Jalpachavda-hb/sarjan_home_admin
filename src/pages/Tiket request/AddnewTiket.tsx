// import React, { useState } from "react";
// import PageMeta from "../../components/common/PageMeta";
// import ComponentCard from "../../components/common/ComponentCard";
// import Label from "../../components/form/Label";
// import Input from "../../components/form/input/InputField";

// import Select from "../../components/form/Select";

// import Button from "../../components/ui/button/Button";

// import TextArea from "../../components/form/input/TextArea";


// const AddnewTiket = () => {
//   const [receiptPreview, setReceiptPreview] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   // Dropdown options
//   const siteOptions = [
//     { value: "site1", label: "Ongoing site" },
//     { value: "site2", label: "Completed project" },
//   ];

//   const sitecategory = [
//     { value: "site1", label: "	Residential Commercial Mix" },
//     { value: "site2", label: "	Commercial" },
//   ];

//   // File upload preview
//   const handleReceiptChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setReceiptPreview(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div>
//       {/* Page Title */}
//       <PageMeta title="" />

//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
//         {/* Card 1: Payment Info */}
//         <div className="space-y-6">
//           <ComponentCard title="Add Tiket">
//             <div className="space-y-6">
//               {/* Select Site */}
//               <div>
//                 <Label>Select Project Type</Label>
//                 <Select
//                   options={siteOptions}
//                   placeholder="Select a site"
//                   className="dark:bg-dark-900"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="inputTwo">Title </Label>
//                 <Input type="text" id="inputTwo" placeholder="Enter Title" />
//               </div>

//               <div>
//                 <Label>Description </Label>
//                 <TextArea />
//               </div>
//             </div>
//           </ComponentCard>
//         </div>

//         {/* Card 2: Upload & Select Type */}
//       </div>

//       {/* Buttons */}
//       <Button className="Submitbtn">Submit</Button>
//       <Button className="canclebtn">Cancel</Button>
//     </div>
//   );
// };

// export default AddnewTiket;



import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import TextArea from "../../components/form/input/TextArea";

const AddnewTiket = () => {
  // Dropdown options
  const siteOptions = [
    { value: "site1", label: "Ongoing site" },
    { value: "site2", label: "Completed project" },
  ];

  return (
    <div>
      {/* Page Title */}
      <PageMeta title="Add New Ticket" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Add Ticket">
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

              {/* Title Input */}
              <div>
                <Label htmlFor="inputTwo">Title</Label>
                <Input type="text" id="inputTwo" placeholder="Enter Title" />
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <TextArea placeholder="Enter description" />
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <Button className="Submitbtn">Submit</Button>
        <Button className="canclebtn">Cancel</Button>
      </div>
    </div>
  );
};

export default AddnewTiket;
