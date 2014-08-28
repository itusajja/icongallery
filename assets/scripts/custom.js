(function($){
 
    $.fn.shuffle = function() {
 
        var allElems = this.get(),
            getRandom = function(max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function(){
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
           });
 
        this.each(function(i){
            $(this).replaceWith($(shuffled[i]));
        });
 
        return $(shuffled);
 
    };
 
})(jQuery);

$(document).ready(function(){
    $relatedIcons = $('#related-icons');
    $listItems = $relatedIcons.find('li');
    
    $listItems.shuffle();
    
    $listItems.each(function(i, el){
        if(i < 10) {
            el[0].show();
            
        }
    }); 

    $relatedIcons.show();
});
// show only the first 10
