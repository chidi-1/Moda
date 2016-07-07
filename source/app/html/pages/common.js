// показ и скрытие поиска
$(document).on('click', '.js--search-open', function(){
    $('.search').addClass('search-open');
    return false;
});
$(document).on('click', 'body', function(){
    $('.search').removeClass('search-open');
});
$(document).on('click', '.search form', function(event){
	event.stopPropagation();
});

// изменение стоимости в попапе
$(document).on('change', '.popup-item__info__buttons .inp', function(){
    change_sum($(this))
});

function change_sum(block){
    var amount = Number(block.parents('.counter').find('.inp').prop('value'));
    var step = Number(block.parents('label').attr('data-step'));
    var cost = Number(block.parents('label').attr('data-cost'));
    block.parents('label').next('a').find('i').text("Итого: " +  Math.round((amount/step)*cost).toFixed(0) + " руб.")
}

// добавить в сравнение
$(document).on('click', '.js--add-compare', function(){
    var url = $(this).attr('data-url');
    var method = $(this).attr('data-method');
    var id = $(this).attr('data-id');

    $.ajax({
        url: url,
        method: method,
        data: {id:id},
        success: function (data) {
            var parse_data = jQuery.parseJSON(data);
            $('.header__links-comp').removeClass('empty').find('i').text(parse_data.compare_total)
        }
    });
    return false;
});

// добавить товар в корзину
$(document).on('click', '.js--add-basket', function(){
    var form = $(this).parents('form');
    var value = form.find('.inp').prop('value');

    if(!(value == undefined || value == '' || value == '0')){
        var url = form.attr('action');
        var method = form.attr('method');
        var data = form.serialize();

        $.ajax({
            url: url,
            method: method,
            data: data,
            success: function (data) {
                var parse_data = jQuery.parseJSON(data);
                $('.header__links-bas').removeClass('empty').find('i').text(parse_data.basket_total);
                form.find('.popup').fadeIn(100)
                setTimeout(function(){
                    form.find('.popup').fadeOut(100)
                }, 3000)
            }
        });
    }
    return false;
});

setTimeout(function() {
    // слайдер баннеров на главной
    if($('.index-banner').length){
        $('.index-banner').owlCarousel({
            loop: true,
            nav: true,
            items: 1,
            smartSpeed: 500,
            fluidSpeed: 500,
            margin: 0,
            autoplay: true,
            navText: [,],
            animateOut: 'fadeOut'
        });
    }

    // стилизация Input
    /*
    if($('.inp-styled').length){
        $('.inp-styled').each(function(){
          $(this).styler();
        })
    }
    */

    // табы

    $(document).on('click', 'ul.tabs__caption li:not(.active)', function() {
      $(this).addClass('active').siblings().removeClass('active')
      .closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');
    });

    // попап
     if($('.fancy').length){
        $('.fancy').fancybox();
    }

}, 100);


// +/- в полях
$(document).on('click', '.js--counter--button', function(){
    var block = $(this);
    var current_value = $(this).parents('.counter').find('.inp').prop('value');
    var step = Number($(this).parents('.counter').attr('data-step'));
    if($(this).hasClass('js-remove') == true && (current_value == 0  || current_value == undefined)){
        return false
    }else{
        current_value = current_value.replace(/\s+/g, '');
        current_value = Number(current_value);
        ($(this).hasClass('js-remove') == true) ? (current_value = current_value - step) : (current_value = current_value + step);
        if(step == 0.1){
            current_value = current_value.toFixed(1)
        }
        $(this).parents('.counter').find('.inp').prop('value', current_value);

        if($(this).parents('ul').hasClass('basket-list')){
            change_basket($(this).parents('.basket-list__el'));
        }
         if($(this).parents('label').hasClass('counter')){
            change_sum(block);
        }
    }
    return false;
});

// ввод только цифр в поле количетво
$(document).on('keydown', '.input-number', function(e){input_number();});

// ввод количества с клавиатуры
$(document).on('input','.input-number', function(){

    if($(this).data("lastval")!= $(this).val()) {
        if($(this).val() == ''){
            $(this).prop('value',0)
        }
        else{
            var value = $(this).prop('value');
            if(value[value.length - 1] =='.' && value.length == 1){
                $(this).prop('value','0.')
            }
            else{
                if(value[value.length - 1] !='.'){
                    value = value.replace(/\s+/g, '');
                    value = Number(value);
                    value = value.toString();
                    value = number_format(value);
                    if(value == "NaN"){
                        $(this).prop('value',0)
                    }else{
                        $(this).prop('value',value);
                    }
                }
                else{
                    if(value[value.length - 1] =='.' && value[value.length - 2] =='.'){
                        value = value.slice(0,-1)
                        $(this).prop('value',value)
                    }
                }
            }

        };
        $(this).data("lastval", $(this).val());

    };
});

// ввод только цифр в поле
var input_number = function(){
    var allow_meta_keys=[86, 67, 65];
    if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9  || event.keyCode == 27 || event.keyCode == 110 || event.keyCode == 191 ||
        // Разрешаем: Ctrl+A
        ($.inArray(event.keyCode,allow_meta_keys) > -1 && (event.ctrlKey === true ||  event.metaKey === true)) ||
        // Разрешаем: home, end, влево, вправо
        (event.keyCode >= 35 && event.keyCode <= 39)) {
        // Ничего не делаем
        return;
    }
    else {
        // Обеждаемся, что это цифра, и останавливаем событие keypress
        if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
            event.preventDefault();
        }
    }
};

// кнопка вверх
$(document).on('click', '.js--scroll-top', function(){
    $("html, body").animate({
        scrollTop: 0
    }, {
        duration: 300
    });
    return false;
});

$(window).scroll(function() {
    var top = $(document).scrollTop();
    if (top > 300){
        $('.scroll-top').addClass('visible')
    }
    else{
        $('.scroll-top').removeClass('visible')
    }
});

