


// this function takes the parent tag and adds "letter" divs to create a page layout
function snip(){
    var max_pages = 20;
    var page_count = 1;    // get parent tag containing our artice
    var externalTag = $('dt-article');
    // create array with all child nodes for our article
    var children = externalTag.children().toArray();
    // create a div that is laid out as a page and add all children to it
    var letterDiv = document.createElement('div');
    letterDiv.className = "letter";
    while (externalTag.children().length > 0) {
        letterDiv.appendChild($(externalTag)[0].firstChild);
    }
    // append new div to parent node
    externalTag.append(letterDiv);

    while(children.length > 0 && page_count <= max_pages){
        page_count++;
        // first while loop which creates new pages as long as we have children left to place
        var newpage = document.createElement('div');
        newpage.className = "letter";
        // insert the new page node
        externalTag.append(newpage);
        // variables to store the current length of our new page in
        var long = $(letterDiv).prop('scrollHeight') - Math.ceil($(letterDiv).innerHeight());
        var wide = $(letterDiv).prop('scrollWidth') - Math.ceil($(letterDiv).innerWidth());
        while ((long > 0 || wide > 0) && children.length > 0) {
            var child = children.pop();
            $(child).detach();
            newpage.prepend(child);
            if ($(child).innerHeight() != 0){
                long = $(letterDiv).prop('scrollHeight') - Math.ceil($(letterDiv).innerHeight());

                wide = $(letterDiv).prop('scrollWidth') - Math.ceil($(letterDiv).innerWidth());
            }
        }
        // check if page ended with a new header, if so, move it to the next page
        if ($(letterDiv).children().last().is("h2")){
            var heading = $(letterDiv).children().last();
            $(heading).detach();
            $(newpage).prepend(heading);
        }


        letterDiv = newpage;
        children = $(newpage).children().toArray();

    }
    if ($(letterDiv).length){
        $(letterDiv).detach();
    }

}

function unsnip(){
	$('.letter, .p1col1, .p1col2').each(function() {
		// console.log("letter div position " + $(this).html());
		var str = $(this).html();
		$(this).before(str);
		$(this).empty();
		$(this).detach();
		console.log("div content after empty " + $(this).html());
	});

}



// currently the first layout is set to distill since it generates the references
var currentLayout = "distill";
var distill_refs, acm_refs;
var ref_header;
var distill_authors, acm_authors, title;



function switchLayout() {
console.log("switching layouts...");
if (tangle) {
  tangle.cleanup();
}
tangle = null;

// switching to distill layout
if (currentLayout == "ACM"){
  // disable ACM css
  $('link[href="pubcss-acm-sigchi.css"]').prop('disabled', true);
  $('link[href="style.css"]').prop('disabled', true);

  // remove page divs
  unsnip();
  // show distill style references and authors
  $(acm_refs).hide();
  $('.distill-bib').show();
  $('.acm-bib').hide();
  $('dt-byline').show();
  $('header').hide();
  $('#acm, #terms').hide();
  $('dt-article').prepend($('.title'));

  // setup tangle for the interactive text
  setUpTangle();
  // get the distill js
  $.getScript("https://distill.pub/template.v1.js");
  $('style').prop('disabled', false);

  // store that we switched layout
  currentLayout = "distill";
  $('#layout_button').html('Switch to ACM layout');

} else {
  // switching to ACM layout
  
  // remove distill js file
  removejscssfile("template.v1.js", "js");
  $('style').prop('disabled', true);
  $('link[href="pubcss-acm-sigchi.css"]').prop('disabled', false);
  $('link[href="style.css"]').prop('disabled', false);
  // show ACM style references and authors
  $('.distill-bib').hide();
  $('.acm-bib').show();
  // $(acm_authors).show();
  $('header').show();
  $('dt-byline').hide();
  $('#acm, #terms').show();
  $('header').prepend($('.title'));

  // insert page divs
  setUpTangle();
  snip();

  currentLayout = "ACM";
  $('#layout_button').html('Switch to Distill layout');

}
console.log("switched layout to " + currentLayout);
}

// setup to enable switching between layouts;
// - makes sure that the references created by distill are available
//   for the ACM layout as well;
// - assigns the distill and ACM versions of author listing to variables
//   to show and hide them when switching
$(document).ready(function(){
$('link[href="pubcss-acm-sigchi.css"]').prop('disabled', true);
$('link[href="style.css"]').prop('disabled', true);

  // references
  distill_refs = $('dt-bibliography').parent();
  acm_refs = $(distill_refs).clone();
  $(distill_refs).addClass("distill-bib");
  $(acm_refs).addClass("acm-bib");
  ref_header = $(acm_refs).find('h3');
  $(ref_header).replaceWith($('<h2>' + $(ref_header).html() + '</h2>'));
  $('dt-article').append(acm_refs);

  // authors
  distill_authors = $('dt-byline');
  // acm_authors = $('.authors.col-2');
  // $(acm_authors).hide();
  $(acm_refs).hide();
  $('#acm, #terms').hide();

  $('dt-article').prepend($('.title'));
  $('header').hide();


})




// function to remove a javascript file
function removejscssfile(filename, filetype){
  var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
  var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
  var allsuspects=document.getElementsByTagName(targetelement)
  for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
  if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
      allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
  }
}