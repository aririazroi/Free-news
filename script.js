// --- Tracking module --------------------------------------------------------

// Configuration
const CONFIG = {
    googleSheetsWebhookUrl: 'https://script.google.com/macros/s/AKfycbwTVk2bdIYgSFL3HM_J8-WLRVqXV0GZdcjgfMG89lBUYWYRzL9zuFIGPAoNv-EFviTUXg/exec', // Set this to your Google Apps Script webhook URL
    batchInterval: 5000, // Send batch every 5 seconds
    maxRetries: 3,
    retryDelay: 1000, // Start with 1 second
    sendCriticalEventsImmediately: true, // Clicks, traffic light hovers
};

const Tracking = (function () {
    const state = {
        participantId: null,
        sessionStart: null,
        sessionEnd: null,
        // articleId -> total visible milliseconds
        articleTimes: {},
        // articleId -> visibility start timestamp (ms) when currently visible
        currentlyVisible: {},
        // articleId -> hover start timestamp (ms) when currently hovered
        currentlyHovered: {},
        // articleId -> hover statistics
        articleHovers: {},
        // articleId -> traffic light hover statistics
        trafficLightHovers: {},
        // sequential event list
        events: [],
        visibilityObserver: null,
        currentModalArticleId: null,
        pageVisible: true,
        // Google Sheets batch queue
        batchQueue: [],
        batchTimer: null,
        retryQueue: [],
    };

    function nowMs() {
        return Date.now();
    }

    function nowIso() {
        return new Date().toISOString();
    }

    function parseParticipantId() {
        try {
            const params = new URLSearchParams(window.location.search);
            return params.get('pid') || null;
        } catch (e) {
            return null;
        }
    }

    function logEvent(event) {
        const base = {
            ts: nowIso(),
            t: event.type,
            pid: state.participantId,
        };
        const fullEvent = Object.assign(base, event);
        state.events.push(fullEvent);
        
        // Queue for Google Sheets (non-critical events will be batched)
        // Critical events (clicks, traffic light hovers) are sent immediately in their handlers
        const isCritical = event.type === 'click' || 
                          (event.type === 'hover_start' && event.isTrafficLight) ||
                          (event.type === 'hover_end' && event.isTrafficLight);
        
        // Only queue non-critical events here (critical events are handled separately)
        if (!isCritical) {
            sendEventToGoogleSheets(fullEvent, false);
        }
    }

    function startSession() {
        if (!state.sessionStart) {
            state.sessionStart = nowMs();
            logEvent({ type: 'session_start' });
        }
    }

    function ensureArticleRecord(articleId) {
        if (!state.articleTimes[articleId]) {
            state.articleTimes[articleId] = {
                articleId,
                totalMs: 0,
                viewCount: 0,
                listViewMs: 0,
                modalViewMs: 0,
            };
        }
        return state.articleTimes[articleId];
    }

    function ensureHoverRecord(articleId) {
        if (!state.articleHovers[articleId]) {
            state.articleHovers[articleId] = {
                articleId,
                hoverDurationMs: 0,
                hoverCount: 0,
            };
        }
        return state.articleHovers[articleId];
    }

    function ensureTrafficLightHoverRecord(articleId) {
        if (!state.trafficLightHovers[articleId]) {
            state.trafficLightHovers[articleId] = {
                articleId,
                trafficLightHoverMs: 0,
                trafficLightHoverCount: 0,
            };
        }
        return state.trafficLightHovers[articleId];
    }

    function startArticleVisibility(articleId, context) {
        if (!articleId || !state.pageVisible) return;
        if (state.currentlyVisible[articleId]) return;

        state.currentlyVisible[articleId] = nowMs();
        const rec = ensureArticleRecord(articleId);
        rec.viewCount += 1;
        logEvent({ type: 'view_start', articleId, context: context || 'list' });
    }

    function endArticleVisibility(articleId, context) {
        if (!articleId) return;
        const startTs = state.currentlyVisible[articleId];
        if (!startTs) return;

        const dur = nowMs() - startTs;
        const rec = ensureArticleRecord(articleId);
        rec.totalMs += dur;
        
        // Track list vs modal views separately
        if (context === 'modal') {
            rec.modalViewMs += dur;
        } else {
            rec.listViewMs += dur;
        }
        
        delete state.currentlyVisible[articleId];

        logEvent({
            type: 'view_end',
            articleId,
            context: context || 'list',
            durationMs: dur,
        });
    }

    function pauseAllVisibility(reason) {
        Object.keys(state.currentlyVisible).forEach((articleId) => {
            endArticleVisibility(articleId, reason || 'pause');
        });
    }

    function setupVisibilityObserver() {
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const el = entry.target;
                    const articleId = el.getAttribute('data-article-id');
                    if (!articleId) return;

                    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                        startArticleVisibility(articleId, 'list');
                    } else {
                        endArticleVisibility(articleId, 'list');
                    }
                });
            },
            {
                threshold: [0.5],
            }
        );

        document
            .querySelectorAll('[data-article-id]')
            .forEach((el) => observer.observe(el));

        state.visibilityObserver = observer;
    }

    // Modal-specific tracking (focused reading)
    function startModalArticle(articleId) {
        if (state.currentModalArticleId && state.currentModalArticleId !== articleId) {
            // End previous modal view
            endArticleVisibility(state.currentModalArticleId, 'modal');
        }
        state.currentModalArticleId = articleId;
        startArticleVisibility(articleId, 'modal');
    }

    function endModalArticle() {
        if (!state.currentModalArticleId) return;
        endArticleVisibility(state.currentModalArticleId, 'modal');
        state.currentModalArticleId = null;
    }

    function getArticleMetadata(articleId) {
        if (!articleId) return null;
        const article = articles.find(a => String(a.id) === String(articleId));
        if (!article) return null;
        return {
            trafficLightStatus: article.trafficLightStatus,
            misleadingScore: article.misleadingScore,
        };
    }

    function setupClickTracking() {
        document.addEventListener(
            'click',
            function (e) {
                const target = e.target;
                if (!target) return;

                const articleEl = target.closest('[data-article-id]');
                const articleId = articleEl ? articleEl.getAttribute('data-article-id') : null;

                let elementType = 'other';
                let context = 'list';
                
                // Check if we're in modal
                const modal = document.getElementById('article-modal');
                if (modal && modal.classList.contains('active')) {
                    context = 'modal';
                }

                if (target.classList.contains('traffic-light') || target.closest('.traffic-light')) {
                    elementType = 'traffic_light';
                } else if (target.classList.contains('nav-item') || target.closest('.nav-item')) {
                    elementType = 'nav_item';
                } else if (target.tagName === 'A') {
                    elementType = 'link';
                } else if (target.tagName === 'BUTTON') {
                    elementType = 'button';
                } else if (articleEl) {
                    elementType = 'article_card';
                }

                const metadata = getArticleMetadata(articleId);
                const clickEvent = {
                    type: 'click',
                    articleId,
                    elementType,
                    context,
                };

                // Add traffic light metadata if available
                if (metadata) {
                    clickEvent.trafficLightStatus = metadata.trafficLightStatus;
                    clickEvent.misleadingScore = metadata.misleadingScore;
                }

                logEvent(clickEvent);
                
                // Send critical events immediately
                if (CONFIG.sendCriticalEventsImmediately) {
                    sendEventToGoogleSheets(clickEvent, true);
                }
            },
            true
        );
    }

    function setupHoverTracking() {
        // Track hover on article elements
        document.addEventListener('mouseenter', function(e) {
            const target = e.target;
            if (!target) return;

            const articleEl = target.closest('[data-article-id]');
            if (!articleEl) return;

            const articleId = articleEl.getAttribute('data-article-id');
            if (!articleId || state.currentlyHovered[articleId]) return;

            // Check if hovering on traffic light specifically
            const isTrafficLight = target.classList.contains('traffic-light') || 
                                   target.closest('.traffic-light') ||
                                   target.closest('.traffic-light-card') ||
                                   target.closest('.traffic-light-large');

            const hoverStart = nowMs();
            state.currentlyHovered[articleId] = {
                start: hoverStart,
                isTrafficLight: isTrafficLight,
            };

            const metadata = getArticleMetadata(articleId);
            const hoverEvent = {
                type: 'hover_start',
                articleId,
                isTrafficLight: isTrafficLight,
            };

            if (metadata) {
                hoverEvent.trafficLightStatus = metadata.trafficLightStatus;
                hoverEvent.misleadingScore = metadata.misleadingScore;
            }

            logEvent(hoverEvent);

            // Send traffic light hovers immediately
            if (CONFIG.sendCriticalEventsImmediately && isTrafficLight) {
                sendEventToGoogleSheets(hoverEvent, true);
            }
        }, true);

        document.addEventListener('mouseleave', function(e) {
            const target = e.target;
            if (!target) return;

            const articleEl = target.closest('[data-article-id]');
            if (!articleEl) return;

            const articleId = articleEl.getAttribute('data-article-id');
            if (!articleId) return;

            const hoverData = state.currentlyHovered[articleId];
            if (!hoverData) return;

            const hoverDuration = nowMs() - hoverData.start;
            const isTrafficLight = hoverData.isTrafficLight;

            // Update hover statistics
            if (isTrafficLight) {
                const rec = ensureTrafficLightHoverRecord(articleId);
                rec.trafficLightHoverMs += hoverDuration;
                rec.trafficLightHoverCount += 1;
            } else {
                const rec = ensureHoverRecord(articleId);
                rec.hoverDurationMs += hoverDuration;
                rec.hoverCount += 1;
            }

            const metadata = getArticleMetadata(articleId);
            const hoverEvent = {
                type: 'hover_end',
                articleId,
                isTrafficLight: isTrafficLight,
                hoverDurationMs: hoverDuration,
            };

            if (metadata) {
                hoverEvent.trafficLightStatus = metadata.trafficLightStatus;
                hoverEvent.misleadingScore = metadata.misleadingScore;
            }

            logEvent(hoverEvent);

            // Send traffic light hovers immediately
            if (CONFIG.sendCriticalEventsImmediately && isTrafficLight) {
                sendEventToGoogleSheets(hoverEvent, true);
            }

            delete state.currentlyHovered[articleId];
        }, true);
    }

    function setupPageVisibilityHandling() {
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden') {
                state.pageVisible = false;
                pauseAllVisibility('tab_hidden');
                logEvent({ type: 'page_hidden' });
                // Send batch when page becomes hidden
                flushBatchQueue();
            } else {
                state.pageVisible = true;
                logEvent({ type: 'page_visible' });
            }
        });
    }

    // Google Sheets integration
    function sendEventToGoogleSheets(eventData, immediate = false) {
        if (!CONFIG.googleSheetsWebhookUrl) {
            // Webhook URL not configured, skip silently
            return;
        }

        const eventWithMetadata = {
            ...eventData,
            timestamp: nowIso(),
            participantId: state.participantId,
            sessionStart: state.sessionStart ? new Date(state.sessionStart).toISOString() : null,
        };

        if (immediate) {
            // Send immediately for critical events
            sendToGoogleSheets([eventWithMetadata], 0);
        } else {
            // Add to batch queue
            state.batchQueue.push(eventWithMetadata);
            scheduleBatchSend();
        }
    }

    function scheduleBatchSend() {
        if (state.batchTimer) return; // Already scheduled

        state.batchTimer = setTimeout(() => {
            flushBatchQueue();
        }, CONFIG.batchInterval);
    }

    function flushBatchQueue() {
        if (state.batchQueue.length === 0) return;

        const eventsToSend = [...state.batchQueue];
        state.batchQueue = [];
        
        if (state.batchTimer) {
            clearTimeout(state.batchTimer);
            state.batchTimer = null;
        }

        sendToGoogleSheets(eventsToSend, 0);
    }

    function sendToGoogleSheets(events, retryCount = 0) {
        if (!CONFIG.googleSheetsWebhookUrl || events.length === 0) return;

        const payload = {
            events: events,
            participantId: state.participantId,
        };

        fetch(CONFIG.googleSheetsWebhookUrl, {
            method: 'POST',
            mode: 'no-cors', // Apps Script handles CORS, but no-cors prevents reading response
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }).catch(error => {
            // Handle fetch errors (network, CORS, etc.)
            console.warn('Google Sheets tracking error:', error);
            
            if (retryCount < CONFIG.maxRetries) {
                // Add to retry queue
                state.retryQueue.push({
                    events: events,
                    retryCount: retryCount + 1,
                });
                
                // Retry with exponential backoff
                const delay = CONFIG.retryDelay * Math.pow(2, retryCount);
                setTimeout(() => {
                    const retryItem = state.retryQueue.shift();
                    if (retryItem) {
                        sendToGoogleSheets(retryItem.events, retryItem.retryCount);
                    }
                }, delay);
            } else {
                // Max retries reached, log to console for debugging
                console.error('Failed to send events to Google Sheets after max retries:', events);
            }
        });
    }

    function sendSessionSummaryToGoogleSheets() {
        if (!CONFIG.googleSheetsWebhookUrl) return;

        const summary = {
            type: 'session_summary',
            participantId: state.participantId,
            sessionStart: state.sessionStart ? new Date(state.sessionStart).toISOString() : null,
            sessionEnd: state.sessionEnd ? new Date(state.sessionEnd).toISOString() : null,
            totalSessionMs: state.sessionEnd && state.sessionStart ? state.sessionEnd - state.sessionStart : null,
            articleTimes: Object.values(state.articleTimes).map(rec => ({
                ...rec,
                trafficLightStatus: getArticleMetadata(rec.articleId)?.trafficLightStatus,
                misleadingScore: getArticleMetadata(rec.articleId)?.misleadingScore,
            })),
            articleHovers: Object.values(state.articleHovers),
            trafficLightHovers: Object.values(state.trafficLightHovers),
        };

        sendToGoogleSheets([summary], 0);
    }

    function finishSessionAndSend() {
        if (state.sessionEnd) {
            // already finished
            return;
        }

        // Stop any ongoing views and hovers
        pauseAllVisibility('session_end');
        
        // End any ongoing hovers
        Object.keys(state.currentlyHovered).forEach((articleId) => {
            const hoverData = state.currentlyHovered[articleId];
            const hoverDuration = nowMs() - hoverData.start;
            const isTrafficLight = hoverData.isTrafficLight;

            if (isTrafficLight) {
                const rec = ensureTrafficLightHoverRecord(articleId);
                rec.trafficLightHoverMs += hoverDuration;
                rec.trafficLightHoverCount += 1;
            } else {
                const rec = ensureHoverRecord(articleId);
                rec.hoverDurationMs += hoverDuration;
                rec.hoverCount += 1;
            }

            delete state.currentlyHovered[articleId];
        });

        state.sessionEnd = nowMs();

        // Flush any pending batch queue
        flushBatchQueue();

        const payload = {
            participantId: state.participantId,
            sessionStart: state.sessionStart ? new Date(state.sessionStart).toISOString() : null,
            sessionEnd: new Date(state.sessionEnd).toISOString(),
            events: state.events,
            articleTimes: Object.values(state.articleTimes).map(rec => ({
                ...rec,
                trafficLightStatus: getArticleMetadata(rec.articleId)?.trafficLightStatus,
                misleadingScore: getArticleMetadata(rec.articleId)?.misleadingScore,
            })),
            articleHovers: Object.values(state.articleHovers),
            trafficLightHovers: Object.values(state.trafficLightHovers),
        };

        logEvent({ type: 'session_end' });

        // Send to parent window (Qualtrics iframe) - PRIMARY METHOD
        try {
            if (window.parent && window.parent !== window) {
                window.parent.postMessage(
                    {
                        type: 'traffic_experiment_log',
                        payload,
                    },
                    '*'
                );
            }
        } catch (e) {
            // Swallow errors but keep going
        }

        // Send to Google Sheets - BACKUP METHOD
        try {
            // Send all remaining events
            if (state.events.length > 0) {
                const eventsToSend = state.events.map(event => ({
                    ...event,
                    timestamp: event.ts || nowIso(),
                }));
                sendToGoogleSheets(eventsToSend, 0);
            }
            
            // Send session summary
            sendSessionSummaryToGoogleSheets();
        } catch (e) {
            // Don't block if Google Sheets fails
            console.warn('Failed to send to Google Sheets:', e);
        }

        // Also log to console for debugging / piloting
        if (window.console && typeof window.console.log === 'function') {
            console.log('Traffic experiment log payload:', payload);
        }
    }

    function setupUnloadHandler() {
        // Send tracking data when user leaves the page
        window.addEventListener('beforeunload', function () {
            finishSessionAndSend();
        });
    }

    function init() {
        state.participantId = parseParticipantId();
        startSession();
        setupVisibilityObserver();
        setupClickTracking();
        setupHoverTracking();
        setupPageVisibilityHandling();
        setupUnloadHandler();
    }

    return {
        init,
        logEvent,
        startModalArticle,
        endModalArticle,
    };
})();

// Main application logic

document.addEventListener('DOMContentLoaded', function() {
    renderArticles();
    setupModal();
    Tracking.init();
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
    
    // Create traffic light HTML
    const trafficLightHTML = createLargeTrafficLightCard(article.trafficLightStatus, article.misleadingScore);
    
    // Remove traffic light from article image in detail view
    detail.innerHTML = `
        <div class="article-image-container">
            <div class="article-image-wrapper">
                <img src="${article.image}" alt="${article.title}" class="article-image">
            </div>
            <div class="mobile-traffic-light-container">
                ${trafficLightHTML}
            </div>
        </div>
        <div class="article-category">${article.category}</div>
        <h1>${article.title}</h1>
        <div class="article-content">
            ${article.content}
        </div>
    `;
    
    // Add fixed traffic light card on the side (for desktop)
    fixedTrafficLight.innerHTML = trafficLightHTML;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Track focused reading of this article in the modal
    Tracking.startModalArticle(String(article.id));
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

    // End modal-focused reading time tracking
    Tracking.endModalArticle();
}

