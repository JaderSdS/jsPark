import React, { useContext, useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import Layout from "../../components/layout";
import { allServices, estaMenus } from "./checkIn";
import { Button, Grid, MenuItem, Select, Typography } from "@mui/material";
import { getDocs, query, where } from "firebase/firestore";
import { parkingLotRef, ticketsRef } from "../../services/firebaseService";
import { ParkingLotInterface } from "../administrador/ParkingLotCreateEdit";
import { AuthContext } from "../../contexts/UserContext";

export const Relatorios = () => {
  const user = useContext(AuthContext);
  const [parkingLot, setParkingLot] = useState<ParkingLotInterface>();

  const defaultData = {
    axisData: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    seriesData: [820, 932, 901, 934, 1290, 1330, 1320],
  };
  const [reportData, setReportData] = useState<typeof defaultData>(defaultData); // [

  const [options, setOptios] = useState({
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: "category",
      data: defaultData.axisData,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: defaultData.seriesData,
        type: "line",
        smooth: true,
      },
    ],
    tooltip: {
      trigger: "axis",
    },
  });

  //   <ReactECharts option={options} />

  const [reportTime, setReportTime] = useState<"day" | "month" | "weekly">(
    "day"
  );

  const [report, setReport] = useState(false);

  const getParkingLot = async () => {
    const data = await getDocs(parkingLotRef);
    const parkingLot = data.docs.map((doc) => doc.data());
    const parkingLotCnpj = parkingLot.filter(
      (parkingLot) => parkingLot.email === user?.email
    );
    setParkingLot(parkingLotCnpj[0] as ParkingLotInterface);
  };

  useEffect(() => {
    getParkingLot();
  }, []);

  const handleCreateReport = async (reporType: "tickets" | "cash") => {
    if (reporType === "tickets") {
      let cnpj = parkingLot?.cnpj;
      const ticketQuery = query(ticketsRef, where("cnpj", "==", cnpj));
      const parkingLotTickets = await getDocs(ticketQuery);
      const tickets = parkingLotTickets.docs.map((doc) => doc.data());
      const ticketsCnpj = tickets.filter(
        (ticket) => ticket.parkingLotCnpj === parkingLot?.cnpj
      );
      debugger;
      switch (reportTime) {
        case "day":
            // pegar todos os tickets do inicio ao fim do dia atual
            
            // filtrar os tickets por horario
            // pegar o valor de cada ticket
            // somar os valores

          break;
        case "weekly":
          break;
        case "month":
          break;
        default:
          break;
      }
    } else {
    }

    setReport(true);
  };

  return (
    <Layout menuItems={estaMenus}>
      <Grid container sx={{ marginTop: "80px" }} spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <Typography style={{ marginTop: "16px" }} variant="h4">
            Gerar relatórios
          </Typography>
        </Grid>
        <Grid item xs={6} md={3} sm={2}>
          <Typography style={{ marginTop: "16px" }} variant="h6">
            Relatorio de entradas e saidas:
          </Typography>
        </Grid>
        <Grid item xs={6} md={2} sm={2}>
          <Select
            fullWidth
            value={reportTime}
            onChange={(e) =>
              setReportTime(e.target.value as "day" | "month" | "weekly")
            }
          >
            <MenuItem value="day">Diário</MenuItem>
            <MenuItem value="weekly">Semanal</MenuItem>
            <MenuItem value="month">Mensal</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={6} md={2} sm={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleCreateReport("tickets")}
          >
            Gerar
          </Button>
        </Grid>
        <Grid item xs={6} md={5} sm={5}></Grid>
        <Grid item xs={6} md={3} sm={2}>
          <Typography style={{ marginTop: "16px" }} variant="h6">
            Relatorio de caixa:
          </Typography>
        </Grid>
        <Grid item xs={6} md={2} sm={2}>
          <Select
            fullWidth
            value={reportTime}
            onChange={(e) =>
              setReportTime(e.target.value as "day" | "month" | "weekly")
            }
          >
            <MenuItem value="day">Diário</MenuItem>
            <MenuItem value="weekly">Semanal</MenuItem>
            <MenuItem value="month">Mensal</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={6} md={2} sm={2}>
          <Button variant="contained" color="primary">
            Gerar
          </Button>
        </Grid>
        {report && (
          <Grid item xs={12} md={12} sm={12}>
            <ReactECharts option={options} />
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};