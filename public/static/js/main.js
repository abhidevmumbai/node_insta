$(document).ready(function(){

	$(window).scroll(function(){
		// Load next batch only when the user scrolls down to the bottom
		if(window.pageYOffset + window.innerHeight >= $('#photo-list li:last')[0].offsetTop) {
			if(feeds.timeout) {
				//console.log('cont height : ' + $(".container").innerHeight());
		    	window.clearTimeout(feeds.timeout);
		    	delete feeds.timeout;
		    }
			feeds.timeout = window.setTimeout(feeds.fetch, 500);
		}
	});
});

// Lazy load the images
var feeds = {
	token: '',
	next_max_id: '',
	timeout: null,
	isEnd: false,
	// Init
	init: function () {
		//
		if ($('#photo-list').height() < window.innerHeight) {
			feeds.fetch();
		}
	},

	// Get a batch of Instagram feed
	fetch: function () {
		$(".spinner").show();
		// window.scrollTo(window.innerHeight,50);
		if(!feeds.isEnd){
			$.ajax({
				type: "GET",
				dataType: "jsonp",
				url: 'https://api.instagram.com/v1/users/self/media/recent?access_token='+ feeds.token + (feeds.next_max_id ? '&max_id=' + feeds.next_max_id : ''),
				success: function(e){
					if(e.pagination.next_max_id){
						feeds.next_max_id = e.pagination.next_max_id;
					} else {
						feeds.isEnd = true;
					}
					for (index in e.data) {
						$('ul#photo-list').append('<li><a href="'+ e.data[index].images.standard_resolution.url +'" target="blank"><img src="'+ e.data[index].images.thumbnail.url +'" /></a></li>');
					}
					console.log(e.data[index].images);
					$(".spinner").hide();
					// console.log(e.data);
				}
			});
		} else {
			$(".spinner").hide();
		}
		
	}

}