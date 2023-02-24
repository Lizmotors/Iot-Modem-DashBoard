import { Box, SimpleGrid } from "@chakra-ui/react";
import DevelopmentTable from "views/admin/modem/components/DevelopmentTable";
import CheckTable from "views/admin/dataTables/components/CheckTable";
import ColumnsTable from "views/admin/dataTables/components/ColumnsTable";
import ComplexTable from "views/admin/dataTables/components/ComplexTable";
import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
  columnsDataNetwork,
  columnsDataGps,
  columnsDataNeighbourcell,
  columnsDataServingcell,
} from "views/admin/dataTables/variables/columnsData";
import tableDataDevelopment from "views/admin/dataTables/variables/tableDataDevelopment.json";
import tableDataCheck from "views/admin/dataTables/variables/tableDataCheck.json";
import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns.json";
import tableDataComplex from "views/admin/dataTables/variables/tableDataComplex.json";
import General from "views/admin/modem/components/General";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Settings() {
  const [data, setData] = useState({
    device: {},
    gps: [],
    neighbourcell: [],
    network: [],
    servingcell: [],
  });
  // Chakra Color Mode

  useEffect(() => {
    axios
      .get("http://localhost:3030/device/63f57f550a0c5a499676d6c4", null, {
        withCredentials: false,
      })
      .then((res) => {
        console.log("res", res);

        setData(res.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  const { device, gps, neighbourcell, network, servingcell } = data;

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}
      >
        <General minH="365px" pe="20px" data={device} />
        <DevelopmentTable
          columnsData={columnsDataNetwork}
          tableData={network}
          name="Network"
        />

        <DevelopmentTable
          columnsData={columnsDataGps}
          tableData={gps}
          name="GPS"
        />

        <DevelopmentTable
          columnsData={columnsDataNeighbourcell}
          tableData={neighbourcell}
          name="Neighbour Cell"
        />

        <DevelopmentTable
          columnsData={columnsDataServingcell}
          tableData={servingcell}
          name="Serving Cell"
        />
        {/* <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <ColumnsTable
          columnsData={columnsDataColumns}
          tableData={tableDataColumns}
        />
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        /> */}
      </SimpleGrid>
    </Box>
  );
}
