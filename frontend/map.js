const { div } = van.tags

const Popover = () => {
    return div({ class: 'popover'},
        'content'
    )
}

document.getElementById('caloocan-map').addEventListener('load', function(){
    svgPanZoom('#caloocan-map', {
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: true,
        center: true,
        // viewportSelector: document.getElementById('demo-tiger').querySelector('#g4')
        // this option will make library to misbehave. Viewport should have no transform attribute
    });
})

console.log('van')
van.add(document.getElementById('asdasd'), Popover())

const popover = document.querySelectorAll('.popover')[0]

document.addEventListener('mousemove', fn, false);
document.addEventListener("mouseout", function(event){
    if (event.target.classList.contains("map-brgys")) {
        popover.style.display = 'none';
    }
});
document.addEventListener("mouseenter", function(event){
    if (event.target.classList.contains("map-brgys")) {
        popover.style.display = 'block';
    }
});

function fn(e) {
    if (e.target.classList.contains('map-brgys')) {
        popover.style.display = 'block';
        popover.style.left = e.pageX + 'px';
        popover.style.top = e.pageY + 'px';
    }
}