export default function monthlyData(data, labels, labelColor) {
  let totalExpense = data.reduce((prev, curr) => prev + curr, 0);
  const monthlyData = {
    datasets: [
      {
        data: data,
        backgroundColor: labelColor,
        weight: "40",
      },
    ],
    labels: labels,
  };

  const monthlyConfig = {
    type: "doughnut",
    data: monthlyData,
    options: {
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      cutout: "80%",
    },
    plugins: [
      {
        id: "text",
        beforeDraw: function (chart) {
          const width = chart.width;
          const height = chart.height;
          const ctx = chart.ctx;

          const text = `${totalExpense.toLocaleString()}원`;
          ctx.font = "24" + "px " + "Noto Sans CJK KR";
          ctx.fillStyle = "#000000";

          const textX = width / 2 - ctx.measureText(text).width / 2;
          const textY = height / 2 + 12;

          ctx.fillText(text, textX, textY);
        },
      },
    ],
  };

  return monthlyConfig;
}
