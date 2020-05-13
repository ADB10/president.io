const slider = document.querySelector('#hand');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
});
slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
});
slider.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 3; //scroll-fast
    slider.scrollLeft = scrollLeft - walk;
});

// transistion e1 > e2 avec display e2 = display
function animation_transition(e1, e2, display){
    $('#' + e1).css('opacity', '0')
    $('#' + e2).css('display', display)
    setTimeout(function(){
        $('#' + e1).css('display', 'none')
        $('#' + e2).css('opacity', '1')
    }, 500)
}

let historic_interface_open = true

$('#historic .collapse').click(function(){
    if(historic_interface_open){
        $('#game').css('grid-template-columns', 'auto 35px')
        $('#historic > *:not(:first-child)').css('display', 'none')
        $('#historic i.close').css('display', 'none')
        $('#historic i.open').css('display', 'inherit')
    } else {
        $('#game').css('grid-template-columns', 'auto 400px')
        $('#historic > *:not(:first-child)').css('display', 'grid')
        $('#historic i.close').css('display', 'inherit')
        $('#historic i.open').css('display', 'none')
    }
    historic_interface_open = !historic_interface_open
})