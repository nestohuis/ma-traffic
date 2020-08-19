<template>
  <div class="traffic-report">
    <pre>{{ trafficHeader }}</pre>
    <transition-group name="fade">
      <pre v-if="isEndDay" key="0" class="ri">{{ report.all }}</pre>
      <pre v-if="traffics.hotel" key="1" class="ri">{{ report.hotel }}</pre>
      <pre v-if="traffics.flightDom" key="2" class="ri">{{ report.flightDom }}</pre>
      <pre v-if="traffics.flightInt" key="3" class="ri">{{ report.flightInt }}</pre>
      <pre v-if="traffics.train" key="4" class="ri">{{ report.train }}</pre>
      <pre v-if="traffics.explore" key="5" class="ri">{{ report.explore }}</pre>
      <pre v-if="traffics.tour" key="6" class="ri">{{ report.tour }}</pre>
    </transition-group>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import numeral from 'numeral';

export default {
  name: 'TrafficReport',

  props: {
    datetime: {
      type: Object,
      required: false,
      default: () => {},
    },

    isCopy: {
      type: Boolean,
      required: false,
      default: false,
    },

    isEndDay: {
      type: Boolean,
      required: false,
      default: false,
    },

    traffics: {
      type: Object,
      required: false,
      default: () => {},
    },
  },

  watch: {
    isCopy(val) {
      if (val) {
        this.$copyText(this.contentReport).then(this.onCopySuccess, this.onCopyFailed);
      }
    },
  },

  computed: {
    month() {
      return dayjs().format('MMMM');
    },

    pastMonth() {
      return dayjs().subtract(1, 'month').format('MMMM');
    },

    year() {
      return dayjs().year();
    },

    pastYear() {
      return dayjs().subtract(1, 'year').year();
    },

    trafficHeader() {
      return `*${this.datetime.date} ${this.datetime.month} ${this.datetime.year} ${this.datetime.hour}*`;
    },

    report() {
      return {
        all: this.generateAllReport(),
        hotel: this.generateReport(this.traffics.hotel, 'Hotel'),
        flightDom: this.generateReport(this.traffics.flightDom, 'Flight Domestic'),
        flightInt: this.generateReport(this.traffics.flightInt, 'Flight International'),
        train: this.generateReport(this.traffics.train, 'Train'),
        explore: this.generateReport(this.traffics.explore, 'Explore'),
        tour: this.generateReport(this.traffics.tour, 'Tour'),
      };
    },

    contentReport() {
      if (this.isEndDay) {
        return `${this.trafficHeader}\n
${this.report.all}\n
${this.report.hotel}\n
${this.report.flightDom}\n
${this.report.flightInt}\n
${this.report.train}\n
${this.report.explore}\n
${this.report.tour}`;
      }

      return `${this.trafficHeader}\n
${this.report.hotel}\n
${this.report.flightDom}\n
${this.report.flightInt}\n
${this.report.train}\n
${this.report.explore}\n
${this.report.tour}`;
    },
  },

  methods: {
    onCopySuccess() {
      this.$toasted.success('Text successfully copied!');
    },

    onCopyFailed() {
      this.$toasted.warning('Text cannot be copied!');
    },

    digitGrouping(num) {
      if (!num) return 0;
      return numeral(num).format('0,0');
    },

    getTotal(product) {
      const webUv = product.web.uv;
      const appUv = product.app.uv;
      return webUv + appUv;
    },

    getRate(product) {
      const { trx } = product;
      const total = this.getTotal(product);
      if (!total && !trx) return 0;
      return `${((trx / total) * 100).toFixed(2)}%`;
    },

    generateDefaultReport(data, product) {
      if (!data) return '';
      const { web, app, trx } = data;

      return `*${product} Traffic*
-Traffic Web View : ${this.digitGrouping(web.up)} / ${this.digitGrouping(web.uv)} (UP/UV)
-Traffic Mob Apps : ${this.digitGrouping(app.up)} / ${this.digitGrouping(app.uv)} (UP/UV)
-Total Traffic : ${this.digitGrouping(this.getTotal(data))} (UV)
-Conv. : ${this.getRate(data)} ( ${this.digitGrouping(trx)} Trx )`;
    },

    generateEndReport(data, product) {
      if (!data) return '';
      const {
        web, app, trx, mtd, ytd,
      } = data;

      return `*${product} Traffic*
-Traffic Web View : ${this.digitGrouping(web.up)} / ${this.digitGrouping(web.uv)} (UP/UV)
-Traffic Mob Apps : ${this.digitGrouping(app.up)} / ${this.digitGrouping(app.uv)} (UP/UV)
-Total Traffic : ${this.digitGrouping(this.getTotal(data))} (UV)
-Trx MTD ${this.month} ${this.year} : ${this.digitGrouping(mtd.current)}/ ${this.pastMonth} ${this.year} : ${this.digitGrouping(mtd.past)}
-Trx YTD ${this.year} : ${this.digitGrouping(ytd.current)}/ ${this.pastYear} : ${this.digitGrouping(ytd.past)}
-Conv. : ${this.getRate(data)} ( ${this.digitGrouping(trx)} Trx )`;
    },

    generateAllReport() {
      if (!this.isEndDay) return '';
      if (!this.traffics) return '';

      const data = Object.values(this.traffics);
      const webUp = data.map((p) => p.web.up || 0).reduce((a, b) => a + b, 0);
      const appUp = data.map((p) => p.app.up || 0).reduce((a, b) => a + b, 0);
      const mtdCurrent = data.map((p) => p.mtd.current || 0).reduce((a, b) => a + b, 0);
      const mtdPast = data.map((p) => p.mtd.past || 0).reduce((a, b) => a + b, 0);
      const ytdCurrent = data.map((p) => p.ytd.current || 0).reduce((a, b) => a + b, 0);
      const ytdPast = data.map((p) => p.ytd.past || 0).reduce((a, b) => a + b, 0);
      const total = webUp + appUp;
      const webPercentage = `${((webUp / total) * 100).toFixed(2)}%`;
      const appPercentage = `${((appUp / total) * 100).toFixed(2)}%`;

      return `*All Products*
-Traffic Web View : ${webUp} ( ${webPercentage} )
-Traffic Mob Apps : ${appUp} ( ${appPercentage} )
-Total Traffic : ${total} ( 100% )
-Trx MTD ${this.month} ${this.year} : ${mtdCurrent}/ ${this.pastMonth} ${this.year} : ${mtdPast}
-Trx YTD ${this.year} : ${ytdCurrent}/ ${this.pastYear} : ${ytdPast}`;
    },

    generateReport(data, product) {
      if (this.isEndDay) {
        return this.generateEndReport(data, product);
      }
      return this.generateDefaultReport(data, product);
    },
  },
};
</script>

<style lang="scss" scoped>
  .traffic-report {
    font-size: 12px;
    line-height: 1.5;
  }

  .pr-item {
    transition: all 1s ease;
    display: block;
  }
</style>
