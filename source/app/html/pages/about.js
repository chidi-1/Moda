// показ и скрытие формы отзыва
$(document).on('click', '.js--popup-review-show', function(){
    $('.popup-review').addClass('popup-review-open');
    return false;
});
$(document).on('click', 'body', function(){
    $('.popup-review').removeClass('popup-review-open');
});
$(document).on('click', '.popup-review', function(event){
	event.stopPropagation();
});