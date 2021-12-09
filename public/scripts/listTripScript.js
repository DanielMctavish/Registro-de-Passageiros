let listTrip = document.querySelectorAll("#tripLi");
listTrip.forEach(li=>{
    console.log(li)
    li.style.transition = '5s';
    li.style.opacity = '.7';
})
