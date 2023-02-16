// // Chakra imports
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";

import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import CheckTable from "views/admin/customGrid/components/CheckTable";
import ComplexTable from "views/admin/customGrid/components/ComplexTable";
import DailyTraffic from "views/admin/customGrid/components/DailyTraffic";
import PieCard from "views/admin/customGrid/components/PieCard";
import Tasks from "views/admin/customGrid/components/Tasks";
import TotalSpent from "views/admin/customGrid/components/TotalSpent";
import WeeklyRevenue from "views/admin/customGrid/components/WeeklyRevenue";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/customGrid/variables/columnsData";
import tableDataCheck from "views/admin/customGrid/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/customGrid/variables/tableDataComplex.json";
// import GridLayout from "react-grid-layout";

// export default function UserReports() {
//   // Chakra Color Mode
//   const brandColor = useColorModeValue("brand.500", "white");
//   const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

//   const layout = [
//     { i: "a", x: 0, y: 0, w: 1, h: 2, static: false },
//     { i: "b", x: 1, y: 0, w: 3, h: 2, static: false },
//     { i: "c", x: 4, y: 0, w: 1, h: 2, static: false },
//   ];

//   return (
//     <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
//       <GridLayout
//         className="layout"
//         layout={layout}
//         cols={12}
//         rowHeight={30}
//         width={1200}
//       >
//         <div key="a">
//           <MiniStatistics
//             startContent={
//               <IconBox
//                 w="56px"
//                 h="56px"
//                 bg={boxBg}
//                 icon={
//                   <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
//                 }
//               />
//             }
//             name="Earnings"
//             value="$350.4"
//           />
//         </div>
//         <div key="b">
//           <MiniStatistics
//             startContent={
//               <IconBox
//                 w="56px"
//                 h="56px"
//                 bg={boxBg}
//                 icon={
//                   <Icon
//                     w="32px"
//                     h="32px"
//                     as={MdAttachMoney}
//                     color={brandColor}
//                   />
//                 }
//               />
//             }
//             name="Spend this month"
//             value="$642.39"
//           />
//         </div>

//         <div key="c">
//           <MiniStatistics growth="+23%" name="Sales" value="$574.34" />
//         </div>
//       </GridLayout>
//       {/* <SimpleGrid
//         columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
//         gap="20px"
//         mb="20px"
//       >
//         <MiniStatistics
//           startContent={
//             <IconBox
//               w="56px"
//               h="56px"
//               bg={boxBg}
//               icon={
//                 <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
//               }
//             />
//           }
//           name="Earnings"
//           value="$350.4"
//         />
//         <MiniStatistics
//           startContent={
//             <IconBox
//               w="56px"
//               h="56px"
//               bg={boxBg}
//               icon={
//                 <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
//               }
//             />
//           }
//           name="Spend this month"
//           value="$642.39"
//         />
//         <MiniStatistics growth="+23%" name="Sales" value="$574.34" />
//         <MiniStatistics
//           endContent={
//             <Flex me="-16px" mt="10px">
//               <FormLabel htmlFor="balance">
//                 <Avatar src={Usa} />
//               </FormLabel>
//               <Select
//                 id="balance"
//                 variant="mini"
//                 mt="5px"
//                 me="0px"
//                 defaultValue="usd"
//               >
//                 <option value="usd">USD</option>
//                 <option value="eur">EUR</option>
//                 <option value="gba">GBA</option>
//               </Select>
//             </Flex>
//           }
//           name="Your balance"
//           value="$1,000"
//         />
//         <MiniStatistics
//           startContent={
//             <IconBox
//               w="56px"
//               h="56px"
//               bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
//               icon={<Icon w="28px" h="28px" as={MdAddTask} color="white" />}
//             />
//           }
//           name="New Tasks"
//           value="154"
//         />
//         <MiniStatistics
//           startContent={
//             <IconBox
//               w="56px"
//               h="56px"
//               bg={boxBg}
//               icon={
//                 <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
//               }
//             />
//           }
//           name="Total Projects"
//           value="2935"
//         />
//       </SimpleGrid>

//       <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
//         <TotalSpent />
//         <WeeklyRevenue />
//       </SimpleGrid>
//       <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
//         <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
//         <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
//           <DailyTraffic />
//           <PieCard />
//         </SimpleGrid>
//       </SimpleGrid>
//       <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
//         <ComplexTable
//           columnsData={columnsDataComplex}
//           tableData={tableDataComplex}
//         />
//         <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
//           <Tasks />
//           <MiniCalendar h="100%" minW="100%" selectRange={false} />
//         </SimpleGrid>
//       </SimpleGrid> */}
//     </Box>
//   );
// }

import React from "react";
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import("./test-hook").then((fn) => fn.default(BasicLayout));
const ReactGridLayout = WidthProvider(RGL);

const gridData = {
  className: "layout",
  items: 5,
  rowHeight: 30,
  onLayoutChange: function () {},
  cols: 12,
};

export default function BasicLayout() {
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  // const layout = [
  //   {
  //     x: 0,
  //     y: 0,
  //     w: 4,
  //     h: 1,
  //     i: "a",
  //   },
  //   {
  //     x: 4,
  //     y: 0,
  //     w: 4,
  //     h: 1,
  //     i: "b",
  //   },
  //   {
  //     x: 8,
  //     y: 0,
  //     w: 4,
  //     h: 1,
  //     i: "c",
  //   },
  //   {
  //     x: 0,
  //     y: 0,
  //     w: 4,
  //     h: 1,
  //     i: "d",
  //   },
  //   {
  //     x: 4,
  //     y: 0,
  //     w: 4,
  //     h: 1,
  //     i: "e",
  //   },
  //   {
  //     x: 8,
  //     y: 0,
  //     w: 4,
  //     h: 1,
  //     i: "f",
  //   },
  //   {
  //     x: 0,
  //     y: 0,
  //     w: 5,
  //     h: 3,
  //     i: "g",
  //   },
  //   {
  //     x: 0,
  //     y: 6,
  //     w: 5,
  //     h: 3,
  //     i: "h",
  //   },
  //   {
  //     x: 0,
  //     y: 0,
  //     w: 7,
  //     h: 5,
  //     i: "i",
  //   },
  //   {
  //     x: 8,
  //     y: 0,
  //     w: 8,
  //     h: 5,
  //     i: "j",
  //   },
  //   {
  //     x: 10,
  //     y: 0,
  //     w: 10,
  //     h: 5,
  //     i: "k",
  //   },
  //   {
  //     x: 0,
  //     y: 0,
  //     w: 6,
  //     h: 5,
  //     i: "l",
  //   },
  //   {
  //     x: 6,
  //     y: 0,
  //     w: 6,
  //     h: 5,
  //     i: "m",
  //   },
  // ];

  const layout = [
    {
        "w": 4,
        "h": 1,
        "x": 0,
        "y": 0,
        "i": "a",
        "moved": false,
        "static": false
    },
    {
        "w": 4,
        "h": 1,
        "x": 4,
        "y": 0,
        "i": "b",
        "moved": false,
        "static": false
    },
    {
        "w": 4,
        "h": 1,
        "x": 8,
        "y": 0,
        "i": "c",
        "moved": false,
        "static": false
    },
    {
        "w": 4,
        "h": 1,
        "x": 0,
        "y": 1,
        "i": "d",
        "moved": false,
        "static": false
    },
    {
        "w": 4,
        "h": 1,
        "x": 4,
        "y": 1,
        "i": "e",
        "moved": false,
        "static": false
    },
    {
        "w": 4,
        "h": 1,
        "x": 8,
        "y": 1,
        "i": "f",
        "moved": false,
        "static": false
    },
    {
        "w": 6,
        "h": 4,
        "x": 0,
        "y": 2,
        "i": "g",
        "moved": false,
        "static": false
    },
    {
        "w": 6,
        "h": 4,
        "x": 6,
        "y": 2,
        "i": "h",
        "moved": false,
        "static": false
    },
    {
        "w": 6,
        "h": 4,
        "x": 0,
        "y": 6,
        "i": "i",
        "moved": false,
        "static": false
    },
    {
        "w": 3,
        "h": 4,
        "x": 6,
        "y": 6,
        "i": "j",
        "moved": false,
        "static": false
    },
    {
        "w": 3,
        "h": 4,
        "x": 9,
        "y": 6,
        "i": "k",
        "moved": false,
        "static": false
    },
    {
        "w": 6,
        "h": 3,
        "x": 0,
        "y": 10,
        "i": "l",
        "moved": false,
        "static": false
    },
    {
        "w": 6,
        "h": 3,
        "x": 6,
        "y": 10,
        "i": "m",
        "moved": false,
        "static": false
    }
]

  const generateDOM = () => {
    return _.map(_.range(gridData.items), function (i) {
      return (
        <div key={i} style={{ backgroundColor: "grey" }}>
          <span className="text">{i}</span>
        </div>
      );
    });
  };

  const onLayoutChange = (layout) => {
    //this.props.onLayoutChange(layout);
    console.log("lay", layout);
  };
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <ReactGridLayout
        layout={layout}
        onLayoutChange={onLayoutChange}
        //{...this.props}
      >
        {/* {generateDOM()} */}
        <div key="a">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
                } 
                style={{height:"50%"}}
              />
            }
            name="Earnings"
            value="$350.4"
          />
        </div>
        <div key="b">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon
                    w="32px"
                    h="32px"
                    as={MdAttachMoney}
                    color={brandColor}
                  />
                }
              />
            }
            name="Spend this month"
            value="$642.39"
          />
        </div>

        <div key="c">
          <MiniStatistics growth="+23%" name="Sales" value="$574.34" />
        </div>

        <div key="d">
          <MiniStatistics
            endContent={
              <Flex me="-16px" mt="10px">
                <FormLabel htmlFor="balance">
                  <Avatar src={Usa} />
                </FormLabel>
                <Select
                  id="balance"
                  variant="mini"
                  mt="5px"
                  me="0px"
                  defaultValue="usd"
                >
                  <option value="usd">USD</option>
                  <option value="eur">EUR</option>
                  <option value="gba">GBA</option>
                </Select>
              </Flex>
            }
            name="Your balance"
            value="$1,000"
          />
        </div>

        <div key="e">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                icon={<Icon w="28px" h="28px" as={MdAddTask} color="white" />}
              />
            }
            name="New Tasks"
            value="154"
          />
        </div>

        <div key="f">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
                }
              />
            }
            name="Total Projects"
            value="2935"
          />
        </div>

        <div key="g">
          <TotalSpent />
        </div>

        <div key="h">
          <WeeklyRevenue />
        </div>

        <div key="i">
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div>
        <div key="j">
          <DailyTraffic />
        </div>
        <div key="k">
          <PieCard />
        </div>
        <div key="l">
          <ComplexTable
            columnsData={columnsDataComplex}
            tableData={tableDataComplex}
          />
        </div>
        <div key="m">
          <Tasks />
        </div>

        {/* <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
          <SimpleGrid
            columns={{ base: 1, md: 2, xl: 2 }}
            gap="20px"
          ></SimpleGrid>
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
          <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
            <MiniCalendar h="100%" minW="100%" selectRange={false} />
          </SimpleGrid>
        </SimpleGrid> */}
      </ReactGridLayout>
    </Box>
  );
}

// export default class BasicLayout extends React.PureComponent {
//   static defaultProps = {
//     className: "layout",
//     items: 5,
//     rowHeight: 30,
//     onLayoutChange: function () {},
//     cols: 12,
//   };

//   constructor(props) {
//     super(props);

//     const layout = this.generateLayout();
//     this.state = { layout };
//   }

//   generateDOM() {
//     return _.map(_.range(this.props.items), function (i) {
//       return (
//         <div key={i} style={{ backgroundColor: "grey" }}>
//           <span className="text">{i}</span>
//         </div>
//       );
//     });
//   }

//   generateLayout() {
//     const p = this.props;
//     return _.map(new Array(p.items), function (item, i) {
//       const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
//       return {
//         x: 0,
//         y: 1,
//         w: 12,
//         h: 5,
//         i: i.toString(),
//       };
//     });
//   }

//   onLayoutChange(layout) {
//     this.props.onLayoutChange(layout);
//   }

//   render() {
//     return (
//       <ReactGridLayout
//         layout={this.state.layout}
//         onLayoutChange={this.onLayoutChange}
//         {...this.props}
//       >
//         {this.generateDOM()}
//       </ReactGridLayout>
//     );
//   }
// }

// import("./test-hook").then((fn) => fn.default(BasicLayout));
