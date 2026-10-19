/* Render festival posts from posts.json. */
(() => {
    const grid = document.getElementById('festive-posts-grid');
    if (!grid) return;
    const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
    fetch('newposts.json', { cache: 'no-cache' })
        .then((response) => {
            if (!response.ok) throw new Error('Could not load festival posts');
            return response.json();
        })
        .then((posts) => {
            if (!Array.isArray(posts) || posts.length === 0) {
                grid.innerHTML = '<p class="festive-empty">No festival posts published yet.</p>';
                return;
            }
            grid.innerHTML = posts.map((post) => `
                <article class="festive-post-card">
                    <div class="festive-post-emoji" aria-hidden="true">${escapeHTML(post.emoji || '🎉')}</div>
                    <span class="festive-post-category">${escapeHTML(post.category || 'Festival Post')}</span>
                    <h3 class="festive-post-title">${escapeHTML(post.title || post.festival || 'Festival Greeting')}</h3>
                    <p class="festive-post-message">${escapeHTML(post.message || '')}</p>
                    ${Array.isArray(post.content) && post.content.length ? `
                        <details class="festive-article-details">
                            <summary>पूरा लेख पढ़ें</summary>
                            <div class="festive-article-body">
                                ${post.content.map((part) => `<section class="festive-article-part"><h4>${escapeHTML(part.heading || '')}</h4><p>${escapeHTML(part.text || '')}</p></section>`).join('')}
                            </div>
                        </details>
                    ` : ''}
                    ${post.date ? `<p class="mt-3 mb-0 small"><i class="far fa-calendar me-2" aria-hidden="true"></i>${escapeHTML(post.date)}</p>` : ''}
                </article>
            `).join('');
        })
        .catch(() => {
            grid.innerHTML = '<p class="festive-empty">Festival posts are temporarily unavailable. Please refresh the page later.</p>';
        });
})();
