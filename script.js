// Main application logic

document.addEventListener('DOMContentLoaded', function() {
    renderArticles();
    setupModal();
    setupNavigation();
});

// Render all articles on the homepage
function renderArticles() {
    const container = document.getElementById('main-container');
    if (!container) return;

    // Left Column - Daily Briefing and Top News
    const leftColumn = createColumn('left-column');
    
    // Daily Briefing (first article)
    const briefingArticle = articles[0];
    leftColumn.appendChild(createDailyBriefing(briefingArticle));
    
    // Top News Stories
    const topNews = createTopNewsSection();
    leftColumn.appendChild(topNews);
    
    // Middle Column - Main articles
    const middleColumn = createColumn('middle-column');
    
    // Main featured article
    middleColumn.appendChild(createMainArticle(briefingArticle));
    
    // Other articles
    for (let i = 1; i < Math.min(4, articles.length); i++) {
        middleColumn.appendChild(createArticleCard(articles[i]));
    }
    
    // Right Column - Blindspot section
    const rightColumn = createColumn('right-column');
    rightColumn.appendChild(createBlindspotSection());
    
    container.appendChild(leftColumn);
    container.appendChild(middleColumn);
    container.appendChild(rightColumn);
}

// Create a column element
function createColumn(className) {
    const column = document.createElement('div');
    column.className = `column ${className}`;
    return column;
}

// Create Daily Briefing section
function createDailyBriefing(article) {
    const briefing = document.createElement('div');
    briefing.className = 'daily-briefing';
    briefing.setAttribute('data-article-id', article.id);
    
    briefing.innerHTML = `
        ${createArticleImageContainer(article)}
        <div class="article-meta">6 stories • 675 articles • 6m read</div>
        <h2 class="article-headline">${article.title}</h2>
        <p class="article-summary">${article.summary}</p>
        <div class="related-links">
            ${articles.slice(1, 4).map(a => `<div class="related-item">+ ${a.title}</div>`).join('')}
            <div class="related-item">+ and more.</div>
        </div>
    `;
    
    briefing.addEventListener('click', () => openArticle(article.id));
    return briefing;
}

// Create Top News section
function createTopNewsSection() {
    const topNews = document.createElement('div');
    topNews.className = 'top-news';
    
    const title = document.createElement('h3');
    title.className = 'section-title';
    title.textContent = 'Top News Stories';
    topNews.appendChild(title);
    
    // Add top news items
    articles.slice(4, 7).forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.setAttribute('data-article-id', article.id);
        
        const headline = document.createElement('h4');
        headline.className = 'news-headline';
        headline.textContent = article.title;
        newsItem.appendChild(headline);
        
        newsItem.addEventListener('click', () => openArticle(article.id));
        topNews.appendChild(newsItem);
    });
    
    return topNews;
}

// Create main article card
function createMainArticle(article) {
    const mainArticle = document.createElement('div');
    mainArticle.className = 'main-article';
    mainArticle.setAttribute('data-article-id', article.id);
    
    mainArticle.innerHTML = `
        ${createArticleImageContainer(article)}
        <h1 class="main-headline">${article.title}</h1>
    `;
    
    mainArticle.addEventListener('click', () => openArticle(article.id));
    return mainArticle;
}

// Create article card
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.setAttribute('data-article-id', article.id);
    
    card.innerHTML = `
        <div class="article-category">${article.category}</div>
        ${createArticleImageContainer(article)}
        <h3 class="article-headline">${article.title}</h3>
    `;
    
    card.addEventListener('click', () => openArticle(article.id));
    return card;
}

// Create article image container with traffic light
function createArticleImageContainer(article) {
    return `
        <div class="article-image-container">
            <div class="article-image-wrapper">
                <img src="${article.image}" alt="${article.title}" class="article-image">
            </div>
            ${createTrafficLight(article.trafficLightStatus, article.misleadingScore)}
        </div>
    `;
}

// Create traffic light component
function createTrafficLight(status, misleadingScore) {
    return `
        <div class="traffic-light" data-status="${status}" data-score="${misleadingScore}">
            <div class="traffic-light-light red"></div>
            <div class="traffic-light-light yellow"></div>
            <div class="traffic-light-light green"></div>
            <div class="traffic-light-tooltip">Misleading score: ${misleadingScore}/100</div>
        </div>
    `;
}

// Create large traffic light card for article view
function createLargeTrafficLightCard(status, misleadingScore) {
    let levelText = '';
    let levelClass = '';
    
    if (status === 'green') {
        levelText = 'LOW';
        levelClass = 'level-low';
    } else if (status === 'yellow') {
        levelText = 'MEDIUM';
        levelClass = 'level-medium';
    } else {
        levelText = 'HIGH';
        levelClass = 'level-high';
    }
    
    return `
        <div class="traffic-light-card">
            <div class="traffic-light-card-title">Misleading Level</div>
            <div class="traffic-light-large" data-status="${status}">
                <div class="traffic-light-light-large red"></div>
                <div class="traffic-light-light-large yellow"></div>
                <div class="traffic-light-light-large green"></div>
            </div>
            <div class="traffic-light-level ${levelClass}">${levelText}</div>
        </div>
    `;
}

// Create Blindspot section
function createBlindspotSection() {
    const blindspot = document.createElement('div');
    blindspot.className = 'blindspot-section';
    
    blindspot.innerHTML = `
        <div class="blindspot-header">
            <div class="blindspot-logo">BLINDSPOT</div>
            <p class="blindspot-description">Stories disproportionately covered by one side of the political spectrum. Learn more about political bias in news coverage.</p>
        </div>
    `;
    
    // Add blindspot articles (articles with higher misleading scores)
    const blindspotArticles = articles.filter(a => a.misleadingScore > 45).slice(0, 3);
    blindspotArticles.forEach(article => {
        const blindspotArticle = document.createElement('div');
        blindspotArticle.className = 'blindspot-article';
        blindspotArticle.setAttribute('data-article-id', article.id);
        
        blindspotArticle.innerHTML = `
            ${createArticleImageContainer(article)}
            <div class="blindspot-meta">Blindspot ${Math.floor(Math.random() * 10) + 8} Sources</div>
            <h3 class="article-headline">${article.title}</h3>
        `;
        
        blindspotArticle.addEventListener('click', () => openArticle(article.id));
        blindspot.appendChild(blindspotArticle);
    });
    
    return blindspot;
}

// Open article in modal
function openArticle(articleId) {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;
    
    const modal = document.getElementById('article-modal');
    const detail = document.getElementById('article-detail');
    const fixedTrafficLight = document.getElementById('fixed-traffic-light');
    
    if (!modal || !detail || !fixedTrafficLight) return;
    
    // Remove traffic light from article image in detail view
    detail.innerHTML = `
        <div class="article-image-container">
            <div class="article-image-wrapper">
                <img src="${article.image}" alt="${article.title}" class="article-image">
            </div>
        </div>
        <div class="article-category">${article.category}</div>
        <h1>${article.title}</h1>
        <div class="article-content">
            ${article.content}
        </div>
    `;
    
    // Add fixed traffic light card on the side
    fixedTrafficLight.innerHTML = createLargeTrafficLightCard(article.trafficLightStatus, article.misleadingScore);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Setup modal close functionality
function setupModal() {
    const modal = document.getElementById('article-modal');
    const closeButton = document.getElementById('close-modal');
    
    if (closeButton) {
        closeButton.addEventListener('click', closeArticle);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeArticle();
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeArticle();
        }
    });
}

// Close article modal
function closeArticle() {
    const modal = document.getElementById('article-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Setup navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}
