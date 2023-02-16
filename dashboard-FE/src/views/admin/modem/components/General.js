// Chakra imports
import { SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
import Information from "views/admin/profile/components/Information";

// Assets
export default function GeneralInformation(props) {
  const { data, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  const {
    type,
    revision,
    imei,
    imsi,
    qccid,
    ipAddress,
    byteSend,
    byteReceive,
  } = data;
  return (
    <Card mb={{ base: "0px", "2xl": "20px" }} {...rest}>
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="10px"
        mb="4px"
      >
        Device Information
      </Text>

      <SimpleGrid columns="2" gap="20px">
        <Information boxShadow={cardShadow} title="Type" value={type} />
        <Information boxShadow={cardShadow} title="Revision" value={revision} />

        <Information boxShadow={cardShadow} title="IMEI" value={imei} />
        <Information boxShadow={cardShadow} title="IMSI" value={imsi} />
        <Information boxShadow={cardShadow} title="QCCID" value={qccid} />
        <Information
          boxShadow={cardShadow}
          title="Ip Address"
          value={ipAddress}
        />
        <Information
          boxShadow={cardShadow}
          title="Byte Send"
          value={byteSend}
        />
        <Information
          boxShadow={cardShadow}
          title="Byte Receive"
          value={byteReceive}
        />
      </SimpleGrid>
    </Card>
  );
}
