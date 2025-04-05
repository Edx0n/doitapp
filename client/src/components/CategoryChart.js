import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components (same as before)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CategoryChart = ({ todos }) => {
  // Processando os dados para o gráfico usando useMemo para melhorar a performance
  const chartData = useMemo(() => {
    // Contando o número de tarefas por categoria
    const categoryCounts = {};

    todos.forEach((todo) => {
      const category = todo.category || "Sem categoria";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    // Preparando os dados para o gráfico
    const categories = Object.keys(categoryCounts);
    const counts = Object.values(categoryCounts);

    // Definindo as cores com base no mapeamento de categorias existente
    const categoryColors = {
      Trabalho: "#1976d2", // Azul
      Lazer: "#ed6c02", // Laranja
      Estudo: "#2e7d32", // Verde
      "Sem categoria": "#757575", // Cinza para itens sem categoria
    };

    const backgroundColors = categories.map(
      (category) => categoryColors[category] || "#6366f1"
    );

    return {
      labels: categories,
      datasets: [
        {
          label: "Número de Tarefas",
          data: counts,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map((color) => color),
          borderWidth: 1,
        },
      ],
    };
  }, [todos]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff",
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Distribuição de Tarefas por Categoria",
        color: "#fff",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          precision: 0,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  return (
    <div style={{ height: "300px", marginBottom: "32px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CategoryChart;
