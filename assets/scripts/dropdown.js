// This is the one of the only scripts needed on every page
// It controls the dropdown in the header
var el = document.querySelector('.dropdown__trigger');
el.addEventListener('click', function(e){
    e.stopPropagation();
    toggleClass(this.parentNode, 'dropdown--active');
});
var body = document.getElementsByTagName('body');
body[0].addEventListener('click', function(e){
    removeClass(el.parentNode, 'dropdown--active');
});
function removeClass(el, className){
    if (el.classList){
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
}
function toggleClass(el, className){
    if (el.classList) {
        el.classList.toggle(className);
    } else {
        var classes = el.className.split(' ');
        var existingIndex = classes.indexOf(className);

        if (existingIndex >= 0){
            classes.splice(existingIndex, 1);
        } else {
            classes.push(className);
            el.className = classes.join(' ');
        }
    }
}