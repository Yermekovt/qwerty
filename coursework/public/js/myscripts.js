//function that will be triggered when the page is loaded
$(function () {
  //when the search form is submitted, send the value of a search input to getResultFromOMDB function
  $('#registerForm').submit(function () {
    alert('Thank you for registration. You will be redirected to login page');
  })

  $('#searchform').submit(function () {
    var searchterms = $('#searchterms').val();
    getResultsFromOMDB(searchterms);
    return false;
  })
});

//get json from an api and pass it to addResultsDiv function
function getResultsFromOMDB(searchterms) {

  var url = "http://www.omdbapi.com/?apikey=8dbb4272&s=" + searchterms;

  $.getJSON(url, function(jsondata) {
    addResultsDiv(jsondata);
  });

}

//this function empies the #films container
function addResultsDiv(jsondata) {
  $('#films').empty();

  //if the jsondata.Search != null, then take necessary information and append it #films container on client side
  if (jsondata.Search) {
    for(var i = 0; i < jsondata.Search.length; i++) {
      var title = jsondata.Search[i].Title;
      var poster = jsondata.Search[i].Poster;
      var type = jsondata.Search[i].Type;

      img = "img" //this variable stores the name of class; it will be applied below
      var film = "<div class = '" + img + "'>" + "<div class='" + type + "'>" +
              "<h2>" + title + "</h2>"  +
              "<img src='" + poster + "'/>" +
              "</div>" + "</div>"
      $('#films').append(film);
    }
  }
  //if the jsondata.Search is empty, then 'Nothing was found' text will appear on client side
  else {
    var sth = "<p>Nothing was found</p>"
    $('#films').append(sth);
  } 
}
