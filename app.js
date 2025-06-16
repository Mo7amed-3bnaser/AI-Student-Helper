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
    
    // Initialize all tools
    initSummarizer();
    initEssayIdeas();
    initExplainConcepts();
    initTranslator();
    initMCQGenerator();
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

// Enhanced AI responses with more realistic content
function generateSummary(text) {
    // Extract key information from text
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const keyPoints = sentences.slice(0, Math.min(3, Math.ceil(sentences.length / 3)));
    
    if (keyPoints.length === 0) {
        return "Unable to generate summary. Please provide more substantial content.";
    }
    
    const summary = keyPoints.map(point => point.trim()).join('. ') + '.';
    
    return `<strong>Summary:</strong><br><br>${summary}`;
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

// MyMemory Translation API integration (Free and reliable)
async function translateTextWithMyMemory(text, sourceLang, targetLang) {
    try {
        const langPair = `${sourceLang}|${targetLang}`;
        const encodedText = encodeURIComponent(text);
        const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Translation API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData) {
            return data.responseData.translatedText;
        } else {
            throw new Error('Translation failed: ' + (data.responseDetails || 'Unknown error'));
        }
    } catch (error) {
        console.error('MyMemory Translation error:', error);
        throw error;
    }
}

// Fallback translation function
async function fallbackTranslation(text, sourceLang, targetLang) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (sourceLang === 'en' && targetLang === 'ar') {
        return `[الترجمة العربية ستظهر هنا]<br><br>
        <em>⚠️ خدمة الترجمة غير متاحة مؤقتاً. يرجى المحاولة لاحقاً.</em>`;
    } else if (sourceLang === 'ar' && targetLang === 'en') {
        return `[English translation would appear here]<br><br>
        <em>⚠️ Translation service temporarily unavailable. Please try again later.</em>`;
    }
    
    return 'Translation service temporarily unavailable.';
}

// Enhanced translation function with MyMemory API
async function translateText(text, sourceLang, targetLang) {
    console.log(`Translating from ${sourceLang} to ${targetLang}:`, text);
    
    // Try MyMemory API first
    try {
        const translatedText = await translateTextWithMyMemory(text, sourceLang, targetLang);
        return `<strong>${targetLang === 'ar' ? 'الترجمة العربية' : 'English Translation'}:</strong><br><br>
        ${translatedText}`;
    } catch (error) {
        // Fallback simulation if API fails
        console.error('Translation error:', error);
        return await fallbackTranslation(text, sourceLang, targetLang);
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
            await new Promise(resolve => setTimeout(resolve, 1500));
            const summary = generateSummary(text);
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
        
        if (sourceLang === targetLang) {
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
    • انقر على أي عنوان لتحديده، ثم اضغط "Use Selected Title"<br>
    • يمكنك تعديل أي عنوان ليناسب متطلبات مهمتك<br>
    • تأكد من أن العنوان المختار ليس واسعاً جداً أو ضيقاً جداً`;
    
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
