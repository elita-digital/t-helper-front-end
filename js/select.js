class Select {
  constructor($selectWrap, className = "select") {
    const $select = $selectWrap.querySelector(`.${className}`);
    const $value = $selectWrap.querySelector(`.${className}__value`);
    const $native = $selectWrap.querySelector("select");
    const $options = Array.from($selectWrap.querySelectorAll("option"));

    let listHtml = `<div class="${className}__list">`;
    $options.forEach(($option) => {
      listHtml += `<a href="#" class="${className}__item" data-value="${$option.value}">${$option.innerText}</a>`;

      if ($option.getAttribute("selected") !== null) {
        $select.classList.add("has-value");
        $value.innerText = $option.innerText;
      }
    });
    listHtml += "</div>";

    $selectWrap.insertAdjacentHTML("beforeend", listHtml);

    const $list = $selectWrap.querySelector(`.${className}__list`);
    const $items = Array.from(
      $selectWrap.querySelectorAll(`.${className}__item`)
    );

    $select.addEventListener("click", (e) => {
      e.preventDefault();

      $list.classList.toggle("active");
      $select.classList.toggle("active");
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
    $selects.forEach(($select) => new Select($select));
  }
}

Select.initAll();
