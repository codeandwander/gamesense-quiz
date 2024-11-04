// QuizApp.vue
<template>
  <div class="quiz-container bg-[#F4F6F5] bg-[url('/images/bg.jpg')] bg-cover bg-center font-fort">
    <!-- Add modal component -->
    <div v-if="showAboutModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">About the test</h3>
          <button @click="showAboutModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-gray-700 mb-4">
          {{ quizData?.aboutText }}
        </p>
        <button 
          @click="showAboutModal = false"
          class="w-full bg-[#76B900] text-white px-4 py-2 rounded hover:bg-[#86C100] uppercase font-bold"
        >
          CLOSE
        </button>
      </div>
    </div>

    <div class="relative max-w-3xl mx-auto bg-white min-h-screen">
      <!-- Opening Frame -->
      <div v-if="currentStep === 'start'" class="text-center p-8 md:p-16">
        <!-- Logo -->
        <img 
          :src="'/images/gamesense-logo.png'" 
          alt="GameSense" 
          class="h-16 mx-auto mb-4"
        />
        <img 
          :src="'/images/bclc-logo.png'" 
          alt="BCLC" 
          class="h-12 mx-auto mb-8"
        />
        
        <h1 class="text-4xl font-bold px-4 text-[#0B3B2D] mb-6">
          {{ quizData.openingFrame.headerText }}
        </h1>

        <!-- Description Text -->
        <p class="text-lg text-[#0B3B2D] mb-6">
          {{ quizData.openingFrame.descriptionText }}
        </p>
        
        <p class="text-lg text-[#0B3B2D] mb-8 font-medium">
          {{ quizData.openingFrame.ctaText }}
        </p>

        <!-- Privacy Notice -->
        <p class="text-sm text-gray-600 mb-6 max-w-[240px] mx-auto">
          By starting this test, you accept the
          <a :href="quizData.openingFrame.privacyUrl" class="underline">Privacy Notice</a> and 
          <a :href="quizData.openingFrame.termsUrl" class="underline">Terms of Use</a>
        </p>

        <!-- Start Button -->
        <button 
          @click="startQuiz" 
          class="bg-[#76B900] text-white px-6 py-2 hover:bg-[#86C100] uppercase font-bold"
        >
          Start
        </button>
      </div>

      <!-- Questions -->
      <div v-else-if="currentStep === 'question'" class="question-container min-h-screen flex flex-col">
        <!-- Progress Bar -->
        <div class="bg-[#0B3B2D] p-6 px-8">
          <div class="flex items-center">
            <button @click.stop="toggleMenu" class="text-white menu-container">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div class="w-full mx-4">
              <div class="bg-white/20 h-2 rounded-full">
                <div 
                  class="bg-[#76B900] h-2 rounded-full transition-all duration-300" 
                  :style="`width: ${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%`"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Add menu dropdown -->
        <div v-if="showMenu" class="absolute top-[72px] left-0 bg-[#0B3B2D] text-white py-4 z-40 min-w-[200px] w-full menu-container">
          <button 
            @click="handleStartOver" 
            class="w-full text-left px-8 py-4 hover:bg-[#154734]"
          >
            Start over
          </button>
          <button 
            @click="handleAboutClick" 
            class="w-full text-left px-8 py-4 hover:bg-[#154734]"
          >
            About this test
          </button>
        </div>

        <div class="p-8 md:p-16 flex-1 flex justify-center">
          <div>
            <!-- Question Image -->
            <div class="hidden md:flex items-center justify-center mb-8">
              <img :src="currentQuestion.image" alt="Question Image" class="w-full max-w-[400px]">
            </div>

            <!-- Question Counter -->
            <div class="flex items-center justify-center mb-8">
              <span class="bg-[#0B3B2D] text-white px-2 py-1 text-lg font-bold">
                QUESTION {{currentQuestionIndex + 1}}/{{quizData.questions.length}}
              </span>
            </div>

            <!-- Question Text -->
            <h2 class="text-[#0B3B2D] text-3xl font-bold mb-8 text-center">
              {{ currentQuestion.questionText }}
            </h2>

            <!-- Answer Options -->
            <div class="flex flex-col md:flex-row gap-4">
              <div v-for="(answer, index) in currentQuestion.answers" :key="index" class="w-full">
                <button
                  @click="selectAnswer(index)"
                  :disabled="showResults"
                  class="relative w-full p-4 text-center rounded-xl border-2 border-[#0B3B2D] text-[#0B3B2D] text-2xl font-medium hover:bg-[#0B3B2D] hover:text-white transition-colors flex items-center"
                  :class="{
                    'bg-green-100 border-green-600': showResults && answer.isCorrect,
                    'bg-red-100 border-red-600': showResults && !answer.isCorrect && selectedAnswer === index
                  }"
                >
                  <span class="flex-1">{{ answer.text }}</span>
                  <div class="absolute top-0 right-0 p-[18px] z-10">
                    <span v-if="showResults && answer.isCorrect" class="text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span v-if="showResults && !answer.isCorrect && selectedAnswer === index" class="text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                  </div>
                </button>
              </div>
            </div>
            
            <!-- Answer Feedback -->
            <div v-if="showResults" class="text-center text-[#0B3B2D] mt-8">
              <p class="text-lg">
                {{ currentQuestion.answers[selectedAnswer].responseText }}
              </p>
            </div>
          </div>
        </div>


        <div class="px-16 py-8 bg-[#C2C2C2] flex justify-center">
          <!-- Next Question Button -->
          <button
            @click="nextQuestion"
            :disabled="!showResults"
            class="bg-[#76B900] text-white p-4 leading-none text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{'hover:bg-[#86C100]': showResults}"
          >
            NEXT QUESTION
          </button>
        </div>
      </div>

      <!-- End Frame -->
      <div v-else-if="currentStep === 'end'">

        <div class="text-center p-8 md:p-16">
          <!-- End of quiz label -->
          <div class="flex items-center justify-center mb-8">
            <span class="bg-[#0B3B2D] text-white px-2 py-1 text-lg font-bold">
              END OF QUIZ
            </span>
          </div>

          <h2 class="text-[#0B3B2D] text-3xl font-bold mb-8 text-center">{{ quizData.endFrame.text }}</h2>

          <div class="py-4 px-8 md:py-8 md:px-16 bg-[#154734] rounded-xl text-white">
            
            <div class="text-2xl font-semibold mb-4">
              You got {{ correctAnswers }} out of {{ quizData.questions.length }} questions correct
            </div>

            <p class="mb-6">{{ getScoreResponse() }}</p>

            <!-- CTAs -->
            <div class="flex flex-col gap-4">
              <div v-if="quizData.endFrame.cta1.text || quizData.endFrame.cta1.buttonText">
                <p class="mb-4 font-medium">{{ quizData.endFrame.cta1.text }}</p>
                <button 
                  v-if="quizData.endFrame.cta1.buttonText"
                  @click="handleCTA(1)"
                  class="bg-[#76B900] text-white px-6 py-2 hover:bg-[#86C100] uppercase font-bold"
                >
                  {{ quizData.endFrame.cta1.buttonText }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="px-16 py-8 bg-[#C2C2C2] flex flex-col gap-1 items-center justify-center text-[#154734]">
          <span class="font-bold">Want to continue learning about healthy gambling habits?</span>
          <span class="text-lg font-medium">Get tips, tools and resources to help you keep gambling fun.</span>
          <a href="https://www.bclc.ca/gamesense" class="underline font-bold">Learn more</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuizApp',
  props: {
    quizSource: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      quizData: null,
      currentStep: 'start',
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showResults: false,
      userAnswers: [],
      correctAnswers: 0,
      showMenu: false,
      showAboutModal: false,
    }
  },
  computed: {
    currentQuestion() {
      return this.quizData?.questions[this.currentQuestionIndex] || {}
    },
    isLastQuestion() {
      return this.currentQuestionIndex === this.quizData?.questions.length - 1
    }
  },
  methods: {
    async loadQuizData() {
      try {
        const response = await fetch(this.quizSource)
        this.quizData = await response.json()
      } catch (error) {
        console.error('Error loading quiz data:', error)
      }
    },
    startQuiz() {
      this.currentStep = 'question'
      this.currentQuestionIndex = 0
      this.userAnswers = []
      this.correctAnswers = 0
    },
    selectAnswer(index) {
      if (this.showResults) return
      this.selectedAnswer = index
      this.showResults = true
      
      if (this.currentQuestion.answers[index].isCorrect) {
        this.correctAnswers++
      }
      
      this.userAnswers.push({
        questionIndex: this.currentQuestionIndex,
        selectedAnswer: index,
        isCorrect: this.currentQuestion.answers[index].isCorrect
      })
    },
    nextQuestion() {
      this.showResults = false
      this.selectedAnswer = null
      
      if (this.isLastQuestion) {
        this.currentStep = 'end'
      } else {
        this.currentQuestionIndex++
      }
    },
    getScoreResponse() {
      const scoreResponses = this.quizData.endFrame.scoreResponses
      const percentage = (this.correctAnswers / this.quizData.questions.length) * 100
      
      if (scoreResponses.sameForAll) {
        return scoreResponses.text
      }
      
      // Find appropriate response based on score ranges
      return scoreResponses.ranges.find(range => 
        percentage >= range.min && percentage <= range.max
      )?.text || ''
    },
    handleCTA(ctaNumber) {
      // Emit event for parent component to handle
      this.$emit('cta-clicked', {
        ctaNumber,
        score: this.correctAnswers,
        total: this.quizData.questions.length
      })
    },
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    handleStartOver() {
      this.showMenu = false
      this.startQuiz()
    },
    handleAboutClick() {
      this.showMenu = false
      this.showAboutModal = true
    },
  },
  created() {
    this.loadQuizData()
  },
  mounted() {
    // Update click outside handler
    document.addEventListener('click', (e) => {
      const isMenuContainer = e.target.closest('.menu-container')
      if (!isMenuContainer && this.showMenu) {
        this.showMenu = false
      }
    })
  },
  beforeUnmount() {
    // Clean up event listener
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>