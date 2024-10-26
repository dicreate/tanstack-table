import { createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { USERS } from '../data'
import { useState } from 'react';

const TanStackTable = () => {
   type Person = {
      username: string
      email: string
      birthdate: Date
      No: string
      avatar: string
   }

   const columnHelper = createColumnHelper<Person>()

   const columns = [
      columnHelper.accessor('No', {
         cell: info => <span>{info.row.index + 1}</span>,
         header: "№"
      }),
      columnHelper.accessor('avatar', {
         cell: info => (
            <img src={info?.getValue()}
               alt="..."
               className='rounded-full w-10 h-10 object-cover'
            />
         ),
         header: "avatar"
      }),
      columnHelper.accessor('username', {
         cell: info => <span>{info.getValue()}</span>,
         header: "Имя пользователя"
      }),
      columnHelper.accessor('email', {
         cell: info => <span>{info.getValue()}</span>,
         header: "email"
      }),
      columnHelper.accessor('birthdate', {
         cell: info => <span>{info.getValue().toLocaleDateString()}</span>,
         header: "birthdate"
      }),
   ]
   const [columnVisibility, setColumnVisibility] = useState({})

   const [data] = useState(() => [...USERS])

   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      state: {
         columnVisibility,
      },
      onColumnVisibilityChange: setColumnVisibility,
   })

   return (
      <div className="p-2 max-w-5xl mx-auto text-white fill-gray-400">
         {table.getAllLeafColumns().map(column => {
            return (
               <div key={column.id} className="px-1">
                  <label>
                     <input
                        {...{
                           type: 'checkbox',
                           checked: column.getIsVisible(),
                           onChange: column.getToggleVisibilityHandler(),
                        }}
                     />{' '}
                     {column.id}
                  </label>
               </div>
            )
         })}
         <table className='border border-gray-700 w-full text-left'>
            <thead className="bg-indigo-600">
               {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                     {
                        headerGroup.headers.map(header => (
                           <th key={header.id} className='capitalize px-3.5 py-2'>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                           </th>
                        ))
                     }
                  </tr>
               ))}
            </thead>
            <tbody>
               {
                  table.getRowModel().rows.length ? (
                     table.getRowModel().rows.map((row, i) => (
                        <tr key={row.id} className={`
                           ${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}
                        `}>
                           {
                              row.getVisibleCells().map((cell) => (
                                 <td key={cell.id} className='px-3.5 py-2'>
                                    {flexRender(
                                       cell.column.columnDef.cell,
                                       cell.getContext()
                                    )}
                                 </td>
                              ))
                           }
                        </tr>
                     ))
                  ) : null
               }
            </tbody>
         </table>
         {/* pagination */}
         <div className="flex items-center justify-end mt-2 gap-2">
            <button
               onClick={() => {
                  table.previousPage();
               }}
               disabled={!table.getCanPreviousPage()}
               className="p-1 border border-gray-300 px-2 disabled:opacity-30"
            >
               {"<"}
            </button>
            <button
               onClick={() => {
                  table.nextPage();
               }}
               disabled={!table.getCanNextPage()}
               className="p-1 border border-gray-300 px-2 disabled:opacity-30"
            >
               {">"}
            </button>

            <span className="flex items-center gap-1">
               <div>Page</div>
               <strong>
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
               </strong>
            </span>
            <span className="flex items-center gap-1">
               | Go to page:
               <input
                  type="number"
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                     const page = e.target.value ? Number(e.target.value) - 1 : 0;
                     table.setPageIndex(page);
                  }}
                  className="border p-1 rounded w-16 bg-transparent"
               />
            </span>
            <select
               value={table.getState().pagination.pageSize}
               onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
               }}
               className="p-2 bg-transparent"
            >
               {[10, 20, 30, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                     Show {pageSize}
                  </option>
               ))}
            </select>
         </div>
      </div>
   )
}

export default TanStackTable;