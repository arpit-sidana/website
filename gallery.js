const params = new URLSearchParams(window.location.search);
const collection = params.get("collection");
const item = params.get("item");
const labels = {
  "fall-in-new-england": "fall in new england", "cold-air-intake": "cold air intake",
  "manhattan-skyline": "manhattan skyline", "east-coast": "east coast",
  "bmw-m-entourage": "bmw m entourage", autocross: "autocross",
  "more-autocross": "more autorcross", "parking-lot": "parking lot",
  mishas: "mishas", suburbs: "suburbs", "starbucks-roastery-nyc": "starbucks roastery nyc",
  "commonwealth-joe": "commonwealth joe", philly: "philly", seattle: "seattle",
  "tysons-corner": "tysons corner", "tatte-dc": "tatte dc", "arlington-va": "arlington va",
  "arlington-va-pt2": "arlington va pt2", "sweet-science-coffee": "sweet science coffee",
  georgetown: "georgetown", "arlington-va-pt3": "arlington va pt3",
  "starbucks-roastery-nyc-2": "starbucks roastery nyc", dc: "dc",
  "starbucks-holiday-season": "starbucks holiday season", peets: "peets"
};

if ((collection === "cars" || collection === "coffee") && labels[item]) {
  const label = labels[item];
  document.title = `${label} — arpit sidana™`;
  document.querySelector("#title").textContent = label;
  document.querySelector("#back").href = `${collection}.html`;
  document.querySelector("#back").textContent = collection;
  const image = document.querySelector("#image");
  image.src = `assets/images/${collection}/${item}.webp`;
  image.alt = label;
} else {
  window.location.replace("index.html");
}

