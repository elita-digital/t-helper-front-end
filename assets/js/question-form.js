class Autocomplete {
  constructor($autocomplete) {
    const $input = $autocomplete.querySelector("input");
    const $items = Array.from(
      $autocomplete.querySelectorAll(".question-form__autocomplete-item")
    );

    $input.addEventListener("input", () => {
      $items.forEach(($item) => {
        $item.classList.add("hidden");

        if (
          $input.value.length > 2 &&
          $item.innerText.toLowerCase().includes($input.value.toLowerCase())
        ) {
          $item.classList.remove("hidden");
        }
      });

      if (!!$items.find(($item) => !$item.classList.contains("hidden"))) {
        $autocomplete.classList.add("active");
      } else {
        $autocomplete.classList.remove("active");
      }
    });

    $input.addEventListener("blur", () => {
      setTimeout(() => {
        if ($input !== document.activeElement) {
          $autocomplete.classList.remove("active");
        }
      }, 500);
    });

    $items.forEach(($item) => {
      $item.addEventListener("click", (e) => {
        e.preventDefault();

        $input.value = $item.innerText;
        $input.dispatchEvent(new Event("change"));
      });
    });
  }

  static init() {
    document
      .querySelectorAll(".question-form__autocomplete")
      .forEach(($el) => new Autocomplete($el));
  }
}

Autocomplete.init();

const $questionForm = document.querySelector(".question-form");

if ($questionForm) {
  const $step1 = $questionForm.querySelector(".question-form__step-1");
  const $step1Inputs = Array.from(
    $step1.querySelectorAll(".question-form__input")
  );
  const $step1Next = $step1.querySelector(".question-form__button");
  const $step2 = $questionForm.querySelector(".question-form__step-2");

  const $filled = Array.from(
    $questionForm.querySelectorAll(".question-form__filled")
  );
  const $locked = Array.from(
    $questionForm.querySelectorAll(".question-form__locked")
  );

  $filled.forEach(($wrap) => {
    const $edit = $wrap.querySelector(".question-form__filled-edit");
    const $input = $wrap.querySelector(".question-form__input");

    $edit.addEventListener("click", (e) => {
      e.preventDefault();

      $wrap.classList.remove("question-form__filled");
      $input.removeAttribute("disabled");
      $edit.remove();
    });
  });

  $locked.forEach(($wrap) => {
    $wrap.addEventListener("click", () => {
      const isActive = $wrap.classList.contains("active");

      $locked.forEach(($wrap) => {
        $wrap.classList.remove("active");
      });

      if (!isActive) $wrap.classList.add("active");
    });
  });

  const isInputsFilled = () => {
    return $step1Inputs.reduce(
      (acc, $input) => acc && $input.value.length > 0,
      true
    );
  };

  $step1Inputs.forEach(($input) => {
    $input.addEventListener("change", () => {
      if (isInputsFilled())
        $step1Next.classList.remove("question-form__button--disabled");
    });
  });

  if (isInputsFilled())
    $step1Next.classList.remove("question-form__button--disabled");

  $step1Next.addEventListener("click", (e) => {
    e.preventDefault();

    $step1.classList.remove("active");
    $step2.classList.add("active");
  });
}
