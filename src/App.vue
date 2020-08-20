<template>
  <div id="app">
    <div class="wrapper">
      <div id="header">
        <div class="header-title">
          <img src="./assets/image/report.png" alt="Report">
          Helpdesk Report
        </div>
        <div class="header-tool">
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
            ref="number"
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
          <form @submit.prevent="" class="traffic-form">
            <TrafficProduct
              name="Hotel"
              ref="hotel"
              type="hotel"
              key="hotel"
              :is-end-day="isEndDay"
              @next="handleNext"
              @update="setData" />

            <TrafficProduct
              name="Flight Domestic"
              ref="flightDom"
              type="flightDom"
              key="flightDom"
              :is-end-day="isEndDay"
              @next="handleNext"
              @update="setData" />

            <TrafficProduct
              name="Flight International"
              ref="flightInt"
              type="flightInt"
              key="flightInt"
              :is-end-day="isEndDay"
              @next="handleNext"
              @update="setData" />

            <TrafficProduct
              name="Train"
              ref="train"
              type="train"
              key="train"
              :is-end-day="isEndDay"
              @next="handleNext"
              @update="setData" />

            <TrafficProduct
              name="Explore"
              ref="explore"
              type="explore"
              key="explore"
              :is-end-day="isEndDay"
              @next="handleNext"
              @update="setData" />

            <TrafficProduct
              name="Tour"
              ref="tour"
              type="tour"
              key="tour"
              :is-end-day="isEndDay"
              @update="setData" />
          </form>

          <div class="traffic-preview">
            <TrafficReport
              :datetime="datetime"
              :is-copy="isCopy"
              :is-end-day="isEndDay"
              :traffics="traffics" />
          </div>
        </div>
      </div>

      <div id="footer">
        <span>Copyright &copy; 2020. All rights reserved</span>
        <button class="btn btn-outline-primary"
          @click="doCopy">
          Copy
          <img src="./assets/image/document.svg" alt="Copy">
        </button>
      </div>
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

    getPeriodDate() {
      const hour = dayjs().hour();
      const endDayDate = dayjs().subtract(1, 'day').format('DD');
      const now = dayjs().date();
      return (hour < 9) ? endDayDate : now;
    },

    getPeriodTime() {
      const hour = dayjs().subtract(1, 'hour').format('H');
      const selected = this.options.times.findIndex((i) => i.hour >= hour);
      let index = 0;

      if (selected > 0) {
        index = selected;
      }

      if (hour < 9) {
        index = 4;
      }

      return this.options.times[index].label;
    },

    getToday() {
      this.datetime = {
        date: this.getPeriodDate(),
        month: this.options.months[dayjs().month()],
        year: dayjs().year(),
        hour: this.getPeriodTime(),
      };
    },

    setData(payload) {
      const { type, data } = payload;
      this.traffics[type] = data;
    },

    handleNext(payload) {
      let nextForm = 'flightDom';

      switch (payload) {
        case 'hotel':
          nextForm = 'flightDom';
          break;
        case 'flightDom':
          nextForm = 'flightInt';
          break;
        case 'flightInt':
          nextForm = 'train';
          break;
        case 'train':
          nextForm = 'explore';
          break;
        case 'explore':
          nextForm = 'tour';
          break;
        default:
          nextForm = 'flightDom';
      }

      this.$refs[nextForm].$refs.webUp.focus();
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

    @media only screen and (max-width: 768px) {
      display: flex;
      justify-content: space-between;
    }

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

      @media only screen and (max-width: 768px) {
        width: 100%;
        font-size: 1rem;
      }

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
    justify-content: space-between;

    @media only screen and (max-width: 768px) {
      flex-wrap: wrap;
    }
  }

  .traffic-form {
    width: 60%;

    @media only screen and (max-width: 768px) {
      width: 100%;
    }
  }

  .traffic-preview {
    width: 40%;
    margin-left: 2rem;

    @media only screen and (max-width: 768px) {
      margin-top: 1rem;
      margin-left: 0;
      width: 100%;
    }
  }
</style>
