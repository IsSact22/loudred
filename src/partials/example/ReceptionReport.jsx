"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Image from "next/image";
import { images } from "@/src/utils/helpers";

export function ReceptionReport({
  code_reception,
  date_reception,
  master_guide,
  manifest,
  inventory,
  inspection,
  house_guide,
  sidunea_code,
  observation,
  printableRef,
}) {
  const declaredQty = parseInt(master_guide.packages);
  const receivedVal = inspection.package;
  const receivedQty = receivedVal ? parseInt(receivedVal) : "N/A";
  const missingQty = receivedQty === "N/A" ? "N/A" : declaredQty - receivedQty;

  return (
    <div
      className="container w-[20cm] mb-4 space-y-6 print:p-0 print:m-0"
      ref={printableRef}
    >
      <Card className="print:shadow-none print:border-0">
        <CardHeader className="space-y-6 p-6">
          <div className="flex justify-between items-center gap-4">
            <Image
              width={200}
              height={1}
              className="mb-2 h-full"
              src={images.gonavi}
              alt="Imagen de perfil"
              priority
            />
            <Image
              width={200}
              height={1}
              className="mb-2"
              src={manifest.airline.image}
              alt="Imagen de perfil"
              priority
            />
            <div className="flex gap-2">
              <Badge
                className="flex flex-col gap-1 h-max print:border print:border-black"
                variant="outline"
              >
                <span className="underline"> Control de Acta #:</span>
                {code_reception}
              </Badge>
              <Badge
                className="flex flex-col gap-1 h-max print:border print:border-black"
                variant="outline"
              >
                <span className="underline">Sidunea:</span>
                {sidunea_code}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-center text-2xl print:text-3xl">
            Acta de Recepción
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 py-4">
          {/* Información Principal */}
          <div className="grid laptop:grid-cols-2 gap-6 print:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold">Detalles de Envío</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-[auto_1fr] gap-2 text-sm">
                  <span className="text-muted-foreground print:text-black whitespace-nowrap">
                    Guía Master:
                  </span>
                  <span className="print:font-medium">
                    {master_guide.nro_control}
                  </span>
                  <span className="text-muted-foreground print:text-black whitespace-nowrap">
                    Guía House:
                  </span>
                  <span className="print:font-medium">
                    {house_guide || "N/A"}
                  </span>
                  <span className="text-muted-foreground print:text-black whitespace-nowrap">
                    Vuelo:
                  </span>
                  <span className="print:font-medium">
                    {manifest.flight.flight_code}
                  </span>
                  <span className="text-muted-foreground print:text-black whitespace-nowrap">
                    Aerolínea:
                  </span>
                  <span className="print:font-medium">
                    {manifest.airline.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Información de Ruta</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-[auto_1fr] gap-2 text-sm">
                  <span className="text-muted-foreground print:text-black whitespace-nowrap">
                    Origen de la Carga:
                  </span>
                  <span className="print:font-medium">
                    {manifest.origin.name}
                  </span>
                  <span className="text-muted-foreground print:text-black whitespace-nowrap">
                    Destino de la Carga:
                  </span>
                  <span className="print:font-medium">
                    {manifest.destination.name}
                  </span>
                  <span className="text-muted-foreground print:text-black whitespace-nowrap">
                    Fecha de Recepción:
                  </span>
                  <span className="print:font-medium">
                    {format(new Date(date_reception), "dd/MM/yyyy HH:mm")}
                  </span>
                  <span className="text-muted-foreground print:text-black whitespace-nowrap">
                    Ubicación en almacén:
                  </span>
                  <span className="print:font-medium">
                    {inventory.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="print:border-gray-800" />

          {/* Remitente y Destinatario */}
          <div className="grid laptop:grid-cols-2 gap-6 print:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold">Expedidor</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-[auto_1fr] gap-2 text-sm">
                  <span className="text-muted-foreground print:text-black whitespace-nowrap">
                    Nombre:
                  </span>
                  <span className="print:font-medium">
                    {master_guide.shipper.name}
                  </span>
                  <span className="text-muted-foreground print:text-black whitespace-nowrap">
                    Identificación:
                  </span>
                  <span className="print:font-medium">
                    {master_guide.shipper.type}-
                    {master_guide.shipper.identification}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Consignatario</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-[auto_1fr] gap-2 text-sm">
                  <span className="text-muted-foreground print:text-black whitespace-nowrap">
                    Nombre:
                  </span>
                  <span className="print:font-medium">
                    {master_guide.consignee.name}
                  </span>
                  <span className="text-muted-foreground print:text-black whitespace-nowrap">
                    Identificación:
                  </span>
                  <span className="print:font-medium">
                    {master_guide.consignee.type}-
                    {master_guide.consignee.identification}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="print:border-gray-800" />

          {/* Detalles de la Carga */}
          <div className="space-y-2">
            <h3 className="font-semibold">Detalles de la Carga</h3>
            <div className="rounded-md border overflow-hidden print:border print:border-gray-800">
              <Table className="print:table">
                <TableHeader className="print:bg-gray-100">
                  <TableRow className="print:border-b-2 print:border-gray-800">
                    <TableHead className="border-r print:border-gray-800 print:px-2 print:py-1">
                      Descripción
                    </TableHead>
                    <TableHead className="border-r print:border-gray-800 print:px-2 print:py-1">
                      Cantidad Declarada
                    </TableHead>
                    <TableHead className="border-r print:border-gray-800 print:px-2 print:py-1">
                      Cantidad Recibida
                    </TableHead>
                    <TableHead className="border-r print:border-gray-800 print:px-2 print:py-1">
                      Cantidad Faltante
                    </TableHead>
                    <TableHead className="print:px-2 print:py-1">
                      Peso
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="print:border-b print:border-gray-400">
                    <TableCell className="border-r print:border-gray-800 print:px-2 print:py-1">
                      {master_guide.content}
                    </TableCell>
                    <TableCell className="border-r print:border-gray-800 print:px-2 print:py-1">
                      {declaredQty}
                    </TableCell>
                    <TableCell className="border-r print:border-gray-800 print:px-2 print:py-1">
                      {receivedQty}
                    </TableCell>
                    <TableCell className="border-r print:border-gray-800 print:px-2 print:py-1">
                      {missingQty}
                    </TableCell>
                    <TableCell className="print:px-2 print:py-1">
                      {master_guide.gross_weight} {master_guide.unit_weight}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-2 print:break-inside-avoid">
            <h3 className="font-semibold">Observaciones Generales</h3>
            <div className="flex flex-col gap-2 bg-muted p-4 rounded-lg text-sm print:bg-transparent print:border print:border-gray-800 print:p-3">
              {observation || inventory.inspection.observation ? (
                <>
                  {observation && (
                    <p className="print:text-base">{observation}</p>
                  )}
                  {inventory.inspection.observation && (
                    <p className="print:text-base">
                      {inventory.inspection.observation}
                    </p>
                  )}
                </>
              ) : (
                <p className="print:text-base">Sin observaciones</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
