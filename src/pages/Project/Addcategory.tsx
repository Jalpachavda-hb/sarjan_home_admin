
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

const AddCategory = () => {
  const { id } = useParams(); // Get ID from route
  const isEditMode = Boolean(id);

  const [categoryName, setCategoryName] = useState("");

  // Fetch category details if in edit mode
  useEffect(() => {
    if (isEditMode) {
      // Example API call
      fetch(`http://localhost:5000/api/category/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setCategoryName(data.name);
        })
        .catch((err) => console.error(err));
    }
  }, [id, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      // Update category
      fetch(`http://localhost:5000/api/category/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      }).then(() => alert("Category updated successfully!"));
    } else {
      // Add new category
      fetch(`http://localhost:5000/api/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      }).then(() => alert("Category added successfully!"));
    }
  };

  return (
    <div>
      <PageMeta title={isEditMode ? "Edit Category" : "Add Category"} />

      <div className="grid grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title={isEditMode ? "Edit Category" : "Add Category"}>
            <div className="space-y-6">
              <div>
                <Label>Project Category</Label>
                <Input
                  placeholder="Enter Category Name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      <Button onClick={handleSubmit} className="Submitbtn">
        {isEditMode ? "Update" : "Submit"}
      </Button>
      <Button className="canclebtn">Cancel</Button>
    </div>
  );
};

export default AddCategory;
