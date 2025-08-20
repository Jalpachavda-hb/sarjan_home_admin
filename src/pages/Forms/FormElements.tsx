
import DefaultInputs from "../../components/form/form-elements/DefaultInputs";
import InputGroup from "../../components/form/form-elements/InputGroup";
import  TextAreaInput from "../../components/form/form-elements/TextAreaInput"
import PageMeta from "../../components/common/PageMeta";

export default function FormElements() {
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | Sarjan_Admin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for Sarjan_Admin - React.js Tailwind CSS Admin Dashboard Template"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <DefaultInputs />

          <TextAreaInput />
          {/* <InputStates /> */}
        </div>
        <div className="space-y-6">
          <InputGroup />
          {/* <FileInputExample /> */}
          {/* <CheckboxComponents /> */}
          {/* <RadioButtons /> */}
          {/* <ToggleSwitch /> */}
          {/* <DropzoneComponent /> */}
        </div>
      </div>
    </div>
  );
}
