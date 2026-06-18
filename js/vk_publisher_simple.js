// VK Publisher - ИСПРАВЛЕННАЯ версия с принудительным отображением

// ========== КОНФИГУРАЦИЯ ==========
const VK_ACCESS_TOKEN = 'vk1.a.Dx2Q9eBUtyAznTAfQ_NaZP48G_WO0QtpV390AVQ4jvH4evJNUtOL9V2MrZ6ssAmm_DxDkGB3UzJKdYlKsT1ntAUHtvUYL6ItJMk9dB8bg7OZTqhFrDZesWNe35Z62TFvaCUCLbCenYivke-rgetpAH0RkNGkRqfVTyFQHGWceabFUA5eQh_3Ywm6hif80sXhm4rJSUAcqyknYLSfB3wwBg';
const VK_API_VERSION = '5.199';
const VK_GROUP_ID = '233570764';

let postAttachments = [];

// ========== ОТКРЫТИЕ МОДАЛЬНОГО ОКНА (ФОРСИРОВАННОЕ) ==========
function openVKPublishModal() {
    console.log('🔵 openVKPublishModal вызвана');
    
    const modal = document.getElementById('vkPublishModal');
    if (!modal) {
        console.error('❌ Модальное окно не найдено!');
        alert('Ошибка: модальное окно не найдено');
        return;
    }
    
    console.log('✅ Модальное окно найдено, открываем...');
    
    // ПРИНУДИТЕЛЬНОЕ ОТОБРАЖЕНИЕ - переопределяем все стили
    modal.style.display = 'block';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.zIndex = '99999';
    modal.style.overflow = 'auto';
    modal.style.padding = '20px';
    modal.style.boxSizing = 'border-box';
    
    // Принудительно показываем контент модального окна
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.display = 'block';
        modalContent.style.position = 'relative';
        modalContent.style.margin = '50px auto';
        modalContent.style.maxWidth = '700px';
        modalContent.style.backgroundColor = '#ffffff';
        modalContent.style.borderRadius = '16px';
        modalContent.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)';
        modalContent.style.padding = '0';
        modalContent.style.animation = 'slideDown 0.3s ease';
    }
    
    // Блокируем скролл страницы
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Модальное окно открыто');
}

// ========== ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА ==========
function closeVKPublishModal() {
    console.log('🔴 closeVKPublishModal вызвана');
    
    const modal = document.getElementById('vkPublishModal');
    if (modal) {
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
    }
    
    document.body.style.overflow = 'auto';
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
function initVKPublisher() {
    console.log('🚀 Инициализация VK Publisher...');
    
    // Принудительно скрываем модальное окно при загрузке
    const modal = document.getElementById('vkPublishModal');
    if (modal) {
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
    }
    
    setupVKPublisherUI();
    console.log('✅ VK Publisher инициализирован');
}

// ========== НАСТРОЙКА UI ==========
function setupVKPublisherUI() {
    // Обработчик загрузки изображений
    const imageUpload = document.getElementById('vkImageUpload');
    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }
    
    // Счетчик символов
    const postInput = document.getElementById('vkPostText');
    if (postInput) {
        postInput.addEventListener('input', updateCharCounter);
        updateCharCounter();
    }
    
    // Drag and drop для изображений
    const dropZone = document.getElementById('vkDropZone');
    if (dropZone) {
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            handleDroppedFiles(e.dataTransfer.files);
        });
    }
    
    // Закрытие по клику на фон (через event listener)
    const modal = document.getElementById('vkPublishModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeVKPublishModal();
            }
        });
    }
}

// ========== ЗАГРУЗКА ИЗОБРАЖЕНИЙ ==========
function handleImageUpload(e) {
    const files = e.target.files;
    handleDroppedFiles(files);
    e.target.value = '';
}

function handleDroppedFiles(files) {
    if (postAttachments.length + files.length > 10) {
        showNotification('Максимум 10 изображений на пост', 'error');
        return;
    }
    
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
            showNotification(`Файл "${file.name}" не является изображением`, 'warning');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            showNotification(`Изображение "${file.name}" слишком большое (макс. 10MB)`, 'warning');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            postAttachments.push({
                id: Date.now() + Math.random(),
                name: file.name,
                url: e.target.result,
                file: file
            });
            updateImagePreview();
        };
        reader.readAsDataURL(file);
    });
}

// ========== ПРЕВЬЮ ИЗОБРАЖЕНИЙ ==========
function updateImagePreview() {
    const preview = document.getElementById('vkImagePreview');
    if (!preview) return;
    
    if (postAttachments.length === 0) {
        preview.innerHTML = `
            <div class="empty-preview">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Нажмите для загрузки изображений или перетащите их сюда</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="image-grid">';
    postAttachments.forEach((img, index) => {
        html += `
            <div class="image-item">
                <img src="${img.url}" alt="${img.name}">
                <div class="image-overlay">
                    <button class="remove-image" onclick="removeImage(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    preview.innerHTML = html;
}

function removeImage(index) {
    postAttachments.splice(index, 1);
    updateImagePreview();
}

// ========== СЧЕТЧИК СИМВОЛОВ ==========
function updateCharCounter() {
    const input = document.getElementById('vkPostText');
    const counter = document.getElementById('charCounter');
    
    if (!input || !counter) return;
    
    const count = input.value.length;
    counter.textContent = `${count}/4096`;
    
    if (count > 4000) {
        counter.style.color = '#ef4444';
    } else if (count > 3500) {
        counter.style.color = '#f59e0b';
    } else {
        counter.style.color = '#64748b';
    }
}

// ========== ОЧИСТКА ФОРМЫ ==========
function clearVKForm() {
    const postInput = document.getElementById('vkPostText');
    if (postInput) postInput.value = '';
    postAttachments = [];
    updateCharCounter();
    updateImagePreview();
}

// ========== ПУБЛИКАЦИЯ В VK ==========
async function publishToVK() {
    const postText = document.getElementById('vkPostText').value.trim();
    
    if (!postText && postAttachments.length === 0) {
        showNotification('Введите текст или прикрепите изображения', 'error');
        return;
    }
    
    const publishBtn = document.querySelector('.vk-actions .btn-primary');
    if (publishBtn) {
        publishBtn.disabled = true;
        publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Публикация...';
    }
    
    showNotification('Начинаю публикацию в VK...', 'info');
    
    try {
        const params = new URLSearchParams({
            owner_id: `-${VK_GROUP_ID}`,
            message: postText,
            from_group: 1,
            access_token: VK_ACCESS_TOKEN,
            v: VK_API_VERSION
        });
        
        if (postAttachments.length > 0) {
            const attachments = [];
            
            for (const img of postAttachments) {
                try {
                    const uploadUrl = await getUploadServer();
                    if (uploadUrl) {
                        const photoData = await uploadPhoto(uploadUrl, img.file);
                        if (photoData) {
                            attachments.push(`photo${photoData.owner_id}_${photoData.id}`);
                        }
                    }
                } catch (err) {
                    console.error('Ошибка загрузки изображения:', err);
                }
            }
            
            if (attachments.length > 0) {
                params.append('attachments', attachments.join(','));
            }
        }
        
        console.log('Параметры запроса:', params.toString());
        
        const response = await fetch('https://api.vk.com/method/wall.post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });
        
        const data = await response.json();
        console.log('Ответ VK API:', data);
        
        if (data.error) {
            let errorMessage = 'Ошибка VK: ';
            
            switch(data.error.error_code) {
                case 5: errorMessage = 'Неверный токен доступа. Проверьте токен';
                    break;
                case 6: errorMessage = 'Слишком много запросов. Подождите';
                    break;
                case 14: errorMessage = 'Требуется капча';
                    break;
                case 15: errorMessage = 'Доступ запрещен. Проверьте права токена';
                    break;
                case 214: errorMessage = 'Нет прав на публикацию в группе';
                    break;
                default: errorMessage += data.error.error_msg || 'Неизвестная ошибка';
            }
            
            showNotification(errorMessage, 'error');
            saveNewsLocally(postText);
            
        } else if (data.response && data.response.post_id) {
            const postId = data.response.post_id;
            saveNewsLocally(postText, postId);
            
            showNotification('Новость успешно опубликована в VK! 🎉', 'success');
            
            setTimeout(() => {
                clearVKForm();
                closeVKPublishModal();
                
                if (typeof loadVKNews === 'function') {
                    loadVKNews();
                }
                
                showNotification('Готово! Новость появится на сайте', 'success');
            }, 1500);
            
        } else {
            showNotification('Новость сохранена локально', 'warning');
            saveNewsLocally(postText);
        }
        
    } catch (networkError) {
        console.error('Ошибка сети:', networkError);
        showNotification('Ошибка сети. Новость сохранена локально', 'error');
        saveNewsLocally(postText);
    }
    
    if (publishBtn) {
        publishBtn.disabled = false;
        publishBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Опубликовать в VK';
    }
}

// ========== ЗАГРУЗКА ИЗОБРАЖЕНИЙ В VK ==========
async function getUploadServer() {
    try {
        const response = await fetch(
            `https://api.vk.com/method/photos.getWallUploadServer?group_id=${VK_GROUP_ID}&access_token=${VK_ACCESS_TOKEN}&v=${VK_API_VERSION}`
        );
        const data = await response.json();
        
        if (data.response && data.response.upload_url) {
            return data.response.upload_url;
        } else {
            console.error('Не удалось получить URL для загрузки:', data);
            return null;
        }
    } catch (err) {
        console.error('Ошибка получения сервера загрузки:', err);
        return null;
    }
}

async function uploadPhoto(uploadUrl, file) {
    const formData = new FormData();
    formData.append('photo', file);
    
    try {
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        console.log('Результат загрузки фото:', data);
        
        if (data.server && data.photo && data.hash) {
            const saveResponse = await fetch(
                `https://api.vk.com/method/photos.saveWallPhoto?group_id=${VK_GROUP_ID}&server=${data.server}&photo=${encodeURIComponent(data.photo)}&hash=${data.hash}&access_token=${VK_ACCESS_TOKEN}&v=${VK_API_VERSION}`,
                { method: 'POST' }
            );
            
            const saveData = await saveResponse.json();
            console.log('Фото сохранено:', saveData);
            
            if (saveData.response && saveData.response.length > 0) {
                const photo = saveData.response[0];
                return { owner_id: photo.owner_id, id: photo.id };
            }
        }
        return null;
    } catch (err) {
        console.error('Ошибка загрузки фото:', err);
        return null;
    }
}

// ========== СОХРАНЕНИЕ НОВОСТИ ЛОКАЛЬНО ==========
function saveNewsLocally(text, vkPostId = null) {
    let news = JSON.parse(localStorage.getItem('ucheba_vk_news')) || [];
    
    const newNews = {
        id: Date.now(),
        text: text,
        date: new Date().toLocaleString('ru-RU'),
        fromVK: true,
        vkLink: vkPostId ? `https://vk.com/wall-${VK_GROUP_ID}_${vkPostId}` : null
    };
    
    news.unshift(newNews);
    
    if (news.length > 20) {
        news = news.slice(0, 20);
    }
    
    localStorage.setItem('ucheba_vk_news', JSON.stringify(news));
    return newNews;
}

// ========== УВЕДОМЛЕНИЯ ==========
function showNotification(message, type = 'info') {
    let container = document.getElementById('vkNotifications');
    if (!container) {
        container = document.createElement('div');
        container.id = 'vkNotifications';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 100000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        background: ${colors[type] || '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 280px;
        max-width: 400px;
        font-size: 14px;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${icons[type] || 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ========== СТИЛИ (встроенные с !important) ==========
const vkStyles = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes slideDown {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    /* Модальное окно - принудительные стили */
    #vkPublishModal {
        display: none !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0, 0, 0, 0.5) !important;
        z-index: 99999 !important;
        overflow: auto !important;
        padding: 20px !important;
        box-sizing: border-box !important;
    }
    
    #vkPublishModal.active {
        display: block !important;
    }
    
    #vkPublishModal .modal-content {
        position: relative !important;
        margin: 50px auto !important;
        max-width: 700px !important;
        background: #ffffff !important;
        border-radius: 16px !important;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
        padding: 0 !important;
        animation: slideDown 0.3s ease !important;
    }
    
    #vkPublishModal .modal-header {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        padding: 20px 25px !important;
        border-bottom: 1px solid #e2e8f0 !important;
    }
    
    #vkPublishModal .modal-header h2 {
        margin: 0 !important;
        font-size: 20px !important;
        color: #1e293b !important;
    }
    
    #vkPublishModal .modal-close {
        background: none !important;
        border: none !important;
        font-size: 28px !important;
        cursor: pointer !important;
        color: #94a3b8 !important;
        transition: color 0.3s !important;
        padding: 0 5px !important;
        line-height: 1 !important;
    }
    
    #vkPublishModal .modal-close:hover {
        color: #ef4444 !important;
    }
    
    #vkPublishModal .modal-body {
        padding: 25px !important;
    }
    
    .vk-publisher-container {
        background: white;
        border-radius: 12px;
    }
    
    .vk-form-group {
        margin-bottom: 20px;
    }
    
    .vk-form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #1e293b;
    }
    
    .vk-textarea {
        width: 100%;
        padding: 15px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 16px;
        font-family: inherit;
        resize: vertical;
        min-height: 120px;
        transition: border-color 0.3s;
        box-sizing: border-box;
    }
    
    .vk-textarea:focus {
        outline: none;
        border-color: #4a76a8;
        box-shadow: 0 0 0 3px rgba(74, 118, 168, 0.1);
    }
    
    .char-counter {
        text-align: right;
        font-size: 14px;
        color: #64748b;
        margin-top: 5px;
    }
    
    .image-upload-section {
        border: 2px dashed #e2e8f0;
        border-radius: 8px;
        padding: 25px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .image-upload-section:hover {
        border-color: #4a76a8;
        background: #f8fafc;
    }
    
    .image-upload-section.dragover {
        border-color: #4a76a8;
        background: rgba(74, 118, 168, 0.1);
    }
    
    .empty-preview {
        color: #64748b;
    }
    
    .empty-preview i {
        font-size: 48px;
        margin-bottom: 10px;
        opacity: 0.5;
    }
    
    .empty-preview p {
        margin: 0;
    }
    
    .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 10px;
        margin-top: 10px;
    }
    
    .image-item {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        aspect-ratio: 1;
    }
    
    .image-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .image-item:hover .image-overlay {
        opacity: 1;
    }
    
    .remove-image {
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s;
    }
    
    .remove-image:hover {
        transform: scale(1.1);
    }
    
    .vk-publish-info {
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        border-radius: 8px;
        padding: 12px 15px;
        margin: 20px 0;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        color: #0369a1;
        font-size: 14px;
    }
    
    .vk-publish-info i {
        font-size: 18px;
        margin-top: 2px;
    }
    
    .vk-actions {
        display: flex;
        gap: 15px;
        margin-top: 25px;
        padding-top: 20px;
        border-top: 1px solid #e2e8f0;
        flex-wrap: wrap;
    }
    
    .vk-actions .btn {
        flex: 1;
        min-width: 120px;
        justify-content: center;
        padding: 12px 20px;
    }
    
    .vk-actions .btn-outline {
        background: transparent;
        border: 2px solid #e2e8f0;
        color: #1e293b;
    }
    
    .vk-actions .btn-outline:hover {
        background: #f1f5f9;
        border-color: #94a3b8;
    }
    
    .vk-actions .btn-primary:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

// Добавляем стили
(function addStyles() {
    if (!document.getElementById('vkPublisherStyles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'vkPublisherStyles';
        styleSheet.textContent = vkStyles;
        document.head.appendChild(styleSheet);
        console.log('✅ Стили VK Publisher добавлены');
    }
})();

// Инициализируем при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    initVKPublisher();
    
    // Тестовое открытие через 2 секунды (для отладки)
    console.log('✅ VK Publisher готов! Используйте кнопку "Опубликовать новость в VK"');
    
    // Добавляем обработчик на кнопку вручную (на случай, если onclick не сработал)
    const adminBtn = document.getElementById('adminPublishBtn');
    if (adminBtn) {
        console.log('✅ Кнопка публикации найдена');
        // Убеждаемся, что обработчик есть
        if (!adminBtn._listenerAdded) {
            adminBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openVKPublishModal();
            });
            adminBtn._listenerAdded = true;
            console.log('✅ Обработчик клика добавлен на кнопку');
        }
    } else {
        console.warn('⚠️ Кнопка публикации не найдена на странице');
    }
});

console.log('📦 VK Publisher скрипт загружен');
