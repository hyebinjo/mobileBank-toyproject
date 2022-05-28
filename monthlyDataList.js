export default function monthlyDataList(data, labels, labelColor) {
  const ul = document.querySelector(".monthly-report__list");
  for (let i = 0; i < labels.length; i++) {
    const li = document.createElement("li");
    li.setAttribute("class", "monthly-report__item");
    ul.appendChild(li);
    li.innerHTML = `
    <span class="monthly-report__content"><strong style="color: ${
      labelColor[i]
    };">●${`  `}</strong>${labels[i]}</span>
    <span class="monthly-report__amount">${data[i].toLocaleString()}원</span>
  `;
  }
}
