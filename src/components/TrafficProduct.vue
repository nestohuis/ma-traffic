<template>
  <div class="product-traffic">
    <div class="form-header">
      <img :src="iconUrl" :alt="name" />
      <h4>{{ name }}</h4>
    </div>

    <div class="form-column">
      <div class="form-section">
        <div class="form-section-title">Web Traffic</div>
        <div class="form-group">
          <span class="form-label">UP</span>
          <input type="number"
            v-model.number="web.up"
            min="0"
            class="form-field"
            @input="updateData" />
        </div>
        <div class="form-group">
          <span class="form-label">UV</span>
          <input type="number"
            v-model.number="web.uv"
            min="0"
            class="form-field"
            @input="updateData" />
        </div>
      </div>

      <div class="form-section">
        <div class="form-section-title">App Traffic</div>
        <div class="form-group">
          <span class="form-label">UP</span>
          <input type="number"
            v-model.number="app.up"
            min="0"
            class="form-field"
            @input="updateData" />
        </div>
        <div class="form-group">
          <span class="form-label">UV</span>
          <input type="number"
            v-model.number="app.uv"
            min="0"
            class="form-field"
            @input="updateData" />
        </div>
      </div>

      <template v-if="isEndDay">
        <div class="form-section">
          <div class="form-section-title">Month to Date</div>
          <div class="form-group">
            <span class="form-label">CM</span>
            <input type="number"
              v-model.number="mtd.current"
              min="0"
              class="form-field"
              @input="updateData" />
          </div>
          <div class="form-group">
            <span class="form-label">PM</span>
            <input type="number"
              v-model.number="mtd.past"
              min="0"
              class="form-field"
              @input="updateData" />
          </div>
        </div>

        <div class="form-section">
          <div class="form-section-title">Year to Date</div>
          <div class="form-group">
            <span class="form-label">CY</span>
            <input type="number"
              v-model.number="ytd.current"
              min="0"
              class="form-field"
              @input="updateData" />
          </div>
          <div class="form-group">
            <span class="form-label">PY</span>
            <input type="number"
              v-model.number="ytd.past"
              min="0"
              class="form-field"
              @input="updateData" />
          </div>
        </div>
      </template>

      <div class="form-section">
        <div class="form-section-title">Transactions</div>
        <div class="form-group">
          <span class="form-label">TX</span>
          <input type="number"
            v-model.number="trx"
            min="0"
            class="form-field"
            @input="updateData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrafficProduct',

  props: {
    name: {
      type: String,
      required: true,
      default: '',
    },

    type: {
      type: String,
      required: true,
      default: '',
    },

    isEndDay: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      web: {
        up: null,
        uv: null,
      },
      app: {
        up: null,
        uv: null,
      },
      trx: null,
      mtd: {
        current: null,
        past: null,
      },
      ytd: {
        current: null,
        past: null,
      },
    };
  },

  computed: {
    iconUrl() {
      return `/images/${this.type}.svg`;
    },
  },

  created() {
    this.updateData();
  },

  methods: {
    updateData() {
      this.$emit('update', {
        type: this.type,
        data: {
          web: this.web,
          app: this.app,
          trx: this.trx,
          mtd: this.mtd,
          ytd: this.ytd,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
  .product-traffic {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #ebebeb;

    &:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
      border-bottom: none;
    }

    h4 {
      font-size: 0.875rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: #111;
      text-transform: uppercase;
    }

    .form-header {
      width: 25%;
      margin-right: 2rem;

      @media only screen and (max-width: 768px) {
        width: 100%;
        margin: 0 0 1rem 0;
      }

      img {
        width: 2.5rem;
        margin-bottom: 0.5rem;
        object-fit: contain;

        @media only screen and (max-width: 768px) {
          width: 1rem;
          margin: 0 1rem 0 0;
        }
      }

      h4 {
        @media only screen and (max-width: 768px) {
          display: inline-block;
          margin: 0;
        }
      }
    }

    .form-column {
      width: calc(75% - 2rem);

      @media only screen and (max-width: 768px) {
        width: 100%;
      }
    }

    .form-section {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      vertical-align: middle;
    }

    .form-section-title {
      width: 25%;
      font-size: 13px;
      color: #888;
    }

    .form-group {
      position: relative;
      display: flex;
      margin: 0.25rem 0.5rem;
      width: 33.333%;
      font-size: 13px;
    }

    .form-group:focus-within > .form-label {
      color: var(--group-color-focus);
      background: var(--group-background-focus);
      border-color: var(--group-border-focus);
    }

    .form-label {
      font-weight: 600;
      border-radius: 0.25rem 0 0 0.25rem;
      text-align: center;
      padding: 0.25rem 0.5rem;
      width: 1.25rem;
      color: var(--group-color);
      background: var(--group-background);
      border: 1px solid var(--group-border);
      transition: background .3s ease, border .3s ease, color .3s ease;
    }

    .form-field {
      display: block;
      width: 100%;
      padding: 0.25rem 0.5rem;
      border-radius: 0 0.25rem 0.25rem 0;
      -webkit-appearance: none;
      color: var(--input-color);
      border: 1px solid var(--input-border);
      background: var(--input-background);
      transition: border .3s ease;
      position: relative;
      z-index: 1;
      flex: 1 1 auto;
      width: 1%;
      margin-top: 0;
      margin-bottom: 0;
      margin-left: -1px;
    }

    .form-field::placeholder {
      color: var(--input-placeholder);
    }

    .form-field:focus {
      outline: none;
      border-color: var(--input-border-focus);
    }
  }
</style>
