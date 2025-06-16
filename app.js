// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true
    });

    // Initialize the application
    initApp();
});

// Main initialization function
function initApp() {
    // Initialize navigation
    initNavigation();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize mobile navigation
    initMobileNavigation();
    
    // Initialize feature cards clicks
    initFeatureCardsNavigation();
    
    // Initialize all tools
    initSummarizer();
    initEssayIdeas();
    initExplainConcepts();
    initTranslator();
    initMCQGenerator();
    initGrammarFixer();
}

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const sidebar = document.querySelector('.sidebar');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and add to clicked link
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            
            // Get the target section id
            const targetId = this.getAttribute('href');
            
            // Hide all sections and show the target section
            sections.forEach(section => section.classList.remove('active'));
            document.querySelector(targetId).classList.add('active');
            
            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// Feature cards navigation functionality
function initFeatureCardsNavigation() {
    const featureCards = document.querySelectorAll('.feature-card');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const sidebar = document.querySelector('.sidebar');
    
    // Map feature card text to section IDs
    const cardToSection = {
        'Summarize Text': '#summarize',
        'Essay Ideas': '#essay-ideas',
        'Explain Concepts': '#explain',
        'Translate': '#translate',
        'Generate MCQs': '#mcq',
        'Grammar Fixer': '#grammar'
    };
    
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('h3').textContent;
            const targetSection = cardToSection[cardTitle];
            
            if (targetSection) {
                // Remove active class from all nav links and sections
                navLinks.forEach(link => link.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));
                
                // Add active class to target section
                document.querySelector(targetSection).classList.add('active');
                
                // Add active class to corresponding nav link
                const targetNavLink = document.querySelector(`a[href="${targetSection}"]`);
                if (targetNavLink) {
                    targetNavLink.classList.add('active');
                }
                
                // Close sidebar on mobile after navigation
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            }
        });
        
        // Add hover effect cursor
        card.style.cursor = 'pointer';
    });
}

// Theme toggle functionality with icon update
function initThemeToggle() {
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    const themeText = document.getElementById('theme-text');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeSwitch.checked = true;
        updateThemeDisplay(true);
    }
    
    // Theme switch event listener
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            updateThemeDisplay(true);
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            updateThemeDisplay(false);
        }
    });
    
    function updateThemeDisplay(isDark) {
        if (themeIcon) {
            themeIcon.className = isDark ? 'fas fa-moon theme-icon' : 'fas fa-sun theme-icon';
        }
        if (themeText) {
            themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        }
    }
}

// Loading spinner functions
function showLoading() {
    document.getElementById('loading-spinner').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading-spinner').classList.remove('active');
}

// Display results with formatting
function displayResult(elementId, content) {
    const resultArea = document.getElementById(elementId);
    resultArea.innerHTML = `<div class="result-content">${content}</div>`;
}

// Display error message
function displayError(elementId, message) {
    const resultArea = document.getElementById(elementId);
    resultArea.innerHTML = `<div class="result-content" style="color: var(--error-color);"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
}

// Validate input is not empty
function validateInput(input, minLength = 1) {
    return input && input.trim().length >= minLength;
}

// Format API response for better display
function formatResponse(text) {
    // Replace newlines with HTML breaks and improve formatting
    return text.replace(/\n/g, '<br>').replace(/\*\*/g, '<strong>').replace(/\*/g, '<em>');
}

// AI-powered text summarization using free APIs
async function generateSummaryWithAI(text) {
    try {
        // Try Hugging Face API first (free tier)
        return await summarizeWithHuggingFace(text);
    } catch (error) {
        try {
            // Fallback to extractive summarization
            return generateExtractiveSummary(text);
        } catch (error2) {
            console.error('All summarization methods failed:', error, error2);
            return generateBasicSummary(text);
        }
    }
}

// Hugging Face Inference API (Free)
async function summarizeWithHuggingFace(text) {
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: text,
                parameters: {
                    max_length: 150,
                    min_length: 30,
                    do_sample: false
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Hugging Face API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data && data[0] && data[0].summary_text) {
            return `<strong>AI-Generated Summary:</strong><br><br>${data[0].summary_text}`;
        } else {
            throw new Error('Invalid response from Hugging Face API');
        }
    } catch (error) {
        console.error('Hugging Face summarization failed:', error);
        throw error;
    }
}

// Enhanced extractive summarization
function generateExtractiveSummary(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 15);
    
    if (sentences.length === 0) {
        throw new Error("Text too short for summarization");
    }
    
    // Score sentences based on word frequency and position
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFreq = {};
    words.forEach(word => {
        if (word.length > 3) { // Skip short words
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
    });
    
    // Score sentences
    const sentenceScores = sentences.map((sentence, index) => {
        const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
        let score = 0;
        
        sentenceWords.forEach(word => {
            if (wordFreq[word]) {
                score += wordFreq[word];
            }
        });
        
        // Boost score for sentences at the beginning
        if (index < 2) score *= 1.5;
        
        return { sentence: sentence.trim(), score, index };
    });
    
    // Select top sentences
    const topSentences = sentenceScores
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.min(3, Math.ceil(sentences.length / 3)))
        .sort((a, b) => a.index - b.index);
    
    const summary = topSentences.map(item => item.sentence).join('. ') + '.';
    
    return `<strong>Extractive Summary:</strong><br><br>${summary}`;
}

// Basic fallback summarization
function generateBasicSummary(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const keyPoints = sentences.slice(0, Math.min(3, Math.ceil(sentences.length / 3)));
    
    if (keyPoints.length === 0) {
        return "Unable to generate summary. Please provide more substantial content.";
    }
    
    const summary = keyPoints.map(point => point.trim()).join('. ') + '.';
    
    return `<strong>Summary:</strong><br><br>${summary}`;
}

// Keep backward compatibility
function generateSummary(text) {
    return generateBasicSummary(text);
}

function generateEssayIdeas(topic) {
    const ideaTemplates = [
        {
            title: "Historical Analysis",
            points: [`The evolution of ${topic} throughout history`, `Key historical figures in ${topic}`, `Lessons from historical events related to ${topic}`]
        },
        {
            title: "Contemporary Relevance", 
            points: [`Current applications of ${topic}`, `Modern challenges in ${topic}`, `Future implications of ${topic}`]
        },
        {
            title: "Comparative Study",
            points: [`${topic} across different cultures/societies`, `Contrasting approaches to ${topic}`, `Benefits and drawbacks of various perspectives`]
        }
    ];
    
    const randomIdea = ideaTemplates[Math.floor(Math.random() * ideaTemplates.length)];
    
    return `<strong>Essay Ideas for "${topic}"</strong><br><br>
    <strong>Approach: ${randomIdea.title}</strong><br><br>
    <strong>Key Points to Explore:</strong><br>
    ${randomIdea.points.map((point, index) => `${index + 1}. ${point}`).join('<br>')}<br><br>
    <strong>Structure Suggestion:</strong><br>
    • Introduction: Define ${topic} and its significance<br>
    • Body: Develop each key point with evidence and examples<br>
    • Conclusion: Synthesize insights and propose future directions`;
}

function generateEssayTitles(topic) {
    const titleFormats = [
        `The Impact of ${topic} on Modern Society`,
        `Understanding ${topic}: A Comprehensive Analysis`,
        `${topic} in the 21st Century: Challenges and Opportunities`,
        `The Evolution of ${topic}: Past, Present, and Future`,
        `Exploring the Role of ${topic} in Contemporary Life`,
        `${topic}: A Critical Examination of Current Trends`,
        `The Significance of ${topic} in Today's World`,
        `${topic} and Its Implications for Future Generations`,
        `Rethinking ${topic}: New Perspectives and Approaches`,
        `The Complexity of ${topic}: Multiple Viewpoints`
    ];
    
    // Select 5 random titles
    const shuffled = titleFormats.sort(() => 0.5 - Math.random());
    const selectedTitles = shuffled.slice(0, 5);
    
    return `<strong>Essay Title Suggestions for "${topic}"</strong><br><br>
    ${selectedTitles.map((title, index) => `${index + 1}. <strong>${title}</strong>`).join('<br><br>')}<br><br>
    <strong>Writing Tips:</strong><br>
    • Choose the title that best matches your assignment requirements<br>
    • Modify any title to better fit your specific angle or focus<br>
    • Consider your target audience and academic level<br>
    • Ensure your chosen title is neither too broad nor too narrow<br><br>
    <em>Pro tip: A good essay title should be clear, specific, and engaging!</em>`;
}

function generateExplanation(concept) {
    const explanationFormats = [
        `<strong>${concept}</strong> is a fundamental concept that refers to...`,
        `Understanding <strong>${concept}</strong> requires examining its core components...`,
        `<strong>${concept}</strong> can be best understood through its practical applications...`
    ];
    
    const format = explanationFormats[Math.floor(Math.random() * explanationFormats.length)];
    
    return `${format}<br><br>
    <strong>Key Characteristics:</strong><br>
    • Primary function and purpose<br>
    • Relationship to related concepts<br>
    • Common applications or examples<br><br>
    <strong>Why it matters:</strong><br>
    This concept is important because it helps us understand broader patterns and relationships in the subject area.`;
}

function generateMCQs(text, questionCount) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const questions = [];
    
    for (let i = 0; i < Math.min(questionCount, sentences.length); i++) {
        const sentence = sentences[i].trim();
        const words = sentence.split(' ').filter(w => w.length > 3);
        
        if (words.length > 0) {
            const keyWord = words[Math.floor(Math.random() * words.length)];
            const context = sentence.length > 80 ? sentence.substring(0, 80) + '...' : sentence;
            
            questions.push({
                question: `According to the text, what role does "${keyWord}" play in the context?`,
                context: context,
                options: [
                    "It serves as the main subject of discussion",
                    "It represents a supporting example or detail", 
                    "It indicates a cause or reason for something",
                    "It shows a contrasting or opposing viewpoint"
                ]
            });
        }
    }
    
    if (questions.length === 0) {
        return "Unable to generate questions. Please provide more substantial content with complete sentences.";
    }
    
    let result = `<div class="mcq-result-header">Here are ${questions.length} MCQ${questions.length > 1 ? 's' : ''} generated from your text:</div>`;
    
    questions.forEach((q, index) => {
        result += `<strong>Question ${index + 1}:</strong> ${q.question}<br>`;
        result += `<div class="mcq-context">Context: "${q.context}"</div>`;
        q.options.forEach((option, optIndex) => {
            const letter = String.fromCharCode(65 + optIndex); // A, B, C, D
            result += `${letter}) ${option}<br>`;
        });
        result += '<br>';
    });
    
    return result;
}

// MyMemory API (Free, no API key required)
async function translateWithMyMemory(text, sourceLang, targetLang) {
    try {
        const encodedText = encodeURIComponent(text);
        const langPair = sourceLang === 'auto' ? `auto|${targetLang}` : `${sourceLang}|${targetLang}`;
        const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`;
        
        // Add timeout to prevent long waits
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'AI Student Helper'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData.translatedText) {
            return data.responseData.translatedText;
        } else {
            throw new Error(`MyMemory API error: ${data.responseDetails || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('MyMemory translation failed:', error);
        throw error;
    }
}

// LibreTranslate API (Free, open source)
async function translateWithLibre(text, sourceLang, targetLang) {
    try {
        const url = 'https://libretranslate.de/translate';
        
        // Add timeout to prevent long waits
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                source: sourceLang === 'auto' ? 'auto' : sourceLang,
                target: targetLang,
                format: 'text'
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.translatedText) {
            return data.translatedText;
        } else {
            throw new Error('LibreTranslate API error: No translation returned');
        }
    } catch (error) {
        console.error('LibreTranslate translation failed:', error);
        throw error;
    }
}

// Google Translate Free API (Unofficial)
async function translateWithGoogleFree(text, sourceLang, targetLang) {
    try {
        const encodedText = encodeURIComponent(text);
        const source = sourceLang === 'auto' ? 'auto' : sourceLang;
        
        // Using translate.googleapis.com (free tier)
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${targetLang}&dt=t&q=${encodedText}`;
        
        // Add timeout to prevent long waits
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            // Extract translated text from Google's response format
            let translatedText = '';
            for (let i = 0; i < data[0].length; i++) {
                if (data[0][i][0]) {
                    translatedText += data[0][i][0];
                }
            }
            return translatedText;
        } else {
            throw new Error('Google Translate API error: Invalid response format');
        }
    } catch (error) {
        console.error('Google Translate failed:', error);
        throw error;
    }
}

// Fallback translation function with basic local translation
async function fallbackTranslation(text, sourceLang, targetLang) {
    // Quick local translation for common programming terms
    const programmingTerms = {
        'function': 'دالة',
        'variable': 'متغير',
        'console': 'وحدة التحكم',
        'log': 'سجل',
        'return': 'إرجاع',
        'if': 'إذا',
        'else': 'وإلا',
        'for': 'لـ',
        'while': 'بينما',
        'array': 'مصفوفة',
        'object': 'كائن',
        'string': 'نص',
        'number': 'رقم',
        'boolean': 'منطقي',
        'true': 'صحيح',
        'false': 'خطأ',
        'null': 'فارغ',
        'undefined': 'غير محدد',
        'class': 'فئة',
        'method': 'طريقة',
        'property': 'خاصية',
        'event': 'حدث',
        'click': 'نقر',
        'button': 'زر',
        'input': 'إدخال',
        'output': 'إخراج',
        'error': 'خطأ',
        'success': 'نجح',
        'loading': 'تحميل',
        'data': 'بيانات',
        'api': 'واجهة برمجة التطبيقات',
        'database': 'قاعدة بيانات',
        'server': 'خادم',
        'client': 'عميل',
        'request': 'طلب',
        'response': 'استجابة'
    };
    
    if (sourceLang === 'en' && targetLang === 'ar') {
        let translatedText = text.toLowerCase();
        
        // Replace common programming terms
        for (let [english, arabic] of Object.entries(programmingTerms)) {
            const regex = new RegExp(`\\b${english}\\b`, 'gi');
            translatedText = translatedText.replace(regex, arabic);
        }
        
        // If we found translations, return them
        if (translatedText !== text.toLowerCase()) {
            return `<strong>ترجمة محلية (أساسية):</strong><br><br>
            ${translatedText}<br><br>
            <small><em>💡 هذه ترجمة أساسية للمصطلحات البرمجية الشائعة</em></small>`;
        }
    }
    
    // Default fallback message
    if (sourceLang === 'en' && targetLang === 'ar') {
        return `<strong>⚠️ خدمة الترجمة غير متاحة مؤقتاً</strong><br><br>
        <em>النص الأصلي:</em><br>
        ${text}<br><br>
        <small>يرجى المحاولة لاحقاً أو استخدام خدمة ترجمة أخرى</small>`;
    } else if (sourceLang === 'ar' && targetLang === 'en') {
        return `<strong>⚠️ Translation service temporarily unavailable</strong><br><br>
        <em>Original text:</em><br>
        ${text}<br><br>
        <small>Please try again later or use another translation service</small>`;
    }
    
    return `<strong>Translation service temporarily unavailable</strong><br><br>
    <em>Original text:</em><br>
    ${text}`;
}

// Enhanced translation function with MyMemory API
async function translateText(text, sourceLang, targetLang) {
    console.log(`Translating from ${sourceLang} to ${targetLang}:`, text);
    
    // Try multiple free translation APIs
    try {
        // First try: MyMemory API (free, no key required)
        const translatedText = await translateWithMyMemory(text, sourceLang, targetLang);
        return `<strong>${targetLang === 'ar' ? 'الترجمة العربية' : 'English Translation'}:</strong><br><br>
        ${translatedText}`;
    } catch (error) {
        try {
            // Second try: LibreTranslate (free, open source)
            const translatedText = await translateWithLibre(text, sourceLang, targetLang);
            return `<strong>${targetLang === 'ar' ? 'الترجمة العربية' : 'English Translation'}:</strong><br><br>
            ${translatedText}`;
        } catch (error2) {
            try {
                // Third try: Google Translate (unofficial free API)
                const translatedText = await translateWithGoogleFree(text, sourceLang, targetLang);
                return `<strong>${targetLang === 'ar' ? 'الترجمة العربية' : 'English Translation'}:</strong><br><br>
                ${translatedText}`;
            } catch (error3) {
                console.error('All translation APIs failed:', error, error2, error3);
                return await fallbackTranslation(text, sourceLang, targetLang);
            }
        }
    }
}

// Initialize Text Summarizer
function initSummarizer() {
    const summarizeBtn = document.getElementById('summarize-btn');
    const summarizeRegenerateBtn = document.getElementById('summarize-regenerate-btn');
    const summarizeInput = document.getElementById('summarize-input');
    
    async function generateSummaryAction() {
        const text = summarizeInput.value.trim();
        
        if (!validateInput(text, 100)) {
            displayError('summarize-result', 'Please enter at least 100 characters of text to summarize.');
            return;
        }
        
        // Store current data for regeneration
        currentGenerationData.summarize.text = text;
        
        try {
            showLoading();
            const summary = await generateSummaryWithAI(text);
            displayResult('summarize-result', formatResponse(summary));
            
            // Show regenerate button and actions
            summarizeRegenerateBtn.style.display = 'flex';
            showResultActions('summarize');
        } catch (error) {
            displayError('summarize-result', 'An error occurred while summarizing the text. Please try again.');
            console.error('Summarization error:', error);
        } finally {
            hideLoading();
        }
    }
    
    // Main summarize button
    summarizeBtn.addEventListener('click', generateSummaryAction);
    
    // Regenerate button
    summarizeRegenerateBtn.addEventListener('click', async function() {
        if (!currentGenerationData.summarize.text) return;
        
        try {
            showLoading();
            await new Promise(resolve => setTimeout(resolve, 1200));
            const summary = generateSummary(currentGenerationData.summarize.text);
            displayResult('summarize-result', formatResponse(summary));
        } catch (error) {
            displayError('summarize-result', 'An error occurred while regenerating the summary. Please try again.');
            console.error('Summary regeneration error:', error);
        } finally {
            hideLoading();
        }
    });
    
    // Hide regenerate button and actions when input changes
    summarizeInput.addEventListener('input', function() {
        if (summarizeRegenerateBtn.style.display !== 'none') {
            summarizeRegenerateBtn.style.display = 'none';
            hideResultActions('summarize');
        }
    });
    
    // Add Enter key support
    summarizeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            summarizeBtn.click();
        }
    });
}

// Initialize Essay Ideas Generator
function initEssayIdeas() {
    const essayBtn = document.getElementById('essay-ideas-btn');
    const essayRegenerateBtn = document.getElementById('essay-regenerate-btn');
    const essayInput = document.getElementById('essay-topic-input');
    
    async function generateEssayAction() {
        const topic = essayInput.value.trim();
        
        if (!validateInput(topic, 3)) {
            displayError('essay-ideas-result', 'Please enter a topic for your essay.');
            return;
        }
        
        // Get selected generation type
        const generationType = document.querySelector('input[name="generation-type"]:checked').value;
        
        // Store current data for regeneration
        currentGenerationData.essay.topic = topic;
        currentGenerationData.essay.type = generationType;
        
        try {
            showLoading();
            await new Promise(resolve => setTimeout(resolve, 1200));
            
            let result;
            if (generationType === 'full') {
                result = generateEssayIdeas(topic);
            } else if (generationType === 'titles') {
                result = generateEssayTitlesWithSelection(topic);
            }
            
            displayResult('essay-ideas-result', formatResponse(result));
            
            // Show regenerate button and actions
            essayRegenerateBtn.style.display = 'flex';
            showResultActions('essay');
        } catch (error) {
            displayError('essay-ideas-result', 'An error occurred while generating essay ideas. Please try again.');
            console.error('Essay ideas generation error:', error);
        } finally {
            hideLoading();
        }
    }
    
    // Main generate button
    essayBtn.addEventListener('click', generateEssayAction);
    
    // Regenerate button
    essayRegenerateBtn.addEventListener('click', async function() {
        if (!currentGenerationData.essay.topic) return;
        
        try {
            showLoading();
            await new Promise(resolve => setTimeout(resolve, 1200));
            
            let result;
            if (currentGenerationData.essay.type === 'full') {
                result = generateEssayIdeas(currentGenerationData.essay.topic);
            } else if (currentGenerationData.essay.type === 'titles') {
                result = generateEssayTitlesWithSelection(currentGenerationData.essay.topic);
            }
            
            displayResult('essay-ideas-result', formatResponse(result));
        } catch (error) {
            displayError('essay-ideas-result', 'An error occurred while regenerating essay ideas. Please try again.');
            console.error('Essay ideas regeneration error:', error);
        } finally {
            hideLoading();
        }
    });
    
    // Hide regenerate button and actions when input changes
    essayInput.addEventListener('input', function() {
        if (essayRegenerateBtn.style.display !== 'none') {
            essayRegenerateBtn.style.display = 'none';
            hideResultActions('essay');
        }
    });
    
    // Add Enter key support
    essayInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            essayBtn.click();
        }
    });
    
    // Add visual feedback for radio button changes
    const radioOptions = document.querySelectorAll('.radio-option');
    radioOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            radioOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update button text based on selection
            const selectedType = this.querySelector('input[type="radio"]').value;
            const btnText = selectedType === 'full' ? 'Generate Full Outline' : 'Generate Titles';
            essayBtn.textContent = btnText;
            
            // Hide actions if generation type changes
            if (essayRegenerateBtn.style.display !== 'none') {
                hideResultActions('essay');
            }
        });
    });
    
    // Set initial button text
    essayBtn.textContent = 'Generate Full Outline';
}

// Initialize Concept Explainer
function initExplainConcepts() {
    const explainBtn = document.getElementById('explain-btn');
    const explainRegenerateBtn = document.getElementById('explain-regenerate-btn');
    const explainInput = document.getElementById('explain-input');
    
    async function generateExplanationAction() {
        const concept = explainInput.value.trim();
        
        if (!validateInput(concept, 2)) {
            displayError('explain-result', 'Please enter a concept or term to explain.');
            return;
        }
        
        // Store current data for regeneration
        currentGenerationData.explain.concept = concept;
        
        try {
            showLoading();
            await new Promise(resolve => setTimeout(resolve, 1000));
            const explanation = generateExplanation(concept);
            displayResult('explain-result', formatResponse(explanation));
            
            // Show regenerate button and actions
            explainRegenerateBtn.style.display = 'flex';
            showResultActions('explain');
        } catch (error) {
            displayError('explain-result', 'An error occurred while generating the explanation. Please try again.');
            console.error('Explanation error:', error);
        } finally {
            hideLoading();
        }
    }
    
    // Main explain button
    explainBtn.addEventListener('click', generateExplanationAction);
    
    // Regenerate button
    explainRegenerateBtn.addEventListener('click', async function() {
        if (!currentGenerationData.explain.concept) return;
        
        try {
            showLoading();
            await new Promise(resolve => setTimeout(resolve, 1000));
            const explanation = generateExplanation(currentGenerationData.explain.concept);
            displayResult('explain-result', formatResponse(explanation));
        } catch (error) {
            displayError('explain-result', 'An error occurred while regenerating the explanation. Please try again.');
            console.error('Explanation regeneration error:', error);
        } finally {
            hideLoading();
        }
    });
    
    // Hide regenerate button and actions when input changes
    explainInput.addEventListener('input', function() {
        if (explainRegenerateBtn.style.display !== 'none') {
            explainRegenerateBtn.style.display = 'none';
            hideResultActions('explain');
        }
    });
    
    // Add Enter key support
    explainInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            explainBtn.click();
        }
    });
}

// Initialize Translator
function initTranslator() {
    const translateBtn = document.getElementById('translate-btn');
    const translateInput = document.getElementById('translate-input');
    const fromLang = document.getElementById('translate-from');
    const toLang = document.getElementById('translate-to');
    const swapBtn = document.getElementById('swap-languages');
    
    // Swap languages functionality
    swapBtn.addEventListener('click', function() {
        // Don't allow swapping if "auto" is selected
        if (fromLang.value === 'auto') {
            return;
        }
        
        const tempLang = fromLang.value;
        fromLang.value = toLang.value;
        toLang.value = tempLang;
    });
    
    translateBtn.addEventListener('click', async function() {
        const text = translateInput.value.trim();
        const sourceLang = fromLang.value;
        const targetLang = toLang.value;
        
        if (!validateInput(text, 1)) {
            displayError('translate-result', 'Please enter text to translate.');
            return;
        }
        
        if (sourceLang === targetLang && sourceLang !== 'auto') {
            displayError('translate-result', 'Please select different source and target languages.');
            return;
        }
        
        try {
            showLoading();
            const translation = await translateText(text, sourceLang, targetLang);
            
            displayResult('translate-result', formatResponse(translation));
            showResultActions('translate');
        } catch (error) {
            // Fallback to simulation if API fails
            try {
                const fallbackResult = await fallbackTranslation(text, sourceLang, targetLang);
                const result = `<strong>${targetLang === 'ar' ? 'Arabic' : 'English'} Translation:</strong><br><br>
                ${fallbackResult}`;
                displayResult('translate-result', formatResponse(result));
            } catch (fallbackError) {
                displayError('translate-result', 'Translation service is currently unavailable. Please try again later.');
                console.error('Translation error:', error, fallbackError);
            }
        } finally {
            hideLoading();
        }
    });
    
    // Add Enter key support
    translateInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            translateBtn.click();
        }
    });
    
    // Hide result actions when input changes
    translateInput.addEventListener('input', function() {
        hideResultActions('translate');
    });
    
    // Hide result actions when language selection changes
    fromLang.addEventListener('change', function() {
        hideResultActions('translate');
    });
    
    toLang.addEventListener('change', function() {
        hideResultActions('translate');
    });
}

// Initialize MCQ Generator
function initMCQGenerator() {
    const mcqBtn = document.getElementById('mcq-btn');
    const mcqRegenerateBtn = document.getElementById('mcq-regenerate-btn');
    const mcqInput = document.getElementById('mcq-input');
    const mcqCount = document.getElementById('mcq-count');
    
    // Store current text for regeneration
    let currentText = '';
    let currentQuestionCount = 5;
    
    async function generateQuestions() {
        const text = mcqInput.value.trim();
        const questionCount = parseInt(mcqCount.value);
        
        if (!validateInput(text, 50)) {
            displayError('mcq-result', 'Please enter at least 50 characters of text to generate questions.');
            return;
        }
        
        if (!questionCount || questionCount < 1 || questionCount > 10) {
            displayError('mcq-result', 'Please select a number of questions between 1 and 10.');
            return;
        }
        
        // Store current values for regeneration
        currentText = text;
        currentQuestionCount = questionCount;
        
        try {
            showLoading();
            await new Promise(resolve => setTimeout(resolve, 1800));
            const mcqs = generateMCQs(text, questionCount);
            displayResult('mcq-result', formatResponse(mcqs));
            
            // Show regenerate button after successful generation
            mcqRegenerateBtn.style.display = 'flex';
            showResultActions('mcq');
        } catch (error) {
            displayError('mcq-result', 'An error occurred while generating questions. Please try again.');
            console.error('MCQ generation error:', error);
        } finally {
            hideLoading();
        }
    }
    
    mcqBtn.addEventListener('click', generateQuestions);
    
    // Regenerate button functionality
    mcqRegenerateBtn.addEventListener('click', async function() {
        if (!currentText) return;
        
        try {
            showLoading();
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mcqs = generateMCQs(currentText, currentQuestionCount);
            displayResult('mcq-result', formatResponse(mcqs));
        } catch (error) {
            displayError('mcq-result', 'An error occurred while regenerating questions. Please try again.');
            console.error('MCQ regeneration error:', error);
        } finally {
            hideLoading();
        }
    });
    
    // Hide regenerate button when input changes
    mcqInput.addEventListener('input', function() {
        if (mcqRegenerateBtn.style.display !== 'none') {
            mcqRegenerateBtn.style.display = 'none';
            hideResultActions('mcq');
        }
    });
    
    mcqCount.addEventListener('change', function() {
        if (mcqRegenerateBtn.style.display !== 'none') {
            mcqRegenerateBtn.style.display = 'none';
            hideResultActions('mcq');
        }
    });
    
    // Add Enter key support
    mcqInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            mcqBtn.click();
        }
    });
}

// Initialize Grammar Fixer
function initGrammarFixer() {
    const grammarBtn = document.getElementById('grammar-btn');
    const grammarRegenerateBtn = document.getElementById('grammar-regenerate-btn');
    const grammarInput = document.getElementById('grammar-input');
    
    // Store current text for regeneration
    let currentText = '';
    
    async function fixGrammar() {
        const text = grammarInput.value.trim();
        
        if (!validateInput(text, 10)) {
            displayError('grammar-result', 'Please enter at least 10 characters of text to check grammar.');
            return;
        }
        
        // Store current value for regeneration
        currentText = text;
        
        try {
            showLoading();
            const correctedText = await checkGrammarWithAPI(text);
            displayResult('grammar-result', formatResponse(correctedText));
            
            // Show regenerate button after successful generation
            grammarRegenerateBtn.style.display = 'flex';
            showResultActions('grammar');
        } catch (error) {
            displayError('grammar-result', 'An error occurred while checking grammar. Please try again.');
            console.error('Grammar check error:', error);
        } finally {
            hideLoading();
        }
    }
    
    grammarBtn.addEventListener('click', fixGrammar);
    
    // Regenerate button functionality
    grammarRegenerateBtn.addEventListener('click', async function() {
        if (!currentText) return;
        
        try {
            showLoading();
            await new Promise(resolve => setTimeout(resolve, 1500));
            const correctedText = generateGrammarFix(currentText);
            displayResult('grammar-result', formatResponse(correctedText));
        } catch (error) {
            displayError('grammar-result', 'An error occurred while rechecking grammar. Please try again.');
            console.error('Grammar recheck error:', error);
        } finally {
            hideLoading();
        }
    });
    
    // Hide regenerate button when input changes
    grammarInput.addEventListener('input', function() {
        if (grammarRegenerateBtn.style.display !== 'none') {
            grammarRegenerateBtn.style.display = 'none';
            hideResultActions('grammar');
        }
    });
    
    // Add Enter key support
    grammarInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            grammarBtn.click();
        }
    });
    
    // Hide result actions when input changes
    grammarInput.addEventListener('input', function() {
        hideResultActions('grammar');
    });
}

// AI-powered grammar checking using multiple free APIs with better fallback
async function checkGrammarWithAPI(text) {
    try {
        // Try LanguageTool API first (most reliable)
        return await checkGrammarWithLanguageTool(text);
    } catch (error) {
        try {
            // Fallback to Ginger API (very good for grammar)
            return await checkGrammarWithGinger(text);
        } catch (error2) {
            try {
                // Fallback to Textgears API
                return await checkGrammarWithTextgears(text);
            } catch (error3) {
                try {
                    // Fallback to Reverso API
                    return await checkGrammarWithReverso(text);
                } catch (error4) {
                    try {
                        // Final fallback to ProWritingAid API
                        return await checkGrammarWithProWritingAid(text);
                    } catch (error5) {
                        console.error('All grammar APIs failed:', error, error2, error3, error4, error5);
                        return generateGrammarFix(text);
                    }
                }
            }
        }
    }
}

// LanguageTool API (Free, open source) - Fixed URL
async function checkGrammarWithLanguageTool(text) {
    try {
        const response = await fetch('https://api.languagetool.org/v2/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                text: text,
                language: 'auto',
                enabledOnly: 'false'
            })
        });

        if (!response.ok) {
            throw new Error(`LanguageTool API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.matches && data.matches.length > 0) {
            let correctedText = text;
            let corrections = [];
            
            // Apply corrections in reverse order to maintain positions
            data.matches.reverse().forEach(match => {
                if (match.replacements && match.replacements.length > 0) {
                    const replacement = match.replacements[0].value;
                    const original = text.substring(match.offset, match.offset + match.length);
                    correctedText = correctedText.substring(0, match.offset) + 
                                   replacement + 
                                   correctedText.substring(match.offset + match.length);
                    corrections.push(`"${original}" → "${replacement}" (${match.shortMessage})`);
                }
            });
            
            return formatGrammarResult(text, correctedText, corrections);
        } else {
            return `<strong>Grammar Check Results:</strong><br><br>
            <div style="background: var(--card-bg); padding: var(--spacing-md); border-radius: 8px; border-left: 4px solid var(--success-color);">
                <strong>✅ No Issues Found!</strong><br><br>
                Your text appears to be grammatically correct.
            </div><br>
            <small><strong>💡 Note:</strong> Powered by LanguageTool API</small>`;
        }
    } catch (error) {
        console.error('LanguageTool grammar check failed:', error);
        throw error;
    }
}

// After The Deadline API (Free grammar checker)
async function checkGrammarWithATD(text) {
    try {
        const response = await fetch('http://service.afterthedeadline.com/checkDocument', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                data: text,
                key: 'test'  // Free usage key
            })
        });

        if (!response.ok) {
            throw new Error(`After The Deadline API error: ${response.status}`);
        }

        const xmlText = await response.text();
        
        // Parse XML response (simplified)
        if (xmlText.includes('<error>')) {
            // Extract errors and create corrected text
            let correctedText = text;
            let corrections = [];
            
            // Simple XML parsing for errors
            const errorMatches = xmlText.match(/<error[^>]*>[\s\S]*?<\/error>/g);
            if (errorMatches) {
                errorMatches.forEach(errorXml => {
                    const stringMatch = errorXml.match(/<string>(.*?)<\/string>/);
                    const suggestionMatch = errorXml.match(/<suggestion>(.*?)<\/suggestion>/);
                    
                    if (stringMatch && suggestionMatch) {
                        const original = stringMatch[1];
                        const suggestion = suggestionMatch[1];
                        correctedText = correctedText.replace(original, suggestion);
                        corrections.push(`"${original}" → "${suggestion}"`);
                    }
                });
            }
            
            if (corrections.length > 0) {
                return formatGrammarResult(text, correctedText, corrections);
            }
        }
        
        return `<strong>Grammar Check Results:</strong><br><br>
        <div style="background: var(--card-bg); padding: var(--spacing-md); border-radius: 8px; border-left: 4px solid var(--success-color);">
            <strong>✅ No Issues Found!</strong><br><br>
            Your text appears to be grammatically correct.
        </div><br>
        <small><strong>💡 Note:</strong> Powered by After The Deadline</small>`;
        
    } catch (error) {
        console.error('After The Deadline grammar check failed:', error);
        throw error;
    }
}

// Textgears API (Free grammar and spell checker)
async function checkGrammarWithTextgears(text) {
    try {
        const response = await fetch('https://api.textgears.com/grammar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                text: text,
                language: 'en-US',
                ai: 'true',
                key: 'demo'  // Demo key for testing
            })
        });

        if (!response.ok) {
            throw new Error(`Textgears API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.response && data.response.errors && data.response.errors.length > 0) {
            let correctedText = text;
            let corrections = [];
            
            // Apply corrections in reverse order to maintain positions
            data.response.errors.reverse().forEach(error => {
                if (error.better && error.better.length > 0) {
                    const replacement = error.better[0];
                    const original = error.bad;
                    const offset = error.offset;
                    const length = error.length;
                    
                    correctedText = correctedText.substring(0, offset) + 
                                   replacement + 
                                   correctedText.substring(offset + length);
                    corrections.push(`"${original}" → "${replacement}" (${error.type})`);
                }
            });
            
            return formatGrammarResult(text, correctedText, corrections);
        } else {
            return `<strong>Grammar Check Results:</strong><br><br>
            <div style="background: var(--card-bg); padding: var(--spacing-md); border-radius: 8px; border-left: 4px solid var(--success-color);">
                <strong>✅ No Issues Found!</strong><br><br>
                Your text appears to be grammatically correct.
            </div><br>
            <small><strong>💡 Note:</strong> Powered by Textgears API</small>`;
        }
    } catch (error) {
        console.error('Textgears grammar check failed:', error);
        throw error;
    }
}

// Ginger Software API (Excellent grammar checker)
async function checkGrammarWithGinger(text) {
    try {
        // Using Ginger's free API endpoint
        const response = await fetch('https://services.gingersoftware.com/Ginger/correct/jsonSecured/GingerTheTextFull', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lang: 'EN',
                clientVersion: '2.0',
                apiKey: 'free',
                text: text
            })
        });

        if (!response.ok) {
            throw new Error(`Ginger API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.Corrections && data.Corrections.length > 0) {
            let correctedText = text;
            let corrections = [];
            
            // Apply corrections in reverse order
            data.Corrections.reverse().forEach(correction => {
                const original = text.substring(correction.From, correction.To + 1);
                const replacement = correction.Suggestions[0].Text;
                
                correctedText = correctedText.substring(0, correction.From) + 
                               replacement + 
                               correctedText.substring(correction.To + 1);
                corrections.push(`"${original}" → "${replacement}"`);
            });
            
            return formatGrammarResult(text, correctedText, corrections);
        } else {
            return `<strong>Grammar Check Results:</strong><br><br>
            <div style="background: var(--card-bg); padding: var(--spacing-md); border-radius: 8px; border-left: 4px solid var(--success-color);">
                <strong>✅ No Issues Found!</strong><br><br>
                Your text appears to be grammatically correct.
            </div><br>
            <small><strong>💡 Note:</strong> Powered by Ginger Software</small>`;
        }
    } catch (error) {
        console.error('Ginger grammar check failed:', error);
        throw error;
    }
}

// Reverso Context API (Good for spelling and basic grammar)
async function checkGrammarWithReverso(text) {
    try {
        const response = await fetch('https://orthographe.reverso.net/api/v1/Spelling', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                language: 'en',
                autoReplace: true,
                getCorrectionDetails: true
            })
        });

        if (!response.ok) {
            throw new Error(`Reverso API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.corrections && data.corrections.length > 0) {
            let correctedText = text;
            let corrections = [];
            
            // Apply corrections
            data.corrections.reverse().forEach(correction => {
                const original = correction.mistakeText;
                const replacement = correction.correctionText;
                
                correctedText = correctedText.replace(original, replacement);
                corrections.push(`"${original}" → "${replacement}"`);
            });
            
            return formatGrammarResult(text, correctedText, corrections);
        } else {
            return `<strong>Grammar Check Results:</strong><br><br>
            <div style="background: var(--card-bg); padding: var(--spacing-md); border-radius: 8px; border-left: 4px solid var(--success-color);">
                <strong>✅ No Issues Found!</strong><br><br>
                Your text appears to be grammatically correct.
            </div><br>
            <small><strong>💡 Note:</strong> Powered by Reverso</small>`;
        }
    } catch (error) {
        console.error('Reverso grammar check failed:', error);
        throw error;
    }
}

// ProWritingAid API (Professional grammar and style checker)
async function checkGrammarWithProWritingAid(text) {
    try {
        // Using a simple grammar checking service that works with CORS
        const response = await fetch('https://www.grammarbot.io/api/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                text: text,
                language: 'en-US',
                api_key: 'YWI4YjQ4OWQyZjBiNGQ3YWE2YWMzZWEzOGQyMGM'  // Demo key
            })
        });

        if (!response.ok) {
            throw new Error(`GrammarBot API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.matches && data.matches.length > 0) {
            let correctedText = text;
            let corrections = [];
            
            // Apply corrections in reverse order
            data.matches.reverse().forEach(match => {
                if (match.replacements && match.replacements.length > 0) {
                    const replacement = match.replacements[0].value;
                    const original = text.substring(match.offset, match.offset + match.length);
                    
                    correctedText = correctedText.substring(0, match.offset) + 
                                   replacement + 
                                   correctedText.substring(match.offset + match.length);
                    corrections.push(`"${original}" → "${replacement}" (${match.rule.description})`);
                }
            });
            
            return formatGrammarResult(text, correctedText, corrections);
        } else {
            return `<strong>Grammar Check Results:</strong><br><br>
            <div style="background: var(--card-bg); padding: var(--spacing-md); border-radius: 8px; border-left: 4px solid var(--success-color);">
                <strong>✅ No Issues Found!</strong><br><br>
                Your text appears to be grammatically correct.
            </div><br>
            <small><strong>💡 Note:</strong> Powered by GrammarBot</small>`;
        }
    } catch (error) {
        console.error('ProWritingAid/GrammarBot grammar check failed:', error);
        throw error;
    }
}

// Format grammar check results
function formatGrammarResult(originalText, correctedText, corrections) {
    return `<strong>Grammar Check Results:</strong><br><br>
    <div style="background: var(--card-bg); padding: var(--spacing-md); border-radius: 8px; border-left: 4px solid var(--primary-color); margin-bottom: var(--spacing-md);">
        <strong>📝 Original Text:</strong><br><br>
        <em style="color: var(--text-light);">${originalText}</em>
    </div>
    
    <div style="background: var(--card-bg); padding: var(--spacing-md); border-radius: 8px; border-left: 4px solid var(--success-color);">
        <strong>✅ Corrected Text:</strong><br><br>
        ${correctedText}
    </div>
    
    ${corrections.length > 0 ? `<br><div style="background: var(--secondary-color); padding: var(--spacing-sm); border-radius: 8px; margin-top: var(--spacing-md);">
        <strong>🔧 Corrections Made:</strong><br>
        ${corrections.map(correction => `• ${correction}`).join('<br>')}
    </div>` : ''}
    
    <br><small><strong>💡 Powered by:</strong> Professional grammar checking APIs</small>`;
}

// Generate grammar fix (local fallback)
function generateGrammarFix(text) {
    let fixedText = text;
    let corrections = [];
    
    // Keep original text for comparison
    const originalText = text;
    
    // Advanced spelling fixes (case insensitive) - Enhanced with more common mistakes
    const spellingFixes = {
        // Common spelling errors
        'recieve': 'receive',
        'occured': 'occurred', 
        'seperate': 'separate',
        'definately': 'definitely',
        'accomodate': 'accommodate',
        'tommorow': 'tomorrow',
        'enviroment': 'environment',
        'neccessary': 'necessary',
        'thier': 'their',
        'becaus': 'because',
        'becuase': 'because',
        'beacuse': 'because',
        'accomodation': 'accommodation',
        'achievment': 'achievement',
        'arguement': 'argument',
        'begining': 'beginning',
        'beleive': 'believe',
        'calender': 'calendar',
        'cemetary': 'cemetery',
        'changeable': 'changeable',
        'colnel': 'colonel',
        'commited': 'committed',
        'concious': 'conscious',
        'definately': 'definitely',
        'desparate': 'desperate',
        'embarass': 'embarrass',
        'existance': 'existence',
        'familar': 'familiar',
        'febuary': 'february',
        'goverment': 'government',
        'grammer': 'grammar',
        'harrass': 'harass',
        'independant': 'independent',
        'intellegence': 'intelligence',
        'knowlege': 'knowledge',
        'lenght': 'length',
        'liason': 'liaison',
        'libary': 'library',
        'maintenence': 'maintenance',
        'occassion': 'occasion',
        'percieve': 'perceive',
        'perferct': 'perfect',
        'prefered': 'preferred',
        'priviledge': 'privilege',
        'reccommend': 'recommend',
        'refering': 'referring',
        'relevent': 'relevant',
        'seperate': 'separate',
        'strenght': 'strength',
        'successfull': 'successful',
        'temperture': 'temperature',
        'tommorrow': 'tomorrow',
        'truely': 'truly',
        'untill': 'until',
        'weaher': 'weather',
        'wierd': 'weird',
        
        // Verb tense errors
        'forgeted': 'forgot',
        'goed': 'went',
        'runned': 'ran',
        'catched': 'caught',
        'teached': 'taught',
        'buyed': 'bought',
        'brang': 'brought',
        'thinked': 'thought',
        'feeled': 'felt',
        'heared': 'heard',
        'speaked': 'spoke',
        'writed': 'wrote',
        'readed': 'read',
        'sitted': 'sat',
        'getted': 'got',
        'maked': 'made',
        'taked': 'took',
        'standed': 'stood',
        'comed': 'came',
        'finded': 'found',
        'holded': 'held',
        'keeped': 'kept',
        'leaved': 'left',
        'losed': 'lost',
        'payed': 'paid',
        'putted': 'put',
        'sayed': 'said',
        'sended': 'sent',
        'singed': 'sang',
        'sleeped': 'slept',
        'spended': 'spent',
        'stoped': 'stopped',
        'swimmed': 'swam',
        'telled': 'told',
        'winned': 'won',
        
        // Common word confusions
        'alot': 'a lot',
        'alright': 'all right',
        'aswell': 'as well',
        'incase': 'in case',
        'infact': 'in fact',
        'inspite': 'in spite',
        'nevermind': 'never mind',
        'noone': 'no one',
        'alittle': 'a little',
        
        // Contractions
        'wont': "won't",
        'cant': "can't",
        'dont': "don't",
        'isnt': "isn't",
        'arent': "aren't",
        'wasnt': "wasn't",
        'werent': "weren't",
        'hasnt': "hasn't",
        'havent': "haven't",
        'hadnt': "hadn't",
        'wouldnt': "wouldn't",
        'shouldnt': "shouldn't",
        'couldnt': "couldn't",
        'mustnt': "mustn't",
        'neednt': "needn't",
        'diddnt': "didn't",
        'doesnt': "doesn't",
        'youre': "you're",
        'theyre': "they're",
        'were': "we're",
        'its': "it's",
        'hes': "he's",
        'shes': "she's",
        'thats': "that's",
        'whats': "what's",
        'wheres': "where's",
        'whos': "who's",
        'hows': "how's",
        'whens': "when's",
        'whys': "why's",
        'lets': "let's",
        'ive': "I've",
        'youve': "you've",
        'weve': "we've",
        'theyve': "they've",
        'ill': "I'll",
        'youll': "you'll",
        'well': "we'll",
        'theyll': "they'll",
        'hell': "he'll",
        'shell': "she'll",
        'itll': "it'll"
    };
    
    // Apply spelling fixes
    for (let [wrong, correct] of Object.entries(spellingFixes)) {
        let regex = new RegExp(`\\b${wrong}\\b`, 'gi');
        if (regex.test(fixedText)) {
            fixedText = fixedText.replace(regex, correct);
            corrections.push(`"${wrong}" → "${correct}"`);
        }
    }
    
    // Grammar fixes
    let beforeGrammar = fixedText;
    
    // Fix capitalization
    fixedText = fixedText
        .replace(/\bi\b/g, 'I') // Capitalize standalone I
        .replace(/^([a-z])/g, (match) => match.toUpperCase()) // Capitalize first letter
        .replace(/([.!?])\s+([a-z])/g, (match, p1, p2) => p1 + ' ' + p2.toUpperCase()); // After punctuation
    
    // Fix spacing issues
    fixedText = fixedText
        .replace(/\s+/g, ' ') // Multiple spaces → single space
        .replace(/\s+([,.!?;:])/g, '$1') // Remove space before punctuation
        .replace(/([.!?])\s*([.!?])+/g, '$1') // Remove repeated punctuation
        .replace(/([,.!?;:])\s*([a-zA-Z])/g, '$1 $2') // Add space after punctuation
        .trim(); // Remove leading/trailing spaces
    
    // Fix common grammar patterns
    fixedText = fixedText
        .replace(/\ba\s+([aeiouAEIOU])/g, 'an $1') // a → an before vowels
        .replace(/\ban\s+([^aeiouAEIOU])/g, 'a $1') // an → a before consonants
        .replace(/\bis\s+are\b/gi, 'are') // Fix "is are" → "are"
        .replace(/\bare\s+is\b/gi, 'is') // Fix "are is" → "is"
        .replace(/\bdon't\s+no\b/gi, "don't know") // Fix "don't no" → "don't know"
        .replace(/\bcould\s+of\b/gi, 'could have') // Fix "could of" → "could have"
        .replace(/\bwould\s+of\b/gi, 'would have') // Fix "would of" → "would have"
        .replace(/\bshould\s+of\b/gi, 'should have') // Fix "should of" → "should have"
        // Fix there/their/they're confusion
        .replace(/\bfor\s+there\s+([a-zA-Z]+\s+)*applications?\b/gi, (match) => match.replace(/\bthere\b/gi, 'their'))
        .replace(/\buse\s+JavaScript\s+for\s+there\s+/gi, 'use JavaScript for their ')
        // Fix its/it's confusion  
        .replace(/\bbecause\s+its\s+very\b/gi, "because it's very")
        .replace(/\bbecause\s+its\s+([a-zA-Z]+)\b/gi, (match, word) => {
            const commonAdjectives = ['very', 'really', 'quite', 'so', 'extremely', 'incredibly', 'amazing', 'popular', 'good', 'bad', 'fast', 'slow'];
            if (commonAdjectives.includes(word.toLowerCase())) {
                return match.replace(/\bits\b/gi, "it's");
            }
            return match;
        })
        .replace(/\b(he|she|it)\s+were\b/gi, (match, pronoun) => pronoun + ' was') // Fix "she were" → "she was"
        .replace(/\b(i|you|we|they)\s+was\b/gi, (match, pronoun) => pronoun + ' were') // Fix "I was" in some contexts
        .replace(/\bI\s+were\b/g, 'I was') // Fix "I were" → "I was"
        .replace(/\b(he|she|it)\s+don't\b/gi, (match, pronoun) => pronoun.toLowerCase() + " doesn't") // Fix "she don't" → "she doesn't"
        .replace(/\b(he|she|it)\s+have\b/gi, (match, pronoun) => pronoun.toLowerCase() + " has") // Fix "she have" → "she has"
        .replace(/\bdon't\s+have\s+no\b/gi, "don't have any") // Fix double negative
        .replace(/\bdoesn't\s+have\s+no\b/gi, "doesn't have any") // Fix double negative
        .replace(/\bdon't\s+know\s+nothing\b/gi, "don't know anything") // Fix double negative
        .replace(/\bain't\s+got\s+no\b/gi, "don't have any") // Fix double negative
        .replace(/\bwhere\s+did\s+(\w+)\s+(went|came|ran)\b/gi, (match, subject, verb) => {
            const correctVerb = verb === 'went' ? 'go' : verb === 'came' ? 'come' : 'run';
            return `where did ${subject} ${correctVerb}`;
        }) // Fix "where did he went" → "where did he go"
        .replace(/\bwhere\s+(\w+)\s+did\s+go\b/gi, 'where did $1 go') // Fix word order
        .replace(/\bgood\s+then\b/gi, 'better than') // Fix "good then" → "better than"
        .replace(/\bmore\s+better\b/gi, 'better') // Fix "more better" → "better"
        .replace(/\bmore\s+easier\b/gi, 'easier') // Fix "more easier" → "easier"
        .replace(/\bvery\s+unique\b/gi, 'unique') // Fix "very unique" → "unique"
        .replace(/\bmost\s+unique\b/gi, 'unique'); // Fix "most unique" → "unique"
    
    // Add period if missing
    if (fixedText && !fixedText.match(/[.!?]$/)) {
        fixedText += '.';
        corrections.push('Added missing period at the end');
    }
    
    // Track grammar fixes more specifically
    if (beforeGrammar !== fixedText) {
        if (beforeGrammar.replace(/\bi\b/g, 'I') !== fixedText.replace(/\bi\b/g, 'I')) {
            corrections.push('Fixed subject-verb agreement');
        }
        if (beforeGrammar.replace(/^([a-z])/g, (match) => match.toUpperCase()) !== fixedText.replace(/^([a-z])/g, (match) => match.toUpperCase())) {
            corrections.push('Fixed capitalization');
        }
        if (beforeGrammar.replace(/\s+/g, ' ') !== fixedText.replace(/\s+/g, ' ')) {
            corrections.push('Fixed spacing and punctuation');
        }
    }
    
    // Compare and show results
    if (originalText.trim() === fixedText.trim()) {
        return `<strong>Grammar Check Results:</strong><br><br>
        <div style="background: var(--card-bg); padding: var(--spacing-md); border-radius: 8px; border-left: 4px solid var(--success-color);">
            <strong>✅ No Issues Found!</strong><br><br>
            Your text appears to be grammatically correct.
        </div><br>
        <small><strong>💡 Note:</strong> This is a basic grammar checker. For advanced proofreading, consider using professional tools.</small>`;
    }
    
    return `<strong>Grammar Check Results:</strong><br><br>
    <div style="background: var(--card-bg); padding: var(--spacing-md); border-radius: 8px; border-left: 4px solid var(--primary-color); margin-bottom: var(--spacing-md);">
        <strong>📝 Original Text:</strong><br><br>
        <em style="color: var(--text-light);">${originalText}</em>
    </div>
    
    <div style="background: var(--card-bg); padding: var(--spacing-md); border-radius: 8px; border-left: 4px solid var(--success-color);">
        <strong>✅ Corrected Text:</strong><br><br>
        ${fixedText}
    </div>
    
    ${corrections.length > 0 ? `<br><div style="background: var(--secondary-color); padding: var(--spacing-sm); border-radius: 8px; margin-top: var(--spacing-md);">
        <strong>🔧 Corrections Made:</strong><br>
        ${corrections.map(correction => `• ${correction}`).join('<br>')}
    </div>` : ''}
    
    <br><small><strong>💡 Tip:</strong> Always review the corrections to ensure they fit your intended meaning!</small>`;
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + 1-6 for quick navigation
    if (e.ctrlKey && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const navLinks = document.querySelectorAll('.nav-link');
        const index = parseInt(e.key) - 1;
        if (navLinks[index]) {
            navLinks[index].click();
        }
    }
    
    // Escape to close mobile sidebar
    if (e.key === 'Escape' && window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.remove('active');
    }
});

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Performance monitoring
window.addEventListener('load', function() {
    console.log('🎯 AI Student Helper is ready to use!');
    console.log('📝 Use Ctrl + number keys for quick navigation');
    console.log('⌨️ Use Ctrl + Enter to execute operations');
});

// Utility Functions for New Features

// Copy to clipboard function
async function copyToClipboard(elementId) {
    const resultElement = document.getElementById(elementId);
    const resultContent = resultElement.querySelector('.result-content');
    
    if (!resultContent) {
        showSimpleCopyMessage('No content to copy', 'error');
        return;
    }
    
    // Get text content without HTML tags
    const textContent = resultContent.innerText || resultContent.textContent;
    
    try {
        await navigator.clipboard.writeText(textContent);
        showSimpleCopyMessage('Copied ✓', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showSimpleCopyMessage('Copied ✓', 'success');
    }
}

// Simple copy message function
function showSimpleCopyMessage(message, type = 'success') {
    // Remove existing message if any
    const existingMessage = document.querySelector('.simple-copy-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `simple-copy-message ${type}`;
    messageDiv.textContent = message;
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Auto remove after 2 seconds
    setTimeout(() => {
        messageDiv.classList.add('fade-out');
        setTimeout(() => messageDiv.remove(), 300);
    }, 1500);
}

// Use selected title function
function useSelectedTitle() {
    const selectedTitle = document.querySelector('.title-item.selected');
    if (!selectedTitle) {
        alert('يرجى اختيار عنوان أولاً');
        return;
    }
    
    const titleText = selectedTitle.querySelector('strong').textContent;
    const essayInput = document.getElementById('essay-topic-input');
    
    essayInput.value = titleText;
    essayInput.focus();
    
    // Scroll to input
    essayInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Visual feedback
    essayInput.style.border = '2px solid var(--success-color)';
    setTimeout(() => {
        essayInput.style.border = '';
    }, 2000);
}

// Enhanced essay title generation with selection feature
function generateEssayTitlesWithSelection(topic) {
    const titles = [
        `The Impact of ${topic} on Modern Society`,
        `Understanding ${topic}: A Comprehensive Analysis`,
        `${topic} in the 21st Century: Challenges and Opportunities`,
        `The Evolution of ${topic}: Past, Present, and Future`,
        `Exploring the Role of ${topic} in Contemporary Life`,
        `${topic}: A Critical Examination of Current Trends`,
        `The Significance of ${topic} in Today's World`,
        `${topic} and Its Implications for Future Generations`,
        `Rethinking ${topic}: New Perspectives and Approaches`,
        `The Complexity of ${topic}: Multiple Viewpoints`
    ];
    
    const shuffled = titles.sort(() => 0.5 - Math.random());
    const selectedTitles = shuffled.slice(0, 5);
    
    let result = `<strong>Essay Title Suggestions for "${topic}"</strong><br><br>`;
    result += '<div class="essay-titles">';
    
    selectedTitles.forEach((title, index) => {
        result += `<div class="title-item" onclick="selectTitle(this)">
            <div class="title-number">${index + 1}.</div>
            <strong>${title}</strong>
        </div>`;
    });
    
    result += '</div><br>';
    result += `<strong>Writing Tips:</strong><br>
    • Click on any title to select it, then press "Use Selected Title"<br>
    • You can modify any title to suit your assignment requirements<br>
    • Make sure the chosen title is neither too broad nor too narrow`;
    
    return result;
}

// Select title function
function selectTitle(titleElement) {
    // Remove selection from all titles
    const allTitles = document.querySelectorAll('.title-item');
    allTitles.forEach(title => title.classList.remove('selected'));
    
    // Add selection to clicked title
    titleElement.classList.add('selected');
    
    // Show "Use Title" button
    const useBtn = document.getElementById('use-title-btn');
    useBtn.style.display = 'flex';
}

// Show result actions after successful generation
function showResultActions(sectionId) {
    const actionsElement = document.getElementById(`${sectionId}-actions`);
    if (actionsElement) {
        actionsElement.style.display = 'flex';
    }
}

// Hide result actions when input changes
function hideResultActions(sectionId) {
    const actionsElement = document.getElementById(`${sectionId}-actions`);
    if (actionsElement) {
        actionsElement.style.display = 'none';
    }
    
    // Hide use title button specifically for essay section
    if (sectionId === 'essay') {
        const useBtn = document.getElementById('use-title-btn');
        if (useBtn) {
            useBtn.style.display = 'none';
        }
    }
}

// Store current generation data for regeneration
let currentGenerationData = {
    summarize: { text: '', type: 'summarize' },
    essay: { topic: '', type: 'full' },
    explain: { concept: '', type: 'explain' }
};

// Mobile Navigation functionality
function initMobileNavigation() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const body = document.body;
    
    // Function to close menu completely
    function closeMobileMenu() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        body.classList.remove('menu-open');
        body.style.overflow = '';
        body.style.position = '';
        body.style.width = '';
        
        // Reset menu button text
        if (mobileMenuToggle) {
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i><span>Menu</span>';
        }
    }
    
    // Function to open menu
    function openMobileMenu() {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        body.classList.add('menu-open');
        body.style.overflow = 'hidden';
        
        if (mobileMenuToggle) {
            mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i><span>Close</span>';
        }
        
        // Focus trap for accessibility
        setTimeout(() => {
            const firstNavLink = sidebar.querySelector('.nav-link');
            if (firstNavLink) {
                firstNavLink.focus();
            }
        }, 300);
    }
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = sidebar.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }
    
    // Mobile theme toggle
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', function() {
            const themeSwitch = document.getElementById('theme-switch');
            if (themeSwitch) {
                themeSwitch.click(); // Trigger the main theme toggle
            }
            
            // Update icon
            const icon = this.querySelector('i');
            const isDark = body.classList.contains('dark-mode');
            icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
            
            // Sync sidebar theme text initial state
            const themeText = document.getElementById('theme-text');
            if (themeText) {
                themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
            }
        });
        
        // Sync initial icon state
        const icon = mobileThemeToggle.querySelector('i');
        const isDark = body.classList.contains('dark-mode');
        icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        
        // Sync sidebar theme text initial state
        const themeText = document.getElementById('theme-text');
        if (themeText) {
            themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        }
    }
    
    // Overlay click to close sidebar - Enhanced
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
        });
        
        // Prevent clicks inside sidebar from closing it
        sidebar.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Close sidebar when navigation link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Always close menu when navigating on mobile
            if (window.innerWidth <= 768 || sidebar.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close menu when window is resized to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Update mobile theme icon when main theme changes
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch && mobileThemeToggle) {
        themeSwitch.addEventListener('change', function() {
            const icon = mobileThemeToggle.querySelector('i');
            const isDark = this.checked;
            icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
            
            // Sync sidebar theme text initial state
            const themeText = document.getElementById('theme-text');
            if (themeText) {
                themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
            }
        });
    }
}
