{
    const API_KEY = "eaced91391b22d04f8aa012fd73282d2";

    const app = {
        form: document.querySelector("form"),
        input: document.querySelector("form input"),
        submitBtn: document.querySelector("form button"),
        weatherDataSection: document.querySelector(".weather-data"),
        cityHeader: document.querySelector(".weather-data .city"),
        tempHeader: document.querySelector(".main-temp .temp"),
        conditionImg: document.querySelector(".description .condition-img"),
        tempUnitsDiv: document.querySelector(".temp-units"),
        kelvinLabel: document.querySelector(".temp-units .unit:last-of-type"),
        tempDescription: document.querySelector(".description .description-text"),
        humidityPara: document.querySelector(".env-conditions .humidity"),
        pressurePara: document.querySelector(".env-conditions .pressure"),
        windSpeedPara: document.querySelector(".env-conditions .wind-speed"),
        sunrisePara: document.querySelector(".sun .sunrise"),
        sunsetPara: document.querySelector(".sun .sunset"),
        canGetWeatherData: true,
        celsiusTemp: null,
        fahrTemp: null,
        kelvinTemp: null,
        getWeatherData(city) {
            return new Promise(function(resolve, reject) {
                const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}`;
                const req = new XMLHttpRequest();
                req.timeout = 8000;
                req.addEventListener("error", () => reject("Error: unable to fetch data."));
                req.addEventListener("load", () => resolve(req.response));
                req.open("GET", url);
                req.send();
            });
        },
        setTemps(temp) {
            this.kelvinTemp = Math.round(temp);
            this.celsiusTemp = Math.round(temp - 273.15);
            this.fahrTemp = Math.round(this.celsiusTemp * 1.8 + 32);
        },
        toHours(timestamp) {
            const date = new Date(timestamp * 1000);
            let hours = date.getHours();
            let minutes = date.getMinutes();
            if (minutes < 10) minutes = `0${minutes}`;
            if (hours < 10) hours = `0${hours}`;
            return `${hours}:${minutes} (GMT-6)`;
        },
        renderWeatherData(res) {
            const {main, name, sys, weather, wind} = JSON.parse(res);
            this.setTemps(main.temp);

            this.conditionImg.src = `http://openweathermap.org/img/w/${weather[0].icon}.png`;

            this.cityHeader.textContent = `${name}, ${sys.country}`;
            this.tempHeader.textContent = this.kelvinTemp;
            this.tempDescription.textContent = weather[0].description;

            this.windSpeedPara.textContent = `${wind.speed} m/s`;
            this.humidityPara.textContent = `${main.humidity}%`;
            this.pressurePara.textContent = `${main.pressure}hPa`;

            this.sunrisePara.textContent = this.toHours(sys.sunrise);
            this.sunsetPara.textContent = this.toHours(sys.sunset);

            document.querySelector(".active").classList.remove("active");
            this.kelvinLabel.classList.add("active");
            this.weatherDataSection.classList.add("show");
        },
        handleSubmitEvent(ev) {
            ev.preventDefault();
            if (this.canGetWeatherData) {
                this.getWeatherData(this.input.value)
                    .then(res => this.renderWeatherData(res))
                    .catch(err => console.log(err));
                this.canGetWeatherData = false;
                this.input.value = "";
                this.input.focus();
                this.submitBtn.disabled = true;
            }
            setTimeout(() => {
                this.canGetWeatherData = true;
                this.submitBtn.disabled = false;
            }, 5000);
            return false;
        },
        handleTempUnitClick(ev) {
            if (ev.target.getAttribute("data-unit") === "c") {
                document.querySelector(".active").classList.remove("active");
                ev.target.classList.add("active");
                this.tempHeader.textContent = this.celsiusTemp;
            }
            if (ev.target.getAttribute("data-unit") === "f") {
                document.querySelector(".active").classList.remove("active");
                ev.target.classList.add("active");
                this.tempHeader.textContent = this.fahrTemp;
            }
            if (ev.target.getAttribute("data-unit") === "k") {
                document.querySelector(".active").classList.remove("active");
                ev.target.classList.add("active");
                this.tempHeader.textContent = this.kelvinTemp;
            }
        },
        initEventListeners() {
            this.form.addEventListener("submit", ev => this.handleSubmitEvent(ev));
            this.tempUnitsDiv.addEventListener("click", ev => this.handleTempUnitClick(ev));
        }
    };

    app.initEventListeners();
}
