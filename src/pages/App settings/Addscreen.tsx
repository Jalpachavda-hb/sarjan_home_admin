import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import FileInput from "../../components/form/input/FileInput";
import Button from "../../components/ui/button/Button";
import { submitSplashScreen } from "../../utils/Handlerfunctions/formSubmitHandlers";

const Addscreen = () => {
  const [splashscreen_image, setSplashscreenImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [data, setData] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleSplashScreenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSplashscreenImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const newRecord = await submitSplashScreen(splashscreen_image, title);

    if (newRecord) {
      // Add new record at the top of table (if needed)
      setData((prev) => [newRecord, ...prev]);

      // Reset form fields
      setSplashscreenImage(null);
      setTitle("");

      // Redirect after success
      navigate("/admin/settings/home_slider");
    }
  };

  return (
    <div>
      <PageMeta title="Add Site Info" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title="Add New Splash Screen">
            <div className="space-y-6">
              {splashscreen_image && (
                <div className="w-32 h-32 border rounded overflow-hidden">
                  <img
                    src={URL.createObjectURL(splashscreen_image)}
                    alt="splashscreen preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="fileUpload">Upload Image</Label>
                <FileInput id="fileUpload" onChange={handleSplashScreenChange} />
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  placeholder="Enter splash screen Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="mt-3 bg-green-600 hover:bg-green-700"
      >
        Add
      </Button>
      <Button className="canclebtn">Cancel</Button>
    </div>
  );
};

export default Addscreen;