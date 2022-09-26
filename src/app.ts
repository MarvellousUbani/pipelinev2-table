let modifiedPageData = {};
let currentPage = 1;
const dataPageView = document.querySelector(
  "[data-pageview]"
) as HTMLElement | null;
const dataPrevBtn = document.querySelector(
  "[data-prevbtn]"
) as HTMLButtonElement | null;
const dataNextBtn = document.querySelector(
  "[data-nextbtn]"
) as HTMLButtonElement | null;

const startApp = async () => {
  // Onload
  fetchUserData(currentPage).then(() => {
    addData();
  });
};

async function fetchUserData(page = 1) {
  const response = await fetch(
    `https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84&page=${page}`
  );
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const userData = await response.json();

  // Caching & Modifying the fetched data into object
  modifiedPageData[currentPage] = userData["results"][0][currentPage];
  modifiedPageData[currentPage + 1] = userData["results"][0][currentPage + 1];
}

// Function to Build DOM

function addData() {
  let tBody = document.querySelector("tbody");
  tBody?.replaceChildren();

  let results = modifiedPageData[currentPage];
  let previousDisabled = currentPage == 1 ? true : false;

  let currentBuild = ``;

  if (tBody != undefined) {
    tBody.innerHTML = "";
  }

  for (let i = 0; i < results.length; i++) {
    const { id, age, gender, row } = results[i];
    currentBuild += `<tr data-entryid ='${id}'><td>${row}</td><td>${gender}</td><td>${age}</td> </tr>`;
  }

  // Showing current page on UI
  if (dataPageView != undefined) {
    dataPageView.innerHTML = `Showing Page ${currentPage}`;
    dataPageView.dataset.pageview = String(currentPage);
  }

  // Determine previous button state
  if (dataPrevBtn != undefined) {
    dataPrevBtn.disabled = previousDisabled;
    dataPrevBtn.dataset.prevbtn = String(currentPage - 1);
  }

  // Next Button Data state
  if (dataNextBtn != undefined) {
    dataNextBtn.dataset.nextbtn = String(currentPage + 1);
  }

  if (tBody != undefined) {
    tBody.innerHTML = currentBuild;
  }
  document.querySelector(".page-container")?.classList.add("active");
}

function nextData() {
  // If its an odd page then there's no data to fetch
  currentPage++;
  if (modifiedPageData[currentPage]) {
    addData();
    return;
  }

  fetchUserData(currentPage).then(() => {
    addData();
  });
}

dataNextBtn?.addEventListener("click", () => {
  nextData();
});

dataPrevBtn?.addEventListener("click", () => {
  currentPage--;
  addData();
});

document.addEventListener("DOMContentLoaded", startApp);
