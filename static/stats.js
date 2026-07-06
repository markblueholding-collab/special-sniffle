(async function () {
  const card = document.getElementById('card')
  if (!card) return

  function renderLoading() {
    card.innerText = 'Loading YouTube stats…'
  }
  function renderError(msg) {
    card.innerHTML = `<div style="color:#ff7b72">Failed to load stats: ${String(msg)}</div>`
  }

  function renderData(data) {
    const s = data.statistics || {}
    const title = data.snippet?.title || '@Pearlyirl'
    const avatar = data.snippet?.thumbnails?.default?.url || ''
    const subs = Number(s.subscriberCount || 0).toLocaleString()
    const views = Number(s.viewCount || 0).toLocaleString()
    const videos = Number(s.videoCount || 0).toLocaleString()

    card.innerHTML = `
      <div class="header">
        ${avatar ? `<img class="avatar" src="${avatar}" alt="${title}">` : ''}
        <div>
          <div class="title">${title}</div>
          <div class="subtitle">${data.snippet?.customUrl ?? ''}</div>
        </div>
      </div>
      <div class="stats">
        <div class="stat"><div class="num">${subs}</div><div class="muted">subscribers</div></div>
        <div class="stat"><div class="num">${views}</div><div class="muted">total views</div></div>
        <div class="stat"><div class="num">${videos}</div><div class="muted">videos</div></div>
      </div>
      <div class="note">Updated: ${new Date().toLocaleTimeString()}</div>
    `
  }

  async function fetchStats() {
    renderLoading()
    try {
      // Unofficial public proxy for quick prototypes (no API key required)
      const url = 'https://yt.lemnoslife.com/channels?part=statistics,snippet&forUsername=Pearlyirl'
      const res = await fetch(url)
      if (!res.ok) throw new Error('status ' + res.status)
      const json = await res.json()
      const item = (json.items && json.items[0]) || json
      if (!item) throw new Error('no data')
      renderData(item)
    } catch (err) {
      renderError(err?.message || err)
    }
  }

  await fetchStats()
  // refresh every 60s
  setInterval(fetchStats, 60_000)
})()
