"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Columnas predeterminadas como ejemplo
export const defaultColumns = [
  {
    accessorKey: "number",
    header: "No.",
    cell: ({ row }) => <div className="text-white">{row.getValue("number")}</div>,
  },
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => (
      <img
        src={row.getValue("image")}
        alt="Album cover"
        className="w-10 h-10 rounded-md"
      />
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-white font-semibold">{row.getValue("title")}</span>
        <span className="text-purple-300 text-sm">{row.original.artist}</span>
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <div className="text-white text-sm">{row.getValue("duration")}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex gap-2">
        <button className="bg-red-600 p-2 rounded-full hover:bg-red-700">
          👎
        </button>
        <button className="bg-green-600 p-2 rounded-full hover:bg-green-700">
          👍
        </button>
      </div>
    ),
  },
];

// Componente de tabla
export function DataTable({ data = [], columns = defaultColumns }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  return (
    <div className="overflow-x-auto h-full w-full bg-slate-950 p-6 rounded-lg">
      <div className="border border-purple-600 rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-purple-800 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-purple-700 last:border-none hover:bg-purple-700"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-24 text-center text-white"
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
