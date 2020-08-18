<template>
  <div id="app">
    <div class="wrapper">
      <div id="header">
        <div class="header-title">
          <img src="./assets/image/report.png" alt="Report">
          Helpdesk Report
        </div>
        <div>
          <button class="btn btn-outline-primary"
            @click="resetForm">
            Reset
          </button>
          <button class="btn btn-primary"
            @click="doCopy">
            Copy
            <img src="./assets/image/document.svg" alt="Copy">
          </button>
        </div>
      </div>

      <div id="content">
        <div class="traffic-datetime">
          <input v-model="datetime.date"
            type="number"
            min="1"
            max="31">

          <select v-model="datetime.month">
            <option v-for="(month, index) in options.months"
              :key="index"
              :value="month">
              {{ month }}
            </option>
          </select>

          <select v-model="datetime.year">
            <option v-for="(year, index) in years"
              :key="index"
              :value="year">
              {{ year }}
            </option>
          </select>

          <select v-model="datetime.hour">
            <option v-for="(hour, index) in options.times"
              :key="index"
              :value="hour.label">
              {{ hour.label }}
            </option>
          </select>
        </div>

        <div class="traffics">
          <div class="traffic-form">
            <TrafficProduct
              name="Hotel"
              type="hotel"
              key="hotel"
              :is-end-day="isEndDay"
              @update="setData" />

            <TrafficProduct
              name="Flight Domestic"
              type="flightDom"
              key="flightDom"
              :is-end-day="isEndDay"
              @update="setData" />

            <TrafficProduct
              name="Flight International"
              type="flightInt"
              key="flightInt"
              :is-end-day="isEndDay"
              @update="setData" />

            <TrafficProduct
              name="Train"
              type="train"
              key="train"
              :is-end-day="isEndDay"
              @update="setData" />

            <TrafficProduct
              name="Explore"
              type="explore"
              key="explore"
              :is-end-day="isEndDay"
              @update="setData" />

            <TrafficProduct
              name="Tour"
              type="tour"
              key="tour"
              :is-end-day="isEndDay"
              @update="setData" />
          </div>

          <div class="traffic-preview">
            <TrafficReport
              :datetime="datetime"
              :is-copy="isCopy"
              :is-end-day="isEndDay"
              :traffics="traffics" />
          </div>
        </div>
      </div>

      <div id="footer"></div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import TrafficProduct from './components/TrafficProduct.vue';
import TrafficReport from './components/TrafficReport.vue';

export default {
  name: 'App',

  components: {
    TrafficProduct,
    TrafficReport,
  },

  data() {
    return {
      datetime: {
        date: null,
        month: null,
        year: null,
        hour: null,
      },

      traffics: {
        hotel: null,
        flightDom: null,
        flightInt: null,
        train: null,
        explore: null,
        tour: null,
      },

      options: {
        months: [
          'Januari',
          'Februari',
          'Maret',
          'April',
          'Mei',
          'Juni',
          'Juli',
          'Agustus',
          'September',
          'Oktober',
          'November',
          'Desember',
        ],

        times: [
          {
            label: '09:00',
            hour: 9,
          },
          {
            label: '11:30',
            hour: 11,
          },
          {
            label: '15:00',
            hour: 15,
          },
          {
            label: '20:00',
            hour: 20,
          },
          {
            label: '23:59',
            hour: 23,
          },
        ],
      },

      isCopy: false,
    };
  },

  computed: {
    isEndDay() {
      return (this.datetime.hour === '23:59');
    },

    years() {
      return Array.from({ length: 3 }, (v, i) => 2020 + i);
    },
  },

  mounted() {
    this.getToday();
  },

  methods: {
    resetForm() {
      window.location.reload();
    },

    getPeriodTime() {
      const now = dayjs().hour();
      const selected = this.options.times.findIndex((i) => i.hour >= now);
      const index = (selected > 0) ? selected : 0;
      return this.options.times[index].label;
    },

    getToday() {
      this.datetime = {
        date: dayjs().date(),
        month: this.options.months[dayjs().month()],
        year: dayjs().year(),
        hour: this.getPeriodTime(),
      };
    },

    setData(payload) {
      const { type, data } = payload;
      this.traffics[type] = data;
    },

    doCopy() {
      this.isCopy = !this.isCopy;

      setTimeout(() => {
        this.isCopy = !this.isCopy;
      }, 1000);
    },
  },
};
</script>

<style lang="scss">
  @import './assets/styles/app.scss';

  .traffic-datetime {
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #ebebeb;

    input,
    select {
      display: inline-block;
      margin-right: 0.25rem;
      padding: 0.25rem 0.5rem 0.25rem 0.25rem;
      border-radius: 0.25rem;
      color: var(--input-color);
      border: 1px solid var(--input-border);
      background: var(--input-background);
      transition: border .3s ease;

      &:focus {
        border-color: var(--input-border-focus);
      }
    }

    input {
      width: 2.5rem;
      padding: 0.25rem 0.5rem;
      text-align: center;
    }

    select {
      cursor: pointer;
    }
  }

  .traffics {
    display: flex;
    justify-content: space-between
  }

  .traffic-form {
    width: 60%;
  }

  .traffic-preview {
    width: 40%;
    margin-left: 2rem;
    padding: 1rem 2rem;
    background-color: #f8f8f8;
    border-radius: 0.5rem
  }
</style>
