window.SITE_FEATURES = Object.freeze({
  bookshelf: false,
  substack: false,
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-feature]").forEach((element) => {
    element.hidden = !window.SITE_FEATURES[element.dataset.feature];
  });

  document.querySelectorAll("[data-feature-disabled]").forEach((element) => {
    element.hidden = Boolean(window.SITE_FEATURES[element.dataset.featureDisabled]);
  });

  document.querySelectorAll("meta[data-feature-robots]").forEach((element) => {
    if (window.SITE_FEATURES[element.dataset.featureRobots]) element.remove();
  });
});
