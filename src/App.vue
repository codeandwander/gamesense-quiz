<script setup lang="ts">

import QuizApp from './components/QuizApp.vue'

</script>

<template>
  <div id="quiz-app">
    <QuizApp 
      quiz-source="/quiz.json"
    />
  </div>
</template>

<!-- <template>
  <QuizApp 
    quiz-source="/quiz.json"
    @cta-clicked="handleCTA"
  />
</template>

<script>
import QuizApp from './components/QuizApp.vue'

export default {
  components: {
    QuizApp
  },
  methods: {
    handleCTA(data) {
      // Handle CTA clicks (e.g., restart quiz, navigate to other pages)
      console.log('CTA clicked:', data)
    }
  }
}
</script> -->
