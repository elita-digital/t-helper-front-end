const $popup = document.querySelector(".calc-popup");
const $openLinks = Array.from(document.querySelectorAll(".js-calc-open"));
const $closeLinks = Array.from(document.querySelectorAll(".js-calc-close"));
const $nextLinks = Array.from(document.querySelectorAll(".js-calc-next"));

$openLinks.forEach(($openLink) => {
  $openLink.addEventListener("click", (e) => {
    e.preventDefault();

    $popup.classList.add("active");
    document.body.classList.add("hide-scroll");
  });
});

$closeLinks.forEach(($closeLink) => {
  $closeLink.addEventListener("click", (e) => {
    e.preventDefault();

    $popup.classList.remove("active");
    document.body.classList.remove("hide-scroll");
  });
});

$nextLinks.forEach(($nextLink) => {
  $nextLink.addEventListener("click", (e) => {
    e.preventDefault();

    const $currentStep = $popup.querySelector(".calc-popup__step.active");
    const $nextStep = $currentStep.nextElementSibling;

    $currentStep.classList.remove("active");
    $nextStep.classList.add("active");
  });
});

const $selects = Array.from(
  document.querySelectorAll(".calc-popup__select-wrap")
);
$selects.forEach(($selectWrap) => {
  const $select = $selectWrap.querySelector(".calc-popup__select");
  const $value = $selectWrap.querySelector(".calc-popup__select-value");
  const $native = $selectWrap.querySelector("select");
  const $options = Array.from($selectWrap.querySelectorAll("option"));

  let listHtml = '<div class="calc-popup__select-list">';
  $options.forEach(($option) => {
    listHtml += `<a href="#" class="calc-popup__select-item" data-value="${$option.value}">${$option.innerText}</a>`;
  });
  listHtml += "</div>";

  $selectWrap.insertAdjacentHTML("beforeend", listHtml);

  const $list = $selectWrap.querySelector(".calc-popup__select-list");
  const $items = Array.from(
    $selectWrap.querySelectorAll(".calc-popup__select-item")
  );

  $select.addEventListener("click", (e) => {
    e.preventDefault();

    $list.classList.add("active");
    $select.classList.add("active");
  });

  $items.forEach(($item) => {
    $item.addEventListener("click", (e) => {
      e.preventDefault();

      $list.classList.remove("active");
      $select.classList.remove("active");
      $select.classList.add("has-value");
      $value.innerText = $item.innerText;
      $native.value = $item.dataset.value;
    });
  });
});
