let currentPage = 1;
let isLoading = false;

async function fetchNews() {
    if (isLoading) return;
    
    isLoading = true;
    document.getElementById('loading').style.display = 'block';

    try {
        const response = await fetch(
            `https://api.rss2json.com/v1/api.json?rss_url=https://www.aljazeera.net/aljazeerarss/3cd0f0b4-4d0a-4355-8615-8d8e8a509682&page=${currentPage}`
        );
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            displayNews(data.items);
            currentPage++;
        }
    } catch (error) {
        console.error('حدث خطأ:', error);
        displayLocalNews();
    } finally {
        isLoading = false;
        document.getElementById('loading').style.display = 'none';
    }
}

function displayNews(articles) {
    const container = document.getElementById('news-container');
    
    articles.forEach(article => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `
            ${article.enclosure ? `<img src="${article.enclosure.link}" class="news-image" alt="${article.title}">` : ''}
            <div class="news-content">
                <h3 class="news-title">${article.title}</h3>
                <p class="news-description">${article.description.replace(/<[^>]+>/g, '').substring(0, 150)}...</p>
                <a href="${article.link}" target="_blank" class="read-more">قراءة المزيد</a>
            </div>
        `;
        container.appendChild(newsCard);
    });
}

// نظام التحميل التلقائي عند التمرير
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    if (scrollTop + clientHeight >= scrollHeight - 500 && !isLoading) {
        fetchNews();
    }
});

// النسخ الاحتياطي
function displayLocalNews() {
    const news = [
        {
            title: "أهم الأخبار المحلية",
            description: "تفاصيل الأخبار المحلية اليومية",
            link: "#",
            enclosure: { link: "https://via.placeholder.com/300x200" }
        }
    ];
    displayNews(news);
}

// التحميل الأولي
fetchNews();
