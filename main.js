// $(document).ready(function(){
//   $(window).scroll(function(){
//       // sticky navbar on scroll script
//       if(this.scrollY > 20){
//           $('.main-nav').addClass("sticky");
//       }else{
//           $('.main-nav').removeClass("sticky");
//       }
      
//       // scroll-up button show/hide script
//       if(this.scrollY > 500){
//           $('.scroll-up-btn').addClass("show");
//       }else{
//           $('.scroll-up-btn').removeClass("show");
//       }
//   });
// });
// document.querySelector(document).ready(function(){
//   document.querySelector(window).scroll(function(){
//       // sticky navbar on scroll script
//       if(this.scrollY > 20){
//           document.querySelector('.main-nav').classList.add("sticky");
//       }else{
//           document.querySelector('.main-nav').removeClass("sticky");
//       }
      
//       // scroll-up button show/hide script
//       if(this.scrollY > 500){
//           document.querySelector('.scroll-up-btn').classList.add("show");
//       }else{
//           document.querySelector('.scroll-up-btn').removeClass("show");
//       }
//   });
// // });
AOS.init({
  duration: 1200,
})
document.querySelector(".testimonial-container").addEventListener("click", slideTestimonial);

let user1 = document.getElementById("user-1");
let user2 = document.getElementById("user-2");
let user3 = document.getElementById("user-3");
let user4 = document.getElementById("user-4");

function slideTestimonial(e) {
  if (e.target.classList.contains("btn")) {
    if (e.target.id == "btn-1") {
      user1.style.left = "50%";
      user2.style.left = "100%";
      user3.style.left = "100%";
      user4.style.left = "100%";
      user2.style.transform = "translateY(-50%)";
      user3.style.transform = "translateY(-50%)";
      user4.style.transform = "translateY(-50%)";
      e.target.classList.add("bg");
      e.target.classList.remove("no-bg");
      e.target.nextElementSibling.classList.add("no-bg");
      e.target.nextElementSibling.nextElementSibling.classList.add("no-bg");
      e.target.nextElementSibling.nextElementSibling.nextElementSibling.classList.add(
        "no-bg"
      );
    }
    if (e.target.id == "btn-2") {
      user1.style.left = "-100%";
      user2.style.left = "50%";
      user3.style.left = "100%";
      user4.style.left = "100%";
      user2.style.transform = "translate(-50%, -50%)";
      user3.style.transform = "translateY(-50%)";
      user4.style.transform = "translateY(-50%)";
      e.target.classList.add("bg");
      e.target.classList.remove("no-bg");
      e.target.previousElementSibling.classList.add("no-bg");
      e.target.nextElementSibling.classList.add("no-bg");
      e.target.nextElementSibling.nextElementSibling.classList.add("no-bg");
    }
    if (e.target.id == "btn-3") {
      user1.style.left = "-100%";
      user2.style.left = "-100%";
      user3.style.left = "50%";
      user4.style.left = "100%";
      user3.style.transform = "translate(-50%, -50%)";
      user4.style.transform = "translateY(-50%)";
      e.target.classList.remove("no-bg");
      e.target.classList.add("bg");
      e.target.previousElementSibling.classList.add("no-bg");
      e.target.previousElementSibling.previousElementSibling.classList.add(
        "no-bg"
      );
      e.target.nextElementSibling.classList.add("no-bg");
    }
    if (e.target.id == "btn-4") {
      user1.style.left = "-100%";
      user2.style.left = "-100%";
      user3.style.left = "-100%";
      user4.style.left = "50%";
      user4.style.transform = "translate(-50%, -50%)";
      e.target.classList.remove("no-bg");
      e.target.classList.add("bg");
      e.target.previousElementSibling.classList.add("no-bg");
      e.target.previousElementSibling.previousElementSibling.classList.add(
        "no-bg"
      );
      e.target.previousElementSibling.previousElementSibling.previousElementSibling.classList.add(
        "no-bg"
      );
    }
  }
}

function squatsClick() {
  window.open("exercises/squats/squats.html", "_self");
}

function legRaisesClick() {
  window.open("exercises/leg-raises/leg-raises.html", "_self");
}

function shoulderPressClick() {
  window.open("exercises/shoulder-press/shoulder-press.html", "_self");
}

function lateralRaisesClick() {
  window.open("exercises/lateral-raises/lateral-raises.html", "_self");
}

function highKneesClick() {
  window.open("exercises/high-knees/high-knees.html", "_self");
}

"use strict";
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay))
const humanize = speed => Math.round(Math.random() * (100 - 30)) + speed
async function typed(opts) {
	let {
		strings, 
		elm, 
		backDelay = 500,
		eraseSpeed = 10,
		typeSpeed = 30,	
		loop = false
	} = opts
	
	do {
		let last = strings.length
		let index = 0

		for (let string of strings) {
			index++

			for (let character of string) {
				await sleep(humanize(typeSpeed))
				elm.innerText += character
			}

			if (!loop && last == index) return

			await sleep(backDelay)

			while (string) {
				await sleep(humanize(eraseSpeed))
				elm.innerText = string = string.slice(0, -1)
			}
		}
	} while (loop)
}

typed({
	elm: document.querySelector(".main-heading-focus"),
	strings: ['Smart.', 'Indoor.', 'Fitness.','Trainer.'],
	// loop: false <-- default
}).then(() => console.log('done with animation'))

