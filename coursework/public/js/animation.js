

function slowScroll(id) {
  //animating whole body
  $('html, body').animate({
    scrollTop: $(id).offset().top //scroll distance
  }, 100); //scroll speed = 500ms
}

//function when the page is scrolled
$(document).on("scroll", function () {
  if($(window).scrollTop() === 0)
    //removing class
    $("header").removeClass("scrolled");
  else
    //adding class
    $("header").attr("class", "scrolled");
});
