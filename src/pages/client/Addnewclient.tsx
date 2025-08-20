import DefaultInputs from "../../components/form/form-elements/DefaultInputs";
import InputGroup from "../../components/form/form-elements/InputGroup";
import Button from "../../components/ui/button/Button";

import PageMeta from "../../components/common/PageMeta";

export default function Addnewclient() {
  return (
    <div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <DefaultInputs />
        </div>

        <div className="space-y-6">
          <InputGroup />
        </div>

      </div>
       <Button className="Submitbtn">Submit</Button>
      <Button className="canclebtn">Cancel</Button>
    </div>
  );
}
