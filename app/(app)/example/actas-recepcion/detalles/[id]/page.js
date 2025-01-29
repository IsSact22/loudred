"use client";
/* Animations */
import { Earthplane } from "@/src/animations/Earthplane";
/* Components */
import { ReceptionReport } from "@/src/features/import/reception-reports/components/ReceptionReport";
import { PrintButton } from "@/src/components/buttons/PrintButton";
import { Separator } from "@/components/ui/separator";
/* Core */
import { PageWrapper } from "@/src/core/components/PageWrapper";
/* Hooks */
import { useIsClient } from "@uidotdev/usehooks";
import { useData } from "@/src/hooks/useData";
/* Icons */
import { TbHexagon3D } from "react-icons/tb";
// React
import React, { useRef } from "react";

const ReceptionDetails = ({ params }) => {
  const isClient = useIsClient();
  const printableRef = useRef(null);

  // En Next.js, params suele ser un objeto con la forma { id: '...' }
  const { id } = React.use(params);
  const { data: reception, isLoading } = useData(`/reception_reports/${id}`);

  if (!reception || isLoading)
    return <PageWrapper loading={true} LoadingComponent={Earthplane} />;

  const {
    code_reception,
    date_reception,
    master_guide: {
      nro_control,
      shipper: { name: shipperName, identification: shipperId, type: shipperType },
      consignee: { name: consigneeName, identification: consigneeId, type: consigneeType },
      packages,
      gross_weight,
      unit_weight,
      content,
    },
    manifest: {
      airline: { name: airlineName, ImageCloud: image },
      origin: { name: originName },
      destination: { name: destinationName },
      flight: { flight_code, date_destination },
    },
    inventory: {
      location,
      inspection: {
        observation: inspectionObservation,
        package: inspectionPackage,
      },
    },
    house_guide,
    sidunea_code,
    observation: docObservation,
  } = reception;

  return (
    <PageWrapper
      title="Acta de Recepción"
      loading={isLoading}
      LoadingComponent={Earthplane}
      icon={<TbHexagon3D className="w-6 text-navy" />}
      hasHeader={false}
    >
      {isClient ? (
        <div className="flex flex-col gap-4">
          <div className="space-x-2">
            <PrintButton printableRef={printableRef}/>
          </div>
          <Separator />
          <div className="flex justify-center items-center rounded-lg">
            <ReceptionReport
              printableRef={printableRef}
              code_reception={code_reception}
              date_reception={date_reception}
              master_guide={{
                nro_control,
                shipper: {
                  name: shipperName,
                  identification: shipperId,
                  type: shipperType,
                },
                consignee: {
                  name: consigneeName,
                  identification: consigneeId,
                  type: consigneeType,
                },
                packages,
                gross_weight,
                unit_weight,
                content,
              }}
              manifest={{
                airline: { name: airlineName, image: image },
                origin: { name: originName },
                destination: { name: destinationName },
                flight: {
                  flight_code,
                  date_destination,
                },
              }}
              inventory={{
                location,
                inspection: {
                  observation: inspectionObservation,
                },
              }}
              inspection={{ package: inspectionPackage }}
              house_guide={house_guide}
              sidunea_code={sidunea_code}
              observation={docObservation}
            />
          </div>
        </div>
      ) : null}
    </PageWrapper>
  );
};

export default ReceptionDetails;
