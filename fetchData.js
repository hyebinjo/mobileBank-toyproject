const fetchData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  const bankList = await data.bankList.reverse();
  return bankList;
};

export default fetchData;
