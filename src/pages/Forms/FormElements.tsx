
import DefaultInputs from "../../components/form/form-elements/DefaultInputs";
import InputGroup from "../../components/form/form-elements/InputGroup";
import  TextAreaInput from "../../components/form/form-elements/TextAreaInput"


export default function FormElements() {
  return (
    <div>
     

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
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
