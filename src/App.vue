<script setup>
import {
  ref,
  computed,
  nextTick,
  watch
} from 'vue'

import { yeetThought, getThoughts } from './db'

const thought = ref('')
const yeetState = ref('idle')

const mode = ref('capture')
const query = ref('')
const thoughts = ref([])
const thoughtList = ref(null)

async function scrollToNewest() {
  await nextTick()

  if (thoughtList.value) {
    thoughtList.value.scrollTop = thoughtList.value.scrollHeight
  }
}

watch(query, scrollToNewest)

async function yeet() {
  if (!thought.value.trim() || yeetState.value !== 'idle') return

  // Memory before drama.
  await yeetThought(thought.value)

  yeetState.value = 'glitch'

  setTimeout(() => {
    thought.value = ''
    yeetState.value = 'consumed'
  }, 550)

  setTimeout(() => {
    yeetState.value = 'idle'
  }, 2600)
}

async function openSearch() {
  thoughts.value = await getThoughts()
  mode.value = 'search'

  await scrollToNewest()
}

function closeSearch() {
  query.value = ''
  mode.value = 'capture'
}

const results = computed(() => {
  const search = query.value.trim().toLowerCase()

  if (!search) {
    return thoughts.value
  }

  return thoughts.value.filter(item =>
    item.text.toLowerCase().includes(search)
  )
})

function formatDateTime(timestamp) {
  const date = new Date(timestamp)

  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()

  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')

  return `${dd}/${mm}/${yyyy}, ${hh}:${min}:${ss}`
}
</script>


<template>
  <main class="void">

    <section class="main-space">

      <button
        v-if="mode === 'search'"
        class="back-button"
        @click="closeSearch"
      >
        ← Back to the void
      </button>


      <!-- CAPTURE -->

      <div
        v-if="mode === 'capture'"
        class="capture"
      >
        <h1>BLACK HOLE</h1>

        <div class="event-horizon">

          <div
            v-if="yeetState !== 'consumed'"
            class="capture-content"
            :class="{ glitching: yeetState === 'glitch' }"
          >
            <textarea
              v-model="thought"
              placeholder="Throw something into the void..."
              autofocus
              @keydown.ctrl.enter="yeet"
            />

            <button
              class="yeet-button"
              @click="yeet"
            >
              YEET
            </button>
          </div>

          <div
            v-else
            class="void-message"
          >
            CONSUMED BY THE VOID
          </div>

        </div>
      </div>


      <!-- SEARCH RESULTS -->

      <div
        v-else
        class="search-results"
      >
        <div
          ref="thoughtList"
          class="thought-list"
        >
          <article
            v-for="item in results"
            :key="item.id"
            class="thought"
          >
            <p>{{ item.text }}</p>

            <small>
              {{ formatDateTime(item.createdAt) }}
            </small>
          </article>
        </div>
      </div>

    </section>


    <!-- EVENT HORIZON / SEARCH -->

    <section class="void-search">

      <div class="search-control">

        <span class="eye">👁</span>

        <button
          v-if="mode === 'capture'"
          class="search-trigger"
          @click="openSearch"
        >
          Search the void
        </button>

        <input
          v-else
          v-model="query"
          class="search-input"
          placeholder="Search the void"
          autofocus
        >

        <span class="eye">👁</span>

      </div>

    </section>

  </main>
</template>