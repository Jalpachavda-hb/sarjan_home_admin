import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Badge from "../../components/ui/badge/Badge";
import { FaPlus } from "react-icons/fa";

import ComponentCard from "../../components/common/ComponentCard";

export default function Badges() {
  return (
    <div>
   
      <PageBreadcrumb pageTitle="Badges" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="With Light Background">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            {/* Light Variant */}
            <Badge variant="light" color="primary">
              Primary
            </Badge>
            <Badge variant="light" color="success">
              Success
            </Badge>{" "}
            <Badge variant="light" color="error">
              Error
            </Badge>{" "}
            <Badge variant="light" color="warning">
              Warning
            </Badge>{" "}
            <Badge variant="light" color="info">
              Info
            </Badge>
            <Badge variant="light" color="light">
              Light
            </Badge>
            <Badge variant="light" color="dark">
              Dark
            </Badge>
          </div>
        </ComponentCard>
        <ComponentCard title="With Solid Background">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            {/* Light Variant */}
            <Badge variant="solid" color="primary">
              Primary
            </Badge>
            <Badge variant="solid" color="success">
              Success
            </Badge>{" "}
            <Badge variant="solid" color="error">
              Error
            </Badge>{" "}
            <Badge variant="solid" color="warning">
              Warning
            </Badge>{" "}
            <Badge variant="solid" color="info">
              Info
            </Badge>
            <Badge variant="solid" color="light">
              Light
            </Badge>
            <Badge variant="solid" color="dark">
              Dark
            </Badge>
          </div>
        </ComponentCard>
        <ComponentCard title="Light Background with Left Icon">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            <Badge variant="light" color="primary" startIcon={<FaPlus  />}>
              Primary
            </Badge>
            <Badge variant="light" color="success" startIcon={<FaPlus  />}>
              Success
            </Badge>{" "}
            <Badge variant="light" color="error" startIcon={<FaPlus  />}>
              Error
            </Badge>{" "}
            <Badge variant="light" color="warning" startIcon={<FaPlus  />}>
              Warning
            </Badge>{" "}
            <Badge variant="light" color="info" startIcon={<FaPlus  />}>
              Info
            </Badge>
            <Badge variant="light" color="light" startIcon={<FaPlus  />}>
              Light
            </Badge>
            <Badge variant="light" color="dark" startIcon={<FaPlus  />}>
              Dark
            </Badge>
          </div>
        </ComponentCard>
        <ComponentCard title="Solid Background with Left Icon">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            <Badge variant="solid" color="primary" startIcon={<FaPlus  />}>
              Primary
            </Badge>
            <Badge variant="solid" color="success" startIcon={<FaPlus  />}>
              Success
            </Badge>{" "}
            <Badge variant="solid" color="error" startIcon={<FaPlus  />}>
              Error
            </Badge>{" "}
            <Badge variant="solid" color="warning" startIcon={<FaPlus  />}>
              Warning
            </Badge>{" "}
            <Badge variant="solid" color="info" startIcon={<FaPlus  />}>
              Info
            </Badge>
            <Badge variant="solid" color="light" startIcon={<FaPlus  />}>
              Light
            </Badge>
            <Badge variant="solid" color="dark" startIcon={<FaPlus  />}>
              Dark
            </Badge>
          </div>
        </ComponentCard>
        <ComponentCard title="Light Background with Right Icon">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            <Badge variant="light" color="primary" >
              Primary
            </Badge>
            <Badge variant="light" color="success" >
              Success
            </Badge>{" "}
            <Badge variant="light" color="error" >
              Error
            </Badge>{" "}
            <Badge variant="light" color="warning" >
              Warning
            </Badge>{" "}
            <Badge variant="light" color="info" >
              Info
            </Badge>
            <Badge variant="light" color="light" >
              Light
            </Badge>
            <Badge variant="light" color="dark" >
              Dark
            </Badge>
          </div>
        </ComponentCard>
        <ComponentCard title="Solid Background with Right Icon">
          <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
            <Badge variant="solid" color="primary" >
              Primary
            </Badge>
            <Badge variant="solid" color="success" >
              Success
            </Badge>{" "}
            <Badge variant="solid" color="error" >
              Error
            </Badge>{" "}
            <Badge variant="solid" color="warning" >
              Warning
            </Badge>{" "}
            <Badge variant="solid" color="info" >
              Info
            </Badge>
            <Badge variant="solid" color="light">
              Light
            </Badge>
            <Badge variant="solid" color="dark" >
              Dark
            </Badge>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
