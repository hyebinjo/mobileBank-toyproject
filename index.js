import fetchData from "./fetchData.js";
import TransactionList from "./list.js";
import dailyData from "./dailyReport.js";
import monthlyData from "./monthlyData.js";
import monthlyDataList from "./monthlyDataList.js";

const getBankList = async () => {
  const bankList = await fetchData(
    "https://gist.githubusercontent.com/hyebinjo/910c88016597b5fd3df83e99c8e1f7cc/raw/56a7fe7d5f03349a09c473a3f620871b750ce706/bank.json"
  );
  return bankList;
};

const render = async () => {
  const list = new TransactionList(
    await getBankList(),
    document.querySelector(".account-detail")
  );
  list.renderDays();
  list.renderItems();
  list.addDragEventListener();

  //지출관리 일간리포트
  const dailyExpenseArr = list.getDailyExpenseData();
  const dailyChart = new Chart(
    document.getElementById("dailyBarChart"),
    dailyData(dailyExpenseArr)
  );

  //지출관리 월 지출패턴
  const labels = ["주유비", "건강관리비", "외식비", "장보기", "상점"];
  const labelColor = ["#BD5B00", "#0057BD", "#00BDB2", "#FEC229", "#C4C4C4"];
  const classifiedExpenseArr = list.getClassifiedExpenseData();
  const monthlyChart = new Chart(
    document.getElementById("monthlyDoughnutChart"),
    monthlyData(classifiedExpenseArr, labels, labelColor)
  );
  monthlyDataList(classifiedExpenseArr, labels, labelColor);
};
render();

// 지출관리 화면 열기
const graphBtn = document.querySelector(".link-graph");
graphBtn.addEventListener("click", (e) => {
  const expensePage = document.querySelector(".expense-management");
  expensePage.style.display = "block";
});

//지출관리 화면 닫기
const closeBtn = document.querySelector(".expense-management__closeBtn");
closeBtn.addEventListener("click", (e) => {
  const expensePage = document.querySelector(".expense-management");
  expensePage.style.display = "none";
});
