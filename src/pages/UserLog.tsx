import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { fetchAdminLogs } from "../utils/Handlerfunctions/getdata";

import { useState, useEffect } from "react";
import { TextField } from "@mui/material";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface Log {
  id: number;
  user_id: string;
  user_name: string;
  operation: string;
  descr: string;
  created_at: string;
}

export default function UserLog() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  // 🔹 Fetch logs for specific page
  const getLogs = async (pageNumber: number) => {
    try {
      const res = await fetchAdminLogs(pageNumber + 1);
      const updatedLogs = res.data.map((log: any) => ({
        ...log,
        created_at: log.created_at.split(" ")[0],
      }));

      setLogs(updatedLogs);
      setRowsPerPage(res.pagination.per_page);
      setTotalRecords(res.pagination.total);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredData = logs.filter((log) =>
    [log.operation, log.descr, log.created_at].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  useEffect(() => {
    getLogs(page);
  }, [page]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  const isColumnVisible = (column: string) =>
    selectedColumns.length === 0 || selectedColumns.includes(column);

  return (
    <div className="font-poppins text-gray-800 dark:text-white">
      <h3 className="text-lg font-semibold mb-5">User Log</h3>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-white/[0.03] px-4 pb-3 pt-4 sm:px-6">
        <div className="flex justify-end mb-4">
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

        <div className="max-w-full overflow-x-auto mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="columtext">Sr. No</TableCell>

                {isColumnVisible("operation") && (
                  <TableCell className="columtext">Operation</TableCell>
                )}

                {isColumnVisible("descr") && (
                  <TableCell className="columtext">Description</TableCell>
                )}

                {isColumnVisible("created_at") && (
                  <TableCell className="columtext">Date</TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="rowtext">
                      {page * rowsPerPage + index + 1}
                    </TableCell>

                    {isColumnVisible("operation") && (
                      <TableCell className="rowtext">
                        {item.operation}
                      </TableCell>
                    )}

                    {isColumnVisible("descr") && (
                      <TableCell className="rowtext">{item.descr}</TableCell>
                    )}

                    {isColumnVisible("created_at") && (
                      <TableCell className="rowtext">
                        {item.created_at}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-between items-center w-full border-t border-gray-200 dark:border-gray-700 pt-3">
          <p className="text-sm">
            {totalRecords === 0 ? (
              "Showing 0 entries"
            ) : (
              <>
                Showing {page * rowsPerPage + 1}–
                {page * rowsPerPage + filteredData.length} of {totalRecords}{" "}
                entries
              </>
            )}
          </p>

          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(totalRecords / rowsPerPage)}
              page={page + 1}
              // onChange={(_, value) => setPage(value - 1)}
              onChange={(_, value) => {
                setPage(value - 1);
                // fetchAdminLogs(value);
              }}
              color="primary"
              shape="rounded"
              siblingCount={1}
              boundaryCount={1}
            />
          </Stack>
        </div>
      </div>
    </div>
  );
}
