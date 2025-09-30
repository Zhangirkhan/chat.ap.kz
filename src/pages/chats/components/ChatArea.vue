<template>
  <div :class="[
    'flex-1 flex-col transition-all duration-300',
    selectedChat ? 'flex' : 'hidden md:flex'
  ]">
    <!-- Заголовок чата -->
    <div v-if="selectedChat" class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Кнопка "Назад" для мобильных -->
          <button
            @click="$emit('backToList')"
            class="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            title="Назад к списку чатов"
          >
            <i class="pi pi-arrow-left text-lg"></i>
          </button>
          <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <span class="text-white font-semibold text-sm">{{ getClientInitial(selectedChat) }}</span>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ getClientDisplayName(selectedChat) }}</h3>
            <div class="flex items-center gap-2">
              <span :class="[
                'text-sm',
                getStatusColor(selectedChat.status) === 'green'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
              ]">
                {{ getStatusText(selectedChat.status) }}
              </span>
              <i v-if="getStatusColor(selectedChat.status) === 'green'" class="pi pi-circle-fill text-green-500 text-xs"></i>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-1 md:gap-2">
          <!-- Инфобокс о лимитах Wazzup -->
          <button
            @click="showWazzupInfo = !showWazzupInfo"
            class="p-2 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
            title="Показать ограничения Wazzup"
          >
            <i class="pi pi-info-circle text-sm md:text-base"></i>
          </button>
          <!-- Временно скрыта кнопка телефона -->
          <!--
          <button class="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="pi pi-phone text-sm md:text-base"></i>
          </button>
          -->
          <button
            @click="handleCloseChat"
            class="hidden sm:block p-2 text-red-500 hover:text-red-700 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            title="Закрыть чат"
          >
            <i class="pi pi-times text-sm md:text-base"></i>
          </button>
          <button class="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <i class="pi pi-ellipsis-v text-sm md:text-base"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Панель с ограничениями Wazzup -->
    <div v-if="showWazzupInfo" class="mx-4 my-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-900 dark:text-amber-200">
      <div class="flex items-start gap-2">
        <i class="pi pi-shield text-amber-600 dark:text-amber-300 mt-0.5"></i>
        <div class="space-y-2">
          <p class="font-medium">Вижу, что сработал наш спам‑фильтр.</p>
          <p>👉 Он сделан специально, чтобы защитить ваш номер от нежелательной блокировки аккаунта в случае ошибочной рассылки или неисправности автоматики.</p>
          <p>👉 Спам‑фильтр работает так: при превышении лимита (10 одинаковых сообщений подряд одному контакту за 100 секунд или 100 одинаковых сообщений подряд любым контактам за 10 секунд) канал попадает в спам‑лист и попытки отправки возвращают ошибку в течение 24 часов.</p>
          <p>👉 Проверьте, всё ли штатно работает, не сломан ли автоматический процесс, который отправляет одинаковые сообщения.</p>
          <p>👉 Если всё хорошо, можно запросить запуск канала повторно.</p>
        </div>
      </div>
    </div>

    <!-- Область сообщений -->
    <div
      v-if="selectedChat"
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
      @scroll="$emit('scroll')"
    >
      <!-- Отладочная информация -->
      <div v-if="messages.length === 0" class="text-center py-8">
        <div class="text-gray-500 dark:text-gray-400">
          <i class="pi pi-comments text-3xl mb-2"></i>
          <p>Сообщений нет</p>
          <p class="text-sm">Начните диалог с клиентом</p>
        </div>
      </div>
      
      <div
        v-for="message in messages"
        :key="message.id"
        :data-message-id="message.id"
        :class="[
          'flex w-full',
          message.type === 'system' ? 'justify-center' :
          message.is_from_client ? 'justify-start' : 'justify-end'
        ]"
      >
        <!-- Сообщение клиента (слева) -->
        <div v-if="message.is_from_client" class="flex items-start gap-3 max-w-[70%]">
          <!-- Аватар клиента -->
          <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
            <span class="text-white font-semibold text-xs">{{ getMessageClientInitial(message) }}</span>
          </div>

          <div class="flex flex-col">
            <!-- Имя клиента и время -->
            <div class="mb-1 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <span class="font-medium">{{ getClientName(message) }}</span>
              <span>{{ formatTime(message.created_at) }}</span>
            </div>

            <!-- Сообщение клиента -->
            <div class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border dark:border-gray-600 group relative">
              <!-- Кнопка ответа -->
              <button
                @click="emit('replyTo', message)"
                class="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 hover:bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                title="Ответить"
              >
                <i class="pi pi-reply text-xs"></i>
              </button>
              
              <!-- Цитата -->
              <MessageQuote 
                v-if="message.metadata?.reply_to_message_id"
                :message="message"
                :is-from-client="true"
                @scroll-to="scrollToMessageId"
              />
              
              <!-- Текстовое сообщение -->
              <div v-if="message.type === 'text'" class="whitespace-pre-wrap break-words">{{ message.message }}</div>

              <!-- Изображение -->
              <div v-else-if="message.type === 'image' && message.file_path" class="mb-2">
                <!-- Одиночное изображение -->
                <div v-if="!isPartOfImageGroup(message)" class="single-image">
                  <img
                    :src="message.file_path"
                    :alt="message.file_name || 'Изображение'"
                    class="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    style="max-height: 250px; width: auto; object-fit: contain;"
                    @click="$emit('openImagePreview', message.file_path)"
                    @error="handleImageError"
                  />
                  <p v-if="message.message" class="text-xs text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">{{ message.message }}</p>
                </div>
                
                <!-- Группа изображений (первое изображение в группе) -->
                <div v-else-if="isFirstInImageGroup(message)" class="image-group">
                  <div class="grid grid-cols-2 gap-2">
                    <div 
                      v-for="(imgMsg, index) in getImageGroup(message)" 
                      :key="imgMsg.id"
                      class="relative group"
                      :class="getImageGroupGridClass(getImageGroup(message), index)"
                    >
                      <img
                        :src="imgMsg.file_path"
                        :alt="imgMsg.file_name || 'Изображение'"
                        class="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity object-cover"
                        :style="getImageGroupStyle(getImageGroup(message), index)"
                        @click="$emit('openImagePreview', imgMsg.file_path)"
                        @error="handleImageError"
                      />
                      <!-- Показать количество оставшихся изображений для последнего элемента -->
                      <div 
                        v-if="index === 3 && getImageGroup(message).length > 4"
                        class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-opacity-60 transition-all"
                        @click="$emit('openImagePreview', imgMsg.file_path)"
                      >
                        <span class="text-white font-semibold text-lg">+{{ getImageGroup(message).length - 4 }}</span>
                      </div>
                    </div>
                  </div>
                  <p v-if="message.message" class="text-xs text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">{{ message.message }}</p>
                </div>
              </div>

              <!-- Видео -->
              <div v-else-if="message.type === 'video' && message.file_path" class="mb-2">
                <video
                  :src="message.file_path"
                  controls
                  class="max-w-full h-auto rounded-lg"
                  style="max-height: 300px; object-fit: contain;"
                >
                  Ваш браузер не поддерживает видео.
                </video>
                <p v-if="message.message" class="text-xs text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">{{ message.message }}</p>
              </div>

              <!-- Документ -->
              <div v-else-if="message.type === 'document' && message.file_path" class="mb-2">
                <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500">
                  <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i :class="getDocumentIcon(message.file_name)" class="text-2xl"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ message.file_name || 'Документ' }}</p>
                    <p v-if="message.file_size" class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(message.file_size) }}</p>
                    <p class="text-xs text-gray-400 dark:text-gray-500">{{ getFileExtension(message.file_name) }}</p>
                  </div>
                  <button
                    @click="handleDownloadFile(message)"
                    class="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors"
                    title="Скачать документ"
                  >
                    <i class="pi pi-download text-sm"></i>
                  </button>
                </div>
                <p v-if="message.message" class="text-xs text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">{{ message.message }}</p>
              </div>

              <!-- Аудио от клиента -->
              <div v-else-if="message.type === 'audio'" class="mb-2">
                <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                  <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="pi pi-volume-up text-green-600 dark:text-green-400"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">🎵 Голосовое сообщение</p>
                    <p v-if="message.file_size" class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(message.file_size) }}</p>
                    <audio controls class="w-full mt-2">
                      <source :src="message.file_path || message.metadata?.audio_url || message.metadata?.file_path" />
                      Ваш браузер не поддерживает аудио.
                    </audio>
                  </div>
                  <button
                    @click="handleDownloadFile(message)"
                    class="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                    title="Скачать аудио"
                  >
                    <i class="pi pi-download text-sm"></i>
                  </button>
                </div>
                <p v-if="message.message && message.message !== 'Аудио сообщение'" class="text-xs text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">{{ message.message }}</p>
              </div>

              <!-- Аудио файлы (старый формат type=file) -->
              <div v-else-if="message.type === 'file' && message.file_name && /\.(mp3|wav|ogg|m4a)$/i.test(message.file_name) && message.file_path" class="mb-2">
                <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                  <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="pi pi-volume-up text-green-600 dark:text-green-400"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">🎵 Голосовое сообщение</p>
                    <p v-if="message.file_size" class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(message.file_size) }}</p>
                    <audio controls class="w-full mt-2">
                      <source :src="message.file_path" />
                      Ваш браузер не поддерживает аудио.
                    </audio>
                  </div>
                  <button
                    @click="handleDownloadFile(message)"
                    class="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                    title="Скачать аудио"
                  >
                    <i class="pi pi-download text-sm"></i>
                  </button>
                </div>
                <p v-if="message.message && message.message !== 'Аудио сообщение'" class="text-xs text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">{{ message.message }}</p>
              </div>

              <!-- Неизвестный тип -->
              <div v-else class="text-sm text-gray-500">
                {{ message.type === 'image' ? '📷 Изображение' :
                   message.type === 'video' ? '🎥 Видео' :
                   message.type === 'audio' ? '🎵 Аудио' :
                   message.type === 'document' ? '📄 Документ' :
                   message.type === 'file' ? '📄 Файл' :
                   '📎 Вложение' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Системное сообщение (по центру) -->
        <div v-else-if="message.type === 'system'" class="flex justify-center">
          <div class="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg text-sm max-w-md shadow-sm border border-green-200 dark:border-green-700">
            <!-- Заголовок с именем и временем -->
            <div class="flex items-center justify-between mb-2 text-xs">
              <span class="font-medium">Система</span>
              <span class="opacity-75">{{ formatTime(message.created_at) }}</span>
            </div>
            <!-- Текст сообщения выровнен слева; сохраняем переносы и табы -->
            <div class="text-left leading-relaxed whitespace-pre-wrap break-words">
              {{ message.message }}
            </div>
          </div>
        </div>

        <!-- Наше сообщение (справа) -->
        <div v-else class="flex items-start gap-3 max-w-[70%] flex-row-reverse">
          <!-- Аватар сотрудника -->
          <div class="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
            <span class="text-white font-semibold text-xs">{{ getStaffInitial(message) }}</span>
          </div>

          <div class="flex flex-col items-end">
            <!-- Имя сотрудника, время и статус -->
            <div class="mb-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>{{ formatTime(message.created_at) }}</span>
              <span class="font-medium">{{ getStaffName(message) }}</span>
              <!-- Статус доставки -->
              <div v-if="(message as any).metadata?.wazzup_status" class="flex items-center gap-1">
                <i :class="getDeliveryStatusIcon((message as any).metadata.wazzup_status)" :title="getDeliveryStatusText((message as any).metadata.wazzup_status)"></i>
              </div>
            </div>

            <!-- Сообщение сотрудника -->
            <div class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-sm transition-colors group relative">
              <!-- Кнопка ответа -->
              <button
                @click="emit('replyTo', message)"
                class="absolute -top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                title="Ответить"
              >
                <i class="pi pi-reply text-xs"></i>
              </button>
              
              <!-- Цитата -->
              <MessageQuote 
                v-if="message.metadata?.reply_to_message_id"
                :message="message"
                :is-from-client="false"
                @scroll-to="scrollToMessageId"
              />
              
              <!-- Текстовое сообщение -->
              <div v-if="message.type === 'text'" class="whitespace-pre-wrap break-words">{{ message.message }}</div>

              <!-- Изображение -->
              <div v-else-if="message.type === 'image' && message.file_path" class="mb-2">
                <!-- Одиночное изображение -->
                <div v-if="!isPartOfImageGroup(message)" class="single-image">
                  <img
                    :src="message.file_path"
                    :alt="message.file_name || 'Изображение'"
                    class="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    style="max-height: 250px; width: auto; object-fit: contain;"
                    @click="$emit('openImagePreview', message.file_path)"
                    @error="handleImageError"
                  />
                  <p v-if="message.message" class="text-xs text-white opacity-90 mt-1 whitespace-pre-wrap">{{ message.message }}</p>
                </div>
                
                <!-- Группа изображений (первое изображение в группе) -->
                <div v-else-if="isFirstInImageGroup(message)" class="image-group">
                  <div class="grid grid-cols-2 gap-2">
                    <div 
                      v-for="(imgMsg, index) in getImageGroup(message)" 
                      :key="imgMsg.id"
                      class="relative group"
                      :class="getImageGroupGridClass(getImageGroup(message), index)"
                    >
                      <img
                        :src="imgMsg.file_path"
                        :alt="imgMsg.file_name || 'Изображение'"
                        class="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity object-cover"
                        :style="getImageGroupStyle(getImageGroup(message), index)"
                        @click="$emit('openImagePreview', imgMsg.file_path)"
                        @error="handleImageError"
                      />
                      <!-- Показать количество оставшихся изображений для последнего элемента -->
                      <div 
                        v-if="index === 3 && getImageGroup(message).length > 4"
                        class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-opacity-60 transition-all"
                        @click="$emit('openImagePreview', imgMsg.file_path)"
                      >
                        <span class="text-white font-semibold text-lg">+{{ getImageGroup(message).length - 4 }}</span>
                      </div>
                    </div>
                  </div>
                  <p v-if="message.message" class="text-xs text-white opacity-90 mt-2 whitespace-pre-wrap">{{ message.message }}</p>
                </div>
              </div>

              <!-- Видео -->
              <div v-else-if="message.type === 'video' && message.file_path" class="mb-2">
                <video
                  :src="message.file_path"
                  controls
                  class="max-w-full h-auto rounded-lg"
                  style="max-height: 300px; object-fit: contain;"
                >
                  Ваш браузер не поддерживает видео.
                </video>
                <p v-if="message.message" class="text-xs text-white opacity-90 mt-1 whitespace-pre-wrap">{{ message.message }}</p>
              </div>

              <!-- Аудио -->
              <div v-else-if="message.type === 'audio' && message.file_path" class="mb-2">
                <div class="flex items-center gap-3 p-3 bg-purple-600 rounded-lg border border-purple-500">
                  <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="pi pi-volume-up text-2xl text-white"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-white">{{ message.file_name || 'Аудио сообщение' }}</p>
                    <p v-if="message.file_size" class="text-xs text-white opacity-75">{{ formatFileSize(message.file_size) }}</p>
                    <audio
                      :src="message.file_path"
                      controls
                      class="w-full mt-2"
                      style="max-width: 100%;"
                    >
                      Ваш браузер не поддерживает аудио.
                    </audio>
                  </div>
                </div>
                <p v-if="message.message" class="text-xs text-white opacity-90 mt-1 whitespace-pre-wrap">{{ message.message }}</p>
              </div>

              <!-- Документ -->
              <div v-else-if="message.type === 'document' && message.file_path" class="mb-2">
                <div class="flex items-center gap-3 p-3 bg-blue-600 rounded-lg border border-blue-500">
                  <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i :class="getDocumentIcon(message.file_name)" class="text-2xl text-white"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-white truncate">{{ message.file_name || 'Документ' }}</p>
                    <p v-if="message.file_size" class="text-xs text-white opacity-75">{{ formatFileSize(message.file_size) }}</p>
                    <p class="text-xs text-white opacity-50">{{ getFileExtension(message.file_name) }}</p>
                  </div>
                  <button
                    @click="handleDownloadFile(message)"
                    class="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg flex items-center justify-center transition-colors"
                    title="Скачать документ"
                  >
                    <i class="pi pi-download text-sm"></i>
                  </button>
                </div>
                <p v-if="message.message" class="text-xs text-white opacity-90 mt-1 whitespace-pre-wrap">{{ message.message }}</p>
              </div>

              <!-- Документ (старый формат) -->
              <div v-else-if="message.type === 'file' && message.file_path" class="flex items-center gap-3 p-2 bg-blue-600 rounded-lg">
                <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <i class="pi pi-file text-white"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-white truncate">{{ message.file_name || 'Документ' }}</p>
                  <p v-if="message.file_size" class="text-xs text-white opacity-75">{{ formatFileSize(message.file_size) }}</p>
                </div>
                <button
                  @click="handleDownloadFile(message)"
                  class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
                  title="Скачать файл"
                >
                  <i class="pi pi-download text-sm"></i>
                </button>
              </div>

              <!-- Аудио исходящее (только отображение) -->
              <div v-else-if="message.type === 'audio'" class="mb-2">
                <div class="flex items-center gap-3 p-3 bg-blue-600 rounded-lg">
                  <div class="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="pi pi-volume-up text-white"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-white">🎵 Голосовое сообщение</p>
                    <p v-if="message.file_size" class="text-xs text-white opacity-75">{{ formatFileSize(message.file_size) }}</p>
                    <audio controls class="w-full mt-2">
                      <source :src="message.file_path || message.metadata?.audio_url || message.metadata?.file_path" />
                      Ваш браузер не поддерживает аудио.
                    </audio>
                  </div>
                  <button
                    @click="handleDownloadFile(message)"
                    class="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                    title="Скачать аудио"
                  >
                    <i class="pi pi-download text-sm"></i>
                  </button>
                </div>
                <p v-if="message.message && message.message !== 'Аудио сообщение'" class="text-xs text-white opacity-90 mt-1 whitespace-pre-wrap">{{ message.message }}</p>
              </div>

              <!-- Неизвестный тип -->
              <div v-else class="text-sm opacity-90">
                {{ message.type === 'image' ? '📷 Изображение' :
                   message.type === 'video' ? '🎥 Видео' :
                   message.type === 'audio' ? '🎵 Аудио' :
                   message.type === 'document' ? '📄 Документ' :
                   message.type === 'file' ? '📄 Файл' :
                   '📎 Вложение' }}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Поле ввода сообщения -->
    <div v-if="selectedChat" class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <!-- Превью ответа -->
      <div v-if="replyToMessage" class="px-4 pt-3 pb-2 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <i class="pi pi-reply text-blue-500 text-xs"></i>
              <span class="text-xs font-medium text-blue-600 dark:text-blue-400">
                Ответ на {{ replyToMessage.is_from_client ? getClientName(replyToMessage) : getStaffName(replyToMessage) }}
              </span>
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-300 truncate">
              {{ replyToMessage.message || getMessagePreview(replyToMessage) }}
            </p>
          </div>
          <button
            @click="emit('cancelReply')"
            class="flex-shrink-0 w-6 h-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center"
            title="Отменить ответ"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </div>
      </div>
      
      <div class="p-4 flex items-end gap-3">
        <!-- Меню загрузки файлов -->
        <div class="flex-shrink-0">
          <FileUploadMenu
            @file-selected="$emit('fileSelected', $event)"
            @file-error="$emit('fileError', $event)"
          />
        </div>

        <!-- Поле ввода с эмодзи -->
        <div class="flex-1 relative">
          <div class="flex items-end border border-gray-300 dark:border-gray-600 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <!-- Textarea для сообщения -->
            <textarea
              :value="props.newMessage || messageText"
              @input="handleInput"
              ref="messageInput"
              @keydown.enter.prevent="handleSendMessage"
              placeholder="Введите сообщение..."
              rows="1"
              class="flex-1 px-4 py-3 border-0 focus:ring-0 focus:outline-none bg-transparent dark:text-white resize-none"
              style="max-height: 120px; min-height: 48px;"
            ></textarea>

            <!-- Кнопка эмодзи -->
            <div class="flex-shrink-0 p-2">
              <EmojiPicker @emoji-selected="handleEmojiInsert" />
            </div>
          </div>
        </div>

        <!-- Кнопка отправки -->
        <div class="flex-shrink-0">
          <button
            @click="handleSendMessage"
            :disabled="!(props.newMessage || messageText).trim() || sendingMessage"
            class="w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-full transition-colors duration-200 flex items-center justify-center"
          >
            <i v-if="sendingMessage" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-send text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Индикатор загрузки файла -->
      <div v-if="uploadingFile" class="mt-3 flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div class="relative w-5 h-5">
          <div class="absolute inset-0 rounded-full border-2 border-blue-200 dark:border-blue-700"></div>
          <div class="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin"></div>
        </div>
        <span class="text-sm font-medium text-blue-700 dark:text-blue-300">Загрузка файлов...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch, computed } from 'vue'
import type { Chat, Message } from '@/shared/lib/types'
import FileUploadMenu from './FileUploadMenu.vue'
import EmojiPicker from './EmojiPicker.vue'
import MessageQuote from './MessageQuote.vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { chatApi } from '@/entities/chat/api/chatApi'

interface Props {
  selectedChat: Chat | null
  messages: Message[]
  newMessage?: string
  sendingMessage?: boolean
  uploadingFile?: boolean
  replyToMessage?: Message | null
}

const props = defineProps<Props>()

const messageText = ref('')
const messageInput = ref<HTMLTextAreaElement | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)
const showWazzupInfo = ref(false)

// Эмитим событие когда контейнер сообщений готов
onMounted(() => {
  nextTick(() => {
    if (messagesContainer.value) {
      emit('containerReady', messagesContainer.value)
    }
  })
})

// Следим за изменением selectedChat и эмитим containerReady
watch(() => props.selectedChat, (newChat) => {
  if (newChat) {
    nextTick(() => {
      if (messagesContainer.value) {
        emit('containerReady', messagesContainer.value)
      }
    })
  }
}, { immediate: true })
const confirm = useConfirm()
const toast = useToast()

// Режим разработки больше не влияет на вывод DEBUG в интерфейсе
const isDev = computed(() => false)

// Функции для получения имен и инициалов чата
const getClientDisplayName = (chat: Chat) => {
  // Если есть имя клиента в объекте client, показываем его
  if (chat.client?.name && chat.client.name.trim()) {
    return chat.client.name
  }
  
  // Если есть имя клиента в старом формате, показываем его
  if (chat.client_name && chat.client_name.trim()) {
    return chat.client_name
  }
  
  // Если есть заголовок чата, показываем его
  if (chat.title && chat.title.trim()) {
    return chat.title
  }
  
  // Если нет имени, но есть номер телефона в объекте client, показываем его
  if (chat.client?.phone && chat.client.phone.trim()) {
    return chat.client.phone
  }
  
  // Если нет имени, но есть номер телефона в старом формате, показываем его
  if (chat.client_phone && chat.client_phone.trim()) {
    return chat.client_phone
  }
  
  // Если есть телефон мессенджера, показываем его
  if (chat.messenger_phone && chat.messenger_phone.trim()) {
    return chat.messenger_phone
  }
  
  // Если есть email клиента, показываем его
  if (chat.client?.email && chat.client.email.trim()) {
    return chat.client.email
  }
  
  if (chat.client_email && chat.client_email.trim()) {
    return chat.client_email
  }
  
  // Если нет ни имени, ни телефона, ни email, показываем ID чата
  return `Чат #${chat.id}`
}

const getClientInitial = (chat: Chat) => {
  const displayName = getClientDisplayName(chat)
  
  if (!displayName) return '?'

  // Если это номер телефона, берем последнюю цифру
  if (/^\+?[0-9]+$/.test(displayName)) {
    return displayName.slice(-1)
  }

  // Если это email, берем первую букву до @
  if (displayName.includes('@')) {
    const emailName = displayName.split('@')[0]
    return emailName.charAt(0).toUpperCase()
  }

  // Если это имя, берем первую букву
  return displayName.charAt(0).toUpperCase()
}

// Функции для получения имен и инициалов сообщений
const getClientName = (message: Message) => {
  if (props.selectedChat?.client_name) {
    return props.selectedChat.client_name
  }
  return message.user?.name || 'Клиент'
}

const getMessageClientInitial = (message: Message) => {
  const name = getClientName(message)
  return name.charAt(0).toUpperCase()
}

const getStaffName = (message: Message) => {
  if ((message as unknown as Record<string, unknown>).user_id === 1) {
    return '🤖 Бот'
  }
  return message.user?.name || 'Сотрудник'
}

const getStaffInitial = (message: Message) => {
  if ((message as unknown as Record<string, unknown>).user_id === 1) {
    return '🤖'
  }
  const name = message.user?.name || 'С'
  return name.charAt(0).toUpperCase()
}

// Функции для статуса и времени
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'green'
    case 'pending': return 'yellow'
    default: return 'gray'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Активен'
    case 'pending': return 'Ожидает'
    case 'closed': return 'Закрыт'
    default: return 'Неизвестно'
  }
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Обработка ошибок загрузки изображений
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.warn('Failed to load image:', img.src)
  // Можно добавить fallback изображение или показать сообщение об ошибке
}

// Получение иконки для типа документа
const getDocumentIcon = (fileName?: string) => {
  if (!fileName) return 'pi pi-file'
  
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  const iconMap: Record<string, string> = {
    'pdf': 'pi pi-file-pdf',
    'doc': 'pi pi-file-word',
    'docx': 'pi pi-file-word',
    'xls': 'pi pi-file-excel',
    'xlsx': 'pi pi-file-excel',
    'ppt': 'pi pi-file-powerpoint',
    'pptx': 'pi pi-file-powerpoint',
    'txt': 'pi pi-file',
    'csv': 'pi pi-file',
    'zip': 'pi pi-file-archive',
    'rar': 'pi pi-file-archive',
    '7z': 'pi pi-file-archive',
    'jpg': 'pi pi-image',
    'jpeg': 'pi pi-image',
    'png': 'pi pi-image',
    'gif': 'pi pi-image',
    'webp': 'pi pi-image',
    'json': 'pi pi-file',
    'xml': 'pi pi-file'
  }
  
  return iconMap[extension || ''] || 'pi pi-file'
}

// Получение расширения файла
const getFileExtension = (fileName?: string) => {
  if (!fileName) return ''
  const extension = fileName.split('.').pop()?.toLowerCase()
  return extension ? extension.toUpperCase() : ''
}

// Обработка ввода текста
const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const value = target.value

  // Обновляем локальную переменную
  messageText.value = value

  // Эмитим обновление для v-model
  emit('update:newMessage', value)

  // Автоматически изменяем высоту
  adjustTextareaHeight()
}

// Получить превью сообщения для цитаты
const getMessagePreview = (message: Message) => {
  if (message.type === 'image') return '📷 Изображение'
  if (message.type === 'video') return '🎥 Видео'
  if (message.type === 'audio') return '🎵 Голосовое сообщение'
  if (message.type === 'document' || message.type === 'file') return '📄 ' + (message.file_name || 'Документ')
  return message.message || 'Сообщение'
}

// Прокрутка к сообщению
const scrollToMessageId = (messageId: number) => {
  nextTick(() => {
    const messageElement = messagesContainer.value?.querySelector(`[data-message-id="${messageId}"]`)
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Подсветка сообщения
      messageElement.classList.add('highlight-message')
      setTimeout(() => {
        messageElement.classList.remove('highlight-message')
      }, 2000)
    }
  })
}

// Обработчик вставки эмодзи
const handleEmojiInsert = (emoji: string) => {
  if (!messageInput.value) {
    // Если нет ссылки на textarea, просто добавляем в конец
    const currentText = props.newMessage || messageText.value
    const newText = currentText + emoji
    messageText.value = newText
    emit('update:newMessage', newText)
    return
  }

  const textarea = messageInput.value
  const start = textarea.selectionStart || 0
  const end = textarea.selectionEnd || 0

  const currentText = props.newMessage || messageText.value
  const beforeText = currentText.substring(0, start)
  const afterText = currentText.substring(end)

  const newText = beforeText + emoji + afterText
  messageText.value = newText
  emit('update:newMessage', newText)

  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.focus()
      const newPosition = start + emoji.length
      messageInput.value.setSelectionRange(newPosition, newPosition)
      adjustTextareaHeight()
    }
  })
}

// Автоматическое изменение высоты textarea
const adjustTextareaHeight = () => {
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.style.height = 'auto'
      messageInput.value.style.height = Math.min(messageInput.value.scrollHeight, 120) + 'px'
    }
  })
}

// Отправка сообщения
const handleSendMessage = () => {
  const currentMessage = props.newMessage || messageText.value
  
  if (!currentMessage.trim() || props.sendingMessage) {
    return
  }

  // Эмитим событие отправки сообщения
  emit('sendMessage')

  // Очищаем поле ввода
  messageText.value = ''
  emit('update:newMessage', '')

  // Сбрасываем высоту textarea
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.style.height = '48px'
    }
  })
}

// Закрытие чата с подтверждением
const handleCloseChat = () => {
  if (!props.selectedChat) return

  confirm.require({
    message: 'Вы уверены, что хотите закрыть этот чат?',
    header: 'Подтверждение закрытия',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Закрыть чат',
    accept: async () => {
      try {
        const response = await chatApi.closeMessengerChat(props.selectedChat!.id)

        if (response.success) {
          toast.add({
            severity: 'success',
            summary: 'Успешно',
            detail: 'Чат закрыт. Клиенту отправлено уведомление.',
            life: 5000
          })

          // Эмитим событие о закрытии чата
          emit('chatClosed', props.selectedChat!.id)
        }
      } catch {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Не удалось закрыть чат',
          life: 5000
        })
      }
    }
  })
}

const emit = defineEmits([
  'backToList',
  'scroll',
  'sendMessage',
  'fileSelected',
  'fileError',
  'emojiSelected',
  'openImagePreview',
  'update:newMessage',
  'chatClosed',
  'containerReady',
  'replyTo',
  'cancelReply'
])

// Методы для отображения статусов доставки
const getDeliveryStatusIcon = (status: string) => {
  switch (status) {
    case 'sent':
      return 'pi pi-check text-blue-400'
    case 'delivered':
      return 'pi pi-check-double text-gray-400'
    case 'read':
      return 'pi pi-check-double text-blue-500'
    case 'failed':
      return 'pi pi-times text-red-500'
    default:
      return 'pi pi-clock text-gray-400'
  }
}

const getDeliveryStatusText = (status: string) => {
  switch (status) {
    case 'sent':
      return 'Отправлено'
    case 'delivered':
      return 'Доставлено'
    case 'read':
      return 'Прочитано'
    case 'failed':
      return 'Ошибка доставки'
    default:
      return 'Обрабатывается'
  }
}

// Методы для работы с группами изображений
const isPartOfImageGroup = (message: Message) => {
  if (message.type !== 'image') return false
  
  // Ищем соседние изображения в течение 30 секунд
  const currentTime = new Date(message.created_at).getTime()
  const timeWindow = 30 * 1000 // 30 секунд
  
  const nearbyImages = props.messages.filter((msg, index) => {
    if (msg.type !== 'image' || msg.id === message.id) return false
    const msgTime = new Date(msg.created_at).getTime()
    return Math.abs(msgTime - currentTime) <= timeWindow
  })
  
  return nearbyImages.length > 0
}

const isFirstInImageGroup = (message: Message) => {
  if (!isPartOfImageGroup(message)) return false
  
  const currentTime = new Date(message.created_at).getTime()
  const timeWindow = 30 * 1000
  
  // Проверяем, есть ли изображения раньше этого
  const earlierImages = props.messages.filter((msg, index) => {
    if (msg.type !== 'image' || msg.id === message.id) return false
    const msgTime = new Date(msg.created_at).getTime()
    return msgTime < currentTime && Math.abs(msgTime - currentTime) <= timeWindow
  })
  
  return earlierImages.length === 0
}

const getImageGroup = (message: Message) => {
  if (message.type !== 'image') return [message]
  
  const currentTime = new Date(message.created_at).getTime()
  const timeWindow = 30 * 1000
  
  const groupImages = props.messages.filter((msg) => {
    if (msg.type !== 'image') return false
    const msgTime = new Date(msg.created_at).getTime()
    return Math.abs(msgTime - currentTime) <= timeWindow
  }).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  
  return groupImages.slice(0, 4) // Показываем максимум 4 изображения
}

const getImageGroupGridClass = (images: Message[], index: number) => {
  const count = images.length
  if (count === 1) return ''
  if (count === 2) return ''
  if (count === 3) {
    if (index === 0) return 'col-span-2'
    return ''
  }
  if (count >= 4) {
    if (index === 0) return 'col-span-2'
    return ''
  }
  return ''
}

const getImageGroupStyle = (images: Message[], index: number) => {
  const count = images.length
  if (count === 1) return 'max-height: 250px; object-fit: contain;'
  if (count === 2) return 'height: 120px; object-fit: cover;'
  if (count === 3) {
    if (index === 0) return 'height: 150px; object-fit: cover;'
    return 'height: 70px; object-fit: cover;'
  }
  if (count >= 4) {
    if (index === 0) return 'height: 120px; object-fit: cover;'
    return 'height: 80px; object-fit: cover;'
  }
  return ''
}

// Функция для принудительного скачивания файла
const handleDownloadFile = async (message: Message) => {
  try {
    const fileUrl = message.file_path || (message.metadata as any)?.audio_url || (message.metadata as any)?.file_path
    if (!fileUrl) {
      console.error('Нет URL файла для скачивания')
      return
    }
    
    const response = await fetch(fileUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = message.file_name || 'file'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Ошибка скачивания файла:', error)
    // Fallback: открыть в новой вкладке
    const fileUrl = message.file_path || (message.metadata as any)?.audio_url
    if (fileUrl) {
      window.open(fileUrl, '_blank')
    }
  }
}
</script>

<style scoped>
/* Анимация подсветки цитируемого сообщения */
:deep(.highlight-message) {
  animation: highlight 2s ease-in-out;
}

@keyframes highlight {
  0%, 100% {
    background-color: transparent;
  }
  50% {
    background-color: rgba(59, 130, 246, 0.2);
  }
}
</style>
