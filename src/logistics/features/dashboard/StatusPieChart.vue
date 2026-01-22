<template>
  <div class="chart-container">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import { Pie } from 'vue-chartjs';

import { computed } from 'vue';



ChartJS.register(ArcElement, Tooltip, Legend);



const props = defineProps<{

  risk: number;

  critical: number;

  deadStock: number;

}>();



const chartData = computed(() => {

  const data = [props.risk, props.critical, props.deadStock];

  const labels = ['Risk 60d', 'Critical', 'Dead Stock'];



  return {

    labels: labels,

    datasets: [

      {

        backgroundColor: ['#fca5a5', '#fcd34d', '#86efac'],

        borderColor: ['#f87171', '#fbbf24', '#34d399'],

        borderWidth: 1,

        data: data,

      },

    ],

  };

});



const chartOptions = {

  responsive: true,

  maintainAspectRatio: false,

  plugins: {

    legend: {

      position: 'right' as const,

    },

    tooltip: {

      callbacks: {

        label: function (context) {

          let label = context.label || '';

          if (label) {

            label += ': ';

          }

          const value = context.parsed;

          const total = context.dataset.data.reduce((a, b) => a + b, 0);

          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';

          label += `${value} (${percentage})`;

          return label;

        },

      },

    },

  },

};

</script>

<style scoped>
.chart-container {
  height: 300px;
  width: 100%;
}
</style>
