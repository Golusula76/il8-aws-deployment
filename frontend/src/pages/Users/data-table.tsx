import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "helper/axios";
import Swal from "sweetalert2";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setPageNum: any;
  setPageSize: any;
  pageNum: number;
  pageSize: number;
  total: number;
  userId: any;
  setUserId: any;
  userType: any;
  setUserType: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setPageNum,
  setPageSize,
  pageNum,
  pageSize,
  total,
  userId,
  setUserId,
  userType,
  setUserType,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    phone_no: "",
    user_type: "",
    user_password: "",
    repassword: "",
  });

  const handleInputChange = (fieldName: any, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.user_password === formData.repassword) {
      try {
        const response = await axios.post("api/insert/lms_user", formData);
        if (response.data.status_code === 500) {
          throw new Error("Email Already in Use");
        }
        if (response.data.status_code === 400) {
          throw new Error(response.data.detail);
        }
        Swal.fire({
          icon: "success",
          title: `User Created Successfully`,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => window.location.reload());
      } catch (error) {
        console.error("Error Creating User", error);
        Swal.fire({
          icon: "error",
          title: "Error creating user.",
          text:
            error?.message ||
            "Please check your internet connection or try again later.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <>
      <div className="flex items-center py-4">
        {/* <Input
          placeholder="Filter by User ID..."
          value={userId || null}
          onChange={(event) => setUserId(event.target.value || null)}
          className="max-w-sm mr-2 !bg-white-A700 !text-black-900"
        /> */}
        {/* <Input
          placeholder="Filter emails..."
          value={
            (table.getColumn("User Email")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("User Email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-2 !bg-white-A700 !text-black-900"
        /> */}
        <Select onValueChange={(value) => setUserType(value)} value={userType}>
          <SelectTrigger className="max-w-sm !bg-white-A700 !text-black-900">
            <SelectValue placeholder="Filter type..." />
          </SelectTrigger>
          <SelectContent className="max-w-sm !bg-white-A700 !text-black-900">
            <SelectItem value={null}>Filter Type...</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="parent">Parent</SelectItem>
          </SelectContent>
        </Select>
        {/* <Input
          placeholder="Filter type..."
          value={userType || null}
          onChange={(event) => setUserType(event.target.value || null)}
          className="max-w-sm !bg-white-A700 !text-black-900"
        /> */}
        <div className="ml-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mx-2 !bg-teal-900">Add User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user_name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="user_name"
                    name="user_name"
                    type="text"
                    className="col-span-3"
                    value={formData.user_name}
                    onChange={(e) =>
                      handleInputChange("user_name", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user_email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="user_email"
                    type="email"
                    name="user_email"
                    className="col-span-3"
                    value={formData.user_email}
                    onChange={(e) =>
                      handleInputChange("user_email", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone_no" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone_no"
                    type="number"
                    pattern="[0-9]*"
                    maxLength={10}
                    name="phone_no"
                    className="col-span-3"
                    value={formData.phone_no}
                    onChange={(e) =>
                      handleInputChange("phone_no", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone_no" className="text-right">
                    User Type
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("user_type", value)
                    }
                    value={formData.user_type}
                  >
                    <SelectTrigger className="col-span-3 !bg-gray-500 !text-white-A700">
                      <SelectValue placeholder="Select Type..." />
                    </SelectTrigger>
                    <SelectContent className="col-span-3 !bg-gray-500 !text-white-A700">
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user_password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="user_password"
                    type="password"
                    name="user_password"
                    className="col-span-3"
                    autoComplete="on"
                    value={formData.user_password}
                    onChange={(e) =>
                      handleInputChange("user_password", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="repassword" className="text-right">
                    Re-Password
                  </Label>
                  <Input
                    id="repassword"
                    type="password"
                    name="repassword"
                    className="col-span-3"
                    autoComplete="on"
                    value={formData.repassword}
                    onChange={(e) =>
                      handleInputChange("repassword", e.target.value)
                    }
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Add</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Toggle Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white-A700" align="end">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                ?.getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="bg-teal-900 text-white-A700"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 p-4 bg-teal-900 text-white-A700">
          {/* <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div> */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNum((prev: number) => prev > 0 && prev - 1)}
            disabled={pageNum === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNum((prev: number) => prev + 1)}
            disabled={pageNum * pageSize >= total}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
