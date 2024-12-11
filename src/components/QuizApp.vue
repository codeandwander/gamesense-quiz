// QuizApp.vue
<template>
  <div class="quiz-container bg-[#F3F6F5] font-fort"
    :class="{'bg-[#76B900] bg-repeat text-balance': currentStep === 'start' && isQuizDataLoaded}"
    :style="{ backgroundImage: currentStep === 'start' && quizData ? `url(${quizData.backgroundImage})` : 'none' }">
    <div class="relative max-w-3xl mx-auto h-screen flex flex-col justify-center items-center">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center p-8 md:p-16">
        <p class="text-2xl">Loading quiz...</p>
      </div>

      <!-- Opening Frame -->
      <div v-else-if="currentStep === 'start' && quizData" class="text-center p-8 md:p-16">
        <h1 class="text-5xl font-bold px-4 text-white mb-6 font-gameSense-hand">
          {{ quizData.title }}
        </h1>

        <!-- Start Button -->
        <button @click="startQuiz"
          class="bg-white text-[#154734] px-5 py-2 hover:bg-[#154734] hover:text-white font-medium rounded transition-all">
          Start Quiz
        </button>
      </div>

      <!-- Questions -->
      <div v-else-if="currentStep === 'question'"
        class="question-container min-h-screen flex flex-col items-center justify-end">

        <!-- Add menu dropdown -->
        <div v-if="showMenu"
          class="absolute top-[72px] left-0 bg-[rgb(11,59,45)] text-white py-4 z-40 min-w-[200px] w-full menu-container">
          <button @click="handleStartOver" class="w-full text-left px-8 py-4 hover:bg-[#154734]">
            Start over
          </button>
          <button @click="handleAboutClick" class="w-full text-left px-8 py-4 hover:bg-[#154734]">
            About this test
          </button>
        </div>

        <div class="p-8 md:p-16 flex-1 flex items-center justify-center">
          <div>
            <!-- Question Counter -->
            <div class="flex items-center justify-center mb-8">
              <span class="bg-[#E5EBE9] text-[#4A4A4A] px-3 py-1 text-lg rounded">
                Question {{currentQuestionIndex + 1}}/{{quizData.questions.length}}
              </span>
            </div>

            <!-- Question Image -->
            <div v-if="currentQuestion.image" class="flex justify-center">
              <img :src="currentQuestion.image" alt="Question Image" class="mb-8" />
            </div>

            <!-- Question Text -->
            <h2 class="text-[#4A4A4A] text-3xl mb-8 text-center text-balance">
              {{ currentQuestion.questionText }}
            </h2>

            <!-- Answer Options -->
            <div class="flex flex-col sm:flex-row gap-4 sm:px-16">
              <div v-for="(answer, index) in currentQuestion.answers" :key="index" class="w-full">
                <button @click="selectAnswer(index)" :disabled="showResults"
                  class="relative w-full p-3 text-center rounded border border-[#4A4A4A] text-lg transition-colors flex items-center"
                  :class="{
                    'bg-[#0B3B2D] text-white': showResults && answer.isCorrect,
                    'text-[#4A4A4A]': showResults && !answer.isCorrect && selectedAnswer === index
                  }">
                  <span class="flex-1">{{ answer.text }}</span>
                  <div class="absolute top-0 right-0 p-[14px] z-10">
                    <div v-if="showResults && answer.isCorrect"
                      class="w-6 h-6 flex items-center justify-center bg-white text-green-600 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div v-if="showResults && !answer.isCorrect && selectedAnswer === index"
                      class="w-6 h-6 flex items-center justify-center bg-red-600 text-white rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Answer Feedback -->
            <div v-if="showResults" class="text-center text-[#4A4A4A] mt-8">
              <p class="text-lg text-balance">
                {{ getResponseText() }}
              </p>
            </div>

            <div class="px-16 py-8 flex justify-center">
              <!-- Next Question Button -->
              <button @click="nextQuestion" :disabled="!showResults"
                class="bg-[#76B900] text-white px-5 py-2 text-lg rounded disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{'hover:bg-[#86C100]': showResults}">
                {{ isLastQuestion ? 'Submit answers' : 'Next question' }}
              </button>
            </div>
          </div>
        </div>


      </div>
      <div v-else-if="currentStep === 'end'" class="h-screen flex flex-col justify-center">

        <div class="text-center p-4 md:p-16 flex-1 flex flex-col justify-center">
          <!-- End of quiz label -->
          <div class="flex items-center justify-center mb-8">
            <span class="bg-[#E5EBE9] text-[#4A4A4A] px-3 py-1 text-lg rounded">
              End of quiz
            </span>
          </div>

          <h2 class="text-[#4A4A4A] text-4xl mb-8 text-center text-balance">{{ quizData.endFrame.text }}</h2>

          <div class="p-8 bg-[#154734] text-white rounded mb-4">
            <div class="text-lg mb-1 text-[#76B900]">
              You got {{ correctAnswers }} out of {{ quizData.questions.length }} questions correct
            </div>

            <p class="mb-6 text-2xl font-medium">{{ getScoreResponse() }}</p>

            <div class="flex flex-col items-center gap-1">
              <span class="text-balance mb-4">{{ quizData.endFrame.cta1.text }}</span>
              <a v-if="quizData.endFrame.cta1.buttonText" :href="quizData.endFrame.cta1.buttonLink" target="_blank"
                rel="noopener noreferrer"
                class="bg-[#76B900] text-white px-6 py-3 font-medium hover:bg-[#86C100] rounded inline-block">
                {{ quizData.endFrame.cta1.buttonText }}
              </a>
            </div>
          </div>

          <div
            class="px-4 py-8 bg-white items-center justify-center text-[#4A4A4A] rounded text-balance">
            <!-- CTA -->
            <p class="mb-4">{{ quizData.endFrame.cta2.text }}</p>
            <a :href="quizData.endFrame.cta2.buttonLink" class="font-medium text-[#86C100]">{{
              quizData.endFrame.cta2.buttonText }}</a>
          </div>
        </div>
      </div>

      <!-- End Frame -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  image?: string;
  answers: Answer[];
  responses: {
    correct: string;
    incorrect: string;
  };
}

interface ScoreRange {
  min: number;
  max: number;
  text: string;
}

interface ScoreResponses {
  sameForAll: boolean;
  text?: string;
  ranges?: ScoreRange[];
}

interface CTAButton {
  text: string;
  buttonText?: string;
  buttonLink?: string;
}

interface EndFrame {
  text: string;
  scoreResponses: ScoreResponses;
  cta1: CTAButton;
  cta2: CTAButton;
}

interface QuizData {
  title: string;
  backgroundImage: string;
  gtmId: string;
  questions: Question[];
  endFrame: EndFrame;
}

interface UserAnswer {
  questionIndex: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

export default defineComponent({
  name: 'QuizApp',
  props: {
    quizSource: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      quizData: null as QuizData | null,
      currentStep: 'start' as 'start' | 'question' | 'end',
      currentQuestionIndex: 0,
      selectedAnswer: null as number | null,
      showResults: false,
      userAnswers: [] as UserAnswer[],
      correctAnswers: 0,
      showMenu: false,
      showAboutModal: false,
      isLoading: true,
    }
  },
  computed: {
    isQuizDataLoaded(): boolean {
      return this.quizData !== null;
    },
    currentQuestion(): Question {
      if (!this.quizData) {
        return {
          questionText: "Loading...",
          answers: [],
          responses: { correct: "", incorrect: "" }
        };
      }
      const question = this.quizData.questions[this.currentQuestionIndex];
      return question || {
        questionText: "Default Question",
        answers: [{ text: "Default Answer", isCorrect: false }],
        responses: { correct: "Correct!", incorrect: "Try again!" }
      };
    },
    isLastQuestion(): boolean {
      return this.quizData ? this.currentQuestionIndex === this.quizData.questions.length - 1 : false;
    }
  },
  methods: {
    async loadQuizData(): Promise<void> {
      try {
        const response = await fetch(this.quizSource)
        this.quizData = await response.json()

        if(!this.quizData) {
          throw new Error('Failed to load quiz data')
        }

        this.initializeGTM(this.quizData.gtmId)
        this.isLoading = false
      } catch (error) {
        console.error('Error loading quiz data:', error)
      }
    },
    initializeGTM(gtmId: string): void {
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
    startQuiz(): void {
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
    selectAnswer(index: number): void {
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
    nextQuestion(): void {
      this.showResults = false
      this.selectedAnswer = null
      
      if (this.quizData && this.isLastQuestion) {
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
    getScoreResponse(): string {
      if (!this.quizData) {
        return ''
      }

      const scoreResponses = this.quizData.endFrame.scoreResponses
      const correctAnswers = this.correctAnswers
      
      if (scoreResponses.sameForAll) {
        return scoreResponses.text || ''
      }
      
      // Find appropriate response based on absolute score ranges
      return scoreResponses.ranges?.find(range => 
        correctAnswers >= range.min && correctAnswers <= range.max
      )?.text || ''
    },
    toggleMenu(): void {
      this.showMenu = !this.showMenu
    },
    handleStartOver(): void {
      this.showMenu = false
      this.startQuiz()
    },
    handleAboutClick(): void {
      this.showMenu = false
      this.showAboutModal = true
    },
    getResponseText(): string {
      const isCorrect = this.currentQuestion.answers[this.selectedAnswer as number].isCorrect
      return isCorrect ? 
        this.currentQuestion.responses.correct : 
        this.currentQuestion.responses.incorrect
    },
    handleClickOutside(event: MouseEvent): void {
      const isMenuContainer = (event.target as HTMLElement).closest('.menu-container');
      if (!isMenuContainer && this.showMenu) {
        this.showMenu = false;
      }
    }
  },
  created(): void {
    this.loadQuizData()
  },
  mounted(): void {
    // Update click outside handler
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount(): void {
    // Clean up event listener
    document.removeEventListener('click', this.handleClickOutside)
  }
})
</script>