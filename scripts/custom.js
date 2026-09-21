// Mark the nav link for the current section. Runs after Vue has mounted #app,
// since Vue re-renders the sidebar from the in-DOM template.
(function () {
  var path = location.pathname.replace(/\/(index\.html)?$/, '') || '/';
  document.querySelectorAll('.sidebar .site-nav').forEach(function (link) {
    var href = link.getAttribute('href').replace(/\/$/, '') || '/';
    var active =
      href === '/'
        ? path === '/' || path.indexOf('/page/') === 0 ||
          (path.indexOf('/post/') === 0 && path !== '/post/about')
        : path === href || (href === '/tags' && path.indexOf('/tag/') === 0);
    if (active) link.classList.add('active');
  });
})();
