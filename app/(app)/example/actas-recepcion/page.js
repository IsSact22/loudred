"use client";
// Animations
import { motion, AnimatePresence } from "framer-motion";
import { Earthplane } from "@/src/animations/Earthplane";
// Components
import { Table } from "@/src/components/tables/Table";
import { CreateReception } from "@/src/features/import/reception-reports/components/CreateReception";
import { EditReception } from "@/src/features/import/reception-reports/components/EditReception";
import { ReceptionInfo } from "@/src/features/import/reception-reports/components/ReceptionInfo";
import { ReceptionTable } from "@/src/features/import/reception-reports/components/ReceptionTable";
import { ListCreateButtons } from "@/src/components/buttons/ListCreateButtons";
// Core
import { PageWrapper } from "@/src/core/components/PageWrapper";
// Hooks
import { useEffect } from "react";
import { usePaginatedTable } from "@/src/hooks/usePaginatedTable";
import { useButtonStates } from "@/src/hooks/useButtonStates";
// Icons
import { TbReport } from "react-icons/tb";
// Utils
import { createVariants, transition } from "@/src/utils/helpers";

// CONSTANTES
const url = "/reception_reports";
const variants = createVariants();

const Reception = () => {
  /* Estado para manejar los botones que cambian la vista */
  const { buttonStates, setButtonStates, direction, setDirection } = useButtonStates();

  /* Manejo de una Tabla */
  const {
    isClient,
    data,
    getData,
    handleDestroy,
    handleUpdate,
    loading,
    pagination,
    goToUrl,
  } = usePaginatedTable(url, "reception-reports", "Acta de Recepción");

  /* Efecto de carga para datos */
  useEffect(() => {
    if (isClient) {
      getData();
    }
  }, [isClient, getData]);

  return (
    <PageWrapper
      icon={<TbReport className="w-6 h-6 text-navy" />}
      loading={loading}
      LoadingComponent={Earthplane}
      title="Acta de Recepción"
      altMenu={
        <ListCreateButtons
          buttonStates={buttonStates}
          setButtonStates={setButtonStates}
          setDirection={setDirection}
        />
      }
    >
      <AnimatePresence custom={direction} mode="wait">
        {buttonStates.list && (
          <motion.div
            key="lista"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            <Table
              dataLength={data.length}
              data={data}
              loading={loading}
              handleDestroy={handleDestroy}
              handleUpdate={handleUpdate}
              columns={["Cód. de Acta", "Cód. SIDUNEA", "Fecha", "Observación", "Acción"]}
              CustomEditModal={EditReception}
              CustomShowModal={ReceptionInfo}
              BodyTable={ReceptionTable}
              pagination={pagination}
              goToUrl={goToUrl}
              type={"acta de recepción"}
            />
          </motion.div>
        )}
        {buttonStates.create && (
          <motion.div
            key="crear"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            <CreateReception
              url={url}
              refreshData={getData}
              setButtonStates={setButtonStates}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default Reception;