import { Box, Flex, SimpleGrid, Text, theme } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { Header } from "../components/Header";

import { ApexOptions } from "apexcharts";
import { Sidebar } from "../components/Sidebar";
import { withSSRAuth } from "../utils/withSSRAuth";
import { useContext, useEffect } from "react";
import { newApi } from "../services/apiClient";
import { AuthContext } from "../contexts/AuthContext";
import { setupAPIClient } from "../services/api";
import { useCan } from "../services/hooks/useCan";
import { Can } from "../components/Can";

const Chart = dynamic(()=> import('react-apexcharts'), { ssr: false})

const options: ApexOptions = { //ou as const; no fim dessa const
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray[500]
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      color: theme.colors.gray[600]
    },
    axisTicks: {
      color: theme.colors.gray[600]
    },
    categories: [
      '2022-05-12T00:00:00.000Z',
      '2022-05-13T00:00:00.000Z',
      '2022-05-14T00:00:00.000Z',
      '2022-05-15T00:00:00.000Z',
      '2022-05-16T00:00:00.000Z',
      '2022-05-17T00:00:00.000Z',
      '2022-05-18T00:00:00.000Z',
    ],
  },
  fill: {
    opacity: 0.3,
    type: 'gradient',
    gradient: {
      shade: 'dark',
      opacityFrom: 0.7,
      opacityTo: 0.3,
    }
  }
};

const series = [
  { name: 'series1', data: [31, 120, 10, 28, 61, 18, 189]}
]

export default function Dashboard() {
  const { user } = useContext(AuthContext)

  useEffect(()=> {
    newApi.get('/me')
      .then(response => console.log(response))
      .catch(err => console.log(err))
  }, [])

  
  return (
    <Flex direction="column" h="100vh">
      <Header/>

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

          <Can>
            <SimpleGrid flex="1" gap="4" minChildWidth="320px" alignItems="flex-start">
              <Box
                p={["6", "8"]}
                bg="gray.800"
                borderRadius={8}
                pb="4"
              >
                <Text fontSize="lg" mb="4">Inscritos da semana</Text>
                <Chart options={options} series={series} type="area" height={160} />
              </Box>
              <Box
                p={["6", "8"]}
                bg="gray.800"
                borderRadius={8}
                pb="4"
              >
                <Text fontSize="lg" mb="4">Taxa de abertura</Text>
                <Chart options={options} series={series} type="area" height={160} />
              </Box>
            </SimpleGrid>
          </Can>
        
      </Flex>
    </Flex>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient= setupAPIClient(ctx)
  const response = await apiClient.get('/me')

  return {
    props: {}
  }
}, {
  permissions: ['metrics.list'],
  roles: ['administrator'],
})
