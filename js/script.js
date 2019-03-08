$(document).ready(function(){
  $('#searchBtn').click(function(){
    searchByKeyWord();
  });


  $('form#searchForm').submit(function(e){
    e.preventDefault();
    searchByKeyWord();
  });
  
  $('#prevPage').click(function(){
    console.log('Previous: ' + $(this).attr("data-page"));
    if($(this).data("page") != undefined){
      
      handleNewPage($(this).attr("data-page"), displayResults);
    }
  });

  $('#nextPage').click(function(){
    console.log('Next: ' + $(this).attr("data-page"));
    if($(this).data("page") != undefined){
      
      handleNewPage($(this).attr("data-page"), displayResults);
    }
  });

  function searchByKeyWord() {
    let searchTerm = $('#searchBox').val();
    if (searchTerm != "")

      handleFetch(searchTerm, displayResults);
  }

  function handleFetch(searchTerm, callback) {
    //The fetching code:
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAkXbtElbBFeYVpIGnNGOnmLQmRMdyjW1c&q=${searchTerm}&type=video&maxResults=10`;

    fetch(url, {method: "GET", path: "/youtube/v3/search"}) //Could be fetch(url, {method: "GET"})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new error("Try again later...");
        }
      })
      .then(responseJson => {
        $("#searched").val(searchTerm);
        callback(responseJson);
      })
      .catch(err => {

        $('#itemList').html(err.message);
        console.log(err);
      })
  }

  function handleNewPage(pageToken, callback){
    let searchTerm = $("#searched").val();  
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAkXbtElbBFeYVpIGnNGOnmLQmRMdyjW1c&pageToken=${pageToken}&q=${searchTerm}&type=video&maxResults=10`;

    fetch(url, {method: "GET", path: "/youtube/v3/search"}) //Could be fetch(url, {method: "GET"})
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new error("Try again later...");
        }
      })
      .then(responseJson => {
        callback(responseJson);
      })
      .catch(err => {

        $('#itemList').html(err.message);
        console.log(err);
      })
  }

  function displayResults(data) {
    let counter = 0;
    console.log(data);
    $('#itemList').html(''); //Empty the html of that section

    jQuery.each(data.items, function(i, video){
      let title = video.snippet.title;
      let thumbnail = video.snippet.thumbnails.default.url;
      let videoUrl = video.id.videoId;

      $('#itemList').append(`
        <a href="https://www.youtube.com/watch?v=${videoUrl}">
          <div class="media mb-3">
            <img class="mr-3" src="${thumbnail}" alt="Thumbnail">
            <div class="media-body">
              <h5 class="mt-0">${title}</h5>
            </div>
          </div>
        </a>`);

    });

    if(data.prevPageToken){
      $("#prevPage").show().attr("data-page", data.prevPageToken);
    }else{
      $("#prevPage").hide();
    }

    if(data.nextPageToken){
      $("#nextPage").show().attr("data-page", data.nextPageToken);
    }else{
      $("#nextPage").hide();
    }

  }

});





