import fetchData from "./fetchData.js";
import TransactionList from "./list.js";
import dailyData from "./dailyReport.js";

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
  const dailyChart = new Chart(
    document.getElementById("dailyBarChart"),
    dailyData(list.getDailyExpenseData())
  );
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
