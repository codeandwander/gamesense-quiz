// QuizApp.vue
<template>
  <div class="quiz-container bg-[#F4F6F5]" :class="{'bg-cover bg-center font-fort text-balance': true}" :style="{ backgroundImage: quizData ? `url(${quizData.backgroundImage})` : 'none' }">
    <div class="relative max-w-3xl mx-auto bg-white h-screen flex flex-col items-center">
      <!-- Opening Frame -->
      <div v-if="currentStep === 'start'" class="text-center p-8 md:p-16">
        <h1 class="text-4xl font-bold px-4 text-[#0B3B2D] mb-6">
          {{ quizData.title }}
        </h1>

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
                  class="relative w-full p-4 text-center rounded-xl border-2 border-[#0B3B2D] text-[#0B3B2D] text-2xl font-medium transition-colors flex items-center"
                  :class="{
                    'bg-[#0B3B2D] text-white': showResults && answer.isCorrect,
                    '': showResults && !answer.isCorrect && selectedAnswer === index
                  }"
                >
                  <span class="flex-1">{{ answer.text }}</span>
                  <div class="absolute top-0 right-0 p-[18px] z-10">
                    <div v-if="showResults && answer.isCorrect" class="w-7 h-7 flex items-center justify-center bg-white text-green-600 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div v-if="showResults && !answer.isCorrect && selectedAnswer === index" class="w-7 h-7 flex items-center justify-center bg-red-600 text-white rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            
            <!-- Answer Feedback -->
            <div v-if="showResults" class="text-center text-[#0B3B2D] mt-8">
              <p class="text-lg">
                {{ getResponseText() }}
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
      <div v-else-if="currentStep === 'end'" class="h-screen flex flex-col">

        <div class="text-center p-8 md:p-16 flex-1 flex flex-col">
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
                <p class="mb-8 font-medium">{{ quizData.endFrame.cta1.text }}</p>
                <a 
                  v-if="quizData.endFrame.cta1.buttonText"
                  :href="quizData.endFrame.cta1.buttonLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="bg-[#76B900] text-white px-6 py-2 hover:bg-[#86C100] uppercase font-bold"
                >
                  {{ quizData.endFrame.cta1.buttonText }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="px-16 py-8 bg-[#C2C2C2] flex flex-col gap-1 items-center justify-center text-[#154734]">
          <span class="font-bold">{{ quizData.endFrame.footer.text }}</span>
          <span class="text-lg font-medium">{{ quizData.endFrame.footer.subtext }}</span>
          <a :href="quizData.endFrame.footer.buttonLink" class="underline font-bold">{{ quizData.endFrame.footer.buttonText }}</a>
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
        this.initializeGTM(this.quizData.gtmId)
      } catch (error) {
        console.error('Error loading quiz data:', error)
      }
    },
    initializeGTM(gtmId) {
      // Create and inject GTM script
      const script = document.createElement('script')
      script.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `
      document.head.appendChild(script)

      // Create and inject GTM noscript iframe
      const noscript = document.createElement('noscript')
      const iframe = document.createElement('iframe')
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`
      iframe.height = '0'
      iframe.width = '0'
      iframe.style.display = 'none'
      iframe.style.visibility = 'hidden'
      noscript.appendChild(iframe)
      document.body.insertBefore(noscript, document.body.firstChild)
    },
    startQuiz() {
      this.currentStep = 'question'
      this.currentQuestionIndex = 0
      this.userAnswers = []
      this.correctAnswers = 0

      // Track quiz start
      window.dataLayer.push({
        'event': 'rg_games',
        'status': 'game_start',
        'game_name': 'facts_from_fiction',
        'step': 0,
        'step_response': 'start'
      })
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

      // Add Google Analytics tracking
      window.dataLayer.push({
        'event': 'rg_games',
        'status': 'game_in_progress',
        'game_name': 'facts_from_fiction',
        'step': this.currentQuestionIndex + 1,
        'step_response': this.currentQuestion.answers[index].text
      })
    },
    nextQuestion() {
      this.showResults = false
      this.selectedAnswer = null
      
      if (this.isLastQuestion) {
        this.currentStep = 'end'
        // Track quiz completion
        window.dataLayer.push({
          'event': 'rg_games',
          'status': 'game_complete',
          'game_name': 'facts_from_fiction',
          'step': this.quizData.questions.length + 1,
          'step_response': `${this.correctAnswers}/${this.quizData.questions.length}`
        })
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
    getResponseText() {
      const isCorrect = this.currentQuestion.answers[this.selectedAnswer].isCorrect
      return isCorrect ? 
        this.currentQuestion.responses.correct : 
        this.currentQuestion.responses.incorrect
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