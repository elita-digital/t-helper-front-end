class Select {
  constructor($selectWrap) {
    const $select = $selectWrap.querySelector(".select");
    const $value = $selectWrap.querySelector(".select__value");
    const $native = $selectWrap.querySelector("select");
    const $options = Array.from($selectWrap.querySelectorAll("option"));

    let listHtml = '<div class="select__list">';
    $options.forEach(($option) => {
      listHtml += `<a href="#" class="select__item" data-value="${$option.value}">${$option.innerText}</a>`;

      if ($option.selected) {
        $select.classList.add("has-value");
        $value.innerText = $option.innerText;
      }
    });
    listHtml += "</div>";

    $selectWrap.insertAdjacentHTML("beforeend", listHtml);

    const $list = $selectWrap.querySelector(".select__list");
    const $items = Array.from($selectWrap.querySelectorAll(".select__item"));

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

        $native.value = $item.dataset.value;

        $native.dispatchEvent(new Event("change"));
      });
    });

    $native.addEventListener("change", (e) => {
      if (e.target.value) {
        $select.classList.add("has-value");
        $value.innerText = e.target.querySelector(
          `option:nth-child(${e.target.selectedIndex + 1})`
        ).innerText;
      } else {
        $select.classList.remove("has-value");
        $value.innerText = "";
      }
    });
  }

  static initAll() {
    const $selects = Array.from(document.querySelectorAll(".select__wrap"));

    $selects.forEach(($selectWrap) => new Select($selectWrap));
  }
}

Select.initAll();
