addEventListener("DOMContentLoaded", () => {
  if(!window.isBanter){
    const p = document.createElement('p'), iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://calendar.google.com/calendar/embed?height=569&wkst=2&ctz=UTC&bgcolor=%2300be00&mode=AGENDA&showPrint=0&showTitle=0&src=NjAzNDU1OGU0YzczZGVjNWFkYTk3YTUxMzFlMDBiYmJmYTdkMTk0ZWM4ZTM3NTZlZmU2MTE0YmRhOWFkMmM4ZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%239E69AF');
    iframe.setAttribute('style', 'border-width:0');
    iframe.setAttribute('width', '420');
    iframe.setAttribute('height', '569');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    p.appendChild(iframe);
    document.querySelector('body').appendChild(p);
  }
});