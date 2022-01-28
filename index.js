
const btn = document.querySelector('.btn-show');
const module = document.querySelector('.module');
const closeBtn = document.querySelector('.btn-close');

btn.addEventListener("click", () =>{
 module.classList.remove('hidden');
});
closeBtn.addEventListener("click", () =>{
    module.classList.add('hidden');
   });