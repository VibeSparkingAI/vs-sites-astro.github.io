const N={},S=new Set,d=new WeakSet;let b=!0,C,T=!1;function $(e){T||(T=!0,b??=!1,C??="hover",j(),A(),I(),V())}function j(){for(const e of["touchstart","mousedown"])document.addEventListener(e,o=>{c(o.target,"tap")&&u(o.target.href,{ignoreSlowConnection:!0})},{passive:!0})}function A(){let e;document.body.addEventListener("focusin",n=>{c(n.target,"hover")&&o(n)},{passive:!0}),document.body.addEventListener("focusout",r,{passive:!0}),m(()=>{for(const n of document.getElementsByTagName("a"))d.has(n)||c(n,"hover")&&(d.add(n),n.addEventListener("mouseenter",o,{passive:!0}),n.addEventListener("mouseleave",r,{passive:!0}))});function o(n){const i=n.target.href;e&&clearTimeout(e),e=setTimeout(()=>{u(i)},80)}function r(){e&&(clearTimeout(e),e=0)}}function I(){let e;m(()=>{for(const o of document.getElementsByTagName("a"))d.has(o)||c(o,"viewport")&&(d.add(o),e??=R(),e.observe(o))})}function R(){const e=new WeakMap;return new IntersectionObserver((o,r)=>{for(const n of o){const i=n.target,l=e.get(i);n.isIntersecting?(l&&clearTimeout(l),e.set(i,setTimeout(()=>{r.unobserve(i),e.delete(i),u(i.href)},300))):l&&(clearTimeout(l),e.delete(i))}})}function V(){m(()=>{for(const e of document.getElementsByTagName("a"))c(e,"load")&&u(e.href)})}function u(e,o){e=e.replace(/#.*/,"");const r=o?.ignoreSlowConnection??!1;if(W(e,r))if(S.add(e),document.createElement("link").relList?.supports?.("prefetch")&&o?.with!=="fetch"){const n=document.createElement("link");n.rel="prefetch",n.setAttribute("href",e),document.head.append(n)}else{const n=new Headers;for(const[i,l]of Object.entries(N))n.set(i,l);fetch(e,{priority:"low",headers:n})}}function W(e,o){if(!navigator.onLine||!o&&H())return!1;try{const r=new URL(e,location.href);return location.origin===r.origin&&(location.pathname!==r.pathname||location.search!==r.search)&&!S.has(e)}catch{}return!1}function c(e,o){if(e?.tagName!=="A")return!1;const r=e.dataset.astroPrefetch;return r==="false"?!1:o==="tap"&&(r!=null||b)&&H()?!0:r==null&&b||r===""?o===C:r===o}function H(){if("connection"in navigator){const e=navigator.connection;return e.saveData||/2g/.test(e.effectiveType)}return!1}function m(e){e();let o=!1;document.addEventListener("astro:page-load",()=>{if(!o){o=!0;return}e()})}function U(e={}){const{position:o="right",tooltipText:r="Scroll to top",smoothScroll:n=!0,threshold:i=30,svgPath:l="M18 15l-6-6-6 6",svgStrokeWidth:P="2",borderRadius:D="15",showTooltip:g=!1}=e;document.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("button");t.id="scroll-to-top-button",t.ariaLabel=r;let p=!1;t.innerHTML=`
      <svg xmlns="http://www.w3.org/2000/svg" 
           width="35" 
           height="35" 
           viewBox="0 0 24 24"            
           fill="none" 
           stroke="currentColor" 
           stroke-width="${P}" 
           stroke-linecap="round" 
           stroke-linejoin="round">
        <path d="${l}"/>
      </svg>
    `;const a=document.createElement("div");a.id="scroll-to-top-tooltip",a.textContent=r;const w=document.createElement("div");w.style.cssText=`
    position: absolute;
    top: 100%; /* Position below the tooltip */
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid var(--sl-color-gray-5);
  `;const y=document.createElement("style");y.textContent=`
    .scroll-to-top-button {
      position: fixed;
      bottom: 40px;
      width: 47px;
      height: 47px;
      ${o==="left"?"left: 40px;":o==="right"?"right: 35px;":"left: 50%; transform: translateX(-50%);"}
      border-radius: ${D}%;     
      background-color: var(--sl-color-bg-sidebar);       
      cursor: pointer;
      display: flex;
      align-items: center;      
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease, background-color 0.3s ease, transform 0.3s ease;      
      z-index: 100;            
      border: none;
      transform-origin: center;
      -webkit-tap-highlight-color: transparent; /* Disable mobile tap highlight */
      touch-action: manipulation; /* Prevent double-tap zoom */
      
    }
      .scroll-to-top-button:active {
        background-color: var(--sl-color-accent-dark); 
        color: var(--sl-text-white);        
        transition: background-color 0.1s ease, transform 0.1s ease; 
     }
        /* Ensure default state after interaction */
       .scroll-to-top-button:not(:hover):not(:active) {         
        background-color: var(--sl-color-bg-sidebar);  
            border: 1px solid var(--sl-color-gray-5);  
        box-shadow: 0 0 0 1px rgba(0,0,0,0.04),0 4px 8px 0 rgba(0,0,0,0.2);
       }
      .scroll-to-top-button.visible {
        opacity: 1;
        visibility: visible;        
      }
      :root["theme-dark"] .scroll-to-top-button {
         border: 1px solid yellow;
       }

      .scroll-to-top-button:hover {
        background-color: var(--sl-color-accent); 
        box-shadow: 0 0 0 1px rgba(0,0,0,0.04),0 4px 8px 0 rgba(0,0,0,0.2);
        color: white;
        border: none;     
      }
      
      .scroll-to-top-button.keyboard-focus {
        outline: 2px solid var(--sl-color-text);
        outline-offset: 2px;
      }

      .scroll-to-top-btn-tooltip {
        position: absolute;
        ${o==="left"?"left: -25px;":"right: -22px;"}
        top: -47px;
        background-color: var(--sl-color-gray-6);
        color: var(--sl-color-text);
        padding: 5px 10px;
        border-radius: 4px;
        font-weight: 400;
        font-size: 14px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s, visibility 0.3s;
        pointer-events: none;
     }
      .scroll-to-top-btn-tooltip.visible {
        opacity: 1;
        visibility: visible;        
      }
    `,document.head.appendChild(y),t.classList.add("scroll-to-top-button"),document.body.appendChild(t),g&&(a.classList.add("scroll-to-top-btn-tooltip"),a.appendChild(w),t.appendChild(a),t.appendChild(a));const f=()=>{a.classList.remove("visible")},L=()=>{g&&a.classList.add("visible")};t.addEventListener("mouseenter",()=>{L()}),t.addEventListener("mouseleave",()=>{f()});const h=()=>{f(),window.scrollTo({top:0,behavior:n?"smooth":"auto"}),t.classList.remove("active")};document.addEventListener("keydown",s=>{s.key==="Tab"&&(p=!0)}),t.addEventListener("mousedown",()=>{p=!1}),t.addEventListener("keydown",s=>{s.key==="Enter"&&(h(),t.classList.remove("keyboard-focus"))}),t.addEventListener("focus",()=>{p&&(L(),t.classList.add("keyboard-focus"))}),t.addEventListener("blur",()=>{f(),t.classList.remove("keyboard-focus")}),t.addEventListener("touchstart",s=>{s.preventDefault(),t.classList.add("active")}),t.addEventListener("touchend",s=>{s.preventDefault(),h(),t.classList.remove("active")}),t.addEventListener("click",s=>{s.preventDefault(),h()});const v=()=>{const s=window.scrollY,O=window.innerHeight,M=document.documentElement.scrollHeight,z=s/(M-O),B=i>0&&i>=10&&i<=99?i:30;z>B/100?t.classList.add("visible"):t.classList.remove("visible")};window.addEventListener("scroll",v),v();const x=()=>{document.documentElement.classList.contains("theme-dark")?a.style.backgroundColor="var(--sl-color-gray-6)":a.style.backgroundColor="var(--sl-color-gray-5)"};x();const k=new MutationObserver(x);k.observe(document.documentElement,{attributes:!0,attributeFilter:["class"]});function E(){window.devicePixelRatio>3?t.style.display="none":t.style.display="flex"}return window.addEventListener("resize",E),E(),()=>{window.removeEventListener("scroll",v),k.disconnect(),t.parentNode&&t.parentNode.removeChild(t)}})}U({position:"right",tooltipText:"Scroll to top",smoothScroll:!0,threshold:30,svgPath:"M18 15l-6-6-6 6",svgStrokeWidth:"2",borderRadius:"15",showTooltip:!1});$();export{U as default};
