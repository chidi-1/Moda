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



