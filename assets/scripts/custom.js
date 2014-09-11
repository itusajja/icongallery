
var Filter = {
    key: null,
    val: null,

    init: function() {
        this.key = $('.filter-key option:selected').val();
    },

    changeKey: function(newKey){

        // Delete list
        $('.list-icons').html('');

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
    results: [],
    renderLength: 12,
    $elList: $('.list-icons'),
    $elShowMore: $('.show-more'),
    $template: $('#list-icons-template').html(),



    //var template = $('#template').html();
    //Mustache.parse(template);   // optional, speeds up future uses
    //var rendered = Mustache.render(template, {name: "Luke"});
    //$('#target').html(rendered);


    intialize: function(jsonResponse) {
        this.data = jsonResponse;
    },

    // Create data for rendering the results
    findMatches: function() {

        // Reset current results
        this.$elList.html('');
        this.$elShowMore.hide();
        this.results = [];

        // Loop over each object of the original data
        for (var i = 0; i < this.data.length; i++) {

            // Get year
            var year = new Date(this.data[i].date).getFullYear();

            // Amongst all the icons, find the ones that match the criteria
            var matches = false;

            switch(Filter.key) {
                case 'tags':
                    if( this.data[i].tags ) {
                        tags = this.data[i].tags.split(', ');

                        if( $.inArray(Filter.val, tags) > -1 ) {
                            matches = true;
                        }
                    }
                    break;
                case 'search':
                    // Use fuzzy string match to search title
                    var f = FuzzySet([this.data[i].title])
                    var result = f.get(Filter.val, [[0]]); // return 0 in score if nothing
                    if(result[0][0] > .4) {
                        matches = true;
                    }
                default:
                    if(this.data[i][Filter.key] == Filter.val) {
                        matches = true;
                    }
            }

            // If they match, add them to the render data
            if(matches){
                this.results.push(
                    {
                        title: this.data[i].title,
                        link: year + '/' + this.data[i].slug + '/',
                        icon: this.data[i].slug + '-' + year
                    }
                );
            }
        };

        console.log('Found '+this.results.length+' matches')
    },

    // Render more, or render new
    render: function(){
        if(this.results.length > this.renderLength) {

            // pop off the data we need
            var renderData = this.results.splice(0, this.renderLength);

            // render it
            this.$elList.append( Mustache.render(this.$template, {icons: renderData}) );

            // reveal show more button
            this.$elShowMore.show();
        }
        else {
            // Render what's left
            this.$elList.append( Mustache.render(this.$template, {icons: this.results}) );

            // Hide the show more
            this.$elShowMore.hide();
        }
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


    $('select.filter-key').on('change', function(){
        Filter.changeKey( $(this).val() );

        // Reset the <select> for the value
        $('.filter-val option:selected').each(function(){
            $(this).attr('selected', false);
        });
    });

    $('select.filter-val').on('change', function(){
        Filter.changeVal( $(this).val() );
        Icons.findMatches();
        Icons.render();
    });

    $('#search').on('submit', function(e){
        e.preventDefault();
        Filter.changeVal( $(this).find('input').val() );
        Icons.findMatches();
        Icons.render();
    });

    $('.show-more').on('click', function(e){
        e.preventDefault();
        Icons.render();
    });

    //Icons.render();

});
