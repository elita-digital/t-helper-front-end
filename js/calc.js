let DATA;

class Select {
  constructor($selectWrap) {
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
    const $selects = Array.from(
      document.querySelectorAll(".calc-popup__select-wrap")
    );

    $selects.forEach(($selectWrap) => new Select($selectWrap));
  }
}

class Calculate {
  static all(
    birthday,
    CharlsonIndexAnswers,
    basicActivityAnswers,
    IADLAnswers
  ) {
    const age = Calculate.age(birthday);
    const CharlsonIndex = Calculate.CharlsonIndex(CharlsonIndexAnswers);
    const basicActivity = Calculate.basicActivity(basicActivityAnswers);
    const IADL = Calculate.IADL(IADLAnswers);
    const TTL = Calculate.TTL(age, CharlsonIndex, basicActivity, IADL);

    return {
      CharlsonIndex,
      basicActivity,
      IADL,
      TTL,
    };
  }

  static age({ day, month, year }) {
    try {
      return (
        ((new Date().getTime() - new Date(year, month, day)) /
          (24 * 3600 * 365.25 * 1000)) |
        0
      );
    } catch (e) {
      return 0;
    }
  }

  static CharlsonIndex(answers) {
    let CharlsonIndex = 0;

    answers.forEach((value, key) => {
      CharlsonIndex += DATA.charlson[key].answers[value].value;
    });

    return CharlsonIndex;
  }

  static basicActivity(answers) {
    let basicActivity = answers.length;

    answers.forEach((value) => {
      basicActivity -= value;
    });

    return basicActivity;
  }

  static IADL(answers) {
    let IADL = answers.length;

    answers.forEach((value, key) => {
      IADL -= DATA.iadl[key].answers[value].value;
    });

    return IADL;
  }

  static TTL(age, CharlsonIndex, basicActivity, IADL) {
    let TTL = 0;

    if (age >= 80) {
      TTL += 2;
    } else if (age >= 75) {
      TTL += 1;
    }

    if (CharlsonIndex >= 2) TTL += 1;

    if (basicActivity <= 4) TTL += 1;

    if (IADL <= 5) TTL += 1;

    return TTL;
  }
}

class Calculator {
  constructor() {
    this.$popup = document.querySelector(".calc-popup");

    this.$openLinks = Array.from(document.querySelectorAll(".js-calc-open"));
    this.$closeLinks = Array.from(document.querySelectorAll(".js-calc-close"));
    this.$resetLinks = Array.from(document.querySelectorAll(".js-calc-reset"));
    this.$nextLinks = Array.from(document.querySelectorAll(".js-calc-next"));

    this.$charlsonStep = document.querySelector(".calc-popup__charlson");
    this.$charlsonContent = this.$charlsonStep.querySelector(
      ".calc-popup__step-content"
    );
    this.$charlsonValue = this.$charlsonStep.querySelector(
      ".calc-popup__step-value-box"
    );

    this.$activityStep = document.querySelector(".calc-popup__activity");
    this.$activityContent = this.$activityStep.querySelector(
      ".calc-popup__step-content"
    );
    this.$activityValue = this.$activityStep.querySelector(
      ".calc-popup__step-value-box"
    );

    this.$iadlStep = document.querySelector(".calc-popup__iadl");
    this.$iadlContent = this.$iadlStep.querySelector(
      ".calc-popup__step-content"
    );
    this.$iadlValue = this.$iadlStep.querySelector(
      ".calc-popup__step-value-box"
    );

    this.$result = document.querySelector(".calc-popup__result");
    this.$resultValue = this.$result.querySelector(
      ".calc-popup__result-content"
    );
    this.$pdfLink = this.$result.querySelector(".js-calc-pdf");

    this.render();

    this.$birthdayInputs = Array.from(
      this.$charlsonStep.querySelectorAll("input[type=text]")
    );
    this.$charlsonRadios = Array.from(
      this.$charlsonStep.querySelectorAll("input[type=radio]")
    );
    this.$activityRadios = Array.from(
      this.$activityStep.querySelectorAll("input[type=radio]")
    );
    this.$iadlSelects = Array.from(this.$iadlStep.querySelectorAll("select"));

    this.$birthdayInputs.forEach(($input) => {
      $input.addEventListener("change", (e) => this.recalc());
    });

    this.$charlsonRadios.forEach(($radio) => {
      $radio.addEventListener("change", (e) => this.recalc());
    });

    this.$activityRadios.forEach(($radio) => {
      $radio.addEventListener("change", (e) => this.recalc());
    });

    this.$iadlSelects.forEach(($select) => {
      $select.addEventListener("change", (e) => this.recalc());
    });

    this.$openLinks.forEach(($openLink) => {
      $openLink.addEventListener("click", (e) => {
        e.preventDefault();

        this.open();
      });
    });

    this.$closeLinks.forEach(($closeLink) => {
      $closeLink.addEventListener("click", (e) => {
        e.preventDefault();

        this.close();
      });
    });

    this.$nextLinks.forEach(($nextLink) => {
      $nextLink.addEventListener("click", (e) => {
        e.preventDefault();

        this.next();
      });
    });

    this.$resetLinks.forEach(($resetLink) => {
      $resetLink.addEventListener("click", (e) => {
        e.preventDefault();

        this.reset();
      });
    });
  }

  render() {
    let charlsonContentHtml = "";
    let activityContentHtml = "";
    let iadlContentHtml = "";

    DATA.charlson.forEach((item, i) => {
      let html = `<div class="calc-popup__checkbox-wrap"><span class="calc-popup__checkbox-title">${item.title}</span>`;

      item.answers.forEach((answer, j) => {
        html += `
          <label class="calc-popup__checkbox">
            <input type="radio" name="charlson-${i}" value="${j}" />
            <i></i>
            <span>${answer.label}</span>
          </label>`;
      });

      html += `</div>`;

      charlsonContentHtml += html;
    });

    DATA.activity.forEach((item, i) => {
      let html = `
        <div class="calc-popup__checkbox-wrap">
          <span class="calc-popup__checkbox-title">${item.title}</span>
          <span class="calc-popup__checkbox-descr">${item.descr}</span>
          <label class="calc-popup__checkbox">
            <input type="radio" name="activity-${i}" value="1" />
            <i></i>
            <span>Нет</span>
          </label>
          <label class="calc-popup__checkbox">
            <input type="radio" name="activity-${i}" value="0" />
            <i></i>
            <span>Да</span>
          </label>
        </div>`;

      activityContentHtml += html;
    });

    DATA.iadl.forEach((item, i) => {
      let html = `<div class="calc-popup__select-wrap"><div class="calc-popup__select"><span class="calc-popup__select-label">${item.title}</span><span class="calc-popup__select-value"></span></div><select name="iadl-${i}">`;

      item.answers.forEach((answer, j) => {
        html += `<option value="${j}">${answer.label}</option>`;
      });

      html += `</select></div>`;

      iadlContentHtml += html;
    });

    this.$charlsonContent.innerHTML = charlsonContentHtml;
    this.$activityContent.innerHTML = activityContentHtml;
    this.$iadlContent.innerHTML = iadlContentHtml;

    Select.initAll();
  }

  open() {
    this.$popup.classList.add("active");
    document.body.classList.add("hide-scroll");
  }

  close() {
    this.$popup.classList.remove("active");
    document.body.classList.remove("hide-scroll");
  }

  reset() {
    this.$charlsonStep.reset();
    this.$activityStep.reset();
    this.$iadlStep.reset();

    this.$iadlSelects.forEach(($select) => {
      $select.selectedIndex = -1;
      $select.dispatchEvent(new Event("change"));
    });

    this.$result.classList.remove("active");
    this.$charlsonStep.classList.add("active");
  }

  next() {
    const $currentStep = this.$popup.querySelector(".calc-popup__step.active");
    const $nextStep = $currentStep.nextElementSibling;

    $currentStep.classList.remove("active");
    $nextStep.classList.add("active");
  }

  recalc() {
    const birthday = {};
    this.$birthdayInputs.forEach(($input) => {
      birthday[$input.name] = Number($input.value) || undefined;
    });

    const CharlsonIndexAnswers = Array(DATA.charlson.length).fill(0);
    this.$charlsonRadios.forEach(($radio) => {
      if ($radio.checked) {
        const id = Number($radio.name.replace("charlson-", ""));
        const value = Number($radio.value);

        CharlsonIndexAnswers[id] = value;
      }
    });

    const basicActivityAnswers = Array(DATA.activity.length).fill(1);
    this.$activityRadios.forEach(($radio) => {
      if ($radio.checked) {
        const id = Number($radio.name.replace("activity-", ""));
        const value = Number($radio.value);

        basicActivityAnswers[id] = value;
      }
    });

    const IADLAnswers = Array(DATA.iadl.length).fill(0);
    this.$iadlSelects.forEach(($select) => {
      const id = Number($select.name.replace("iadl-", ""));
      const value = Number($select.value);

      IADLAnswers[id] = value;
    });

    const { CharlsonIndex, basicActivity, IADL, TTL } = Calculate.all(
      birthday,
      CharlsonIndexAnswers,
      basicActivityAnswers,
      IADLAnswers
    );

    this.$charlsonValue.innerText = CharlsonIndex;
    this.$activityValue.innerText = basicActivity;
    this.$iadlValue.innerText = IADL;

    switch (TTL) {
      case 0: {
        this.$resultValue.innerHTML = `
          <span class="calc-popup__result-circle">0</span>
          <span>Пациент «в хорошей физической форме»</span>`;

        break;
      }
      case 1: {
        this.$resultValue.innerHTML = `
          <span class="calc-popup__result-circle" style="opacity: 0.7">1</span>
          <span>Пациент «в средней физической форме»</span>`;

        break;
      }
      default: {
        this.$resultValue.innerHTML = `
          <span class="calc-popup__result-circle" style="opacity: 0.5">${TTL}</span>
          <span>Пациент «в ослабленном состоянии»</span>`;
      }
    }
  }
}

async function bootstrap() {
  DATA = await fetch("data.json").then((data) => data.json());

  new Calculator();
}

bootstrap();
