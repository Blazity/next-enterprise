"use client";
import Grid from "@mui/material/Grid2"; // Usamos Grid2 según tu versión avanzada
import React from "react";
import Chart from "@organisms/Dashboard/Chart";
import DashboardHeader from "@organisms/Dashboard/DashboardHeader";
import RecentTransactions from "@organisms/Dashboard/RecentTransactions";
import Sidebar from "@organisms/Dashboard/Sidebar";
import StatCard from "@organisms/Dashboard/StatCard";

const salesData = [
  { name: "Ene", total: 4000 },
  { name: "Feb", total: 3000 },
  { name: "Mar", total: 5000 },
  { name: "Abr", total: 4500 },
  { name: "May", total: 6000 },
  { name: "Jun", total: 5500 },
];

const recentTransactions = [
  { id: 1, customer: "Cliente 1", products: 3, total: 150.5, date: "2023-06-01" },
  { id: 2, customer: "Cliente 2", products: 2, total: 75.2, date: "2023-06-02" },
  { id: 3, customer: "Cliente 3", products: 5, total: 220.0, date: "2023-06-03" },
  { id: 4, customer: "Cliente 4", products: 1, total: 30.99, date: "2023-06-04" },
  { id: 5, customer: "Cliente 5", products: 4, total: 180.75, date: "2023-06-05" },
];

const Dashboard: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <DashboardHeader />
        <div className="p-4">
          <Grid container spacing={3}>
            {/* Tarjetas de Estadísticas */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Ventas Totales"
                value="$45,231.89"
                change="+20.1% respecto al mes anterior"
                icon="AttachMoney"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Transacciones"
                value="2,350"
                change="+180.1% respecto al mes anterior"
                icon="ShoppingCart"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Clientes Activos"
                value="573"
                change="+201 desde la última semana"
                icon="People"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Tasa de Conversión"
                value="88.6%"
                change="+2.2% respecto al mes anterior"
                icon="TrendingUp"
              />
            </Grid>

            {/* Gráfico */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Chart data={salesData} />
            </Grid>

            {/* Transacciones Recientes */}
            <Grid size={{ xs: 12, md: 8 }}>
              <RecentTransactions transactions={recentTransactions} />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
