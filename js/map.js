let DATA;

const mapConfig = {
  center: [58.6729574349446, 79.50365415310958],
  zoom: 3,
};

class MapSection {
  constructor() {
    this.filters = {
      city: null,
      lpu: null,
    };

    this.$map = document.querySelector(".map");
    this.$mapContainer = this.$map.querySelector(".map__container");
    this.$selectsContainer = this.$map.querySelector(".map__selects");
    this.$list = this.$map.querySelector(".map__list");

    this.render();

    this.$citySelect = this.$map.querySelector("select[name=city]");
    this.$citySelectItems = Array.from(
      this.$citySelect.nextElementSibling.querySelectorAll(".select__item")
    );
    this.$lpuSelect = this.$map.querySelector("select[name=lpu]");
    this.$lpuSelectItems = Array.from(
      this.$lpuSelect.nextElementSibling.querySelectorAll(".select__item")
    );
    this.$items = Array.from(this.$map.querySelectorAll(".map__item"));

    this.$citySelect.addEventListener("change", (e) => {
      e.preventDefault();

      this.setCity(Number(e.target.value));
    });

    this.$lpuSelect.addEventListener("change", (e) => {
      e.preventDefault();

      this.setLpu(Number(e.target.value));
    });

    this.$items.forEach(($item) => {
      const lpuId = Number($item.dataset.id);
      const $link = $item.querySelector(".map__item-link");

      $link.addEventListener("click", (e) => {
        e.preventDefault();

        this.$lpuSelect.value = lpuId;
        this.$lpuSelect.dispatchEvent(new Event("change"));
      });
    });

    ymaps.ready(() => {
      this.map = new ymaps.Map(this.$mapContainer, mapConfig);

      this.placemarks = DATA.lpus.map((lpu) => {
        const placemark = new ymaps.Placemark([lpu.lat, lpu.lng], {
          hintContent: lpu.title,
          balloonContent: lpu.title + "<br><br>" + lpu.address,
        });

        this.map.geoObjects.add(placemark);

        return placemark;
      });
    });
  }

  setCity(cityId) {
    if (cityId < 0) this.filters.city = null;
    else this.filters.city = cityId;

    this.$lpuSelect.value = -1;
    this.$lpuSelect.dispatchEvent(new Event("change"));
  }

  setLpu(lpuId) {
    if (lpuId < 0) this.filters.lpu = null;
    else this.filters.lpu = lpuId;

    this.applyFilters();
  }

  applyFilters() {
    this.map.geoObjects.removeAll();
    this.placemarks.forEach((placemark) => {
      this.map.geoObjects.add(placemark);
    });

    this.map.setCenter(mapConfig.center);
    this.map.setZoom(mapConfig.zoom);

    this.$items.forEach(($item) => {
      $item.classList.remove("hidden");
    });
    this.$citySelectItems.forEach(($item) => {
      $item.classList.remove("hidden");
    });
    this.$lpuSelectItems.forEach(($item) => {
      $item.classList.remove("hidden");
    });

    if (this.filters.city !== null) {
      this.map.geoObjects.removeAll();
      this.placemarks.forEach((placemark, id) => {
        const lpu = DATA.lpus[id];

        if (lpu.city === this.filters.city) this.map.geoObjects.add(placemark);
      });

      this.$items.forEach(($item) => {
        const id = Number($item.dataset.id);
        const lpu = DATA.lpus[id];

        if (this.filters.city !== lpu.city) $item.classList.add("hidden");
      });
      this.$lpuSelectItems.forEach(($item) => {
        const id = Number($item.dataset.value);

        if (id === -1) return;

        const lpu = DATA.lpus[id];

        if (this.filters.city !== lpu.city) $item.classList.add("hidden");
      });

      window.scrollTo(0, this.$mapContainer.offsetTop - 170);
    }

    if (this.filters.lpu !== null) {
      this.$items.forEach(($item) => {
        const id = Number($item.dataset.id);

        if (this.filters.lpu !== id) $item.classList.add("hidden");
      });

      const lpu = DATA.lpus[this.filters.lpu];
      const placemark = this.placemarks[this.filters.lpu];

      this.map.setCenter([lpu.lat, lpu.lng]);
      this.map.setZoom(17);
      this.map.geoObjects.removeAll();
      this.map.geoObjects.add(placemark);

      placemark.balloon.open();
    }
  }

  render() {
    const cities = DATA.cities
      .map((city, id) => {
        return `<option value="${id}">${city}</option>`;
      })
      .join("");

    const lpus = DATA.lpus
      .map((lpu, id) => {
        return `<option value="${id}">${lpu.title}</option>`;
      })
      .join("");

    this.$selectsContainer.innerHTML = `
    <div class="select__wrap">
      <div class="select">
        <span class="select__label">Город</span>
        <span class="select__value"></span>
      </div>
      <select name="city">
        <option value="-1" selected>Любой</option>
        ${cities}
      </select>
    </div>
    <div class="select__wrap">
      <div class="select">
        <span class="select__label">ЛПУ</span>
        <span class="select__value"></span>
      </div>
      <select name="lpu">
        <option value="-1" selected>Любой</option>
        ${lpus}
      </select>
    </div>`;

    Array.from(
      this.$selectsContainer.querySelectorAll(".select__wrap")
    ).forEach(($select) => {
      new Select($select);
    });

    const lpusList = DATA.lpus
      .map((lpu, id) => {
        return `
          <div class="map__item" data-id="${id}">
            <div class="map__item-title">${lpu.title}</div>
            <div class="map__item-content">
              <strong>${DATA.cities[lpu.city]},</strong><br />
              <span>${lpu.address}</span>
              <a href="#" class="map__item-link">Показать на карте</a>
            </div>
          </div>`;
      })
      .join("");

    this.$list.innerHTML = lpusList;
  }
}

async function bootstrap() {
  DATA = await fetch("assets/map.json").then((res) => res.json());

  new MapSection();
}

bootstrap();
