const S=new Set,d=new WeakSet;let b=!0,C,T=!1;function N(e){T||(T=!0,b??=!1,C??="hover",$(),A(),I(),V())}function $(){for(const e of["touchstart","mousedown"])document.body.addEventListener(e,o=>{c(o.target,"tap")&&u(o.target.href,{ignoreSlowConnection:!0})},{passive:!0})}function A(){let e;document.body.addEventListener("focusin",r=>{c(r.target,"hover")&&o(r)},{passive:!0}),document.body.addEventListener("focusout",n,{passive:!0}),m(()=>{for(const r of document.getElementsByTagName("a"))d.has(r)||c(r,"hover")&&(d.add(r),r.addEventListener("mouseenter",o,{passive:!0}),r.addEventListener("mouseleave",n,{passive:!0}))});function o(r){const i=r.target.href;e&&clearTimeout(e),e=setTimeout(()=>{u(i)},80)}function n(){e&&(clearTimeout(e),e=0)}}function I(){let e;m(()=>{for(const o of document.getElementsByTagName("a"))d.has(o)||c(o,"viewport")&&(d.add(o),e??=R(),e.observe(o))})}function R(){const e=new WeakMap;return new IntersectionObserver((o,n)=>{for(const r of o){const i=r.target,l=e.get(i);r.isIntersecting?(l&&clearTimeout(l),e.set(i,setTimeout(()=>{n.unobserve(i),e.delete(i),u(i.href)},300))):l&&(clearTimeout(l),e.delete(i))}})}function V(){m(()=>{for(const e of document.getElementsByTagName("a"))c(e,"load")&&u(e.href)})}function u(e,o){e=e.replace(/#.*/,"");const n=o?.ignoreSlowConnection??!1;if(W(e,n))if(S.add(e),document.createElement("link").relList?.supports?.("prefetch")&&o?.with!=="fetch"){const r=document.createElement("link");r.rel="prefetch",r.setAttribute("href",e),document.head.append(r)}else fetch(e,{priority:"low"})}function W(e,o){if(!navigator.onLine||!o&&P())return!1;try{const n=new URL(e,location.href);return location.origin===n.origin&&(location.pathname!==n.pathname||location.search!==n.search)&&!S.has(e)}catch{}return!1}function c(e,o){if(e?.tagName!=="A")return!1;const n=e.dataset.astroPrefetch;return n==="false"?!1:o==="tap"&&(n!=null||b)&&P()?!0:n==null&&b||n===""?o===C:n===o}function P(){if("connection"in navigator){const e=navigator.connection;return e.saveData||/2g/.test(e.effectiveType)}return!1}function m(e){e();let o=!1;document.addEventListener("astro:page-load",()=>{if(!o){o=!0;return}e()})}function j(e={}){const{position:o="right",tooltipText:n="Scroll to top",smoothScroll:r=!0,threshold:i=30,svgPath:l="M18 15l-6-6-6 6",svgStrokeWidth:D="2",borderRadius:H="15",showTooltip:g=!1}=e;document.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("button");t.id="scroll-to-top-button",t.ariaLabel=n;let p=!1;t.innerHTML=`
      <svg xmlns="http://www.w3.org/2000/svg" 
           width="35" 
           height="35" 
           viewBox="0 0 24 24"            
           fill="none" 
           stroke="currentColor" 
           stroke-width="${D}" 
           stroke-linecap="round" 
           stroke-linejoin="round">
        <path d="${l}"/>
      </svg>
    `;const a=document.createElement("div");a.id="scroll-to-top-tooltip",a.textContent=n;const w=document.createElement("div");w.style.cssText=`
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
      border-radius: ${H}%;     
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
    `,document.head.appendChild(y),t.classList.add("scroll-to-top-button"),document.body.appendChild(t),g&&(a.classList.add("scroll-to-top-btn-tooltip"),a.appendChild(w),t.appendChild(a),t.appendChild(a));const f=()=>{a.classList.remove("visible")},L=()=>{g&&a.classList.add("visible")};t.addEventListener("mouseenter",()=>{L()}),t.addEventListener("mouseleave",()=>{f()});const v=()=>{f(),window.scrollTo({top:0,behavior:r?"smooth":"auto"}),t.classList.remove("active")};document.addEventListener("keydown",s=>{s.key==="Tab"&&(p=!0)}),t.addEventListener("mousedown",()=>{p=!1}),t.addEventListener("keydown",s=>{s.key==="Enter"&&(v(),t.classList.remove("keyboard-focus"))}),t.addEventListener("focus",()=>{p&&(L(),t.classList.add("keyboard-focus"))}),t.addEventListener("blur",()=>{f(),t.classList.remove("keyboard-focus")}),t.addEventListener("touchstart",s=>{s.preventDefault(),t.classList.add("active")}),t.addEventListener("touchend",s=>{s.preventDefault(),v(),t.classList.remove("active")}),t.addEventListener("click",s=>{s.preventDefault(),v()});const h=()=>{const s=window.scrollY,M=window.innerHeight,O=document.documentElement.scrollHeight,z=s/(O-M),B=i>0&&i>=10&&i<=99?i:30;z>B/100?t.classList.add("visible"):t.classList.remove("visible")};window.addEventListener("scroll",h),h();const x=()=>{document.documentElement.classList.contains("theme-dark")?a.style.backgroundColor="var(--sl-color-gray-6)":a.style.backgroundColor="var(--sl-color-gray-5)"};x();const k=new MutationObserver(x);k.observe(document.documentElement,{attributes:!0,attributeFilter:["class"]});function E(){window.devicePixelRatio>3?t.style.display="none":t.style.display="flex"}return window.addEventListener("resize",E),E(),()=>{window.removeEventListener("scroll",h),k.disconnect(),t.parentNode&&t.parentNode.removeChild(t)}})}j({position:"right",tooltipText:"Scroll to top",smoothScroll:!0,threshold:30,svgPath:"M18 15l-6-6-6 6",svgStrokeWidth:"2",borderRadius:"15",showTooltip:!1});N();export{j as default};
