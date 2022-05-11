<template>
  <div class="traffic-report">
    <pre>{{ trafficHeader }}</pre>
    <pre v-if="isEndDay">{{ report.all }}</pre>
    <pre v-if="traffics.mall">{{ report.mall }}</pre>
    <pre v-if="traffics.hotel">{{ report.hotel }}</pre>
    <pre v-if="traffics.flightDom">{{ report.flightDom }}</pre>
    <pre v-if="traffics.flightInt">{{ report.flightInt }}</pre>
    <pre v-if="traffics.train">{{ report.train }}</pre>
    <pre v-if="traffics.explore">{{ report.explore }}</pre>
  </div>
</template>

<script>
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
        mall: this.generateReport(this.traffics.mall, 'AladinMall'),
        hotel: this.generateReport(this.traffics.hotel, 'Hotel'),
        flightDom: this.generateReport(this.traffics.flightDom, 'Flight Domestic'),
        flightInt: this.generateReport(this.traffics.flightInt, 'Flight International'),
        train: this.generateReport(this.traffics.train, 'Train'),
        explore: this.generateReport(this.traffics.explore, 'Explore'),
      };
    },

    contentReport() {
      if (this.isEndDay) {
        return `${this.trafficHeader}\n
${this.report.all}\n
${this.report.mall}\n
${this.report.hotel}\n
${this.report.flightDom}\n
${this.report.flightInt}\n
${this.report.train}\n
${this.report.explore}`;
      }

      return `${this.trafficHeader}\n
${this.report.mall}\n
${this.report.hotel}\n
${this.report.flightDom}\n
${this.report.flightInt}\n
${this.report.train}\n
${this.report.explore}`;
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
-Traffic Web View : ${this.digitGrouping(webUp)} ( ${webPercentage} )
-Traffic Mob Apps : ${this.digitGrouping(appUp)} ( ${appPercentage} )
-Total Traffic : ${this.digitGrouping(total)} ( 100% )
-Trx MTD ${this.month} ${this.year} : ${this.digitGrouping(mtdCurrent)}/ ${this.pastMonth} ${this.year} : ${this.digitGrouping(mtdPast)}
-Trx YTD ${this.year} : ${this.digitGrouping(ytdCurrent)}/ ${this.pastYear} : ${this.digitGrouping(ytdPast)}`;
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

<style lang="scss">
  .traffic-report {
    position: sticky;
    top: 1rem;
    padding: 1rem 2rem;
    background-color: #f8f8f8;
    border-radius: 0.5rem;
    font-size: 12px;
    line-height: 1.5;
    color: #333;

    @media only screen and (max-width: 768px) {
      font-size: 14px;
      padding: 0.5rem 1rem;
    }
  }
</style>
