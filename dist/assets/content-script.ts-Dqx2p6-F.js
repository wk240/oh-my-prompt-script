var F=Object.defineProperty;var U=(n,e,t)=>e in n?F(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var g=(n,e,t)=>U(n,typeof e!="symbol"?e+"":e,t);import{M as T}from"./messages-B2Ka1gOf.js";import{j as i,c as S,r as l,s as q,F as Y,a as K,b as V,X as W,D as X,d as J,S as Q,v as Z,u as ee,C as te,e as oe,P as re,f as ne,G as ie,t as se,g as ae}from"./sortable.esm-qd8fvc0V.js";const D="[Prompt-Script]",de=100,ce=['[data-testid="agent-message-input"]','[data-lexical-editor="true"]','div[contenteditable="true"][role="textbox"]','textarea[placeholder*="prompt"]','textarea[placeholder*="提示"]',".input-area textarea",'textarea[class*="input"]','textarea[class*="prompt"]'];class le{constructor(e){g(this,"observer",null);g(this,"navObserver",null);g(this,"debounceTimer");g(this,"inputElement",null);g(this,"onInputDetected");g(this,"originalPushState",null);g(this,"originalReplaceState",null);g(this,"boundPopstateHandler",null);g(this,"healthCheckInterval");this.onInputDetected=e}start(){this.tryDetect(),this.observer=new MutationObserver(e=>{this.debouncedDetect()}),this.observer.observe(document.body,{childList:!0,subtree:!0,attributes:!1}),this.watchNavigation(),this.healthCheckInterval=setInterval(()=>{this.inputElement||this.tryDetect()},3e4)}stop(){var e,t;(e=this.observer)==null||e.disconnect(),(t=this.navObserver)==null||t.disconnect(),this.debounceTimer!==void 0&&clearTimeout(this.debounceTimer),this.healthCheckInterval!==void 0&&(clearInterval(this.healthCheckInterval),this.healthCheckInterval=void 0),this.originalPushState&&(history.pushState=this.originalPushState),this.originalReplaceState&&(history.replaceState=this.originalReplaceState),this.boundPopstateHandler&&window.removeEventListener("popstate",this.boundPopstateHandler)}getInputElement(){return this.inputElement}debouncedDetect(){this.debounceTimer!==void 0&&clearTimeout(this.debounceTimer),this.debounceTimer=setTimeout(()=>{this.tryDetect()},de)}tryDetect(){const e=this.findLovartInput();e&&e!==this.inputElement&&(this.inputElement=e,console.log(D,"Input detected:",e),this.onInputDetected(e))}findLovartInput(){for(const e of ce){const t=document.querySelector(e);if(t&&this.isValidInputElement(t))return t}return null}isValidInputElement(e){return e.offsetWidth===0||e.offsetHeight===0?!1:!!(e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e.isContentEditable)}handleNavigation(){console.log(D,"Navigation detected via history API"),this.inputElement=null,this.tryDetect()}watchNavigation(){this.originalPushState=history.pushState,this.originalReplaceState=history.replaceState,history.pushState=(...t)=>{this.originalPushState.apply(history,t),this.handleNavigation()},history.replaceState=(...t)=>{this.originalReplaceState.apply(history,t),this.handleNavigation()},this.boundPopstateHandler=()=>this.handleNavigation(),window.addEventListener("popstate",this.boundPopstateHandler);let e=location.href;this.navObserver=new MutationObserver(()=>{location.href!==e&&(e=location.href,console.log(D,"Navigation detected:",e),this.inputElement=null,this.tryDetect())}),this.navObserver.observe(document.body,{childList:!0,subtree:!0})}}function pe({isOpen:n,onClick:e}){const t=a=>{a.preventDefault(),a.stopPropagation(),e()},o=a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),e())};return i.jsx("button",{className:`trigger-button${n?" open":""}`,onClick:t,onKeyDown:o,role:"button",tabIndex:0,"aria-label":"选择预设提示词","aria-expanded":n,title:"Prompt-Script",children:i.jsx("svg",{className:"trigger-icon",width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:i.jsx("path",{d:"M13 3L4 14h7l-1 7 9-11h-7l1-7z",fill:"currentColor",fillOpacity:"0.9"})})})}/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fe=[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]],ge=S("arrow-up-right",fe);/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=[["path",{d:"m11 10 3 3",key:"fzmg1i"}],["path",{d:"M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z",key:"p4q2r7"}],["path",{d:"M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031",key:"wy6l02"}]],he=S("brush",ue);/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const me=[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]],xe=S("folder-open",me);/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const be=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],_=S("layers",be);/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const we=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],ye=S("settings",we);/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}]],Ee=S("sparkle",ve),ke={design:ne,style:re,default:oe},Se=[{id:"all",name:"全部分类",order:0},{id:"design",name:"设计",order:1},{id:"style",name:"风格",order:2},{id:"other",name:"其他",order:3}],r="prompt-script-dropdown-portal";function Ie(){let n=document.getElementById(r);if(!n){n=document.createElement("div"),n.id=r;const e=document.createElement("style");e.id="prompt-script-dropdown-styles",e.textContent=je(),document.head.appendChild(e),document.body.appendChild(n)}return n}function je(){return`
    #${r} .dropdown-container {
      position: fixed;
      width: 480px;
      max-height: 600px;
      background: #ffffff;
      border: 1px solid #E5E5E5;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      box-sizing: border-box;
      z-index: 2147483647;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
    }

    #${r} .dropdown-sidebar {
      width: 120px;
      background: #f8f8f8;
      border-right: 1px solid #E5E5E5;
      display: flex;
      flex-direction: column;
      padding: 12px 0;
      border-radius: 12px 0 0 12px;
    }

    #${r} .sidebar-categories {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow-y: auto;
    }

    #${r} .sidebar-category-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: transparent;
      border: none;
      border-radius: 0;
      text-align: left;
      font-size: 12px;
      font-weight: 500;
      color: #171717;
      cursor: pointer;
      transition: background 0.15s ease;
      width: 100%;
      overflow: hidden;
    }

    #${r} .sidebar-category-item span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      min-width: 0;
    }

    #${r} .sidebar-category-item:hover {
      background: #f0f0f0;
    }

    #${r} .sidebar-category-item.selected {
      background: #ffffff;
      color: #A16207;
      border-left: 2px solid #A16207;
    }

    #${r} .sidebar-category-icon {
      width: 14px;
      height: 14px;
      color: #64748B;
    }

    #${r} .sidebar-category-item.selected .sidebar-category-icon {
      color: #A16207;
    }

    #${r} .dropdown-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-radius: 0 12px 12px 0;
    }

    #${r} .dropdown-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #E5E5E5;
    }

    #${r} .dropdown-header-title {
      font-size: 10px;
      font-weight: 600;
      color: #64748B;
      letter-spacing: 1px;
    }

    #${r} .dropdown-header-actions {
      display: flex;
      gap: 8px;
    }

    #${r} .dropdown-settings,
    #${r} .dropdown-close {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.15s ease;
      color: #171717;
    }

    #${r} .dropdown-settings:hover,
    #${r} .dropdown-close:hover {
      background: #f8f8f8;
    }

    #${r} .dropdown-content {
      flex: 1;
      overflow-y: auto;
      padding: 12px 16px;
    }

    #${r} .dropdown-items {
      display: flex;
      flex-direction: column;
    }

    #${r} .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #E5E5E5;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    #${r} .dropdown-item:hover {
      background: #f8f8f8;
    }

    #${r} .dropdown-item.last {
      border-bottom: none;
    }

    #${r} .dropdown-item.selected {
      background: #fef3e2;
    }

    #${r} .dropdown-item-icon {
      width: 16px;
      height: 16px;
      color: #171717;
    }

    #${r} .dropdown-item-text {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    #${r} .dropdown-item-name {
      font-size: 12px;
      font-weight: 500;
      color: #171717;
    }

    #${r} .dropdown-item-preview {
      font-size: 10px;
      color: #64748B;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    #${r} .dropdown-item-arrow {
      width: 12px;
      height: 12px;
      color: #171717;
    }

    #${r} .empty-state {
      padding: 24px;
      text-align: center;
    }

    #${r} .empty-message {
      font-size: 12px;
      color: #64748B;
    }

    #${r} .sidebar-footer {
      padding: 12px;
      border-top: 1px solid #E5E5E5;
      font-size: 10px;
      color: #64748B;
      text-align: center;
      margin-top: auto;
    }

    #${r} .dropdown-content::-webkit-scrollbar,
    #${r} .sidebar-categories::-webkit-scrollbar {
      width: 6px;
    }

    #${r} .dropdown-content::-webkit-scrollbar-track,
    #${r} .sidebar-categories::-webkit-scrollbar-track {
      background: transparent;
    }

    #${r} .dropdown-content::-webkit-scrollbar-thumb,
    #${r} .sidebar-categories::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 3px;
    }

    #${r} .dropdown-content::-webkit-scrollbar-thumb:hover,
    #${r} .sidebar-categories::-webkit-scrollbar-thumb:hover {
      background: #ccc;
    }

    #${r} .dropdown-item-drag-handle {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      color: #64748B;
      opacity: 0;
      transition: opacity 0.15s ease;
      margin-right: -8px;
    }

    #${r} .dropdown-item:hover .dropdown-item-drag-handle {
      opacity: 1;
    }

    #${r} .dropdown-item-drag-handle:active {
      cursor: grabbing;
    }

    #${r} .dropdown-item.dragging {
      opacity: 0.5;
      background: #f8f8f8;
    }
  `}const Pe={all:xe,design:Ee,style:he,other:_};function Te({prompt:n,isLast:e,isSelected:t,onSelect:o,showDragHandle:a}){const{attributes:d,listeners:w,setNodeRef:h,transform:v,transition:I,isDragging:f}=ee({id:n.id}),j={transform:te.Transform.toString(v),transition:I,opacity:f?.5:1},k=ke[n.categoryId==="design"?"design":n.categoryId==="style"?"style":"default"];return i.jsxs("div",{ref:h,style:j,className:`dropdown-item${t?" selected":""}${e?" last":""}${f?" dragging":""}`,onMouseDown:x=>x.preventDefault(),onClick:()=>o(n),role:"button",tabIndex:0,onKeyDown:x=>{(x.key==="Enter"||x.key===" ")&&(x.preventDefault(),o(n))},children:[a&&i.jsx("div",{className:"dropdown-item-drag-handle",...d,...w,children:i.jsx(ie,{style:{width:12,height:12}})}),i.jsx(k,{className:"dropdown-item-icon"}),i.jsxs("div",{className:"dropdown-item-text",children:[i.jsx("span",{className:"dropdown-item-name",children:n.name}),i.jsx("span",{className:"dropdown-item-preview",children:se(n.content,40)})]}),i.jsx(ge,{className:"dropdown-item-arrow"})]})}function Re({prompts:n,categories:e,onSelect:t,isOpen:o,selectedPromptId:a,onClose:d,isLoading:w=!1}){const h=l.useRef(null),[v,I]=l.useState({top:0,right:0,isStickyTop:!1}),[f,j]=l.useState("all"),k=8,x=600;l.useEffect(()=>{if(!o)return;const s=()=>{const u=document.querySelector('[data-testid="prompt-script-trigger"]');if(!u)return;const m=u.getBoundingClientRect(),E=window.innerWidth-m.left,b=m.top-k,M=b-x<0;I({top:M?0:b,right:E,isStickyTop:M})};s();const c=()=>s();return window.addEventListener("scroll",c,{passive:!0}),window.addEventListener("resize",c),()=>{window.removeEventListener("scroll",c),window.removeEventListener("resize",c)}},[o,k,x]);const $=l.useMemo(()=>{const s={id:"all",name:"全部分类",order:0};if(e.length>0)return[s,...q(e)];const c=[...new Set(n.map(m=>m.categoryId))],u=[s];return c.forEach(m=>{const N=Se.find(E=>E.id===m);u.push(N||{id:m,name:m,order:Y})}),u},[e,n]),p=l.useMemo(()=>{let s;return f==="all"?s=n:s=n.filter(c=>c.categoryId===f),K(s)},[n,f]),y=p.length>=2&&f!=="all",R=async s=>{const{active:c,over:u}=s;if(u&&c.id!==u.id&&f!=="all"){const m=p.findIndex(b=>b.id===c.id),N=p.findIndex(b=>b.id===u.id),E=[...p];E.splice(m,1),E.splice(N,0,p[m]);try{const b=n.map(P=>P.categoryId===f?{...P,order:E.map(A=>A.id).indexOf(P.id)}:P);await chrome.runtime.sendMessage({type:T.SET_STORAGE,payload:{prompts:b,categories:e,version:"1.0.0"}})}catch(b){console.error("[Prompt-Script] Failed to reorder prompts:",b)}}};if(l.useEffect(()=>{if(!o)return;const s=c=>{const u=document.querySelector('[data-testid="prompt-script-trigger"]');h.current&&!h.current.contains(c.target)&&u&&!u.contains(c.target)&&(d==null||d())};return document.addEventListener("mousedown",s),()=>document.removeEventListener("mousedown",s)},[o,d]),!o)return null;const C={top:v.top,right:v.right,transform:v.isStickyTop?"none":"translateY(-100%)"},H=()=>{chrome.runtime.sendMessage({type:T.OPEN_SETTINGS}),d==null||d()},G=s=>Pe[s]||_;return V.createPortal(i.jsxs("div",{ref:h,className:"dropdown-container",style:C,children:[i.jsxs("div",{className:"dropdown-sidebar",children:[i.jsx("div",{className:"sidebar-categories",children:$.map(s=>{const c=G(s.id);return i.jsxs("button",{className:`sidebar-category-item ${f===s.id?"selected":""}`,onClick:()=>j(s.id),"aria-label":s.name,children:[i.jsx(c,{className:"sidebar-category-icon"}),i.jsx("span",{children:s.name})]},s.id)})}),i.jsx("div",{className:"sidebar-footer",children:"power by neo"})]}),i.jsxs("div",{className:"dropdown-main",children:[i.jsxs("div",{className:"dropdown-header",children:[i.jsx("span",{className:"dropdown-header-title",children:"PROMPTS"}),i.jsxs("div",{className:"dropdown-header-actions",children:[i.jsx("button",{className:"dropdown-settings",onClick:H,"aria-label":"设置",children:i.jsx(ye,{style:{width:14,height:14}})}),i.jsx("button",{className:"dropdown-close",onClick:d,"aria-label":"关闭",children:i.jsx(W,{style:{width:14,height:14}})})]})]}),i.jsx("div",{className:"dropdown-content",children:w?i.jsx("div",{className:"empty-state",children:i.jsx("div",{className:"empty-message",children:"加载中..."})}):p.length===0?i.jsx("div",{className:"empty-state",children:i.jsx("div",{className:"empty-message",children:f==="all"?"暂无提示词，请点击设置添加":"该分类暂无提示词"})}):i.jsx("div",{className:"dropdown-items",children:i.jsx(X,{collisionDetection:J,onDragEnd:R,children:i.jsx(Q,{items:p.map(s=>s.id),strategy:Z,children:p.map((s,c)=>i.jsx(Te,{prompt:s,isLast:c===p.length-1,isSelected:a===s.id,onSelect:t,showDragHandle:y},s.id))})})})})]})]}),Ie())}const z="[Prompt-Script]";class Ce{insertPrompt(e,t){try{return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement?this.insertIntoFormControl(e,t):this.insertIntoRichText(e,t),this.dispatchInputEvents(e),console.log(z,"Prompt inserted:",t),!0}catch(o){return console.error(z,"Insert failed:",o),!1}}insertIntoFormControl(e,t){const o=e.selectionStart??e.value.length,a=e.selectionEnd??o;e.value=e.value.substring(0,o)+t+e.value.substring(a);const d=o+t.length;e.selectionStart=d,e.selectionEnd=d}insertIntoRichText(e,t){document.activeElement!==e&&e.focus();const o=window.getSelection();if(!o||o.rangeCount===0||!e.contains(o.getRangeAt(0).commonAncestorContainer)){const d=document.createRange();d.selectNodeContents(e),d.collapse(!1),o==null||o.removeAllRanges(),o==null||o.addRange(d)}document.execCommand("insertText",!1,t)||(console.warn(z,"execCommand failed, using fallback method"),this.insertIntoRichTextFallback(e,t))}insertIntoRichTextFallback(e,t){const o=window.getSelection();if(!o||o.rangeCount===0){e.textContent+=t;return}const a=o.getRangeAt(0);if(!e.contains(a.commonAncestorContainer)){const h=document.createRange();h.selectNodeContents(e),h.collapse(!1),o.removeAllRanges(),o.addRange(h)}const d=o.getRangeAt(0);d.deleteContents();const w=document.createTextNode(t);d.insertNode(w),d.setStartAfter(w),d.setEndAfter(w),o.removeAllRanges(),o.addRange(d)}dispatchInputEvents(e){var t,o;if(e.dispatchEvent(new Event("input",{bubbles:!0})),e.dispatchEvent(new Event("change",{bubbles:!0})),e instanceof HTMLInputElement){const a=(t=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value"))==null?void 0:t.set;a&&(a.call(e,e.value),e.dispatchEvent(new Event("input",{bubbles:!0})))}else if(e instanceof HTMLTextAreaElement){const a=(o=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value"))==null?void 0:o.set;a&&(a.call(e,e.value),e.dispatchEvent(new Event("input",{bubbles:!0})))}e.isContentEditable&&e.dispatchEvent(new InputEvent("beforeinput",{bubbles:!0,inputType:"insertText",data:null}))}}function Ne({inputElement:n}){const[e,t]=l.useState(!1),[o,a]=l.useState(null),[d,w]=l.useState([]),[h,v]=l.useState([]),[I,f]=l.useState(!0),j=l.useRef(new Ce);l.useEffect(()=>{var p;if(!((p=chrome.runtime)!=null&&p.id)){console.log("[Prompt-Script] Extension context invalidated"),f(!1);return}try{chrome.runtime.sendMessage({type:T.GET_STORAGE},y=>{var R;if((R=chrome.runtime)!=null&&R.lastError){console.log("[Prompt-Script] Runtime error:",chrome.runtime.lastError.message),f(!1);return}if(y!=null&&y.success&&y.data){const C=y.data;w(C.prompts),v(C.categories)}f(!1)})}catch(y){console.log("[Prompt-Script] Extension context error:",y),f(!1)}},[]);const k=l.useCallback(()=>{t(p=>!p)},[]),x=l.useCallback(()=>{t(!1)},[]),$=l.useCallback(p=>{j.current.insertPrompt(n,p.content),a(p.id),setTimeout(()=>{a(null)},2e3)},[n]);return i.jsxs("div",{className:"dropdown-app",children:[i.jsx(pe,{isOpen:e,onClick:k}),i.jsx(Re,{prompts:d,categories:h,onSelect:$,isOpen:e,selectedPromptId:o,onClose:x,isLoading:I})]})}class $e extends l.Component{constructor(e){super(e),this.state={hasError:!1,error:null}}static getDerivedStateFromError(e){var t,o;return(t=e.message)!=null&&t.includes("Extension context invalidated")||(o=e.message)!=null&&o.includes("Extension context invalidated")?{hasError:!0,error:e}:{hasError:!0,error:e}}componentDidCatch(e,t){console.log("[Prompt-Script] Error caught:",e.message),console.log("[Prompt-Script] Component stack:",t.componentStack)}render(){var e;return this.state.hasError?(console.log("[Prompt-Script] Component error:",(e=this.state.error)==null?void 0:e.message),null):this.props.children}}const O="[Prompt-Script]",De="prompt-script-host",ze='[data-testid="agent-input-bottom-more-button"]';class Le{constructor(){g(this,"hostElement",null);g(this,"shadowRoot",null);g(this,"reactRoot",null)}inject(e){var a;this.remove();const t=document.querySelector(ze);if(!t){console.warn(O,"Target element not found, skipping injection");return}this.hostElement=document.createElement("span"),this.hostElement.id=De,this.hostElement.setAttribute("data-testid","prompt-script-trigger"),this.shadowRoot=this.hostElement.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`
      <style>
        ${this.getStyles()}
      </style>
      <div id="react-root"></div>
    `,(a=t.parentNode)==null||a.insertBefore(this.hostElement,t);const o=this.shadowRoot.querySelector("#react-root");o&&(this.reactRoot=ae.createRoot(o),this.reactRoot.render(i.jsx($e,{children:i.jsx(Ne,{inputElement:e})}))),console.log(O,"UI injected before target element")}getStyles(){return`
      /* Container reset */
      #react-root {
        all: initial;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-sizing: border-box;
      }

      /* Dropdown app wrapper */
      .dropdown-app {
        display: inline-flex;
        position: relative;
      }

      /* Trigger button - Circular lightning icon matching Lovart style */
      .trigger-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        transition: background 0.15s ease;
        box-sizing: border-box;
        color: #171717;
      }

      .trigger-button:hover {
        background: rgba(0, 0, 0, 0.05);
      }

      .trigger-button:active {
        background: rgba(0, 0, 0, 0.1);
      }

      .trigger-button:focus {
        outline: none;
      }

      .trigger-button.open {
        background: rgba(0, 0, 0, 0.08);
      }

      .trigger-icon {
        width: 18px;
        height: 18px;
        color: inherit;
      }

      /* Dropdown container */
      .dropdown-container {
        position: absolute;
        bottom: calc(100% + 8px);
        right: 0;
        width: 360px;
        max-height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
        background: #ffffff;
        border: 1px solid #E5E5E5;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 150ms ease-out, transform 150ms ease-out;
        pointer-events: none;
        padding: 16px;
        box-sizing: border-box;
      }

      .dropdown-container.open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      /* Dropdown items wrapper */
      .dropdown-items {
        display: flex;
        flex-direction: column;
      }

      /* Dropdown header */
      .dropdown-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 12px;
        border-bottom: 1px solid #E5E5E5;
        margin-bottom: 12px;
      }

      .dropdown-header-left {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
        min-width: 0;
      }

      .dropdown-header-title {
        font-size: 10px;
        font-weight: 600;
        color: #64748B;
        letter-spacing: 1px;
        font-family: 'Inter', sans-serif;
      }

      /* Category Selector */
      .category-selector {
        position: relative;
        display: flex;
        align-items: center;
      }

      .category-selector-button {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        background: #f8f8f8;
        border: 1px solid #E5E5E5;
        border-radius: 6px;
        cursor: pointer;
        font-size: 11px;
        font-weight: 500;
        color: #171717;
        font-family: 'Inter', sans-serif;
        transition: background 0.15s ease, border-color 0.15s ease;
        white-space: nowrap;
      }

      .category-selector-button:hover {
        background: #f0f0f0;
        border-color: #d0d0d0;
      }

      .category-icon {
        color: #64748B;
      }

      .category-name {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .category-chevron {
        color: #64748B;
        transition: transform 0.15s ease;
      }

      .category-chevron.open {
        transform: rotate(180deg);
      }

      .category-menu {
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: 4px;
        min-width: 120px;
        background: #ffffff;
        border: 1px solid #E5E5E5;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        z-index: 1000;
        padding: 4px;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .category-menu-item {
        display: block;
        width: 100%;
        padding: 8px 12px;
        background: transparent;
        border: none;
        border-radius: 4px;
        text-align: left;
        font-size: 12px;
        font-weight: 500;
        color: #171717;
        font-family: 'Inter', sans-serif;
        cursor: pointer;
        transition: background 0.15s ease;
        white-space: nowrap;
      }

      .category-menu-item:hover {
        background: #f8f8f8;
      }

      .category-menu-item.selected {
        background: #fef3e2;
        color: #A16207;
      }

      .dropdown-close {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .dropdown-close:hover {
        background: #f8f8f8;
      }

      .dropdown-close svg {
        color: #171717;
      }

      /* Dropdown header actions container */
      .dropdown-header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      /* Settings button */
      .dropdown-settings {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .dropdown-settings:hover {
        background: #f8f8f8;
      }

      .dropdown-settings svg {
        color: #171717;
      }

      /* Settings overlay */
      .settings-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      /* Settings popup */
      .settings-popup {
        width: 320px;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        padding: 16px;
        box-sizing: border-box;
      }

      /* Settings header */
      .settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 12px;
        border-bottom: 1px solid #E5E5E5;
        margin-bottom: 16px;
      }

      .settings-title {
        font-size: 14px;
        font-weight: 600;
        color: #171717;
        font-family: 'Inter', sans-serif;
      }

      .settings-close {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .settings-close:hover {
        background: #f8f8f8;
      }

      .settings-close svg {
        color: #171717;
      }

      /* Settings content */
      .settings-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .settings-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .settings-section-title {
        font-size: 11px;
        font-weight: 600;
        color: #64748B;
        letter-spacing: 0.5px;
        font-family: 'Inter', sans-serif;
      }

      .settings-actions {
        display: flex;
        gap: 8px;
      }

      .settings-action-btn {
        flex: 1;
        padding: 10px 12px;
        background: #f8f8f8;
        border: 1px solid #E5E5E5;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        color: #171717;
        font-family: 'Inter', sans-serif;
        transition: background 0.15s ease, border-color 0.15s ease;
      }

      .settings-action-btn:hover {
        background: #f0f0f0;
        border-color: #d0d0d0;
      }

      .settings-info {
        font-size: 12px;
        color: #64748B;
        font-family: 'Inter', sans-serif;
      }

      .settings-version {
        font-size: 12px;
        color: #171717;
        font-family: 'Inter', sans-serif;
      }

      /* Dropdown item */
      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #E5E5E5;
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .dropdown-item:hover {
        background: #f8f8f8;
      }

      .dropdown-item.last {
        border-bottom: none;
      }

      .dropdown-item.selected {
        background: #fef3e2;
      }

      .dropdown-item-icon {
        width: 16px;
        height: 16px;
        color: #171717;
      }

      .dropdown-item-text {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .dropdown-item-name {
        font-size: 12px;
        font-weight: 500;
        color: #171717;
        font-family: 'Inter', sans-serif;
      }

      .dropdown-item-preview {
        font-size: 10px;
        color: #64748B;
        font-family: 'Inter', sans-serif;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dropdown-item-arrow {
        width: 12px;
        height: 12px;
        color: #171717;
      }

      /* Empty state */
      .empty-state {
        padding: 24px;
        text-align: center;
      }

      .empty-message {
        font-size: 12px;
        color: #64748B;
        font-family: 'Inter', sans-serif;
      }

      /* Scrollbar styling */
      .dropdown-container::-webkit-scrollbar {
        width: 6px;
      }

      .dropdown-container::-webkit-scrollbar-track {
        background: transparent;
      }

      .dropdown-container::-webkit-scrollbar-thumb {
        background: #ddd;
        border-radius: 3px;
      }

      .dropdown-container::-webkit-scrollbar-thumb:hover {
        background: #ccc;
      }

      /* Footer action area */
      .dropdown-footer {
        padding: 12px;
        border-top: 1px solid #e0e0e0;
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      .dropdown-footer-btn {
        flex: 1;
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #e0e0e0;
        background: #ffffff;
        cursor: pointer;
        font-size: 13px;
        color: #333;
        transition: background 0.15s ease, border-color 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .dropdown-footer-btn:hover {
        background: #f8f8f8;
        border-color: #d0d0d0;
      }

      .dropdown-footer-btn:active {
        background: #f0f0f0;
      }

      .dropdown-footer-btn.primary {
        background: #1890ff;
        border-color: #1890ff;
        color: #ffffff;
      }

      .dropdown-footer-btn.primary:hover {
        background: #40a9ff;
        border-color: #40a9ff;
      }

      .dropdown-footer-btn.primary:active {
        background: #096dd9;
        border-color: #096dd9;
      }

      .dropdown-footer-btn svg {
        width: 16px;
        height: 16px;
      }

      /* Add prompt form */
      .add-prompt-form {
        padding: 12px;
      }

      .add-prompt-form-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .add-prompt-form-title {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }

      .add-prompt-form-close {
        width: 24px;
        height: 24px;
        border: none;
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
        border-radius: 4px;
      }

      .add-prompt-form-close:hover {
        background: #f0f0f0;
        color: #666;
      }

      .add-prompt-field {
        margin-bottom: 12px;
      }

      .add-prompt-label {
        display: block;
        font-size: 12px;
        color: #666;
        margin-bottom: 6px;
      }

      .add-prompt-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
        transition: border-color 0.15s ease;
      }

      .add-prompt-input:focus {
        outline: none;
        border-color: #1890ff;
      }

      .add-prompt-textarea {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
        resize: vertical;
        min-height: 80px;
        font-family: inherit;
      }

      .add-prompt-textarea:focus {
        outline: none;
        border-color: #1890ff;
      }

      .add-prompt-category-select {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
        cursor: pointer;
        background: #ffffff;
      }

      .add-prompt-category-select:focus {
        outline: none;
        border-color: #1890ff;
      }

      .add-prompt-submit {
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 6px;
        background: #1890ff;
        color: #ffffff;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .add-prompt-submit:hover {
        background: #40a9ff;
      }

      .add-prompt-submit:disabled {
        background: #d9d9d9;
        cursor: not-allowed;
      }

      /* Empty state with actions */
      .empty-state-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 16px;
      }

      .empty-state-btn {
        padding: 10px 16px;
        border-radius: 6px;
        border: 1px solid #1890ff;
        background: #ffffff;
        cursor: pointer;
        font-size: 14px;
        color: #1890ff;
        transition: background 0.15s ease;
      }

      .empty-state-btn:hover {
        background: #e6f4ff;
      }

      /* Large dataset hint */
      .more-prompts-hint {
        padding: 8px 12px;
        font-size: 12px;
        color: #999;
        text-align: center;
      }
    `}remove(){this.reactRoot&&(this.reactRoot.unmount(),this.reactRoot=null),this.hostElement&&(this.hostElement.remove(),this.hostElement=null),this.shadowRoot=null}isInjected(){return this.hostElement!==null&&document.body.contains(this.hostElement)}}console.log("[Prompt-Script] Content script loaded on:",window.location.href);const B=new le(Ae),L=new Le;function Ae(n){L.isInjected()&&console.log("[Prompt-Script] Cleaning up existing UI before re-injection"),console.log("[Prompt-Script] Injecting UI near input element"),L.inject(n)}B.start();chrome.runtime.sendMessage({type:T.PING},n=>{if(chrome.runtime.lastError){console.error("[Prompt-Script] Ping failed:",chrome.runtime.lastError.message);return}console.log("[Prompt-Script] Ping response:",n)});chrome.runtime.onMessage.addListener((n,e,t)=>(console.log("[Prompt-Script] Received message:",n.type),n.type===T.GET_STORAGE&&t({success:!0}),!0));window.addEventListener("unload",()=>{B.stop(),L.remove(),console.log("[Prompt-Script] Cleanup complete")});
//# sourceMappingURL=content-script.ts-Dqx2p6-F.js.map
