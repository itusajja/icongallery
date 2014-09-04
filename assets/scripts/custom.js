
var Filter = {
    key: null,
    val: null,

    init: function() {
        this.key = $('.filter-key option:selected').val();
    },

    changeKey: function(newKey){

        // Delete list
        $('.list-icons').html('<li class="list-icons__zero-state">Choose your options.</li>');

        // Hide old
        $('#' + this.key).hide();
        
        // Set and show new
        this.key = newKey.trim();
        $('#' + this.key).show();

        // Log it
        console.log('Changed type to: ' + this.key);
    },

    changeVal: function(newVal){
        this.val = newVal.trim(); 
        console.log('Changed type value to: ' + this.val);     
    }
}

var Icons = {
    data: [],
    renderData: [],
    $listEl: $('.list-icons'),
    $template: $('#list-icons-template').html(),


    //var template = $('#template').html();
    //Mustache.parse(template);   // optional, speeds up future uses
    //var rendered = Mustache.render(template, {name: "Luke"});
    //$('#target').html(rendered);


    intialize: function(jsonResponse) {
        this.data = jsonResponse;
    },

    render: function(){
        this.renderData = [];

        for (var i = 0; i < this.data.length; i++) {
            // Get year
            var year = new Date(this.data[i].date).getFullYear();

            // Amongst all the icons, find the ones that match the criteria
            var t = false;

            switch(Filter.key) {
                case 'tags':
                    if( this.data[i].tags ) {
                        tags = this.data[i].tags.split(', ');

                        if( $.inArray(Filter.val, tags) > -1 ) {
                            t = true; 
                            console.log('tag found! '+Filter.val + ' ' + tags);   
                        }
                    }
                    break;
                case 'search':
                    // Use fuzzy string match to search title
                    var f = FuzzySet([this.data[i].title])
                    var result = f.get(Filter.val, [[0]]); // return 0 in score if nothing
                    if(result[0][0] > .5) {
                        t = true;
                    }
                default:
                    if(this.data[i][Filter.key] == Filter.val) {
                        t = true;
                        console.log('default');
                    }
            }
                
            if(t){
                this.renderData.push(
                    {
                        title: this.data[i].title,
                        link: year + '/' + this.data[i].slug + '/',
                        icon: this.data[i].slug + '-' + year
                    }
                );
            }
        };
        var rendered = Mustache.render(this.$template, {icons: this.renderData});
        this.$listEl.html( rendered );
    }
};

$(document).ready(function(){


    //$.getJSON("/data.json", Icons.intialize);
    $.ajax({
        url: '/data.json',
        dataType: 'json',
        async: false,
        success: function(data) {
            Icons.intialize(data);
        }
    });

    // Initialize
    Filter.init();
    
    
    $('.filter-key').on('change', function(){
        Filter.changeKey( $(this).val() );

        // Reset the <select> for the value
        $('.filter-val option:selected').each(function(){
            $(this).attr('selected', false);
        });
    });

    $('.filter-val').on('change', function(){
        Filter.changeVal( $(this).val() );
        Icons.render();
    });

    $('#search').on('submit', function(e){
        e.preventDefault();
        Filter.changeVal( $(this).find('input').val() );
        Icons.render();
    });

    //Icons.render();

});