export default function dailyData(data) {
  const dailyData = {
    labels: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
    ],
    datasets: [
      {
        backgroundColor: "#38C976",
        data: data,
      },
    ],
  };

  const dailyConfig = {
    type: "bar",
    data: dailyData,
    options: {
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  return dailyConfig;
}
