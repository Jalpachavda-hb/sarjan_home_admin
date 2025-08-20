import ComponentCard from "../../common/ComponentCard";
import { useState } from "react";
import Label from "../Label";
import Input from "../input/InputField";
import { CiMail } from "react-icons/ci";

import TextArea from "../input/TextArea";
export default function InputGroup() {
   const [message, setMessage] = useState("");



  return (
    <ComponentCard title="Add Client Info">
      <div className="space-y-6">
        <div>
          <Label>Email</Label>
          <div className="relative">
            <Input
              placeholder="info@gmail.com"
              type="text"
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <CiMail  className="size-6" />
            </span>
          </div>
        </div>
       
        </div>
          <div>
          <Label htmlFor="input">Aadhar Card </Label>
          <Input type="text" id="input" />
        </div>
    
          <div>
          <Label htmlFor="input">Pan Card  </Label>
          <Input type="text" id="input" />
        </div>
          <div>
          <Label htmlFor="input" > Contact Number </Label>
          <Input type="text" id="input" />
        </div>
         <div>
          <Label>Address</Label>
          <TextArea
            value={message}
            onChange={(value) => setMessage(value)}
            rows={6}
          />
        </div>
    </ComponentCard>
  );
}
