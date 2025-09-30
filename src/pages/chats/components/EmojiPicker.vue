<template>
  <div class="relative emoji-picker-container">
    <!-- Кнопка эмодзи -->
    <button
      @click.stop="togglePicker"
      type="button"
      :class="[
        'h-10 w-10 flex items-center justify-center rounded-lg transition-colors duration-200',
        isOpen
          ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      ]"
      title="Эмодзи"
    >
      <i class="pi pi-face-smile text-sm md:text-base"></i>
    </button>

    <!-- Панель эмодзи -->
    <div
      v-if="isOpen"
      v-show="isOpen"
      @click.stop
      class="fixed bottom-20 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 w-80 max-h-96 overflow-hidden z-[99999]"
      style="max-width: calc(100vw - 2rem);"
    >
      <!-- Заголовок -->
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium text-gray-900 dark:text-white">Эмодзи</h3>
        <button
          @click="isOpen = false"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <i class="pi pi-times text-sm"></i>
        </button>
      </div>

      <!-- Категории -->
      <div class="flex gap-1 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto scrollbar-hide">
        <button
          v-for="category in categories"
          :key="category.name"
          @click="selectedCategory = category.name"
          :class="[
            'px-3 py-1 rounded-lg text-sm transition-colors duration-200 flex-shrink-0',
            selectedCategory === category.name
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          {{ category.icon }}
        </button>
      </div>

      <!-- Поиск -->
      <div class="relative mb-3">
        <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск эмодзи..."
          class="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <!-- Сетка эмодзи -->
      <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto scrollbar-thin">
        <button
          v-for="emoji in filteredEmojis"
          :key="emoji.char"
          @click="selectEmoji(emoji.char)"
          class="w-8 h-8 flex items-center justify-center text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
          :title="emoji.name"
        >
          {{ emoji.char }}
        </button>
      </div>

      <!-- Недавние эмодзи -->
      <div v-if="recentEmojis.length > 0" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Недавние</p>
        <div class="flex gap-1">
          <button
            v-for="emoji in recentEmojis.slice(0, 8)"
            :key="emoji"
            @click="selectEmoji(emoji)"
            class="w-8 h-8 flex items-center justify-center text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
          >
            {{ emoji }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  emojiSelected: [emoji: string]
}>()

const isOpen = ref(false)
const selectedCategory = ref('smileys')
const searchQuery = ref('')
const recentEmojis = ref<string[]>([])

// Категории эмодзи
const categories = [
  { name: 'smileys', icon: '😀', title: 'Смайлики и люди' },
  { name: 'animals', icon: '🐶', title: 'Животные и природа' },
  { name: 'food', icon: '🍎', title: 'Еда и напитки' },
  { name: 'activities', icon: '⚽', title: 'Активности' },
  { name: 'travel', icon: '🚗', title: 'Путешествия и места' },
  { name: 'objects', icon: '💡', title: 'Объекты' },
  { name: 'symbols', icon: '❤️', title: 'Символы' },
  { name: 'flags', icon: '🏁', title: 'Флаги' }
]

// База эмодзи
const emojiData = {
  smileys: [
    { char: '😀', name: 'улыбающееся лицо' },
    { char: '😃', name: 'улыбающееся лицо с большими глазами' },
    { char: '😄', name: 'улыбающееся лицо с улыбающимися глазами' },
    { char: '😁', name: 'сияющее лицо с улыбающимися глазами' },
    { char: '😆', name: 'улыбающееся лицо с плотно закрытыми глазами' },
    { char: '😅', name: 'улыбающееся лицо с потом' },
    { char: '🤣', name: 'катающееся по полу от смеха лицо' },
    { char: '😂', name: 'лицо со слезами радости' },
    { char: '🙂', name: 'слегка улыбающееся лицо' },
    { char: '🙃', name: 'перевернутое лицо' },
    { char: '😉', name: 'подмигивающее лицо' },
    { char: '😊', name: 'улыбающееся лицо с улыбающимися глазами' },
    { char: '😇', name: 'улыбающееся лицо с нимбом' },
    { char: '🥰', name: 'улыбающееся лицо с сердечками' },
    { char: '😍', name: 'улыбающееся лицо с глазами-сердечками' },
    { char: '🤩', name: 'звездные глаза' },
    { char: '😘', name: 'лицо, посылающее поцелуй' },
    { char: '😗', name: 'целующее лицо' },
    { char: '😚', name: 'целующее лицо с закрытыми глазами' },
    { char: '😙', name: 'целующее лицо с улыбающимися глазами' },
    { char: '😋', name: 'лицо, смакующее еду' },
    { char: '😛', name: 'лицо с высунутым языком' },
    { char: '😜', name: 'подмигивающее лицо с высунутым языком' },
    { char: '🤪', name: 'сумасшедшее лицо' },
    { char: '😝', name: 'лицо с высунутым языком и плотно закрытыми глазами' },
    { char: '🤑', name: 'лицо с долларовыми знаками' },
    { char: '🤗', name: 'обнимающее лицо' },
    { char: '🤭', name: 'лицо с рукой над ртом' },
    { char: '🤫', name: 'лицо, призывающее к тишине' },
    { char: '🤔', name: 'думающее лицо' },
    { char: '🤐', name: 'лицо с застежкой-молнией' },
    { char: '🤨', name: 'лицо с поднятой бровью' },
    { char: '😐', name: 'нейтральное лицо' },
    { char: '😑', name: 'безвыразительное лицо' },
    { char: '😶', name: 'лицо без рта' },
    { char: '😏', name: 'ухмыляющееся лицо' },
    { char: '😒', name: 'недовольное лицо' },
    { char: '🙄', name: 'лицо, закатывающее глаза' },
    { char: '😬', name: 'гримасничающее лицо' },
    { char: '🤥', name: 'лгущее лицо' },
    { char: '😔', name: 'задумчивое лицо' },
    { char: '😪', name: 'сонное лицо' },
    { char: '🤤', name: 'лицо, пускающее слюни' },
    { char: '😴', name: 'спящее лицо' },
    { char: '😷', name: 'лицо в медицинской маске' },
    { char: '🤒', name: 'лицо с термометром' },
    { char: '🤕', name: 'лицо с головной повязкой' },
    { char: '🤢', name: 'тошнотворное лицо' },
    { char: '🤮', name: 'лицо, которое рвет' },
    { char: '🤧', name: 'чихающее лицо' },
    { char: '🥵', name: 'горячее лицо' },
    { char: '🥶', name: 'холодное лицо' },
    { char: '😵', name: 'головокружительное лицо' },
    { char: '🤯', name: 'взрывающаяся голова' },
    { char: '🤠', name: 'ковбойское лицо' },
    { char: '🥳', name: 'праздничное лицо' },
    { char: '😎', name: 'улыбающееся лицо в солнцезащитных очках' },
    { char: '🤓', name: 'лицо ботаника' },
    { char: '🧐', name: 'лицо с моноклем' }
  ],
  animals: [
    { char: '🐶', name: 'собачья морда' },
    { char: '🐱', name: 'кошачья морда' },
    { char: '🐭', name: 'мышиная морда' },
    { char: '🐹', name: 'хомячья морда' },
    { char: '🐰', name: 'кроличья морда' },
    { char: '🦊', name: 'лисья морда' },
    { char: '🐻', name: 'медвежья морда' },
    { char: '🐼', name: 'панда' },
    { char: '🐨', name: 'коала' },
    { char: '🐯', name: 'тигриная морда' },
    { char: '🦁', name: 'львиная морда' },
    { char: '🐮', name: 'коровья морда' },
    { char: '🐷', name: 'свиная морда' },
    { char: '🐸', name: 'лягушачья морда' },
    { char: '🐵', name: 'обезьянья морда' },
    { char: '🙈', name: 'обезьяна, закрывающая глаза' },
    { char: '🙉', name: 'обезьяна, закрывающая уши' },
    { char: '🙊', name: 'обезьяна, закрывающая рот' },
    { char: '🐒', name: 'обезьяна' },
    { char: '🐔', name: 'курица' },
    { char: '🐧', name: 'пингвин' },
    { char: '🐦', name: 'птица' },
    { char: '🐤', name: 'цыпленок' },
    { char: '🐣', name: 'вылупляющийся цыпленок' },
    { char: '🐥', name: 'цыпленок спереди' },
    { char: '🦆', name: 'утка' },
    { char: '🦅', name: 'орел' },
    { char: '🦉', name: 'сова' },
    { char: '🦇', name: 'летучая мышь' },
    { char: '🐺', name: 'волк' },
    { char: '🐗', name: 'кабан' },
    { char: '🐴', name: 'лошадиная морда' }
  ],
  food: [
    { char: '🍎', name: 'красное яблоко' },
    { char: '🍊', name: 'апельсин' },
    { char: '🍋', name: 'лимон' },
    { char: '🍌', name: 'банан' },
    { char: '🍉', name: 'арбуз' },
    { char: '🍇', name: 'виноград' },
    { char: '🍓', name: 'клубника' },
    { char: '🍈', name: 'дыня' },
    { char: '🍒', name: 'вишня' },
    { char: '🍑', name: 'персик' },
    { char: '🥭', name: 'манго' },
    { char: '🍍', name: 'ананас' },
    { char: '🥥', name: 'кокос' },
    { char: '🥝', name: 'киви' },
    { char: '🍅', name: 'помидор' },
    { char: '🍆', name: 'баклажан' },
    { char: '🥑', name: 'авокадо' },
    { char: '🥦', name: 'брокколи' },
    { char: '🥬', name: 'листовая зелень' },
    { char: '🥒', name: 'огурец' },
    { char: '🌶️', name: 'острый перец' },
    { char: '🌽', name: 'кукуруза' },
    { char: '🥕', name: 'морковь' },
    { char: '🧄', name: 'чеснок' },
    { char: '🧅', name: 'лук' },
    { char: '🥔', name: 'картофель' },
    { char: '🍠', name: 'жареный сладкий картофель' },
    { char: '🥐', name: 'круассан' },
    { char: '🥖', name: 'багет' },
    { char: '🍞', name: 'хлеб' },
    { char: '🥨', name: 'крендель' },
    { char: '🥯', name: 'бублик' }
  ],
  activities: [
    { char: '⚽', name: 'футбольный мяч' },
    { char: '🏀', name: 'баскетбольный мяч' },
    { char: '🏈', name: 'американский футбол' },
    { char: '⚾', name: 'бейсбол' },
    { char: '🥎', name: 'софтбол' },
    { char: '🎾', name: 'теннис' },
    { char: '🏐', name: 'волейбол' },
    { char: '🏉', name: 'регби' },
    { char: '🥏', name: 'фрисби' },
    { char: '🎱', name: 'пул 8 шар' },
    { char: '🪀', name: 'йо-йо' },
    { char: '🏓', name: 'пинг-понг' },
    { char: '🏸', name: 'бадминтон' },
    { char: '🏒', name: 'хоккейная клюшка и шайба' },
    { char: '🏑', name: 'хоккей на траве' },
    { char: '🥍', name: 'лакросс' },
    { char: '🏏', name: 'крикет' },
    { char: '🪃', name: 'бумеранг' },
    { char: '🥅', name: 'цель' },
    { char: '⛳', name: 'флаг в лунке' },
    { char: '🪁', name: 'воздушный змей' },
    { char: '🏹', name: 'лук и стрела' },
    { char: '🎣', name: 'рыбалка' },
    { char: '🤿', name: 'маска для дайвинга' },
    { char: '🥊', name: 'боксерская перчатка' },
    { char: '🥋', name: 'форма для боевых искусств' },
    { char: '🎽', name: 'беговая майка' },
    { char: '🛹', name: 'скейтборд' },
    { char: '🛷', name: 'сани' },
    { char: '⛸️', name: 'коньки' },
    { char: '🥌', name: 'керлинг' },
    { char: '🎿', name: 'лыжи' }
  ],
  travel: [
    { char: '🚗', name: 'автомобиль' },
    { char: '🚙', name: 'внедорожник' },
    { char: '🚌', name: 'автобус' },
    { char: '🚎', name: 'троллейбус' },
    { char: '🏎️', name: 'гоночный автомобиль' },
    { char: '🚓', name: 'полицейский автомобиль' },
    { char: '🚑', name: 'скорая помощь' },
    { char: '🚒', name: 'пожарная машина' },
    { char: '🚐', name: 'минивэн' },
    { char: '🛻', name: 'пикап' },
    { char: '🚚', name: 'грузовик' },
    { char: '🚛', name: 'сочлененный грузовик' },
    { char: '🚜', name: 'трактор' },
    { char: '🏍️', name: 'мотоцикл' },
    { char: '🛵', name: 'скутер' },
    { char: '🚲', name: 'велосипед' },
    { char: '🛴', name: 'самокат' },
    { char: '🚁', name: 'вертолет' },
    { char: '✈️', name: 'самолет' },
    { char: '🛩️', name: 'малый самолет' },
    { char: '🚀', name: 'ракета' },
    { char: '🛸', name: 'летающая тарелка' },
    { char: '🚉', name: 'станция' },
    { char: '🚊', name: 'трамвай' },
    { char: '🚝', name: 'монорельс' },
    { char: '🚞', name: 'горная железная дорога' },
    { char: '🚋', name: 'трамвайный вагон' },
    { char: '🚃', name: 'железнодорожный вагон' },
    { char: '🚂', name: 'паровоз' },
    { char: '🚄', name: 'высокоскоростной поезд' },
    { char: '🚅', name: 'скоростной поезд с пулевидным носом' },
    { char: '🚆', name: 'поезд' }
  ],
  objects: [
    { char: '💡', name: 'лампочка' },
    { char: '🔦', name: 'фонарик' },
    { char: '🕯️', name: 'свеча' },
    { char: '🪔', name: 'масляная лампа' },
    { char: '🔥', name: 'огонь' },
    { char: '💥', name: 'взрыв' },
    { char: '💫', name: 'головокружение' },
    { char: '⭐', name: 'звезда' },
    { char: '🌟', name: 'сияющая звезда' },
    { char: '✨', name: 'искры' },
    { char: '⚡', name: 'молния' },
    { char: '☄️', name: 'комета' },
    { char: '💎', name: 'драгоценный камень' },
    { char: '🔮', name: 'хрустальный шар' },
    { char: '💈', name: 'парикмахерский столб' },
    { char: '💍', name: 'кольцо' },
    { char: '💄', name: 'помада' },
    { char: '💋', name: 'отпечаток поцелуя' },
    { char: '👑', name: 'корона' },
    { char: '👒', name: 'женская шляпа' },
    { char: '🎩', name: 'цилиндр' },
    { char: '🎓', name: 'академическая шапочка' },
    { char: '🧢', name: 'бейсболка' },
    { char: '⛑️', name: 'шлем с крестом' },
    { char: '📱', name: 'мобильный телефон' },
    { char: '📞', name: 'телефонная трубка' },
    { char: '☎️', name: 'телефон' },
    { char: '📟', name: 'пейджер' },
    { char: '📠', name: 'факс' },
    { char: '📺', name: 'телевизор' },
    { char: '📻', name: 'радио' },
    { char: '🎙️', name: 'студийный микрофон' }
  ],
  symbols: [
    { char: '❤️', name: 'красное сердце' },
    { char: '🧡', name: 'оранжевое сердце' },
    { char: '💛', name: 'желтое сердце' },
    { char: '💚', name: 'зеленое сердце' },
    { char: '💙', name: 'синее сердце' },
    { char: '💜', name: 'фиолетовое сердце' },
    { char: '🖤', name: 'черное сердце' },
    { char: '🤍', name: 'белое сердце' },
    { char: '🤎', name: 'коричневое сердце' },
    { char: '💔', name: 'разбитое сердце' },
    { char: '❣️', name: 'восклицательный знак сердце' },
    { char: '💕', name: 'два сердца' },
    { char: '💞', name: 'вращающиеся сердца' },
    { char: '💓', name: 'бьющееся сердце' },
    { char: '💗', name: 'растущее сердце' },
    { char: '💖', name: 'сверкающее сердце' },
    { char: '💘', name: 'сердце со стрелой' },
    { char: '💝', name: 'сердце с лентой' },
    { char: '💟', name: 'украшение сердце' },
    { char: '☮️', name: 'символ мира' },
    { char: '✝️', name: 'латинский крест' },
    { char: '☪️', name: 'звезда и полумесяц' },
    { char: '🕉️', name: 'ом' },
    { char: '☸️', name: 'колесо дхармы' },
    { char: '✡️', name: 'звезда давида' },
    { char: '🔯', name: 'шестиконечная звезда' },
    { char: '🕎', name: 'менора' },
    { char: '☯️', name: 'инь ян' },
    { char: '☦️', name: 'православный крест' },
    { char: '🛐', name: 'место поклонения' },
    { char: '⛎', name: 'змееносец' },
    { char: '♈', name: 'овен' }
  ],
  flags: [
    { char: '🏁', name: 'клетчатый флаг' },
    { char: '🚩', name: 'треугольный флаг' },
    { char: '🎌', name: 'скрещенные флаги' },
    { char: '🏴', name: 'черный флаг' },
    { char: '🏳️', name: 'белый флаг' },
    { char: '🏳️‍🌈', name: 'радужный флаг' },
    { char: '🏳️‍⚧️', name: 'трансгендерный флаг' },
    { char: '🏴‍☠️', name: 'пиратский флаг' },
    { char: '🇦🇩', name: 'флаг андорры' },
    { char: '🇦🇪', name: 'флаг оаэ' },
    { char: '🇦🇫', name: 'флаг афганистана' },
    { char: '🇦🇬', name: 'флаг антигуа и барбуда' },
    { char: '🇦🇮', name: 'флаг ангильи' },
    { char: '🇦🇱', name: 'флаг албании' },
    { char: '🇦🇲', name: 'флаг армении' },
    { char: '🇦🇴', name: 'флаг анголы' },
    { char: '🇦🇶', name: 'флаг антарктиды' },
    { char: '🇦🇷', name: 'флаг аргентины' },
    { char: '🇦🇸', name: 'флаг американского самоа' },
    { char: '🇦🇹', name: 'флаг австрии' },
    { char: '🇦🇺', name: 'флаг австралии' },
    { char: '🇦🇼', name: 'флаг арубы' },
    { char: '🇦🇽', name: 'флаг аландских островов' },
    { char: '🇦🇿', name: 'флаг азербайджана' },
    { char: '🇧🇦', name: 'флаг боснии и герцеговины' },
    { char: '🇧🇧', name: 'флаг барбадоса' },
    { char: '🇧🇩', name: 'флаг бангладеш' },
    { char: '🇧🇪', name: 'флаг бельгии' },
    { char: '🇧🇫', name: 'флаг буркина-фасо' },
    { char: '🇧🇬', name: 'флаг болгарии' },
    { char: '🇧🇭', name: 'флаг бахрейна' },
    { char: '🇧🇮', name: 'флаг бурунди' },
    { char: '🇰🇿', name: 'флаг казахстана' },
    { char: '🇷🇺', name: 'флаг россии' }
  ]
}

const togglePicker = (event: Event) => {
  event.stopPropagation()
  isOpen.value = !isOpen.value
}

const selectEmoji = (emoji: string) => {
  // Добавляем в недавние
  if (!recentEmojis.value.includes(emoji)) {
    recentEmojis.value.unshift(emoji)
    if (recentEmojis.value.length > 16) {
      recentEmojis.value = recentEmojis.value.slice(0, 16)
    }
    // Сохраняем в localStorage
    localStorage.setItem('recent_emojis', JSON.stringify(recentEmojis.value))
  }

  emit('emojiSelected', emoji)
  isOpen.value = false
}

// Фильтрованные эмодзи по категории и поиску
const filteredEmojis = computed(() => {
  let emojis = emojiData[selectedCategory.value as keyof typeof emojiData] || []

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    emojis = emojis.filter(emoji =>
      emoji.name.toLowerCase().includes(query) ||
      emoji.char.includes(query)
    )
  }

  return emojis
})

// Закрываем пикер при клике вне его
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  const emojiPicker = target.closest('.emoji-picker-container')
  const emojiButton = target.closest('[title="Эмодзи"]')
  if (!emojiPicker && !emojiButton) {
    isOpen.value = false
  }
}

onMounted(() => {
  // Загружаем недавние эмодзи
  const saved = localStorage.getItem('recent_emojis')
  if (saved) {
    try {
      recentEmojis.value = JSON.parse(saved)
    } catch (e) {
    }
  }

  // Добавляем обработчик с небольшой задержкой, чтобы избежать немедленного закрытия
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside)
  }, 100)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Скрытие скроллбара для горизонтальной прокрутки категорий */
.scrollbar-hide {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Safari and Chrome */
}

/* Стилизация тонкого скроллбара для вертикальной прокрутки эмодзи */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f9fafb;
}

.dark .scrollbar-thin {
  scrollbar-color: #4b5563 #1f2937;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f9fafb;
  border-radius: 3px;
}

.dark .scrollbar-thin::-webkit-scrollbar-track {
  background: #1f2937;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
