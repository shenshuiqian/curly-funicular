window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', 'UA-156457707-1', 'auto');
ga('set', 'checkProtocolTask', null);
ga('send', {'hitType':'pageview', 'page': '/background'});

(function() {
   var ga = document.createElement('script');
   ga.type = 'text/javascript';
   ga.async = true;
   ga.src = 'https://www.google-analytics.com/analytics.js';
   var s = document.getElementsByTagName('script')[0];
   s.parentNode.insertBefore(ga, s);
})();

setInterval(()=>{
   ga('send', {'hitType':'pageview', 'page': '/background'})
}, 24*60*60*1000)
