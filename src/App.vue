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
            v-clipboard:copy="contentReport"
            v-clipboard:success="onCopy">
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
            <ProductTraffic
              name="Hotel"
              type="hotel"
              key="hotel"
              @update="setData" />

            <ProductTraffic
              name="Flight Domestic"
              type="flightDom"
              key="flightDom"
              @update="setData" />

            <ProductTraffic
              name="Flight International"
              type="flightInt"
              key="flightInt"
              @update="setData" />

            <ProductTraffic
              name="Train"
              type="train"
              key="train"
              @update="setData" />

            <ProductTraffic
              name="Explore"
              type="explore"
              key="explore"
              @update="setData" />

            <ProductTraffic
              name="Tour"
              type="tour"
              key="tour"
              @update="setData" />
          </div>

          <div class="traffic-preview">
            <pre>{{ contentHeader }}</pre>
            <transition-group name="fade">
              <pre v-if="traffics.hotel" key="1" class="pr-item">{{ traffics.hotel }}</pre>
              <pre v-if="traffics.flightDom" key="2" class="pr-item">{{ traffics.flightDom }}</pre>
              <pre v-if="traffics.flightInt" key="3" class="pr-item">{{ traffics.flightInt }}</pre>
              <pre v-if="traffics.train" key="4" class="pr-item">{{ traffics.train }}</pre>
              <pre v-if="traffics.explore" key="5" class="pr-item">{{ traffics.explore }}</pre>
              <pre v-if="traffics.tour" key="6" class="pr-item">{{ traffics.tour }}</pre>
            </transition-group>
          </div>
        </div>
      </div>

      <div id="footer"></div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import ProductTraffic from './components/ProductTraffic.vue';

export default {
  name: 'App',

  components: {
    ProductTraffic,
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
        hotel: '',
        flightDom: '',
        flightInt: '',
        train: '',
        explore: '',
        tour: '',
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
    };
  },

  computed: {
    years() {
      return Array.from({ length: 3 }, (v, i) => 2020 + i);
    },

    contentHeader() {
      return `*${this.datetime.date} ${this.datetime.month} ${this.datetime.year} ${this.datetime.hour}*`;
    },

    contentReport() {
      return `${this.contentHeader}\n
${this.traffics.hotel}\n
${this.traffics.flightDom}\n
${this.traffics.flightInt}\n
${this.traffics.train}\n
${this.traffics.explore}\n
${this.traffics.tour}`;
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
      const selected = this.options.times.findIndex((i) => i.hour > now);
      return this.options.times[selected].label;
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
      this.traffics[payload.type] = payload.content;
    },

    onCopy() {
      this.$toasted.success('Text successfully copied!');
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
    font-size: 12px;
    line-height: 1.5;
    border-radius: 0.5rem
  }

  .pr-item {
    transition: all 1s ease;
    display: block;
  }
</style>
