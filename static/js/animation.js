const observer = new IntersectionObserver((entries)=> {
    entries.forEach((entry) => {
        if (entry.isIntersecting){
            entry.target.classList.add('show')       
        }else {
            entry.target.classList.remove('show')
        }
    })
})
const observer2 = new IntersectionObserver((entries)=> {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting){
            entry.target.classList.add('show')       
        }else {
            entry.target.classList.remove('show')
        }
    })
})
const observer3 = new IntersectionObserver((entries)=> {
    entries.forEach((entry) => {
    
        if (entry.isIntersecting){
            entry.target.classList.add('show-down')       
        }else {
            entry.target.classList.remove('show-down')
        }
    })
})




const hiddenElements = document.querySelectorAll('.hidden-left')
hiddenElements.forEach((el) => observer.observe(el))
const hiddenElements2 = document.querySelectorAll('.hidden-right')
hiddenElements2.forEach((el) => observer2.observe(el))
const hiddenElements3 = document.querySelectorAll('.hidden-down')
hiddenElements3.forEach((el) => observer3.observe(el))
