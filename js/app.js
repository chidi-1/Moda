/**
 * appName - http://chidi-frontend.esy.es/
 * @version v0.1.0
 * @author bev-olga@yandex.ru
 */
// удалить позицию из корзины
$(document).on('click', '.basket-list__el .js--delete', function(){
    var url = $(this).parents('ul').attr('data-remove-url');
    var method = $(this).parents('ul').attr('data-method');
    var id = $(this).attr('data-id');
    var block = $(this).parents('.basket-list__el');

    $.ajax({
        url: url,
        method: method,
        data: {id:id},
        success: function (data) {
            var parse_data = jQuery.parseJSON(data);
            $('.basket-total-value small').text(parse_data.total);
            block.remove();
            if($('.basket-list li').length == 0){
                $('.basket-full').addClass('hidden-block');
                $('.basket-empty').removeClass('hidden-block');
                $('.header__links-bas').addClass('empty')
            }
            else{
                $('.header__links-bas i').text(parse_data.basket_total)
            }
        }
    });

    return false;
});

// добавить товар в корзину из сравнения
$(document).on('click', '.js--add-comparison-basket', function() {
    var form = $(this).parents('form');
    var url = form.attr('action');
    var method = form.attr('method');
    var block = $(this).parents('li');
    var value = form.find('.inp').prop('value');

    if(!(value == undefined || value == '' || value == '0')){
        $.ajax({
            url: url,
            method: method,
            data: form.serialize(),
            success: function (data) {
                var parse_data = jQuery.parseJSON(data);
                $('.header__links-bas').removeClass('empty').find('i').text(parse_data.basket_total);
                form.find('.popup').fadeIn(100);
                setTimeout(function () {
                    form.find('.popup').fadeOut(100)
                }, 3000);
                $('.basket-list').append(parse_data.added_content);
                $('.basket-total-value small').text(parse_data.total);
                $('.basket-empty').addClass('hidden-block');
                $('.basket-full').removeClass('hidden-block')
            }
        });
    }
    return false;
});

// првоерка на заполненность полей

$(document).on('blur', '.basket-contacts__form form', function(){
    var error = false;
    $(this).find('.inp').each(function(){
        val = $(this).prop('value');
        if(val == undefined || val == ""){
            error = true;
        }
        if($(this).hasClass('inp-mail')){
            if(validateEmail(val) == false){
                 error = true;
            }
        }
    });

    if(error == true){
       $('.basket-pagination__next').addClass('disabled')
    }
    else{
        $('.basket-pagination__next').removeClass('disabled')
    };
})

$(document).on('click', '.disabled', function(){return false});
$(document).on('click', '.basket-contacts.basket-pagination__next', function(){
    $('.page-basket form').trigger('submit')
});

// чекбокс с соглашением
$(document).on('click', '.basret--payment__agreement label', function(){
    setTimeout(function(){
        if($('.inp-greement').prop('checked') == false){
           $('.basket-pagination__oform').addClass('disabled')
        }
        else{
            $('.basket-pagination__oform').removeClass('disabled')
        };
    },10);
});

// подписка
$(document).on('click', '.js--sens-subs', function () {

    var form =  $(this).parents('form');
    var errors = false;

    $(form).find('.required').each(function(){
        var val=$(this).prop('value');
        if(val==''){
            $(this).addClass('error');
            errors=true;
        }
        else{
            if($(this).hasClass('inp-mail')){
                if(validateEmail(val) == false){
                    $(this).addClass('error');
                    errors=true;
                }
            }
        }
    });

    if(errors == false){
        form.trigger('submit')
    }
    return false;
});

    // стилизация селекта
setTimeout(function(){
    if($('.page-basket .inp-styled').length){
        $('.page-basket .inp-styled').each(function(){
          $(this).styler({
            onSelectClosed: function() {
                send_region();
            }
          });
        })
    }

    if ($('#maptown').length && $('.page-basket').length) {
        var point = $('#maptown').attr('data-point')
        ymaps.ready(inittowm);

        function inittowm() {

            var myMap = new ymaps.Map('maptown', {
                    center: [55.76, 37.64],
                    zoom: 10
                }, {
                    searchControlProvider: 'yandex#search'
                }),
                objectManager = new ymaps.ObjectManager({
                    // Чтобы метки начали кластеризоваться, выставляем опцию.
                    clusterize: true,
                    // ObjectManager принимает те же опции, что и кластеризатор.
                    gridSize: 32
                });

            // Чтобы задать опции одиночным объектам и кластерам,
            // обратимся к дочерним коллекциям ObjectManager.
            objectManager.objects.options.set('preset', 'islands#greenDotIcon');
            objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
            myMap.geoObjects.add(objectManager);

            $.ajax({
                url: point
            }).done(function(data) {
                objectManager.add(data);
            });
        }
    }

    if ($('#mappick').length  && $('.page-basket').length) {
        var point = $('#mappick').attr('data-point')
        ymaps.ready(initpick);

        function initpick() {

            var myMap = new ymaps.Map('mappick', {
                    center: [55.76, 37.64],
                    zoom: 10
                }, {
                    searchControlProvider: 'yandex#search'
                }),
                objectManager = new ymaps.ObjectManager({
                    // Чтобы метки начали кластеризоваться, выставляем опцию.
                    clusterize: true,
                    // ObjectManager принимает те же опции, что и кластеризатор.
                    gridSize: 32
                });

            // Чтобы задать опции одиночным объектам и кластерам,
            // обратимся к дочерним коллекциям ObjectManager.
            objectManager.objects.options.set('preset', 'islands#greenDotIcon');
            objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
            myMap.geoObjects.add(objectManager);

            $.ajax({
                url: point
            }).done(function(data) {
                objectManager.add(data);
            });
        }
    }


}, 10);

$(document).on('click', '.basket-delivery__method label', function(){
    /*
    var form = $(this).parents('form');
    var url = form.attr('action');
    var method = form.attr('method');

    $.ajax({
        url: url,
        method: method,
        data: form.serialize(),
        success: function (data) {
            var parse_data = jQuery.parseJSON(data);
            $('.basket-delivery__total span i').text(parse_data.total + ' руб.')
        }
    });
    */
});

function send_region(){
    var block = $('.basket-delivery__region');
    var url = block.attr('data-url');
    var method = block.attr('data-method');
    var value = $('.inp-styled option:checked').prop('value');
    $.ajax({
        url: url,
        method: method,
        data: {value: value},
        success: function (data) {
            var parse_data = jQuery.parseJSON(data);
            $('.basket-delivery__load').empty().append(parse_data.content);

    if ($('#maptown').length && $('.page-basket').length) {
        var point = $('#maptown').attr('data-point')
        ymaps.ready(inittowm);

        function inittowm() {

            var myMap = new ymaps.Map('maptown', {
                    center: [55.76, 37.64],
                    zoom: 10
                }, {
                    searchControlProvider: 'yandex#search'
                }),
                objectManager = new ymaps.ObjectManager({
                    // Чтобы метки начали кластеризоваться, выставляем опцию.
                    clusterize: true,
                    // ObjectManager принимает те же опции, что и кластеризатор.
                    gridSize: 32
                });

            // Чтобы задать опции одиночным объектам и кластерам,
            // обратимся к дочерним коллекциям ObjectManager.
            objectManager.objects.options.set('preset', 'islands#greenDotIcon');
            objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
            myMap.geoObjects.add(objectManager);

            $.ajax({
                url: point
            }).done(function(data) {
                objectManager.add(data);
            });
        }
    }

    if ($('#mappick').length  && $('.page-basket').length) {
        var point = $('#mappick').attr('data-point')
        ymaps.ready(initpick);

        function initpick() {

            var myMap = new ymaps.Map('mappick', {
                    center: [55.76, 37.64],
                    zoom: 10
                }, {
                    searchControlProvider: 'yandex#search'
                }),
                objectManager = new ymaps.ObjectManager({
                    // Чтобы метки начали кластеризоваться, выставляем опцию.
                    clusterize: true,
                    // ObjectManager принимает те же опции, что и кластеризатор.
                    gridSize: 32
                });

            // Чтобы задать опции одиночным объектам и кластерам,
            // обратимся к дочерним коллекциям ObjectManager.
            objectManager.objects.options.set('preset', 'islands#greenDotIcon');
            objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
            myMap.geoObjects.add(objectManager);

            $.ajax({
                url: point
            }).done(function(data) {
                objectManager.add(data);
            });
        }
    }
        }
    });
    return false;
}

// изменить количество товаров в корзине
function change_basket(block){
    var url = $('.basket-list').attr('data-change-url');
    var method = $('.basket-list').attr('data-method');
    var id = block.find('.basket-list__el--params .input-id').prop('value');
    var amount = block.find('.basket-list__el--params .input-number').prop('value');

    $.ajax({
        url: url,
        method: method,
        data: {id:id, amount:amount},
        success: function (data) {
            var parse_data = jQuery.parseJSON(data);
            $('.basket-total-value small').text(parse_data.total);
            block.find('.basket-list__el--params--price').html(parse_data.total_el + "<i>o</i>")
        }
    });

    return false;
}

$(document).on('click', '.tabs__caption label:not(.active)', function() {
  $(this).addClass('active').siblings().removeClass('active')
  .parents('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');
});




var filter_content;
var filter_load;
var filter_load_text;
var slider_list = [];
var timeout_link;

// показ и скрытие выпадающих чекбоксов в фильтре
$(document).on('click', '.psevdoselect > span', function(){
    $('.psevdoselect').removeClass('psevdoselect-open');
    $(this).parents('.psevdoselect').addClass('psevdoselect-open');
    return false;
});
$(document).on('click', '.psevdoselect .trigger-arrow', function(){
    $('.psevdoselect').removeClass('psevdoselect-open');
    $(this).parents('.psevdoselect').addClass('psevdoselect-open');
    return false;
});
$(document).on('click', 'body', function(){
    $('.psevdoselect').removeClass('psevdoselect-open');
});
$(document).on('click', '.psevdoselect-hidden', function(event){
	event.stopPropagation();
});

// выбрать все
$(document).on('click', '.js--check-all', function(){
    if($(this).find('input').prop('checked') == false){
        $(this).parents('.psevdoselect-hidden').find('input').each(function(){
            $(this).prop('checked', 'checked')
        });
    }
    else{
        $(this).parents('.psevdoselect-hidden').find('input').each(function(){
            $(this).prop('checked', false)
        });
    }
    send_filter();
    return false;
});

// выбрать некоторые
$(document).on('click', '.psevdoselect-hidden label:not(.js--check-all)', function(){
    $(this).parents('.psevdoselect-hidden').find('.js--check-all  input').prop('checked', false);
    send_filter();
});

// слайдер
setTimeout(function(){
    if($( ".js--slider-two" ).length){
        $(".js--slider-two" ).each(function(){
        var parent = $(this).parents('.form-col');
        var min_range = Number($(this).attr('data-min_range'));
        var max_range = Number($(this).attr('data-max_range'));
        var min_current = Number($(this).attr('data-min-current'));
        var max_current = Number($(this).attr('data-max-current'));
        var step = Number($(this).attr('data-step'));
        var arr = [];

        arr.push(min_current);
        arr.push(max_current);
        var slider = $(this).slider({
            range: true,
            min: min_range,
            max: max_range,
            values: arr,
            step: step,
            slide: function (event, ui) {
                var min_current = Number(ui.values[0]);
                var max_current = Number(ui.values[1]);
                min_current = min_current.toString();
                min_current = number_format(min_current);
                max_current = max_current.toString();
                max_current = number_format(max_current);
                parent.find('.range_min').prop('value', min_current);
                parent.find('.range_max').prop('value', max_current);
                send_filter();
            }
        });
        slider_list.push(slider);
        min_current = min_current.toString();
        min_current = number_format(min_current);
        max_current = max_current.toString();
        max_current = number_format(max_current);
        parent.find('.range_min').prop('value', min_current);
        parent.find('.range_max').prop('value', max_current);

        $(document).on('input','.slider-double-value', function(){
            var pos = $(this).parents('.form-col').find('.filter--slide-line').attr('data-index');
            if($(this).data("lastval")!= $(this).val()) {
                if($(this).val() == ''){
                    $(this).prop('value',0)
                }
                else{
                    var value = $(this).prop('value');
                    value = value.replace(/\s+/g, '');
                    value = Number(value);
                    value = value.toString();
                    value = number_format(value);
                    if(value == "NaN"){
                        $(this).prop('value',0)
                    }else{
                        $(this).prop('value',value);
                    }
                };
                $(this).data("lastval", $(this).val());

                if (timeout_link) {
                    clearTimeout(timeout_link)
                }

                var min_value_input = $(this).parents('.form-col').find('.range_min').prop('value');
                var max_value_input = $(this).parents('.form-col').find('.range_max').prop('value');
                var arr_new = [];
                min_value_input = min_value_input.replace(/\s+/g, '');
                min_value_input = Number(min_value_input);
                max_value_input = max_value_input.replace(/\s+/g, '');
                max_value_input = Number(max_value_input);
                if(min_value_input < max_value_input) {
                    arr_new.push(min_value_input);
                    arr_new.push(max_value_input);
                    timeout_link = setTimeout(function () {
                        slider_list[pos].slider("values", arr_new);
                        send_filter();
                    }, 250);
                }
            };
        });
    });
};

    // стилизация селектов
if($('.filter').length){
    $('.filter-form select.inp-styled').each(function(){
      $(this).styler({
        onSelectClosed: function() {
            send_filter();
        }
      });
    })
    }
}, 10);

// формат цифр
function number_format( str ){
    return str.replace(/(\s)+/g, '').replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ');
};

// сброс фильтра
$(document).on('click', '.js--filter-reset', function(){
    $('.filter').find('input.range_min').prop('value', $('.filter--slide-line').attr('data-min-current'));
    $('.filter').find('input.range_max').prop('value', $('.filter--slide-line').attr('data-max-current'));
    $('.filter').find('.slider-double-value').trigger('input');
    $('.filter').find('.jq-selectbox').each(function () {
        $(this).find('li.filter-default').trigger('click');
    });
    $('.filter').find('.psevdoselect').each(function () {
        $(this).find('input').prop('checked', false);
    });
    send_filter();
    $('.load-container').empty().append(filter_content);
        if(filter_load == '1'){
        $('.filter-result__more').removeClass('hidden-block').find('a').text(filter_load_text);
    }
    else{
        $('.filter-result__more').addClass('hidden-block');
    }
    return false;
});

$(document).on('click', '.filter-tabs span', function(){
    send_filter()
});

// отправка данных фильтра и получение конечного значения и разметки
function send_filter(){
    var form = $('.filter-form');
    var method = form.attr('method');
    var url = form.attr('action');

    $.ajax({
        url: url,
        method: method,
        data: form.serialize(),
        success: function (data) {
            var parse_data = jQuery.parseJSON(data);
            $('.js--show-result i').text("(" + parse_data.counter + ")");
            filter_content = parse_data.content;
            filter_load = parse_data.has_load;
            filter_load_text = parse_data.load_link;
        }
    });
}

$(document).on('click', '.js--show-result', function(){
    if(filter_content == undefined){
        return false
    }
    else{
        if($('.js--show-result i').text() == '(0)'){
            $('.load-container').empty().append("<p class='filter--load-empty'>К сожалению, по вашему запросу ничего не найдено. Попробуйте изменить условия поиска</p>")
            $('.filter-result__more').addClass('hidden-block');
        }
        else{
            $('.load-container').empty().append(filter_content);
            if(filter_load == '1'){
                $('.filter-result__more').removeClass('hidden-block').find('a').text(filter_load_text);
            }
            else{
                $('.filter-result__more').addClass('hidden-block');
            }
        }
    }
    return false
});

// подгрузка журналов
$(document).on('click', '.js--show-more', function(){
    var block = $(this).parents(".load-container").find("ul");
    var method = $(this).attr('data-metod');
    var url = $(this).attr('data-url');
    var type = $(this).attr('data-type-magazin');
    var counter = block.find('li').length;
    var link = $(this).parent();

    $.ajax({
        url: url,
        method: method,
        data: {counter: counter, type: type},
        success: function (data) {
            var parse_data = jQuery.parseJSON(data);
            block.append(parse_data.content);
            if(parse_data.has_load == '1'){
                $(link).find('a').text(parse_data.load_link);
            }
            else{
                $(link).addClass('hidden-block');
            }
        }
    });

    return false;
});

// подгрузка таблицы
$(document).on('click','.privat__more .js--show-table', function(){
    var block = $(this).parents(".load-container").find("table");
    var method = $(this).attr('data-metod');
    var url = $(this).attr('data-url');
    var counter = block.find('tr').length;
    var link = $(this).parent();

    $.ajax({
        url: url,
        method: method,
        data: {counter: counter},
        success: function (data) {
            var parse_data = jQuery.parseJSON(data);
            block.find('tbody').append(parse_data.content);
            if(parse_data.has_load == '1'){
                $(link).find('a').text(parse_data.load_link);
            }
            else{
                $(link).addClass('hidden-block');
            }
        }
    });

    return false;
});

// таб фурнитуры
$(document).on('click', '.page-furniture ul.tabs__caption-list li:not(.active) label', function() {
  $(this).parents('li').addClass('active').siblings().removeClass('active');
  $(this).closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).parents('li').index()).addClass('active');
  $(this).parents('.tabs').find('div.tabs__caption-filter').find('div.furniture-filter').removeClass('active').find('input').prop('disabled', 'disabled');
  $(this).parents('.tabs').find('div.tabs__caption-filter').find('div.furniture-filter').eq($(this).parents('li').index()).addClass('active').find('input').prop('disabled', false);

});

$(document).on('click', '.furniture-filter label', function(){
    var block = $(".tabs__content.active").find("ul");
    var form = $(this).parents('form');
    var method = form.attr('metod');
    var url = form.attr('action');
    var link = block.find('.furniture__more');
    setTimeout(function(){
        $.ajax({
            url: url,
            method: method,
            data: form.serialize(),
            success: function (data) {
                var parse_data = jQuery.parseJSON(data);
                block.empty().append(parse_data.content);
                if(parse_data.has_load == '1'){
                    $(link).find('a').text(parse_data.load_link);
                }
                else{
                    $(link).addClass('hidden-block');
                }
            }
        });
    }, 10)
});

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

setTimeout(function() {
    if ($('#mapmosc').length && $('.page-delivery').length) {
        var point = $('#mapmosc').attr('data-point')
        ymaps.ready(init);

        function init() {
            var myMap = new ymaps.Map('mapmosc', {
                    center: [55.76, 37.64],
                    zoom: 10
                }, {
                    searchControlProvider: 'yandex#search'
                }),
                objectManager = new ymaps.ObjectManager({
                    // Чтобы метки начали кластеризоваться, выставляем опцию.
                    clusterize: true,
                    // ObjectManager принимает те же опции, что и кластеризатор.
                    gridSize: 32
                });

            // Чтобы задать опции одиночным объектам и кластерам,
            // обратимся к дочерним коллекциям ObjectManager.
            objectManager.objects.options.set('preset', 'islands#greenDotIcon');
            objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
            myMap.geoObjects.add(objectManager);

             $.ajax({
                url: point
             }).done(function(data) {
                objectManager.add(data);
             });
        }
    }
    if ($('#mapsptb').length && $('.page-delivery').length) {
        var point = $('#mapsptb').attr('data-point')
        ymaps.ready(initspb);

        function initspb() {

            var myMap = new ymaps.Map('mapsptb', {
                    center: [55.76, 37.64],
                    zoom: 10
                }, {
                    searchControlProvider: 'yandex#search'
                }),
                objectManager = new ymaps.ObjectManager({
                    // Чтобы метки начали кластеризоваться, выставляем опцию.
                    clusterize: true,
                    // ObjectManager принимает те же опции, что и кластеризатор.
                    gridSize: 32
                });

            // Чтобы задать опции одиночным объектам и кластерам,
            // обратимся к дочерним коллекциям ObjectManager.
            objectManager.objects.options.set('preset', 'islands#greenDotIcon');
            objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
            myMap.geoObjects.add(objectManager);

            $.ajax({
                url: point
            }).done(function(data) {
                objectManager.add(data);
            });
        }
    }
}, 10);

 $(document).on('click', '.sub--title', function(){
     $(this).parents('li').toggleClass('open')
 })
setTimeout(function() {
    if ($('.page-privat .inp-styled').length) {
        $('.page-privat .inp-styled').each(function () {
            $(this).styler({
                onSelectClosed: function () {
                }
            });
        })
    }

    // добавить новый адрес
    $(document).on('click', '.js--add-adress', function(){
        var url = $(this).attr('data-url');
        var method = $(this).attr('data-method');

        $.ajax({
            url: url,
            method: method,
            success: function (data) {
                $('.filter-wrap').append(data);
            }
        });
        return false;
    });
},10)
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

$(document).on('focus', 'input', function(){
    $(this).removeClass('error');
    $('.error-text').text('')
});
$(document).on('focus', 'textarea', function(){
    $(this).removeClass('error');
    $('.error-text').text('')
});

// ФОРМЫ В ПОПАПАХ

$(document).on('click', '.js--show-pass', function() {
    if($(this).hasClass('icon-eye-open')){
        $(this).prev('.input-pass').attr('type','text')
    }
    else{
        $(this).prev('.input-pass').attr('type','password')
    }
    $(this).toggleClass('icon-eye-open icon-eye-close')
});

$(document).on('blur', '.input-mail', function() {
    if(!($(this).prop('value') == undefined || $(this).prop('value') == '')){
        if(validateEmail($(this).prop('value')) == false){
            $(this).addClass('error');
        }
    }
});

// отправка формы из попапа с подробностями

$(document).on('click', '.js--send-popup-item', function(){
    $(this).parents('form').trigger('submit');
})

// отправка формы
$(document).on('click', '.js--form-submit', function () {

    var form =  $(this).parents('.main-form');
    var errors = false;

    $(form).find('.required').each(function(){
        var val=$(this).prop('value');
        if(val==''){
            $(this).addClass('error');
            errors=true;
        }
        else{
            if($(this).hasClass('inp-mail')){
                if(validateEmail(val) == false){
                    $(this).addClass('error');
                    errors=true;
                }
            }
        }
    });

    if(errors == false){
        var button_value = $(form).find('.js--form-submit').prop('value');
        $(form).find('.js--form-submit').prop('value', 'Подождите...');

        var method = form.attr('method');
        var action = form.attr('action');
        var data = form.serialize();
        $.ajax({
            type: method,
            url: action,
            data: data,
            success: function(data) {
                var parse_data = jQuery.parseJSON(data);
                if(parse_data.error == '1' && (form.hasClass('enter-form') || form.hasClass('forgot-form') || form.hasClass('reg-form') || form.hasClass('pass-form'))){
                    $('.error-text').text(parse_data.error_text)
                }
                else{
                    // форма входа
                    if(form.hasClass('enter-form')){
                        window.location = window.location.href
                    }

                    // форма восстановления пароля
                    if(form.hasClass('forgot-form')){
                        $('.js--pass-ok').trigger('click')
                    }

                    // форма установки нового пароля
                    if(form.hasClass('pass-form')){
                        $('.js--new-pass-ok').trigger('click')
                    }

                    // форма регистрации
                    if(form.hasClass('reg-form')){
                        window.location = window.location.href
                    }

                    // сохранение адреса доставки
                    if(form.hasClass('delivery-form')){
                        window.location = window.location.href
                    }

                    // форма отзыва
                    if(form.hasClass('review-form')){
                        form.find('input').each(function(){$(this).prop('value','')});
                        form.find('textarea').prop('value','');
                        $('.js--review-ok').trigger('click')
                    }
                }
            },
            error: function(data) {
                $(form).find('.js--form-submit').prop('value','Ошибка');
                setTimeout(function() {
                    $(form).find('.js--form-submit').prop('value', button_value);
                }, 2000);
            }
        });
    }
    return false;


});
