// import { useState } from "react";
// import { FiPlus, FiTrash2 } from "react-icons/fi";
// import Label from "../Label";
// import Input from "../input/InputField";

// interface Props {
//   onChange?: (data: string[]) => void;
// }

// const DynamicAmenities = ({ onChange }: Props) => {
//   const [inputs, setInputs] = useState([""]);

//   const handleAddInput = () => {
//     if (!inputs[0].trim())
//       return alert("Please fill the first amenity before adding more.");
//     setInputs([...inputs, ""]);
//   };

//   const handleInputChange = (index: number, value: string) => {
//     const updated = [...inputs];
//     updated[index] = value;
//     setInputs(updated);
//     onChange?.(updated);
//   };

//   const handleDeleteInput = (index: number) => {
//     const updated = inputs.filter((_, i) => i !== index);
//     setInputs(updated);
//     onChange?.(updated);
//   };

//   return (
//     <div className="font-[Poppins] text-gray-600">
//       <Label className="mb-1 block">Add Amenities</Label>
//       {inputs.map((input, index) => (
//         <div key={index} className="flex gap-2 mt-2 items-center w-full">
//           <div className="flex-1">
//             <Input
//               type="text"
//               value={input}
//               onChange={(e) => handleInputChange(index, e.target.value)}
//               placeholder="Enter Amenity"
//               className="w-full"
//             />
//           </div>

//           {index === inputs.length - 1 && (
//             <button
//               type="button"
//               onClick={handleAddInput}
//               className="flex items-center gap-1 px-3 py-2 border rounded text-blue-600 hover:bg-blue-50 transition whitespace-nowrap"
//             >
//               <FiPlus /> Add More
//             </button>
//           )}

//           {inputs.length > 1 && (
//             <button
//               type="button"
//               onClick={() => handleDeleteInput(index)}
//               className="px-3 py-2 border rounded text-red-500 hover:bg-red-50 transition"
//             >
//               <FiTrash2 />
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DynamicAmenities;


import { useState, useEffect } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Label from "../Label";
import Input from "../input/InputField";

interface Props {
  initialValues?: string[];
  onChange?: (data: string[]) => void;
}

const DynamicAmenities = ({ initialValues = [], onChange }: Props) => {
  const [inputs, setInputs] = useState([""]);

  useEffect(() => {
    if (initialValues.length > 0) {
      setInputs(initialValues);
    }
  }, [initialValues]);

  const handleAddInput = () => {
    if (!inputs[0].trim()) return alert("Please fill the first amenity before adding more.");
    setInputs([...inputs, ""]);
  };

  const handleInputChange = (index: number, value: string) => {
    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
    onChange?.(updated);
  };

  const handleDeleteInput = (index: number) => {
    const updated = inputs.filter((_, i) => i !== index);
    setInputs(updated);
    onChange?.(updated);
  };

  return (
    <div className="font-[Poppins] text-gray-600">
      <Label className="mb-1 block">Add Amenities</Label>
      {inputs.map((input, index) => (
        <div key={index} className="flex gap-2 mt-2 items-center w-full">
          <div className="flex-1">
            <Input
              type="text"
              value={input}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder="Enter Amenity"
              className="w-full"
            />
          </div>
          {index === inputs.length - 1 && (
            <button type="button" onClick={handleAddInput} className="flex items-center gap-1 px-3 py-2 border rounded text-blue-600 hover:bg-blue-50 transition whitespace-nowrap">
              <FiPlus /> Add More
            </button>
          )}
          {inputs.length > 1 && (
            <button type="button" onClick={() => handleDeleteInput(index)} className="px-3 py-2 border rounded text-red-500 hover:bg-red-50 transition">
              <FiTrash2 />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default DynamicAmenities;