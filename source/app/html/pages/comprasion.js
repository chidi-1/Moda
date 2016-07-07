// удалить из сравнения
$(document).on('click', '.js--remove-comparison', function(){

    var url = $(this).parents('ul').attr('data-url');
    var method = $(this).parents('ul').attr('data-method');
    var id = $(this).attr('data-id');
    var position = $(this).parents('li').attr('data-id');

    $.ajax({
        url: url,
        method: method,
        data: {id: id},
        success: function (data) {
            $('.comparison-list li').each(function(){
                if($(this).attr('data-id') == position){
                    $(this).remove();
                }
            });

            if($('.comparison-list li').length == 0){
                $('.comparison-list').each(function(){
                    $(this).addClass('hidden-block');
                });
                $('.comprasion-empty').removeClass('hidden-block');
            }
        }
    });

    return false;
})

// табы
$(document).on('click', 'ul.tabs__change li:not(.active)', function() {
  $(this).addClass('active').siblings().removeClass('active')
  .closest('div.tabs').find('div.tabs__content').toggleClass('tab-list tab-title');
});

setTimeout(function(){
    if($('.draggable').length){
        $( ".draggable").each(function(){
            $(this).draggable({
                handle: ".js--dragg-comparison",
                containment: ".tabs__content"
            });
        })
    }

     if($('.sortable').length){
        $( ".sortable").sortable();
    }
},10)