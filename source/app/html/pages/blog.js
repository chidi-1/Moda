// показ и скрытие формы отзыва

$(document).on('click', '.js--popup-subscribe-show', function(){
    $('.subscribe-popup').addClass('subscribe-popup-open');
    return false;
});

$(document).on('click', 'body', function(){
    $('.subscribe-popup').removeClass('subscribe-popup-open');
});
$(document).on('click', '.subscribe-popup-close', function(){
    $('.subscribe-popup').removeClass('subscribe-popup-open');
    return false;
});
$(document).on('click', '.subscribe-popup', function(event){
	event.stopPropagation();
});
