(function(){
  const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.querySelectorAll('.nav a').forEach(a=>{if((a.getAttribute('href')||'').toLowerCase()===current)a.classList.add('active')});
})();
