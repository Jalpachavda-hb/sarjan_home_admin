import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { addProjectCategory } from "../../utils/Handlerfunctions/formSubmitHandlers";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validateCategory } from "../../utils/Validation";
const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleSubmit = async () => {
    const values = { categoryName };
    const validationErrors = validateCategory(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // show inline errors
      return;
    }
    setErrors({}); // clear errors

    try {
      const formData = new FormData();
      formData.append("admin_id", "1");
      formData.append("project_category_name", categoryName);

      const res = await addProjectCategory(formData);

      if (res?.status === 200) {
        toast.success("Category added successfully");
        setCategoryName("");
        setTimeout(() => {
          navigate("/admin/projects_category");
        }, 1000);
      } else {
        toast.error(res?.message || "Failed to add category");
      }
    } catch (error) {
      toast.error("Something went wrong while adding category");
      console.error("Add category failed:", error);
    }
  };

  return (
    <div>
      <PageMeta title={"Add Category"} />

      <div className="grid grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Add Category">
            <div className="space-y-6">
              <div>
                <Label>Project Category</Label>
                {/* <Input
                  placeholder="Enter Category Name"
                  value={categoryName}
                  onChange={(e: any) => setCategoryName(e.target.value)}
                /> */}
                <Input
                  type="text"
                  placeholder="Enter Category Name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className={`form-control w-full rounded-md border px-3 py-2 ${
                    errors.categoryName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500"
                  }`}
                />
                {errors.categoryName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.categoryName}
                  </p>
                )}
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      <div className="flex space-x-4 mt-4">
        <Button onClick={handleSubmit} className="Submitbtn">
          Submit
        </Button>
        <Button className="canclebtn">Cancel</Button>
      </div>
    </div>
  );
};

export default AddCategory;
