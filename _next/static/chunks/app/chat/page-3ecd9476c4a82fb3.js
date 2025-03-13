(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[929],{5981:function(e,t,r){Promise.resolve().then(r.bind(r,5055))},5055:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return u}});var s=r(7437),a=r(2265);function l(){let[e,t]=(0,a.useState)(!1);return(0,a.useEffect)(()=>{let e="true"===localStorage.getItem("darkMode")||window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;t(e),e?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")},[]),(0,s.jsx)("button",{onClick:()=>{let r=!e;t(r),localStorage.setItem("darkMode",r.toString()),r?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")},className:"p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700",children:e?(0,s.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,s.jsx)("circle",{cx:"12",cy:"12",r:"5"}),(0,s.jsx)("line",{x1:"12",y1:"1",x2:"12",y2:"3"}),(0,s.jsx)("line",{x1:"12",y1:"21",x2:"12",y2:"23"}),(0,s.jsx)("line",{x1:"4.22",y1:"4.22",x2:"5.64",y2:"5.64"}),(0,s.jsx)("line",{x1:"18.36",y1:"18.36",x2:"19.78",y2:"19.78"}),(0,s.jsx)("line",{x1:"1",y1:"12",x2:"3",y2:"12"}),(0,s.jsx)("line",{x1:"21",y1:"12",x2:"23",y2:"12"}),(0,s.jsx)("line",{x1:"4.22",y1:"19.78",x2:"5.64",y2:"18.36"}),(0,s.jsx)("line",{x1:"18.36",y1:"5.64",x2:"19.78",y2:"4.22"})]}):(0,s.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:(0,s.jsx)("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"})})})}function n(e){let{collapsed:t,setCollapsed:r,openSettings:n}=e,[o,i]=(0,a.useState)("gpt"),[d,c]=(0,a.useState)("API Key Reqd for ChatGPT"),[h,u]=(0,a.useState)(!1);(0,a.useEffect)(()=>{let e=localStorage.getItem("gpt-api-key"),t=localStorage.getItem("claude-api-key");"gpt"===o?c(e?"ChatGPT API Key set":"API Key Reqd for ChatGPT"):"claude"===o?c(t?"Claude API Key set":"API Key Reqd for Claude"):c("".concat(o.charAt(0).toUpperCase()+o.slice(1)," (Free)"))},[o]);let x=!t||h;return(0,s.jsxs)("div",{className:"sidebar-container ".concat(x?"w-64":"w-0"," transition-all duration-300 ease-in-out relative"),onMouseLeave:()=>u(!1),children:[(0,s.jsxs)("div",{className:"sidebar fixed h-full bg-slate-50 dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col ".concat(x?"w-64 opacity-100":"w-0 opacity-0 overflow-hidden"),onMouseEnter:()=>u(!0),children:[(0,s.jsxs)("div",{className:"flex items-center justify-between mb-6",children:[(0,s.jsx)("h1",{className:"text-xl font-bold",children:"Chat"}),(0,s.jsx)("button",{className:"p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700",onClick:()=>r(!t),title:t?"Pin sidebar open":"Collapse sidebar",children:(0,s.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:(0,s.jsx)("path",{d:"M15 18l-6-6 6-6"})})})]}),(0,s.jsxs)("div",{className:"mb-6",children:[(0,s.jsx)("label",{className:"block text-sm font-medium mb-2",children:"Select Model"}),(0,s.jsxs)("select",{className:"w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2",value:o,onChange:e=>i(e.target.value),children:[(0,s.jsx)("option",{value:"gpt",children:"ChatGPT (API Key Reqd)"}),(0,s.jsx)("option",{value:"claude",children:"Claude (API Key Reqd)"}),(0,s.jsx)("option",{value:"gemini",children:"Gemini (Free)"}),(0,s.jsx)("option",{value:"grok",children:"Grok (Free)"})]})]}),(0,s.jsx)("div",{className:"flex-1",children:(0,s.jsx)("button",{className:"w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md",children:"New Chat"})}),(0,s.jsxs)("div",{className:"mt-auto pt-4 border-t dark:border-gray-700 flex flex-col",children:[(0,s.jsx)("div",{className:"text-sm text-amber-600 dark:text-amber-400",children:d}),(0,s.jsxs)("div",{className:"flex justify-end mt-2 space-x-2",children:[(0,s.jsx)(l,{}),(0,s.jsx)("button",{className:"p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800",onClick:n,children:(0,s.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,s.jsx)("path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"}),(0,s.jsx)("circle",{cx:"12",cy:"12",r:"3"})]})})]})]})]}),t&&(0,s.jsx)("div",{className:"fixed top-0 left-0 w-16 h-full z-10",onMouseEnter:()=>u(!0)})]})}function o(e){let{onClose:t}=e,[r,l]=(0,a.useState)(""),[n,o]=(0,a.useState)("");return(0,a.useEffect)(()=>{l(localStorage.getItem("gpt-api-key")||""),o(localStorage.getItem("claude-api-key")||"")},[]),(0,s.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:(0,s.jsxs)("div",{className:"bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md",children:[(0,s.jsxs)("div",{className:"flex justify-between items-center mb-4",children:[(0,s.jsx)("h2",{className:"text-xl font-bold",children:"API Key Settings"}),(0,s.jsx)("button",{onClick:t,className:"text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",children:(0,s.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,s.jsx)("path",{d:"M18 6 6 18"}),(0,s.jsx)("path",{d:"m6 6 12 12"})]})})]}),(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsxs)("div",{className:"grid grid-cols-4 items-center gap-4",children:[(0,s.jsx)("label",{htmlFor:"gpt-key",className:"text-right",children:"ChatGPT API Key"}),(0,s.jsx)("input",{id:"gpt-key",type:"password",className:"col-span-3 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600",placeholder:"sk-...",value:r,onChange:e=>l(e.target.value)})]}),(0,s.jsxs)("div",{className:"grid grid-cols-4 items-center gap-4",children:[(0,s.jsx)("label",{htmlFor:"claude-key",className:"text-right",children:"Claude API Key"}),(0,s.jsx)("input",{id:"claude-key",type:"password",className:"col-span-3 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600",placeholder:"sk-ant-...",value:n,onChange:e=>o(e.target.value)})]}),(0,s.jsx)("div",{className:"text-sm text-gray-500 dark:text-gray-400",children:(0,s.jsx)("p",{children:"Gemini and Grok are available for free and do not require API keys."})})]}),(0,s.jsx)("div",{className:"mt-6 flex justify-end",children:(0,s.jsx)("button",{onClick:()=>{localStorage.setItem("gpt-api-key",r),localStorage.setItem("claude-api-key",n),t()},className:"bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-md",children:"Save changes"})})]})})}function i(e){let{children:t}=e,[r,l]=(0,a.useState)(!1),[i,d]=(0,a.useState)(!1);return(0,s.jsxs)("div",{className:"flex h-screen bg-white dark:bg-gray-900 dark:text-white",children:[(0,s.jsx)(n,{collapsed:i,setCollapsed:d,openSettings:()=>l(!0)}),(0,s.jsx)("main",{className:"flex-1 flex flex-col",children:t}),r&&(0,s.jsx)(o,{onClose:()=>l(!1)})]})}function d(e){let{role:t,content:r}=e,[l,n]=(0,a.useState)(!1);return(0,s.jsxs)("div",{className:"".concat("user"===t?"user-message":"assistant-message"," relative group"),children:[(0,s.jsx)("div",{className:"absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",children:(0,s.jsx)("button",{onClick:()=>{navigator.clipboard.writeText(r),n(!0),setTimeout(()=>n(!1),2e3)},className:"p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700",title:"Copy to clipboard",children:l?(0,s.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:(0,s.jsx)("path",{d:"M20 6 9 17l-5-5"})}):(0,s.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,s.jsx)("rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}),(0,s.jsx)("path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"})]})})}),(0,s.jsx)("div",{className:"whitespace-pre-wrap",children:r})]})}function c(e){let{messages:t,isLoading:r}=e,l=(0,a.useRef)(null);return(0,a.useEffect)(()=>{l.current&&(l.current.scrollTop=l.current.scrollHeight)},[t]),(0,s.jsxs)("div",{ref:l,className:"chat-container flex-1 space-y-4 p-4 overflow-y-auto",children:[0===t.length?(0,s.jsx)("div",{className:"flex items-center justify-center h-full",children:(0,s.jsxs)("div",{className:"text-center",children:[(0,s.jsx)("h2",{className:"text-2xl font-bold mb-2",children:"Welcome to Chat"}),(0,s.jsx)("p",{className:"text-gray-500 dark:text-gray-400",children:"Select a model and start chatting"})]})}):t.map((e,t)=>(0,s.jsx)(d,{role:e.role,content:e.content},t)),r&&(0,s.jsx)("div",{className:"assistant-message flex items-center",children:(0,s.jsx)("div",{className:"loading"})})]})}function h(e){let{onSendMessage:t,isLoading:r}=e,[l,n]=(0,a.useState)(""),o=(0,a.useRef)(null);(0,a.useEffect)(()=>{o.current&&(o.current.style.height="auto",o.current.style.height="".concat(Math.min(o.current.scrollHeight,200),"px"))},[l]);let i=e=>{e.preventDefault(),l.trim()&&!r&&(t(l),n(""),o.current&&(o.current.style.height="auto"))};return(0,s.jsx)("div",{className:"border-t dark:border-gray-700 p-4 mt-auto",children:(0,s.jsxs)("form",{onSubmit:i,className:"message-input-container",children:[(0,s.jsx)("textarea",{ref:o,className:"w-full min-h-[48px] p-3 pr-12 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600",placeholder:"Type your message...",value:l,onChange:e=>n(e.target.value),onKeyDown:e=>{"Enter"!==e.key||e.shiftKey||(e.preventDefault(),i(e))},disabled:r,rows:1}),(0,s.jsx)("button",{type:"submit",className:"send-button-claude",disabled:r||!l.trim(),"aria-label":"Send message",children:(0,s.jsxs)("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[(0,s.jsx)("circle",{cx:"12",cy:"12",r:"10",fill:l.trim()?"#4B5563":"#9CA3AF"}),(0,s.jsx)("path",{d:"M12 16V8M8 12l4-4 4 4",stroke:"white",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]})})]})})}function u(){let[e,t]=(0,a.useState)([]),[r,l]=(0,a.useState)(!1),n=async e=>{let r={role:"user",content:e};t(e=>[...e,r]),l(!0);try{let r=localStorage.getItem("selectedModel")||"gpt",s=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e,model:r,apiKey:localStorage.getItem("".concat(r,"-api-key"))||""})});if(!s.ok)throw Error("Failed to send message");let a=await s.json(),l={role:"assistant",content:a.content};t(e=>[...e,l])}catch(r){console.error("Error sending message:",r);let e={role:"assistant",content:"Sorry, there was an error processing your message. Please try again."};t(t=>[...t,e])}finally{l(!1)}};return(0,s.jsxs)(i,{children:[(0,s.jsx)(c,{messages:e,isLoading:r}),(0,s.jsx)(h,{onSendMessage:n,isLoading:r})]})}}},function(e){e.O(0,[971,117,744],function(){return e(e.s=5981)}),_N_E=e.O()}]);