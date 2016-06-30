$(document).ready(function() {
    var key = '7cc31418c2d54ed6a70ffffd90b9b80c';

    var searchUrl = 'https://api.nytimes.com/svc/movies/v2/reviews/search.json';
    var searchArticleUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    var listMovieTemplate = $('#list-movie-template').html();
    var listArticleTemplate = $('#list-article-template').html();

    function searchMovie(title, offset, callback) {
        var url = searchUrl + '?' + $.param({
            'api-key': key,
            'offset': offset,
            'query': title
        });
        $.ajax({
            url: url,
            method: 'GET'
        }).done(function(data) {
            callback(data)
        });
    }

    function searchArticle(title, callback) {
        var url = searchArticleUrl + '?' + $.param({
            'api-key': key,
            'q': title
        });
        $.ajax({
            url: url,
            method: 'GET'
        }).done(function(data) {
            callback(data)
        });
    }


    $('form').on('submit', function(e) {
        e.preventDefault();
        var f = $(this);
        var title = f.find('input[name="title"]').val();
        var source = f.find('select[name="source"]').val();
        if (source === 'movie') {
            searchMovie(title, 0, function(data) {
                var container = $('#listing ul');
                container.empty();
                for (var i=0; i < data.results.length; i++) {
                    var r = data.results[i];
                    container.append(Mustache.render(listMovieTemplate, r));
                }
                if (data.results.length === 0) {
                    container.html('No Reviews found for \'' + title + '\'');
                }
            });
        }   else {
            searchArticle(title, function(data) {
                console.log(data);
                var container = $('#listing ul');
                container.empty();
                for (var i=0; i < data.response.docs.length; i++) {
                    var r = data.response.docs[i];
                    r.img = 'images/2016/06/30/us/30fd-trumpoutsource/30fd-trumpoutsource-master768.jpg';
                    if (r.multimedia.length > 0) {
                        r.img = r.multimedia[0].url;
                    }
                    container.append(Mustache.render(listArticleTemplate, r));
                }
                if (data.response.docs.length === 0) {
                    container.html('No Articles found for \'' + title + '\'');
                }
            });
        }
    });

    $('form').trigger('submit');
});
