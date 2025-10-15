import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import Badge from "../../components/ui/badge/Badge";
import TablePagination from "@mui/material/TablePagination";
import { MdDelete } from "react-icons/md";
import { TextField, Button } from "@mui/material";
import { usePermissions } from "../../hooks/usePermissions";
import {
  getAdminId,
  fetchSplashScreens,
} from "../../utils/Handlerfunctions/getdata";
import { handleDeleteSplashScreen } from "../../utils/Handlerfunctions/formdeleteHandlers";
import Swal from "sweetalert2";
interface SplashScreen {
  id: number;
  image: string;
  title: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export default function Homeslider() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<SplashScreen[]>([]);
  const [selectedColumns] = useState<string[]>([]);
  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const { canDelete, canCreate } = usePermissions();
  // const canViewAdminUsers = canView("App_settings");
  const canCreateApp_settings = canCreate("App_settings");

  const canDeleteApp_settings = canDelete("App_settings");
  const hasAnyActionPermission = canDeleteApp_settings;

  const fetchData = async () => {
    try {
      const id = getAdminId(); // directly get string | null
      if (id) {
        const splashData = await fetchSplashScreens(id);
        setData(splashData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const DeleteSplash = async (
    id: number,
    setData: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "my-popup",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await handleDeleteSplashScreen(id);
        if (success) {
          setData((prev) => prev.filter((d) => d.id !== id));
          await fetchData();
          // toast.success("Splash screen has been deleted.");
        }
      }
    });
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Filter + Search
  const filteredData = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    return data.filter((item) => item.title.toLowerCase().includes(searchTerm));
  }, [search, data]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

  return (
    <>
      <div className="font-poppins text-gray-800 dark:text-white">
        <h3 className="text-lg font-semibold mb-5">Splash Screen</h3>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-wrap gap-2 items-center"></div>

            {/* Right Column */}
            <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
              {/* Filter by Site Dropdown */}

              {/* Search Input */}
              {canCreateApp_settings && (
                <a href="/admin/settings/home_slider/addscreen">
                  <Button
                    size="small"
                    variant="contained"
                    className="!bg-indigo-700 hover:!bg-indigo-900 text-white"
                   
                  >
                    + Add Splash Screen
                  </Button>
                </a>
              )}
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value.trimStart())}
                sx={{ fontFamily: "Poppins" }}
                InputProps={{ sx: { fontFamily: "Poppins", fontSize: "14px" } }}
              />
            </div>
          </div>

          <div className="max-w-full overflow-x-auto mt-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="columtext">Sr. No</TableCell>

                  {isColumnVisible("image") && (
                    <TableCell className="columtext">Image</TableCell>
                  )}
                  {isColumnVisible("title") && (
                    <TableCell className="columtext">Title</TableCell>
                  )}
                  {hasAnyActionPermission && isColumnVisible("siteName") && (
                    <TableCell className="columtext">Action</TableCell>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      // colSpan={}
                      className="justify-between py-12 text-gray-500  "
                      // style={{ fontSize: "16px" }}
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="rowtext">
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      {isColumnVisible("count") && (
                        <TableCell className="rowtext">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                        </TableCell>
                      )}{" "}
                      {isColumnVisible("title") && (
                        <TableCell className="rowtext">{item.title}</TableCell>
                      )}
                      {hasAnyActionPermission &&
                        isColumnVisible("blocknumberType") && (
                          <TableCell className="rowtext">
                            <div className="flex gap-2 mt-1">
                              {canDeleteApp_settings && (
                                <Badge variant="light" color="error">
                                  <MdDelete
                                    className="text-2xl cursor-pointer"
                                    // onClick={DeleteSplash(item.id, setData)}
                                    onClick={() =>
                                      DeleteSplash(item.id, setData)
                                    }
                                  />
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-between items-center w-full">
            <div className="w-1/2">
              <p className="text-sm">
                Showing {filteredData.length === 0 ? 0 : page * rowsPerPage + 1}
                –{Math.min((page + 1) * rowsPerPage, filteredData.length)} of{" "}
                {filteredData.length} entries
              </p>
            </div>

            <div className="w-1/2 flex justify-end">
              <TablePagination
                component="div"
                count={filteredData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Rows per page:"
                sx={{
                  color: "inherit",
                  ".MuiSelect-select": {
                    color: "inherit",
                    backgroundColor: "transparent",
                  },
                  ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                    {
                      color: "inherit",
                    },
                  ".MuiSvgIcon-root": {
                    color: "inherit",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
