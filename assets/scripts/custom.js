var Filter = {
    key: null,
    val: null,

    init: function() {
        // If there's a query parameter in the URL, load that
        // otherwise load search as the default
        var query = location.search.substring(1);
        if(query != '') {
            query = query.split('=');
            this.key = query[0];
            this.val = query[1];
        } else {
            this.key = 'search',
            this.val = '';
        }
        // load the relevant key/vals on page load
        $('.filter-key option[value=' + this.key + ']').attr('selected', true);
        this.changeKey(this.key);
        this.changeVal(this.val);

        // If there's a parameter passed in, load that
        if(query != ''){
            $('#' + this.key + ' option[value=' + this.val + ']').attr('selected', true);        
            Icons.findMatches();
            Icons.render();
        }
    },

    changeKey: function(newKey){

        // Delete list
        $('.list-icons').html('');

        // Hide old
        $('#' + this.key).hide();

        // Set and show new
        this.key = newKey.trim();
        $('#' + this.key).css('display', 'inline-block');

        // Log it
        console.log('Changed type to: ' + this.key);
    },

    changeVal: function(newVal){
        this.val = newVal.trim();
        console.log('Changed type value to: ' + this.val);

        //location.search = this.key + '=' + this.val;
    }
}

var Icons = {
    data: [],
    results: [],
    renderLength: 20,
    $elList: $('.list-icons'),
    $elShowMore: $('.show-more'),
    $template: $('#list-icons-template').html(),
    $templateZero: $('#list-icons-zero-template').html(),

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
                // Append 'searchScore' to last object if we're searching
                if(Filter.key == 'search') {
                    this.results[this.results.length-1].searchScore = result[0][0];
                }
            }
        };

        // Sort the array by fuzzy score if applicable
        if(Filter.key == 'search') {
            this.results.sort(function(a,b){
                if (a.searchScore < b.searchScore) {
                    return 1;
                }
                if (a.searchScore > b.searchScore) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
        }

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
        } else if (this.results.length == 0) {
            this.$elList.append( Mustache.render(this.$templateZero, {}) );
            console.log(Mustache.render(this.$templateZero, {}));
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
        Icons.$elShowMore.hide();

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

});
