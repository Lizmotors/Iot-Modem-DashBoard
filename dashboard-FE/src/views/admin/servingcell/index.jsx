import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import Graph from "views/admin/servingcell/components/Graph";
import axios from "axios";

export default function UserReports() {
  const [data, setData] = useState({
    device: {},
    gps: [],
    neighbourcell: [],
    network: [],
    servingcell: [],
    rsrp: [],
    rscp: [],
    rsrq: [],
    rssi: [],
  });
  const [loading, setLoading] = useState(true);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  // Chakra Color Mode

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3030/device/63f57f550a0c5a499676d6c4", null, {
        withCredentials: false,
      })
      .then((res) => {
        console.log("res", res);
        const { servingcell } = res.data;
        const rsrp = servingcell.map((ele) => parseInt(ele.rsrp));
        const rscp = servingcell.map((ele) => parseInt(ele.rscp));
        const rsrq = servingcell.map((ele) => parseInt(ele.rsrq));
        const rssi = servingcell.map((ele) => parseInt(ele.rssi));

        setData({
          ...res.data,
          rsrp: [...rsrp],
          rscp: [...rscp],
          rsrq: [...rsrq],
          rssi: [...rssi],
        });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);
      });
  }, []);

  const {
    device,
    gps,
    neighbourcell,
    network,
    servingcell,
    rsrp,
    rscp,
    rsrq,
    rssi,
  } = data;

  console.log("app", rsrp, rscp, rsrq, rssi);

  if (loading) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Loading....
        </Text>
      </Box>
    );
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <Graph
          data={[
            {
              name: "RSRP",
              data: rsrp,
            },
          ]}
          name="RSRP"
          color={"#4318FF"}
        />
        <Graph
          data={[
            {
              name: "RSCP",
              data: rscp,
            },
          ]}
          name="RSCP"
          color="#39B8FF"
        />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <Graph
          data={[
            {
              name: "RSRQ",
              data: rsrq,
            },
          ]}
          name="RSRQ"
          color="#ee5d50"
        />
        <Graph
          data={[
            {
              name: "RSSI",
              data: rssi,
            },
          ]}
          name="RSSI"
          color="#f56ccb"
        />
      </SimpleGrid>
    </Box>
  );
}
