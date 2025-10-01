import { useState, useEffect } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Label from "../Label";
import Input from "../input/InputField";
import TextArea from "../input/TextArea";

export interface SpecialityField {
  icon: string;
  title: string;
  description: string;
}

interface Props {
  initialValues?: SpecialityField[];
  onChange?: (data: SpecialityField[]) => void;
}

const DynamicSpeciality = ({ initialValues = [], onChange }: Props) => {
  const [fields, setFields] = useState<SpecialityField[]>([{ icon: "", title: "", description: "" }]);

  // Update state if initialValues change (important for edit mode)
  useEffect(() => {
    if (initialValues.length > 0) {
      setFields(initialValues);
    }
  }, [initialValues]);

  const handleFieldChange = (index: number, key: keyof SpecialityField, value: string) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
    onChange?.(updated);
  };

  const handleAddField = () => setFields([...fields, { icon: "", title: "", description: "" }]);
  const handleDeleteField = (index: number) => {
    const updated = fields.filter((_, i) => i !== index);
    setFields(updated);
    onChange?.(updated);
  };

  return (
    <div className="font-[Poppins] text-gray-600">
      <Label className="mb-1 block">Add Speciality</Label>

      {fields.map((field, index) => (
        <div key={index} className="flex flex-col gap-2 mt-2 w-full border p-3 rounded-md">
          <Input
            type="text"
            value={field.icon}
            onChange={(e) => handleFieldChange(index, "icon", e.target.value)}
            placeholder="Enter Icon Name"
            className="w-full"
          />
          <Input
            type="text"
            value={field.title}
            onChange={(e) => handleFieldChange(index, "title", e.target.value)}
            placeholder="Enter Title"
            className="w-full"
          />
          <TextArea
            value={field.description}
            onChange={(value) => handleFieldChange(index, "description", value)}
            placeholder="Enter Description"
            className="w-full"
          />
          <div className="flex gap-2">
            {index === fields.length - 1 && (
              <button type="button" onClick={handleAddField} className="flex items-center gap-1 px-3 py-2 border rounded text-blue-600 hover:bg-blue-50 transition whitespace-nowrap">
                <FiPlus /> Add
              </button>
            )}
            {fields.length > 1 && (
              <button type="button" onClick={() => handleDeleteField(index)} className="px-3 py-2 border rounded text-red-500 hover:bg-red-50 transition">
                <FiTrash2 />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicSpeciality;
